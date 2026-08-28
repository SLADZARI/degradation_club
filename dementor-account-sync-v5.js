// Dementor Club — account + diagnostic sync v5.
// Single Supabase client + explicit implicit OAuth restore + visible auth diagnostics.
(()=>{
  if(!location.pathname.includes('/join')) return;
  if(window.__DC_ACCOUNT_SYNC_V5__) return;
  window.__DC_ACCOUNT_SYNC_V5__=true;

  const STORAGE='dementorClubOnboardingV3';
  const VERSION='dc9-v1';
  const TRACE_KEY='dcAuthTraceV1';
  const DEBUG=new URLSearchParams(location.search).get('auth_debug')==='1';
  const MAX_TRACE=100;
  let client=null,session=null,syncTimer=null,applyingRemote=false;

  const readLocal=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{},active:null}}catch(_){return{results:{},active:null}}};
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>JSON.stringify(v);
  let lastState=clone(readLocal());

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const currentPageUrl=()=>{
    const u=new URL(location.pathname,location.origin);
    if(DEBUG) u.searchParams.set('auth_debug','1');
    return u.href;
  };
  const safeUrlState=()=>({
    origin:location.origin,
    pathname:location.pathname,
    searchKeys:[...new URLSearchParams(location.search).keys()],
    hashKeys:location.hash? [...new URLSearchParams(location.hash.replace(/^#/, '')).keys()] : []
  });
  const sourceKey=(sphere,result)=>`${VERSION}:${sphere}:${result?.date||'undated'}`;
  const newest=(a,b)=>{if(!a)return b;if(!b)return a;return (Date.parse(b.date||0)||0)>(Date.parse(a.date||0)||0)?b:a};
  const mergeStates=(a,b)=>{const local=a||{results:{},active:null},remote=b||{results:{},active:null},results={};for(const id of new Set([...Object.keys(local.results||{}),...Object.keys(remote.results||{})]))results[id]=newest(local.results?.[id],remote.results?.[id]);return{results,active:local.active||remote.active||null}};

  function readTrace(){try{return JSON.parse(localStorage.getItem(TRACE_KEY)||'[]')}catch(_){return[]}}
  function saveTrace(items){try{localStorage.setItem(TRACE_KEY,JSON.stringify(items.slice(-MAX_TRACE)))}catch(_){}}
  function sanitize(data){
    if(data==null)return null;
    if(typeof data==='string')return data.slice(0,300);
    if(typeof data!=='object')return data;
    const out={};
    for(const [k,v] of Object.entries(data)){
      if(/token|secret|authorization|code_verifier/i.test(k)){out[k]=v?'[present]':'[absent]';continue}
      if(k==='email'&&typeof v==='string'){const [a,b='']=v.split('@');out[k]=`${a.slice(0,2)}***@${b}`;continue}
      out[k]=typeof v==='object'?sanitize(v):v;
    }
    return out;
  }
  function trace(stage,status='info',data=null){
    const item={t:new Date().toISOString(),stage,status,data:sanitize(data)};
    const items=[...readTrace(),item].slice(-MAX_TRACE);saveTrace(items);
    console.log('[DC AUTH TRACE]',stage,status,item.data||'');
    renderDebug();
    return item;
  }

  function debugRoot(){
    if(!DEBUG)return null;
    let el=document.getElementById('dc-auth-debug');
    if(el)return el;
    document.getElementById('dc-auth-debug-loader')?.remove();
    const st=document.createElement('style');
    st.textContent=`#dc-auth-debug{position:fixed;z-index:2147483647;right:10px;bottom:10px;width:min(620px,calc(100vw - 20px));max-height:58vh;background:#0d0d0d;color:#f1f1e9;border:1px solid #7bff00;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;box-shadow:0 8px 40px rgba(0,0,0,.55)}#dc-auth-debug header{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:9px 10px;border-bottom:1px solid #333;background:#151515}#dc-auth-debug header strong{color:#7bff00}#dc-auth-debug .dcdbg-state{padding:8px 10px;border-bottom:1px solid #2a2a2a;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}#dc-auth-debug .dcdbg-state span{padding:4px 5px;background:#1b1b1b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#dc-auth-debug .dcdbg-actions{display:flex;flex-wrap:wrap;gap:5px;padding:8px 10px;border-bottom:1px solid #2a2a2a}#dc-auth-debug button{font:inherit;background:#111;color:#eee;border:1px solid #666;padding:5px 7px;cursor:pointer}#dc-auth-debug button:hover{border-color:#7bff00;color:#7bff00}#dc-auth-debug .dcdbg-log{max-height:30vh;overflow:auto;padding:6px 10px}#dc-auth-debug .dcdbg-row{display:grid;grid-template-columns:72px 118px 62px 1fr;gap:6px;padding:4px 0;border-bottom:1px dashed #252525}#dc-auth-debug .ok{color:#7bff00}.dcdbg-row .error{color:#ff6363}.dcdbg-row .warn{color:#ffd85c}#dc-auth-debug .dcdbg-detail{white-space:pre-wrap;word-break:break-word;color:#bbb}@media(max-width:700px){#dc-auth-debug{right:4px;bottom:4px;width:calc(100vw - 8px);max-height:64vh}#dc-auth-debug .dcdbg-state{grid-template-columns:1fr 1fr}#dc-auth-debug .dcdbg-row{grid-template-columns:64px 94px 52px 1fr;font-size:10px}}`;
    document.head.appendChild(st);
    el=document.createElement('section');el.id='dc-auth-debug';el.innerHTML='<header><strong>AUTH DEBUG v5</strong><span>no secrets / no tokens shown</span></header><div class="dcdbg-state" data-dcdbg-state></div><div class="dcdbg-actions"><button data-dcdbg="storage">TEST STORAGE</button><button data-dcdbg="session">TEST SESSION</button><button data-dcdbg="read">TEST SNAPSHOT READ</button><button data-dcdbg="write">TEST SNAPSHOT WRITE</button><button data-dcdbg="copy">COPY TRACE</button><button data-dcdbg="clear">CLEAR TRACE</button></div><div class="dcdbg-log" data-dcdbg-log></div>';
    document.body.appendChild(el);
    el.addEventListener('click',async e=>{
      const action=e.target?.dataset?.dcdbg;if(!action)return;
      if(action==='clear'){saveTrace([]);trace('trace_cleared','info',safeUrlState());return}
      if(action==='copy'){try{await navigator.clipboard.writeText(JSON.stringify(readTrace(),null,2));trace('trace_copied','ok',{count:readTrace().length})}catch(err){trace('trace_copy','error',{message:err.message})}return}
      if(action==='storage'){testStorage();return}
      if(action==='session'){await testSession();return}
      if(action==='read'){await testSnapshotRead();return}
      if(action==='write'){await testSnapshotWrite();return}
    });
    return el;
  }
  function renderDebug(){
    if(!DEBUG||!document.body)return;
    const el=debugRoot();if(!el)return;
    const state=el.querySelector('[data-dcdbg-state]');
    const hash=new URLSearchParams(location.hash.replace(/^#/,''));
    state.innerHTML=`<span>runtime: v5</span><span>client: ${client?'YES':'NO'}</span><span>session: ${session?'YES':'NO'}</span><span>hash auth: ${(hash.has('access_token')||hash.has('error'))?'YES':'NO'}</span>`;
    const rows=readTrace().slice(-40).reverse();
    el.querySelector('[data-dcdbg-log]').innerHTML=rows.map(x=>`<div class="dcdbg-row"><span>${esc(x.t.slice(11,19))}</span><span>${esc(x.stage)}</span><span class="${esc(x.status)}">${esc(x.status)}</span><span class="dcdbg-detail">${esc(x.data?JSON.stringify(x.data):'')}</span></div>`).join('');
  }

  function testStorage(){try{const k='dcAuthStorageTest';localStorage.setItem(k,'ok');const ok=localStorage.getItem(k)==='ok';localStorage.removeItem(k);trace('test_storage',ok?'ok':'error',{localStorage:ok})}catch(e){trace('test_storage','error',{message:e.message})}}
  async function testSession(){if(!client){trace('test_session','error',{message:'client not ready'});return}try{const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session||null;trace('test_session','ok',{session:!!session,user:session?.user?true:false,expiresAt:session?.expires_at||null});render();renderDebug()}catch(e){trace('test_session','error',{message:e.message})}}
  async function testSnapshotRead(){if(!client||!session){trace('test_snapshot_read','error',{message:'authenticated session required'});return}try{const {data,error}=await client.from('assessment_snapshots').select('profile_id,assessment_version,client_updated_at,updated_at').eq('profile_id',session.user.id).maybeSingle();if(error)throw error;trace('test_snapshot_read','ok',{found:!!data,assessmentVersion:data?.assessment_version||null,updatedAt:data?.updated_at||null})}catch(e){trace('test_snapshot_read','error',{message:e.message,code:e.code||null})}}
  async function testSnapshotWrite(){if(!client||!session){trace('test_snapshot_write','error',{message:'authenticated session required'});return}try{trace('test_snapshot_write_start','info');await writeSnapshot(readLocal());trace('test_snapshot_write','ok')}catch(e){trace('test_snapshot_write','error',{message:e.message,code:e.code||null})}}

  window.addEventListener('error',e=>trace('window_error','error',{message:e.message,source:e.filename?e.filename.split('/').pop():null,line:e.lineno||null}));
  window.addEventListener('unhandledrejection',e=>trace('unhandled_rejection','error',{message:e.reason?.message||String(e.reason||'unknown')}));

  async function waitConfig(){trace('config_wait_start');for(let i=0;i<100;i++){const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;if(cfg?.enabled&&cfg.url&&cfg.publishableKey){trace('config_ready','ok',{enabled:cfg.enabled,host:new URL(cfg.url).host,assessmentVersion:cfg.assessmentVersion});return cfg}await new Promise(r=>setTimeout(r,40))}throw new Error('Supabase configuration unavailable')}

  function panel(){
    let el=document.querySelector('.dc-account-panel');if(el)return el;
    const st=document.createElement('style');st.textContent='.dc-account-panel{margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12px}.dc-account-panel__meta{display:grid;gap:3px}.dc-account-panel__meta strong{font-size:12px;letter-spacing:.06em}.dc-account-panel__meta span{opacity:.58}.dc-account-panel__actions{display:flex;gap:8px;flex-wrap:wrap}.dc-account-panel button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;padding:9px 11px;font:inherit;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer}.dc-account-panel button:hover{background:var(--acid);color:#111;border-color:var(--acid)}';document.head.appendChild(st);
    el=document.createElement('div');el.className='dc-account-panel';el.setAttribute('aria-live','polite');const shell=document.querySelector('.join-shell');shell?shell.prepend(el):document.body.prepend(el);return el;
  }
  const setStatus=t=>{const e=document.querySelector('[data-dc-account-status]');if(e)e.textContent=t};
  const fail=e=>{console.error('[Dementor Sync v5]',e);trace('runtime_fail','error',{message:e?.message||String(e),code:e?.code||null});setStatus(`ОШИБКА ВХОДА / СИНХРОНИЗАЦИИ${e?.message?' · '+e.message:''}`)};

  function render(){
    const el=panel();
    if(!client){el.innerHTML='<div class="dc-account-panel__meta"><strong>ПРОФИЛЬ</strong><span data-dc-account-status>ПОДКЛЮЧЕНИЕ…</span></div>';return}
    if(!session){el.innerHTML='<div class="dc-account-panel__meta"><strong>ВАША КАРТА ХРАНИТСЯ НА ЭТОМ УСТРОЙСТВЕ</strong><span data-dc-account-status>Войдите через Google, чтобы синхронизировать её между устройствами.</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-login>СОХРАНИТЬ ПРОФИЛЬ / GOOGLE</button></div>';el.querySelector('[data-dc-login]')?.addEventListener('click',login);return}
    const m=session.user.user_metadata||{},name=m.full_name||m.name||session.user.email||'Участник';el.innerHTML=`<div class="dc-account-panel__meta"><strong>${esc(name)}</strong><span data-dc-account-status>ПРОФИЛЬ ПОДКЛЮЧЁН · СИНХРОНИЗАЦИЯ ВКЛЮЧЕНА</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-sync>СИНХРОНИЗИРОВАТЬ</button><button type="button" data-dc-logout>ВЫЙТИ</button></div>`;el.querySelector('[data-dc-sync]')?.addEventListener('click',()=>queueSync(0,true));el.querySelector('[data-dc-logout]')?.addEventListener('click',async()=>{trace('logout_start');await client.auth.signOut();session=null;trace('logout_done','ok');render();renderDebug()});
  }

  async function login(){try{const redirectTo=currentPageUrl();trace('oauth_start','info',{redirectTo});setStatus('ПЕРЕХОД К GOOGLE…');const {data,error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo,skipBrowserRedirect:false}});if(error)throw error;trace('oauth_redirect_created','ok',{provider:!!data?.provider})}catch(e){fail(e)}}

  async function persistRun(sphere,result,active){if(!session||!result?.date)return;const {error}=await client.from('assessment_runs').upsert({profile_id:session.user.id,sphere_id:sphere,assessment_version:VERSION,result_json:result,answers_json:active?.answers||null,started_at:null,completed_at:result.date,source_key:sourceKey(sphere,result)},{onConflict:'profile_id,source_key',ignoreDuplicates:true});if(error&&error.code!=='23505')throw error}
  async function ensureBaselines(state){let count=0;for(const [sphere,result] of Object.entries(state?.results||{}))if(result?.date){await persistRun(sphere,result,null);count++}trace('baseline_runs','ok',{count})}
  function queueSync(delay=250,mergeRemote=false){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(mergeRemote).catch(fail),delay)}

  async function writeSnapshot(state){const now=new Date().toISOString();trace('snapshot_write_start');const {error}=await client.from('assessment_snapshots').upsert({profile_id:session.user.id,assessment_version:VERSION,state_json:state,client_updated_at:now,updated_at:now},{onConflict:'profile_id'});if(error)throw error;trace('snapshot_write','ok',{resultCount:Object.keys(state?.results||{}).length})}
  async function syncNow(mergeRemote=false){
    if(!session||!client){trace('sync_skip','warn',{client:!!client,session:!!session});return}
    trace('sync_start','info',{mergeRemote});const local=readLocal();let state=local;
    if(mergeRemote){trace('snapshot_read_start');const {data,error}=await client.from('assessment_snapshots').select('state_json,assessment_version,updated_at').eq('profile_id',session.user.id).maybeSingle();if(error)throw error;trace('snapshot_read','ok',{found:!!data,assessmentVersion:data?.assessment_version||null,updatedAt:data?.updated_at||null});if(data?.state_json){state=mergeStates(local,data.state_json);if(stable(state)!==stable(local)){applyingRemote=true;localStorage.setItem(STORAGE,JSON.stringify(state));applyingRemote=false;lastState=clone(state);trace('local_merge_applied','ok',{resultCount:Object.keys(state.results||{}).length})}}}
    await ensureBaselines(state);await writeSnapshot(state);setStatus('СИНХРОНИЗИРОВАНО');trace('sync_done','ok');
  }

  function installStorageTap(){const original=Storage.prototype.setItem;if(original.__dcSyncV5Wrapped)return;const wrapped=function(key,value){const r=original.apply(this,arguments);if(this===localStorage&&key===STORAGE&&!applyingRemote){const prev=clone(lastState);let next=null;try{next=JSON.parse(value)}catch(_){}if(next){lastState=clone(next);trace('local_state_changed','info',{resultCount:Object.keys(next.results||{}).length,activeSphere:next.active?.sphere||null});if(session)queueSync(250,false);const a=prev?.active,res=a?.sphere?next?.results?.[a.sphere]:null;if(a?.sphere&&!next.active&&res?.date)persistRun(a.sphere,res,a).catch(fail)}}return r};wrapped.__dcSyncV5Wrapped=true;Storage.prototype.setItem=wrapped;trace('storage_tap_installed','ok')}

  async function restoreSessionFromHash(){
    const raw=location.hash.replace(/^#/,'');
    const hash=new URLSearchParams(raw);
    const keys=[...hash.keys()];trace('callback_inspect','info',{hashPresent:!!raw,hashKeys:keys,hasAccessToken:hash.has('access_token'),hasRefreshToken:hash.has('refresh_token'),hasError:hash.has('error')});
    if(!raw)return null;
    const authError=hash.get('error_description')||hash.get('error');if(authError)throw new Error(authError);
    const accessToken=hash.get('access_token'),refreshToken=hash.get('refresh_token');if(!accessToken||!refreshToken){trace('callback_no_session_tokens','warn',{hashKeys:keys});return null}
    setStatus('ЗАВЕРШАЕМ ВХОД…');trace('set_session_start');
    const {data,error}=await client.auth.setSession({access_token:accessToken,refresh_token:refreshToken});if(error)throw error;if(!data?.session)throw new Error('OAuth tokens received without session');
    trace('set_session','ok',{session:true,user:true,expiresAt:data.session.expires_at||null});history.replaceState({},'',location.pathname+(DEBUG?'?auth_debug=1':''));return data.session;
  }

  async function boot(){
    trace('runtime_loaded','ok',{runtime:'v5',...safeUrlState(),userAgent:navigator.userAgent.slice(0,120)});renderDebug();render();testStorage();
    const cfg=await waitConfig();
    trace('supabase_module_import_start');const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');trace('supabase_module_import','ok',{createClient:typeof mod.createClient==='function'});
    client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:false,autoRefreshToken:true,flowType:'implicit'}});window.DEMENTOR_SUPABASE_CLIENT=client;trace('client_created','ok',{flowType:'implicit',persistSession:true});renderDebug();
    session=await restoreSessionFromHash();
    if(!session){trace('get_session_start');const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session||null;trace('get_session','ok',{session:!!session,user:!!session?.user,expiresAt:session?.expires_at||null})}
    render();renderDebug();
    client.auth.onAuthStateChange((event,next)=>{session=next||null;trace('auth_state_change','info',{event,session:!!session});render();renderDebug();if(session&&(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'))queueSync(0,true)});
    if(session)await syncNow(true);else trace('boot_complete_no_session','warn');
  }

  installStorageTap();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot().catch(fail),{once:true});else boot().catch(fail);
})();
