// Dementor Club — account + assessment sync v8.1.
// OAuth callback is handled outside /join/ at /auth/callback/.
(()=>{
  if(!location.pathname.includes('/join'))return;
  if(window.__DC_ACCOUNT_SYNC_V8__)return;
  window.__DC_ACCOUNT_SYNC_V8__=true;

  const STORAGE='dementorClubOnboardingV3';
  const VERSION='dc9-v1';
  const TRACE=[];
  let client=null,session=null,syncTimer=null,applyingRemote=false,syncInFlight=null,syncPending=false,syncPendingMerge=false;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const readLocal=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{},active:null}}catch(_){return{results:{},active:null}}};
  const canonicalize=v=>Array.isArray(v)?v.map(canonicalize):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v);
  const stable=v=>JSON.stringify(canonicalize(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sourceKey=(sphere,result)=>`${VERSION}:${sphere}:${result?.date||'undated'}`;
  const newest=(a,b)=>{if(!a)return b;if(!b)return a;return(Date.parse(b.date||0)||0)>(Date.parse(a.date||0)||0)?b:a};
  const mergeStates=(a,b)=>{const local=a||{results:{},active:null},remote=b||{results:{},active:null},results={};for(const id of new Set([...Object.keys(local.results||{}),...Object.keys(remote.results||{})]))results[id]=newest(local.results?.[id],remote.results?.[id]);return{results,active:local.active||remote.active||null}};
  let lastState=clone(readLocal());

  function trace(step,detail={}){
    const safe={...detail};delete safe.access_token;delete safe.refresh_token;delete safe.token;delete safe.session;
    const entry={t:new Date().toISOString(),step,...safe};TRACE.push(entry);window.__DC_AUTH_TRACE__=TRACE;
    if(new URLSearchParams(location.search).get('authdebug')==='1')console.log('[DC AUTH V8.1]',entry);
  }
  async function waitConfig(){for(let i=0;i<100;i++){const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;if(cfg?.enabled&&cfg.url&&cfg.publishableKey)return cfg;await sleep(40)}throw new Error('Supabase configuration unavailable')}
  function panel(){
    let el=document.querySelector('.dc-account-panel');if(el)return el;
    const st=document.createElement('style');st.textContent='.dc-account-panel{position:sticky;top:var(--dc-global-header-h,72px);z-index:230;margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12px;background:#111;box-shadow:0 8px 0 #111}.dc-account-panel__meta{display:grid;gap:3px}.dc-account-panel__meta strong{font-size:12px;letter-spacing:.06em}.dc-account-panel__meta span{opacity:.58}.dc-account-panel__actions{display:flex;gap:8px;flex-wrap:wrap}.dc-account-panel button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;padding:9px 11px;font:inherit;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer}.dc-account-panel button:hover{background:var(--acid);color:#111;border-color:var(--acid)}';document.head.appendChild(st);
    el=document.createElement('div');el.className='dc-account-panel';el.setAttribute('aria-live','polite');const shell=document.querySelector('.join-shell');shell?shell.prepend(el):document.body.prepend(el);return el;
  }
  const removePanel=()=>document.querySelector('.dc-account-panel')?.remove();
  const setStatus=t=>{const e=document.querySelector('[data-dc-account-status]');if(e)e.textContent=t};
  const fail=e=>{trace('error',{message:e?.message||String(e),code:e?.code||null});console.error('[Dementor Sync V8.1]',e);setStatus(`ОШИБКА ВХОДА / СИНХРОНИЗАЦИИ${e?.message?' · '+e.message:''}`)};
  function render(){
    // DC-9 is intentionally usable without login. Public auth is owned by the
    // canonical GlobalHeader and Application boundary, not by a second sticky
    // Join panel. Keep account/assessment sync active, but never render another
    // auth surface inside /join/*.
    removePanel();
  }
  function callbackUrl(){return location.origin+'/auth/callback/?next='+encodeURIComponent('/join/')}
  async function login(){
    try{const redirectTo=callbackUrl();trace('login-start',{redirectTo});setStatus('ПЕРЕХОД К GOOGLE…');const {data,error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo,queryParams:{prompt:'select_account'}}});trace('provider-response',{hasUrl:Boolean(data?.url),error:error?.message||null});if(error)throw error}catch(e){fail(e)}
  }
  async function persistRun(sphere,result,active){
    if(!session||!result?.date)return;
    const {error}=await client.from('assessment_runs').upsert({profile_id:session.user.id,sphere_id:sphere,assessment_version:VERSION,result_json:result,answers_json:active?.answers||null,started_at:null,completed_at:result.date,source_key:sourceKey(sphere,result)},{onConflict:'profile_id,source_key',ignoreDuplicates:true});
    if(error&&error.code!=='23505')throw error;
  }
  async function ensureBaselines(state){for(const [sphere,result] of Object.entries(state?.results||{}))if(result?.date)await persistRun(sphere,result,null)}
  async function readRemoteSnapshot(){const {data,error}=await client.from('assessment_snapshots').select('state_json').eq('profile_id',session.user.id).maybeSingle();if(error)throw error;return data?.state_json||null}
  async function writeSnapshot(state){const now=new Date().toISOString();const {error}=await client.from('assessment_snapshots').upsert({profile_id:session.user.id,assessment_version:VERSION,state_json:state,client_updated_at:now,updated_at:now},{onConflict:'profile_id'});if(error)throw error}

  async function syncPass(mergeRemote=false){
    trace('sync-pass-start',{mergeRemote});
    const local=readLocal();let state=local,remote=null;
    if(mergeRemote){
      remote=await readRemoteSnapshot();
      if(remote){
        state=mergeStates(local,remote);
        if(stable(state)!==stable(local)){
          applyingRemote=true;localStorage.setItem(STORAGE,JSON.stringify(state));applyingRemote=false;lastState=clone(state);
        }
      }
    }
    await ensureBaselines(state);
    if(remote&&stable(state)===stable(remote))trace('snapshot-write-skip',{reason:'unchanged'});else await writeSnapshot(state);
    trace('sync-pass-done',{results:Object.keys(state?.results||{}).length,active:state?.active?.sphere||null});
    setStatus('СИНХРОНИЗИРОВАНО');
  }

  async function requestSync(mergeRemote=false){
    if(!session||!client)return;
    if(syncInFlight){
      syncPending=true;
      syncPendingMerge=syncPendingMerge||mergeRemote;
      trace('sync-rerun-queued',{mergeRemote});
      return syncInFlight;
    }
    syncInFlight=(async()=>{
      let nextMerge=mergeRemote;
      do{
        syncPending=false;
        const passMerge=nextMerge||syncPendingMerge;
        syncPendingMerge=false;
        await syncPass(passMerge);
        nextMerge=false;
      }while(syncPending);
    })();
    try{return await syncInFlight}finally{syncInFlight=null}
  }

  function queueSync(delay=250,mergeRemote=false){clearTimeout(syncTimer);syncTimer=setTimeout(()=>requestSync(mergeRemote).catch(fail),delay)}
  function installStorageTap(){
    const original=Storage.prototype.setItem;if(original.__dcSyncV8Wrapped)return;
    const wrapped=function(key,value){
      const r=original.apply(this,arguments);
      if(this===localStorage&&key===STORAGE&&!applyingRemote){
        const prev=clone(lastState);let next=null;try{next=JSON.parse(value)}catch(_){}
        if(next){
          lastState=clone(next);
          const a=prev?.active,res=a?.sphere?next?.results?.[a.sphere]:null;
          const completed=Boolean(a?.sphere&&!next.active&&res?.date);
          if(session){
            if(completed){
              clearTimeout(syncTimer);
              persistRun(a.sphere,res,a)
                .then(()=>requestSync(false))
                .catch(fail);
            }else queueSync(250,false);
          }
        }
      }
      return r;
    };
    wrapped.__dcSyncV8Wrapped=true;Storage.prototype.setItem=wrapped;
  }
  async function boot(){
    trace('boot-start');render();
    const cfg=await waitConfig();
    const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
    client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=client;
    client.auth.onAuthStateChange((event,next)=>{trace('auth-state',{event,hasSession:Boolean(next)});session=next||null;render();if(session&&event==='TOKEN_REFRESHED')requestSync(true).catch(fail)});
    const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session||null;
    if(session){const u=await client.auth.getUser();if(u.error)throw u.error}
    render();if(session)await requestSync(true);trace('boot-done',{signedIn:Boolean(session)});
  }
  installStorageTap();boot().catch(fail);
})();
