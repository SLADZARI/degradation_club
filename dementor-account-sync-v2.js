// Dementor Club — local-first account + diagnostic sync v2.
// One Supabase client, PKCE OAuth, durable snapshot/history.
(()=>{
  if(!location.pathname.includes('/join')) return;
  if(window.__DC_ACCOUNT_SYNC_V2__) return;
  window.__DC_ACCOUNT_SYNC_V2__=true;

  const STORAGE='dementorClubOnboardingV3';
  const ASSESSMENT_VERSION='dc9-v1';
  const RELOAD_FLAG='dcAssessmentSyncReloadedV2';
  let client=null;
  let session=null;
  let applyingRemote=false;
  let syncTimer=null;

  const readLocal=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{},active:null}}catch(_){return{results:{},active:null}}};
  const stable=v=>JSON.stringify(v);
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  let lastState=clone(readLocal());

  function newestResult(a,b){
    if(!a)return b;if(!b)return a;
    const ad=Date.parse(a.date||0)||0,bd=Date.parse(b.date||0)||0;
    return bd>ad?b:a;
  }
  function mergeStates(localState,remoteState){
    const local=localState||{results:{},active:null};
    const remote=remoteState||{results:{},active:null};
    const results={};
    const ids=new Set([...Object.keys(local.results||{}),...Object.keys(remote.results||{})]);
    ids.forEach(id=>results[id]=newestResult(local.results?.[id],remote.results?.[id]));
    return {results,active:local.active||remote.active||null};
  }
  const sourceKey=(sphere,result)=>`${ASSESSMENT_VERSION}:${sphere}:${result?.date||'undated'}`;
  const currentPageUrl=()=>new URL(location.pathname,location.origin).href;

  async function waitConfig(){
    for(let i=0;i<100;i++){
      const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
      if(cfg?.enabled&&cfg.url&&cfg.publishableKey)return cfg;
      await new Promise(r=>setTimeout(r,40));
    }
    throw new Error('Supabase configuration unavailable');
  }

  function panel(){
    let el=document.querySelector('.dc-account-panel');
    if(el)return el;
    const style=document.createElement('style');
    style.textContent='.dc-account-panel{margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12px}.dc-account-panel__meta{display:grid;gap:3px}.dc-account-panel__meta strong{font-size:12px;letter-spacing:.06em}.dc-account-panel__meta span{opacity:.58}.dc-account-panel__actions{display:flex;gap:8px;flex-wrap:wrap}.dc-account-panel button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;padding:9px 11px;font:inherit;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer}.dc-account-panel button:hover{background:var(--acid);color:#111;border-color:var(--acid)}';
    document.head.appendChild(style);
    el=document.createElement('div');el.className='dc-account-panel';el.setAttribute('aria-live','polite');
    const shell=document.querySelector('.join-shell');
    shell?shell.prepend(el):document.body.prepend(el);
    return el;
  }
  const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const setStatus=t=>{const el=document.querySelector('[data-dc-account-status]');if(el)el.textContent=t};
  function showError(err){console.error('[Dementor Sync v2]',err);setStatus('СИНХРОНИЗАЦИЯ НЕДОСТУПНА')}

  function render(){
    const el=panel();
    if(!client){el.innerHTML='<div class="dc-account-panel__meta"><strong>ПРОФИЛЬ</strong><span data-dc-account-status>ПОДКЛЮЧЕНИЕ…</span></div>';return;}
    if(!session){
      el.innerHTML='<div class="dc-account-panel__meta"><strong>ВАША КАРТА ХРАНИТСЯ НА ЭТОМ УСТРОЙСТВЕ</strong><span data-dc-account-status>Войдите через Google, чтобы синхронизировать её между устройствами.</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-login>СОХРАНИТЬ ПРОФИЛЬ / GOOGLE</button></div>';
      el.querySelector('[data-dc-login]')?.addEventListener('click',async()=>{
        try{
          setStatus('ПЕРЕХОД К GOOGLE…');
          const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:currentPageUrl(),skipBrowserRedirect:false}});
          if(error)throw error;
        }catch(e){showError(e)}
      });
      return;
    }
    const meta=session.user.user_metadata||{};
    const name=meta.full_name||meta.name||session.user.email||'Участник';
    el.innerHTML=`<div class="dc-account-panel__meta"><strong>${esc(name)}</strong><span data-dc-account-status>ПРОФИЛЬ ПОДКЛЮЧЁН · СИНХРОНИЗАЦИЯ ВКЛЮЧЕНА</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-sync>СИНХРОНИЗИРОВАТЬ</button><button type="button" data-dc-logout>ВЫЙТИ</button></div>`;
    el.querySelector('[data-dc-sync]')?.addEventListener('click',()=>queueSync(0,true));
    el.querySelector('[data-dc-logout]')?.addEventListener('click',async()=>{await client.auth.signOut();session=null;render()});
  }

  function installStorageTap(){
    const original=Storage.prototype.setItem;
    if(original.__dcSyncV2Wrapped)return;
    const wrapped=function(key,value){
      const result=original.apply(this,arguments);
      if(this===localStorage&&key===STORAGE&&!applyingRemote){
        const prev=clone(lastState);let next=null;try{next=JSON.parse(value)}catch(_){next=null}
        if(next){lastState=clone(next);onLocalStateChange(prev,next)}
      }
      return result;
    };
    wrapped.__dcSyncV2Wrapped=true;
    Storage.prototype.setItem=wrapped;
  }

  function onLocalStateChange(prev,next){
    if(session)queueSync(250,false);
    const prevActive=prev?.active;
    if(!prevActive?.sphere)return;
    const result=next?.results?.[prevActive.sphere];
    if(!next.active&&result?.date)persistRun(prevActive.sphere,result,prevActive).catch(()=>{});
  }
  function queueSync(delay=250,mergeRemote=false){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(mergeRemote).catch(showError),delay)}

  async function persistRun(sphere,result,active){
    if(!session||!result?.date)return;
    const payload={profile_id:session.user.id,sphere_id:sphere,assessment_version:ASSESSMENT_VERSION,result_json:result,answers_json:active?.answers||null,started_at:null,completed_at:result.date,source_key:sourceKey(sphere,result)};
    const {error}=await client.from('assessment_runs').upsert(payload,{onConflict:'profile_id,source_key',ignoreDuplicates:true});
    if(error&&error.code!=='23505')throw error;
  }
  async function ensureBaselines(state){for(const [sphere,result] of Object.entries(state?.results||{})){if(result?.date)await persistRun(sphere,result,null)}}

  async function syncNow(mergeRemote=false){
    if(!session||!client)return;
    const local=readLocal();let state=local;
    if(mergeRemote){
      const {data,error}=await client.from('assessment_snapshots').select('state_json').eq('profile_id',session.user.id).maybeSingle();
      if(error)throw error;
      if(data?.state_json){
        state=mergeStates(local,data.state_json);
        if(stable(state)!==stable(local)){
          applyingRemote=true;localStorage.setItem(STORAGE,JSON.stringify(state));applyingRemote=false;lastState=clone(state);
          if(!sessionStorage.getItem(RELOAD_FLAG)){sessionStorage.setItem(RELOAD_FLAG,'1');location.reload();return;}
        }
      }
    }
    sessionStorage.removeItem(RELOAD_FLAG);
    await ensureBaselines(state);
    const now=new Date().toISOString();
    const {error}=await client.from('assessment_snapshots').upsert({profile_id:session.user.id,assessment_version:ASSESSMENT_VERSION,state_json:state,client_updated_at:now,updated_at:now},{onConflict:'profile_id'});
    if(error)throw error;
    setStatus('СИНХРОНИЗИРОВАНО');
  }

  async function boot(){
    render();
    const cfg=await waitConfig();
    const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
    client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true,flowType:'pkce'}});
    window.DEMENTOR_SUPABASE_CLIENT=client;
    const {data,error}=await client.auth.getSession();
    if(error)throw error;
    session=data.session||null;
    render();
    client.auth.onAuthStateChange((event,next)=>{
      session=next||null;render();
      if(session&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='TOKEN_REFRESHED'))queueSync(0,true);
    });
    if(session)await syncNow(true);
    if(location.search.includes('code=')&&session)history.replaceState({},'',location.pathname);
  }

  installStorageTap();
  boot().catch(showError);
})();
