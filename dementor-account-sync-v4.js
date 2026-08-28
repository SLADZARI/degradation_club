// Dementor Club — account + diagnostic sync v4.
// Single Supabase client, explicit implicit-flow hash session restore, local-first onboarding.
(()=>{
  if(!location.pathname.includes('/join'))return;
  if(window.__DC_ACCOUNT_SYNC_V4__)return;
  window.__DC_ACCOUNT_SYNC_V4__=true;

  const STORAGE='dementorClubOnboardingV3';
  const VERSION='dc9-v1';
  let client=null,session=null,syncTimer=null,applyingRemote=false;
  const readLocal=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{},active:null}}catch(_){return{results:{},active:null}}};
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>JSON.stringify(v);
  let lastState=clone(readLocal());

  const currentPageUrl=()=>new URL(location.pathname,location.origin).href;
  const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sourceKey=(sphere,result)=>`${VERSION}:${sphere}:${result?.date||'undated'}`;
  const newest=(a,b)=>{if(!a)return b;if(!b)return a;return (Date.parse(b.date||0)||0)>(Date.parse(a.date||0)||0)?b:a};
  const mergeStates=(a,b)=>{const local=a||{results:{},active:null},remote=b||{results:{},active:null},results={};for(const id of new Set([...Object.keys(local.results||{}),...Object.keys(remote.results||{})]))results[id]=newest(local.results?.[id],remote.results?.[id]);return{results,active:local.active||remote.active||null}};

  async function waitConfig(){for(let i=0;i<100;i++){const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;if(cfg?.enabled&&cfg.url&&cfg.publishableKey)return cfg;await new Promise(r=>setTimeout(r,40))}throw new Error('Supabase configuration unavailable')}

  function panel(){
    let el=document.querySelector('.dc-account-panel');if(el)return el;
    const st=document.createElement('style');st.textContent='.dc-account-panel{margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12px}.dc-account-panel__meta{display:grid;gap:3px}.dc-account-panel__meta strong{font-size:12px;letter-spacing:.06em}.dc-account-panel__meta span{opacity:.58}.dc-account-panel__actions{display:flex;gap:8px;flex-wrap:wrap}.dc-account-panel button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;padding:9px 11px;font:inherit;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer}.dc-account-panel button:hover{background:var(--acid);color:#111;border-color:var(--acid)}';document.head.appendChild(st);
    el=document.createElement('div');el.className='dc-account-panel';el.setAttribute('aria-live','polite');const shell=document.querySelector('.join-shell');shell?shell.prepend(el):document.body.prepend(el);return el;
  }
  const setStatus=t=>{const e=document.querySelector('[data-dc-account-status]');if(e)e.textContent=t};
  const fail=e=>{console.error('[Dementor Sync v4]',e);setStatus(`ОШИБКА ВХОДА / СИНХРОНИЗАЦИИ${e?.message?' · '+e.message:''}`)};

  function render(){
    const el=panel();
    if(!client){el.innerHTML='<div class="dc-account-panel__meta"><strong>ПРОФИЛЬ</strong><span data-dc-account-status>ПОДКЛЮЧЕНИЕ…</span></div>';return}
    if(!session){el.innerHTML='<div class="dc-account-panel__meta"><strong>ВАША КАРТА ХРАНИТСЯ НА ЭТОМ УСТРОЙСТВЕ</strong><span data-dc-account-status>Войдите через Google, чтобы синхронизировать её между устройствами.</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-login>СОХРАНИТЬ ПРОФИЛЬ / GOOGLE</button></div>';el.querySelector('[data-dc-login]')?.addEventListener('click',login);return}
    const m=session.user.user_metadata||{},name=m.full_name||m.name||session.user.email||'Участник';el.innerHTML=`<div class="dc-account-panel__meta"><strong>${esc(name)}</strong><span data-dc-account-status>ПРОФИЛЬ ПОДКЛЮЧЁН · СИНХРОНИЗАЦИЯ ВКЛЮЧЕНА</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-sync>СИНХРОНИЗИРОВАТЬ</button><button type="button" data-dc-logout>ВЫЙТИ</button></div>`;el.querySelector('[data-dc-sync]')?.addEventListener('click',()=>queueSync(0,true));el.querySelector('[data-dc-logout]')?.addEventListener('click',async()=>{await client.auth.signOut();session=null;render()});
  }

  async function login(){try{setStatus('ПЕРЕХОД К GOOGLE…');const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:currentPageUrl(),skipBrowserRedirect:false}});if(error)throw error}catch(e){fail(e)}}

  async function persistRun(sphere,result,active){if(!session||!result?.date)return;const {error}=await client.from('assessment_runs').upsert({profile_id:session.user.id,sphere_id:sphere,assessment_version:VERSION,result_json:result,answers_json:active?.answers||null,started_at:null,completed_at:result.date,source_key:sourceKey(sphere,result)},{onConflict:'profile_id,source_key',ignoreDuplicates:true});if(error&&error.code!=='23505')throw error}
  async function ensureBaselines(state){for(const [sphere,result] of Object.entries(state?.results||{}))if(result?.date)await persistRun(sphere,result,null)}
  function queueSync(delay=250,mergeRemote=false){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(mergeRemote).catch(fail),delay)}

  async function syncNow(mergeRemote=false){
    if(!session||!client)return;
    const local=readLocal();let state=local;
    if(mergeRemote){const {data,error}=await client.from('assessment_snapshots').select('state_json').eq('profile_id',session.user.id).maybeSingle();if(error)throw error;if(data?.state_json){state=mergeStates(local,data.state_json);if(stable(state)!==stable(local)){applyingRemote=true;localStorage.setItem(STORAGE,JSON.stringify(state));applyingRemote=false;lastState=clone(state)}}}
    await ensureBaselines(state);
    const now=new Date().toISOString();const {error}=await client.from('assessment_snapshots').upsert({profile_id:session.user.id,assessment_version:VERSION,state_json:state,client_updated_at:now,updated_at:now},{onConflict:'profile_id'});if(error)throw error;setStatus('СИНХРОНИЗИРОВАНО');
  }

  function installStorageTap(){const original=Storage.prototype.setItem;if(original.__dcSyncV4Wrapped)return;const wrapped=function(key,value){const r=original.apply(this,arguments);if(this===localStorage&&key===STORAGE&&!applyingRemote){const prev=clone(lastState);let next=null;try{next=JSON.parse(value)}catch(_){}if(next){lastState=clone(next);if(session)queueSync(250,false);const a=prev?.active,res=a?.sphere?next?.results?.[a.sphere]:null;if(a?.sphere&&!next.active&&res?.date)persistRun(a.sphere,res,a).catch(fail)}}return r};wrapped.__dcSyncV4Wrapped=true;Storage.prototype.setItem=wrapped}

  async function restoreSessionFromHash(){
    const raw=location.hash.startsWith('#')?location.hash.slice(1):location.hash;
    if(!raw)return null;
    const hash=new URLSearchParams(raw);
    const authError=hash.get('error_description')||hash.get('error');
    if(authError)throw new Error(authError);
    const accessToken=hash.get('access_token');
    const refreshToken=hash.get('refresh_token');
    if(!accessToken||!refreshToken)return null;
    setStatus('ЗАВЕРШАЕМ ВХОД…');
    const {data,error}=await client.auth.setSession({access_token:accessToken,refresh_token:refreshToken});
    if(error)throw error;
    if(!data?.session)throw new Error('OAuth tokens received without session');
    history.replaceState({},'',location.pathname+location.search);
    return data.session;
  }

  async function boot(){
    render();
    const cfg=await waitConfig();
    const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
    client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:false,autoRefreshToken:true,flowType:'implicit'}});
    window.DEMENTOR_SUPABASE_CLIENT=client;

    session=await restoreSessionFromHash();
    if(!session){const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session||null}

    render();
    client.auth.onAuthStateChange((event,next)=>{session=next||null;render();if(session&&(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'))queueSync(0,true)});
    if(session)await syncNow(true);
  }

  installStorageTap();
  boot().catch(fail);
})();
