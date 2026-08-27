// Dementor Club — local-first account + diagnostic sync.
// Local onboarding remains the immediate runtime; Supabase is the durable identity/history layer.
(()=>{
  if(!location.pathname.includes('/join')) return;

  const STORAGE='dementorClubOnboardingV3';
  const ASSESSMENT_VERSION='dc9-v1';
  const RELOAD_FLAG='dcAssessmentSyncReloaded';
  let client=null;
  let session=null;
  let applyingRemote=false;
  let syncTimer=null;
  let lastState=readLocal();

  function readLocal(){
    try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{results:{},active:null}}catch(_){return{results:{},active:null}}
  }
  function stable(value){return JSON.stringify(value)}
  function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}
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
  function makeSourceKey(sphere,result){return `${ASSESSMENT_VERSION}:${sphere}:${result?.date||'undated'}`}
  function appBase(){
    const marker='/degradation_club';
    return location.pathname===marker||location.pathname.startsWith(`${marker}/`)?marker:'';
  }
  function appUrl(path){
    const clean=String(path||'/').startsWith('/')?String(path||'/'):`/${path}`;
    return `${location.origin}${appBase()}${clean}`;
  }

  async function waitConfig(){
    for(let i=0;i<80;i++){
      const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
      if(cfg?.enabled&&cfg.url&&cfg.publishableKey)return cfg;
      await new Promise(r=>setTimeout(r,50));
    }
    throw new Error('Supabase configuration unavailable');
  }
  async function loadClient(){
    const cfg=await waitConfig();
    const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
    client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true}});
    const {data}=await client.auth.getSession();
    session=data.session||null;
    client.auth.onAuthStateChange((event,next)=>{
      session=next||null;
      renderAccount();
      if(session&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='TOKEN_REFRESHED')) queueSync(0,true);
    });
    renderAccount();
    if(session) await syncNow(true);
  }

  function installStorageTap(){
    const original=Storage.prototype.setItem;
    if(original.__dcSyncWrapped)return;
    const wrapped=function(key,value){
      if(this===localStorage&&key===STORAGE&&!applyingRemote){
        const prev=clone(lastState);
        let next=null;try{next=JSON.parse(value)}catch(_){next=null}
        const result=original.apply(this,arguments);
        if(next){lastState=clone(next);onLocalStateChange(prev,next)}
        return result;
      }
      return original.apply(this,arguments);
    };
    wrapped.__dcSyncWrapped=true;
    Storage.prototype.setItem=wrapped;
  }

  function onLocalStateChange(prev,next){
    if(session) queueSync(350,false);
    const prevActive=prev?.active;
    if(!prevActive?.sphere)return;
    const result=next?.results?.[prevActive.sphere];
    if(!next.active&&result&&result.date){
      persistRun(prevActive.sphere,result,prevActive).catch(()=>{});
    }
  }

  function queueSync(delay=300,mergeRemote=false){
    clearTimeout(syncTimer);
    syncTimer=setTimeout(()=>syncNow(mergeRemote).catch(showError),delay);
  }

  async function ensureHistoricBaselines(state){
    if(!session)return;
    const entries=Object.entries(state?.results||{});
    for(const [sphere,result] of entries){
      if(!result?.date)continue;
      await persistRun(sphere,result,null);
    }
  }

  async function persistRun(sphere,result,active){
    if(!session||!client||!result?.date)return;
    const payload={
      profile_id:session.user.id,
      sphere_id:sphere,
      assessment_version:ASSESSMENT_VERSION,
      result_json:result,
      answers_json:active?.answers||null,
      started_at:null,
      completed_at:result.date,
      source_key:makeSourceKey(sphere,result)
    };
    const {error}=await client.from('assessment_runs').upsert(payload,{onConflict:'profile_id,source_key',ignoreDuplicates:true});
    if(error&&error.code!=='23505')throw error;
  }

  async function syncNow(mergeRemote=false){
    if(!session||!client)return;
    const local=readLocal();
    let state=local;
    if(mergeRemote){
      const {data,error}=await client.from('assessment_snapshots').select('state_json,client_updated_at,updated_at').eq('profile_id',session.user.id).maybeSingle();
      if(error)throw error;
      if(data?.state_json){
        state=mergeStates(local,data.state_json);
        if(stable(state)!==stable(local)){
          applyingRemote=true;
          localStorage.setItem(STORAGE,JSON.stringify(state));
          applyingRemote=false;
          lastState=clone(state);
          if(!sessionStorage.getItem(RELOAD_FLAG)){
            sessionStorage.setItem(RELOAD_FLAG,'1');
            location.reload();
            return;
          }
        }
      }
    }
    sessionStorage.removeItem(RELOAD_FLAG);
    await ensureHistoricBaselines(state);
    const now=new Date().toISOString();
    const {error}=await client.from('assessment_snapshots').upsert({
      profile_id:session.user.id,
      assessment_version:ASSESSMENT_VERSION,
      state_json:state,
      client_updated_at:now,
      updated_at:now
    },{onConflict:'profile_id'});
    if(error)throw error;
    setStatus('СИНХРОНИЗИРОВАНО');
  }

  function setStatus(text){const el=document.querySelector('[data-dc-account-status]');if(el)el.textContent=text}
  function showError(err){console.error('[Dementor Sync]',err);setStatus('СИНХРОНИЗАЦИЯ НЕДОСТУПНА')}

  function ensureAccountPanel(){
    let panel=document.querySelector('.dc-account-panel');
    if(panel)return panel;
    const style=document.createElement('style');
    style.textContent=`
      .dc-account-panel{margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12px}
      .dc-account-panel__meta{display:grid;gap:3px}.dc-account-panel__meta strong{font-size:12px;letter-spacing:.06em}.dc-account-panel__meta span{opacity:.58}
      .dc-account-panel__actions{display:flex;gap:8px;flex-wrap:wrap}.dc-account-panel button{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;padding:9px 11px;font:inherit;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer}
      .dc-account-panel button:hover{background:var(--acid);color:#111;border-color:var(--acid)}
    `;
    document.head.appendChild(style);
    panel=document.createElement('div');panel.className='dc-account-panel';panel.setAttribute('aria-live','polite');
    const shell=document.querySelector('.join-shell');
    if(shell)shell.prepend(panel);else document.body.prepend(panel);
    return panel;
  }

  function renderAccount(){
    const panel=ensureAccountPanel();
    if(!client){panel.innerHTML='<div class="dc-account-panel__meta"><strong>ПРОФИЛЬ</strong><span data-dc-account-status>ЛОКАЛЬНОЕ ХРАНЕНИЕ</span></div>';return}
    if(!session){
      panel.innerHTML='<div class="dc-account-panel__meta"><strong>ВАША КАРТА ХРАНИТСЯ НА ЭТОМ УСТРОЙСТВЕ</strong><span data-dc-account-status>Войдите через Google, чтобы синхронизировать её между устройствами.</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-login>СОХРАНИТЬ ПРОФИЛЬ / GOOGLE</button></div>';
      panel.querySelector('[data-dc-login]')?.addEventListener('click',async()=>{
        try{
          setStatus('ПЕРЕХОД К GOOGLE…');
          const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:appUrl('/join/')}});
          if(error)throw error;
        }catch(e){showError(e)}
      });
      return;
    }
    const meta=session.user.user_metadata||{};
    const name=meta.full_name||meta.name||session.user.email||'Участник';
    panel.innerHTML=`<div class="dc-account-panel__meta"><strong>${escapeHtml(name)}</strong><span data-dc-account-status>ПРОФИЛЬ ПОДКЛЮЧЁН · СИНХРОНИЗАЦИЯ ВКЛЮЧЕНА</span></div><div class="dc-account-panel__actions"><button type="button" data-dc-sync>СИНХРОНИЗИРОВАТЬ</button><button type="button" data-dc-logout>ВЫЙТИ</button></div>`;
    panel.querySelector('[data-dc-sync]')?.addEventListener('click',()=>queueSync(0,true));
    panel.querySelector('[data-dc-logout]')?.addEventListener('click',async()=>{await client.auth.signOut();session=null;renderAccount()});
  }
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  installStorageTap();
  renderAccount();
  loadClient().catch(showError);
})();
