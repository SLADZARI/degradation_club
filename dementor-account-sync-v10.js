// Dementor Club — account + assessment sync v10.
// Invisible sync owner: public authentication UI remains owned by GlobalHeader/Application.
import {
  DC_ASSESSMENT_VERSION,
  DC_LOCAL_STORAGE_KEY,
  canonicalSphereId,
  getClient
} from '/community-runtime-v1.js';
import {
  collectCompletedRuns,
  mergeAssessmentStates,
  normalizeAssessmentState
} from '/join/dc9-sync-state-v1.js';

const runtimePath=location.pathname.replace(/^\/degradation_club(?=\/|$)/,'')||'/';
if(/\/join\/?(?:index\.html)?$/.test(runtimePath)&&!window.__DC_ACCOUNT_SYNC_V10__){
  window.__DC_ACCOUNT_SYNC_V10__=true;

  const CURRENT_QUIZ_VERSION='dc9-immersive-v1';
  const mergeOptions={canonicalSphere:canonicalSphereId,currentQuizVersion:CURRENT_QUIZ_VERSION,assessmentVersion:DC_ASSESSMENT_VERSION};
  const TRACE=[];
  let client=null,session=null,syncTimer=null,applyingRemote=false,syncInFlight=null,syncPending=false,syncPendingMerge=false;

  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const canonicalize=v=>Array.isArray(v)?v.map(canonicalize):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v);
  const stable=v=>JSON.stringify(canonicalize(v));
  const normalize=state=>normalizeAssessmentState(state||{},mergeOptions);
  const readLocal=()=>{try{return normalize(JSON.parse(localStorage.getItem(DC_LOCAL_STORAGE_KEY)||'null')||{})}catch{return normalize({})}};
  let lastState=clone(readLocal());

  function trace(step,detail={}){
    const safe={...detail};delete safe.access_token;delete safe.refresh_token;delete safe.token;delete safe.session;
    const entry={t:new Date().toISOString(),step,...safe};TRACE.push(entry);window.__DC_AUTH_TRACE__=TRACE;
    if(new URLSearchParams(location.search).get('authdebug')==='1')console.log('[DC AUTH V10]',entry);
  }
  const fail=error=>{trace('error',{message:error?.message||String(error),code:error?.code||null});console.error('[Dementor Sync V10]',error)};

  async function persistCompletedRuns(state){
    if(!session)return;
    for(const {sphere,result,sourceKey} of collectCompletedRuns(state,mergeOptions)){
      const {error}=await client.from('assessment_runs').upsert({
        profile_id:session.user.id,
        sphere_id:canonicalSphereId(sphere),
        assessment_version:DC_ASSESSMENT_VERSION,
        result_json:result,
        answers_json:null,
        started_at:null,
        completed_at:result.date,
        source_key:sourceKey
      },{onConflict:'profile_id,source_key',ignoreDuplicates:true});
      if(error&&error.code!=='23505')throw error;
    }
  }
  async function readRemoteSnapshot(){
    const {data,error}=await client.from('assessment_snapshots').select('state_json').eq('profile_id',session.user.id).maybeSingle();
    if(error)throw error;
    return data?.state_json?normalize(data.state_json):null;
  }
  async function writeSnapshot(state){
    const now=new Date().toISOString(),canonical=normalize(state);
    const {error}=await client.from('assessment_snapshots').upsert({
      profile_id:session.user.id,
      assessment_version:DC_ASSESSMENT_VERSION,
      state_json:canonical,
      client_updated_at:now,
      updated_at:now
    },{onConflict:'profile_id'});
    if(error)throw error;
  }
  async function syncPass(mergeRemote=false){
    trace('sync-pass-start',{mergeRemote});
    const local=readLocal();let state=local,remote=null;
    if(mergeRemote){
      remote=await readRemoteSnapshot();
      if(remote){
        state=mergeAssessmentStates(local,remote,mergeOptions);
        if(state.syncIntegrityConflicts?.length)trace('integrity-conflict',{types:state.syncIntegrityConflicts.map(x=>x.type)});
        if(stable(state)!==stable(local)){
          applyingRemote=true;
          try{localStorage.setItem(DC_LOCAL_STORAGE_KEY,JSON.stringify(state))}finally{applyingRemote=false}
          lastState=clone(state);
          window.dispatchEvent(new CustomEvent('dc:assessment-state-merged',{detail:{state:clone(state)}}));
        }
      }
    }
    await persistCompletedRuns(state);
    const canonicalRemote=remote?normalize(remote):null,canonicalState=normalize(state);
    if(canonicalRemote&&stable(canonicalState)===stable(canonicalRemote))trace('snapshot-write-skip',{reason:'unchanged'});else await writeSnapshot(canonicalState);
    trace('sync-pass-done',{results:Object.keys(canonicalState.results||{}).length,drafts:Object.keys(canonicalState.drafts||{}).length,active:canonicalState.active?.sphere||null});
  }
  async function requestSync(mergeRemote=false){
    if(!session||!client)return;
    if(syncInFlight){syncPending=true;syncPendingMerge=syncPendingMerge||mergeRemote;return syncInFlight}
    syncInFlight=(async()=>{let nextMerge=mergeRemote;do{syncPending=false;const passMerge=nextMerge||syncPendingMerge;syncPendingMerge=false;await syncPass(passMerge);nextMerge=false}while(syncPending)})();
    try{return await syncInFlight}finally{syncInFlight=null}
  }
  function queueSync(delay=250,mergeRemote=false){clearTimeout(syncTimer);syncTimer=setTimeout(()=>requestSync(mergeRemote).catch(fail),delay)}
  function installStorageTap(){
    const original=Storage.prototype.setItem;if(original.__dcSyncV10Wrapped)return;
    const wrapped=function(key,value){
      const result=original.apply(this,arguments);
      if(this===localStorage&&key===DC_LOCAL_STORAGE_KEY&&!applyingRemote){
        let next=null;try{next=normalize(JSON.parse(value))}catch{}
        if(next){lastState=clone(next);if(session)queueSync(250,false)}
      }
      return result;
    };
    wrapped.__dcSyncV10Wrapped=true;Storage.prototype.setItem=wrapped;
  }
  async function boot(){
    trace('boot-start');client=getClient();
    client.auth.onAuthStateChange((event,next)=>{
      trace('auth-state',{event,hasSession:Boolean(next)});session=next||null;
      if(session&&event==='TOKEN_REFRESHED')requestSync(true).catch(fail);
    });
    const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session||null;
    if(session){const user=await client.auth.getUser();if(user.error)throw user.error;await requestSync(true)}
    trace('boot-done',{signedIn:Boolean(session)});
  }

  installStorageTap();boot().catch(fail);
}
