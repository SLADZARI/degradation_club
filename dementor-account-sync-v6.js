// Dementor Club — production account + diagnostic sync v6.
// Single Supabase client, explicit implicit-flow session restore, local-first onboarding.
(()=>{
  if(!location.pathname.includes('/join')) return;
  if(window.__DC_ACCOUNT_SYNC_V6__) return;
  window.__DC_ACCOUNT_SYNC_V6__=true;

  const STORAGE='dementorClubOnboardingV3';
  const VERSION='dc9-v1';
  const RETRY_DELAYS=[650,1100,1700];
  const DEBUG=new URLSearchParams(location.search).get('authdebug')==='1';
  const TRACE=[];
  let client=null,session=null,syncTimer=null,applyingRemote=false;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const readLocal=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{},active:null}}catch(_){return{results:{},active:null}}};
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>JSON.stringify(v);
  let lastState=clone(readLocal());

  const currentPageUrl=()=>new URL(location.pathname,location.origin).href;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sourceKey=(sphere,result)=>`${VERSION}:${sphere}:${result?.date||'undated'}`;
  const newest=(a,b)=>{if(!a)return b;if(!b)return a;return (Date.parse(b.date||0)||0)>(Date.parse(a.date||0)||0)?b:a};
  const mergeStates=(a,b)=>{const local=a||{results:{},active:null},remote=b||{results:{},active:null},results={};for(const id of new Set([...Object.keys(local.results||{}),...Object.keys(remote.results||{})]))results[id]=newest(local.results?.[id],remote.results?.[id]);return{results,active:local.active||remote.active||null}};
  const isFutureJwt=e=>e?.code==='PGRST303'||/JWT issued at future/i.test(e?.message||'');

  function trace(step,detail={}){
    const safe={...detail};
    delete safe.access_token;delete safe.refresh_token;delete safe.token;delete safe.session;
    const entry={t:new Date().toISOString(),step,...safe};
    TRACE.push(entry);
    window.__DC_AUTH_TRACE__=TRACE;
    if(DEBUG)console.log('[DC AUTH]',entry);
    renderDebug();
  }

  function renderDebug(){
    if(!DEBUG)return;
    let el=document.getElementById('dc-auth-debug');
    if(!el){
      el=document.createElement('div');el.id='dc-auth-debug';
      el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:99999;width:min(520px,calc(100vw - 24px));max-height:46vh;overflow:auto;background:#0b0b0b;color:#d7ff3f;border:1px solid #d7ff3f;padding:12px;font:11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;box-shadow:0 8px 30px rgba(0,0,0,.5)';
      document.body.appendChild(el);
    }
    el.textContent=TRACE.map(x=>`${x.t.slice(11,19)}  ${x.step}${Object.keys(x).length>2?'  '+JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k])=>!['t','step'].includes(k)))):''}`).join('\n');
  }

  async function withJwtRetry(run){
    for(let attempt=0;;attempt++){
      const result=await run();
      if(!result?.error)return result;
      if(!isFutureJwt(result.error)||attempt>=RETRY_DELAYS.length)return result;
      trace('jwt-retry',{attempt:attempt+1,code:result.error.code||null});
      await sleep(RETRY_DELAYS[attempt]);
    }
  }

  async function waitConfig(){
    for(let i=0;i<100;i++){
      const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
      if(cfg?.enabled&&cfg.url&&cfg.publishableKey)return cfg;
      await sleep(40);
    }
    throw new Error('Supabase configuration unavailable');
  }

  function trackPanelHeight(el){
    const update=()=>{
      const shell=el.closest('.join-shell');
      if(shell)shell.style.setProperty('--dc-account-panel-h',`${Math.ceil(el.getBoundingClientRect().height)+6}px`);
    };
    update();
    if('ResizeObserver'in window)new ResizeObserver(update).observe(el);
  }

  function panel(){
    let el=document.querySelector('.dc-account-panel');if(el)return el;
    const st=document.createElement('style');
    st.textContent='.dc-account-panel{position:sticky;top:var(--dc-global-header-h,72px);z-index:230;margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12px;background:#111;box-shadow:0 8px 0 #111}.dc-account-panel__meta{display:grid;gap:3px}.dc-account-panel__meta strong{font-size:12px;letter-spacing:.06em}.dc-account-panel__meta span{opacity:.58}.dc-account-panel__actions{display:flex;gap:8px;flex-wrap:wrap}.dc-account-panel button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;padding:9px 11px;font:inherit;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer}.dc-account-panel button:hover{background:var(--acid);color:#111;border-color:var(--acid)}.join-shell .progress-wrap{top:calc(var(--dc-global-header-h,72px) + var(--dc-account-panel-h,64px))}@media(max-width:900px){.dc-account-panel{top:var(--dc-global-header-h,64px);margin-top:10px}.dc-account-panel__meta{min-width:0}.dc-account-panel__meta strong,.dc-account-panel__meta span{overflow-wrap:anywhere}}';
    document.head.appendChild(st);
    el=document.createElement('div');el.className='dc-account-panel';el.setAttribute('aria-live','polite');
    const shell=document.querySelector('.join-shell');shell?shell.prepend(el):document.body.prepend(el);
    trackPanelHeight(el);
    return el;
  }

  function updatePrivacyCopy(){
    const items=[...document.querySelectorAll('.privacy')];
    items.forEach((el,i)=>{
      if(!el.dataset.dcOriginalHtml)el.dataset.dcOriginalHtml=el.innerHTML;
      if(!session){el.innerHTML=el.dataset.dcOriginalHtml;return;}
      el.innerHTML=i===0
        ?'Результаты сохраняются локально и синхронизируются с вашим профилем Dementor Club через Google. Это клубная диагностическая механика, а не психологический, медицинский или профессиональный тест.'
        :`Данные сохраняются локально под ключом <code>${STORAGE}</code> и синхронизируются с вашим профилем Dementor Club. Очистка localStorage не удалит уже синхронизированные результаты.`;
    });
  }

  const setStatus=t=>{const e=document.querySelector('[data-dc-account-status]');if(e)e.textContent=t};
  const fail=e=>{trace('error',{message:e?.message||String(e),code:e?.code||null});console.error('[Dementor Sync]',e);setStatus(`ОШИБКА ВХОДА / СИНХРОНИЗАЦИИ${e?.message?' · '+e.message:''}`)};

  function render(){
    const el=panel();
    updatePrivacyCopy();
    if(!client){
      el.innerHTML='<div class="dc-account-panel__meta"><strong>ПРОФИЛЬ</strong><span data-dc-account-status>ПОДКЛЮЧЕНИЕ…</span></div>';
      return;
    }
    if(!session){
      el.innerHTML='<div class="dc-account-panel__meta"><strong>ВАША КАРТА ХРАНИТСЯ НА ЭТОМ УСТРОЙСТВЕ</strong><span data-dc-account-status>Войдите через Google, чтобы синхронизировать её между устройствами.</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-login>СОХРАНИТЬ ПРОФИЛЬ / GOOGLE</button></div>';
      el.querySelector('[data-dc-login]')?.addEventListener('click',login);
      return;
    }
    const m=session.user.user_metadata||{};
    const name=m.full_name||m.name||session.user.email||'Участник';
    el.innerHTML=`<div class="dc-account-panel__meta"><strong>${esc(name)}</strong><span data-dc-account-status>ПРОФИЛЬ ПОДКЛЮЧЁН · СИНХРОНИЗАЦИЯ ВКЛЮЧЕНА</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-sync>СИНХРОНИЗИРОВАТЬ</button><button type="button" data-dc-logout>ВЫЙТИ</button></div>`;
    el.querySelector('[data-dc-sync]')?.addEventListener('click',()=>queueSync(0,true));
    el.querySelector('[data-dc-logout]')?.addEventListener('click',async()=>{trace('logout-start');await client.auth.signOut();session=null;trace('logout-done');render()});
  }

  async function login(){
    try{
      const redirectTo=currentPageUrl();
      trace('login-start',{redirectTo});
      setStatus('ПЕРЕХОД К GOOGLE…');
      const {data,error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo,skipBrowserRedirect:false}});
      trace('login-provider-response',{hasUrl:Boolean(data?.url),error:error?.message||null});
      if(error)throw error;
    }catch(e){fail(e)}
  }

  async function persistRun(sphere,result,active){
    if(!session||!result?.date)return;
    const {error}=await withJwtRetry(()=>client.from('assessment_runs').upsert({
      profile_id:session.user.id,
      sphere_id:sphere,
      assessment_version:VERSION,
      result_json:result,
      answers_json:active?.answers||null,
      started_at:null,
      completed_at:result.date,
      source_key:sourceKey(sphere,result)
    },{onConflict:'profile_id,source_key',ignoreDuplicates:true}));
    if(error&&error.code!=='23505')throw error;
  }

  async function ensureBaselines(state){
    for(const [sphere,result] of Object.entries(state?.results||{}))if(result?.date)await persistRun(sphere,result,null);
  }

  function queueSync(delay=250,mergeRemote=false){
    clearTimeout(syncTimer);
    syncTimer=setTimeout(()=>syncNow(mergeRemote).catch(fail),delay);
  }

  async function readRemoteSnapshot(){
    trace('snapshot-read-start');
    const {data,error}=await withJwtRetry(()=>client.from('assessment_snapshots').select('state_json').eq('profile_id',session.user.id).maybeSingle());
    trace('snapshot-read-done',{ok:!error,hasData:Boolean(data)});
    if(error)throw error;
    return data?.state_json||null;
  }

  async function writeSnapshot(state){
    const now=new Date().toISOString();
    trace('snapshot-write-start');
    const {error}=await withJwtRetry(()=>client.from('assessment_snapshots').upsert({
      profile_id:session.user.id,
      assessment_version:VERSION,
      state_json:state,
      client_updated_at:now,
      updated_at:now
    },{onConflict:'profile_id'}));
    trace('snapshot-write-done',{ok:!error});
    if(error)throw error;
  }

  async function syncNow(mergeRemote=false){
    if(!session||!client)return;
    trace('sync-start',{mergeRemote});
    const local=readLocal();let state=local;
    if(mergeRemote){
      const remote=await readRemoteSnapshot();
      if(remote){
        state=mergeStates(local,remote);
        if(stable(state)!==stable(local)){
          applyingRemote=true;
          localStorage.setItem(STORAGE,JSON.stringify(state));
          applyingRemote=false;
          lastState=clone(state);
        }
      }
    }
    await ensureBaselines(state);
    await writeSnapshot(state);
    trace('sync-done');
    setStatus('СИНХРОНИЗИРОВАНО');
  }

  function installStorageTap(){
    const original=Storage.prototype.setItem;
    if(original.__dcSyncV6Wrapped)return;
    const wrapped=function(key,value){
      const r=original.apply(this,arguments);
      if(this===localStorage&&key===STORAGE&&!applyingRemote){
        const prev=clone(lastState);let next=null;
        try{next=JSON.parse(value)}catch(_){}
        if(next){
          lastState=clone(next);
          if(session)queueSync(250,false);
          const a=prev?.active,res=a?.sphere?next?.results?.[a.sphere]:null;
          if(a?.sphere&&!next.active&&res?.date)persistRun(a.sphere,res,a).catch(fail);
        }
      }
      return r;
    };
    wrapped.__dcSyncV6Wrapped=true;
    Storage.prototype.setItem=wrapped;
  }

  async function restoreSessionFromHash(){
    const raw=location.hash.startsWith('#')?location.hash.slice(1):location.hash;
    trace('oauth-return-inspect',{hasHash:Boolean(raw),hashKeys:raw?[...new URLSearchParams(raw).keys()]:[]});
    if(!raw)return null;
    const hash=new URLSearchParams(raw);
    const authError=hash.get('error_description')||hash.get('error');
    if(authError)throw new Error(authError);
    const accessToken=hash.get('access_token');
    const refreshToken=hash.get('refresh_token');
    if(!accessToken||!refreshToken){trace('oauth-return-no-token-pair');return null;}
    setStatus('ЗАВЕРШАЕМ ВХОД…');
    trace('set-session-start');
    const {data,error}=await client.auth.setSession({access_token:accessToken,refresh_token:refreshToken});
    trace('set-session-done',{ok:!error,hasSession:Boolean(data?.session)});
    if(error)throw error;
    if(!data?.session)throw new Error('OAuth tokens received without session');
    history.replaceState({},'',location.pathname+location.search);
    return data.session;
  }

  async function boot(){
    trace('boot-start',{href:location.origin+location.pathname+location.search,hasHash:Boolean(location.hash)});
    render();
    const cfg=await waitConfig();
    trace('config-ready',{projectHost:new URL(cfg.url).host});
    const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
    trace('sdk-loaded');
    client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:false,autoRefreshToken:true,flowType:'implicit'}});
    window.DEMENTOR_SUPABASE_CLIENT=client;
    trace('client-created');

    session=await restoreSessionFromHash();
    if(!session){
      trace('get-session-start');
      const {data,error}=await client.auth.getSession();
      trace('get-session-done',{ok:!error,hasSession:Boolean(data?.session)});
      if(error)throw error;
      session=data.session||null;
    }

    if(session){
      trace('get-user-start');
      const {data:userData,error:userError}=await client.auth.getUser();
      trace('get-user-done',{ok:!userError,hasUser:Boolean(userData?.user),userId:userData?.user?.id||null});
      if(userError)throw userError;
    }

    render();
    client.auth.onAuthStateChange((event,next)=>{
      trace('auth-state',{event,hasSession:Boolean(next)});
      session=next||null;
      render();
      if(session&&(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'))queueSync(0,true);
    });
    if(session)await syncNow(true);
    trace('boot-done',{signedIn:Boolean(session)});
  }

  installStorageTap();
  boot().catch(fail);
})();
