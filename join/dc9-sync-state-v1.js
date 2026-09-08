const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const safeObject=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
const dateStamp=value=>{const n=Date.parse(value||'');return Number.isFinite(n)?n:0};
const validResult=value=>value&&typeof value==='object'&&typeof value.date==='string'&&dateStamp(value.date)>0;
const stable=value=>{
  if(Array.isArray(value))return `[${value.map(stable).join(',')}]`;
  if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
};

function requireCanonical(options){
  if(typeof options?.canonicalSphere!=='function')throw new Error('DC9_CANONICAL_SPHERE_REQUIRED');
  return options.canonicalSphere;
}
function canonicalMap(raw,canonicalSphere,mergeValue){
  const out={};
  for(const [rawId,value] of Object.entries(safeObject(raw))){
    const id=canonicalSphere(rawId);
    if(!id)continue;
    out[id]=out[id]===undefined?clone(value):mergeValue(out[id],value,id);
  }
  return out;
}
function newerResult(a,b){
  if(!a)return clone(b);if(!b)return clone(a);
  return dateStamp(b.date)>dateStamp(a.date)?clone(b):clone(a);
}
function normalizeDraft(raw,id){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  return {...clone(raw),sphere:id};
}
function draftStamp(draft){return Math.max(dateStamp(draft?.updatedAt),dateStamp(draft?.startedAt))}
function mergeCompatibleDrafts(a,b,id){
  const newer=draftStamp(b)>draftStamp(a)?b:a;
  const older=newer===a?b:a;
  const merged={...clone(older),...clone(newer),sphere:id};
  const aa=Array.isArray(a?.answers)?a.answers:[];
  const ba=Array.isArray(b?.answers)?b.answers:[];
  const len=Math.max(aa.length,ba.length);
  if(len){
    const primary=newer===a?aa:ba,secondary=newer===a?ba:aa;
    merged.answers=Array.from({length:len},(_,i)=>primary[i]!==null&&primary[i]!==undefined?primary[i]:secondary[i]??null);
  }
  return merged;
}
function mergeDraft(a,b,id,currentQuizVersion){
  const da=normalizeDraft(a,id),db=normalizeDraft(b,id);
  if(!da)return db;if(!db)return da;
  if(da.quizVersion&&db.quizVersion&&da.quizVersion===db.quizVersion)return mergeCompatibleDrafts(da,db,id);
  const aCurrent=da.quizVersion===currentQuizVersion,bCurrent=db.quizVersion===currentQuizVersion;
  if(aCurrent!==bCurrent)return clone(aCurrent?da:db);
  return clone(draftStamp(db)>draftStamp(da)?db:da);
}
function normalizeBaseline(raw,canonicalSphere){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const next=clone(raw);
  next.results=canonicalMap(raw.results,canonicalSphere,newerResult);
  return next;
}
function baselineMeaning(value){
  if(!value)return null;
  return stable({rule:value.rule||null,assessmentVersion:value.assessmentVersion||null,completedAt:value.completedAt||null,results:value.results||{}});
}
function normalizeRepeatRuns(raw,canonicalSphere,assessmentVersion){
  const out={};const seen=new Map();
  for(const [rawId,list] of Object.entries(safeObject(raw))){
    const sphere=canonicalSphere(rawId);if(!sphere||!Array.isArray(list))continue;
    if(!out[sphere]){out[sphere]=[];seen.set(sphere,new Set())}
    const sphereSeen=seen.get(sphere);
    for(const result of list){
      if(!validResult(result))continue;
      const identity=result.runId||result.run_id||result.assessment_run_id||result.id||result.date;
      const version=result.assessmentVersion||result.assessment_version||assessmentVersion;
      const key=`${version}:${sphere}:${identity}`;
      if(sphereSeen.has(key))continue;
      sphereSeen.add(key);out[sphere].push(clone(result));
    }
  }
  for(const list of Object.values(out))list.sort((a,b)=>dateStamp(a.date)-dateStamp(b.date));
  return out;
}
function unionRepeatRuns(a,b,canonicalSphere,assessmentVersion){
  const combined={};
  for(const source of [a,b])for(const [id,list] of Object.entries(safeObject(source))){if(!combined[id])combined[id]=[];if(Array.isArray(list))combined[id].push(...list)}
  return normalizeRepeatRuns(combined,canonicalSphere,assessmentVersion);
}
function canonicalActive(raw,canonicalSphere){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||!raw.sphere)return null;
  return {...clone(raw),sphere:canonicalSphere(raw.sphere)};
}
function validActive(candidate,drafts,currentQuizVersion){
  if(!candidate?.sphere)return false;
  const draft=drafts[candidate.sphere];
  if(!draft)return false;
  if(draft.quizVersion!==currentQuizVersion)return false;
  if(candidate.quizVersion&&candidate.quizVersion!==currentQuizVersion)return false;
  return true;
}
function mergeActive(local,remote,drafts,currentQuizVersion,canonicalSphere){
  const candidates=[canonicalActive(local,canonicalSphere),canonicalActive(remote,canonicalSphere)].filter(Boolean).filter(x=>validActive(x,drafts,currentQuizVersion));
  if(!candidates.length)return null;
  candidates.sort((a,b)=>dateStamp(b.updatedAt)-dateStamp(a.updatedAt));
  return clone(candidates[0]);
}
function mergeConflicts(local,remote,newConflict){
  const out=[];const seen=new Set();
  for(const item of [...(Array.isArray(local)?local:[]),...(Array.isArray(remote)?remote:[]),...(newConflict?[newConflict]:[])]){
    const key=stable(item);if(seen.has(key))continue;seen.add(key);out.push(clone(item));
  }
  return out;
}

export function normalizeAssessmentState(input,options){
  const canonicalSphere=requireCanonical(options);
  const assessmentVersion=options.assessmentVersion||'dc9-v1';
  const source=safeObject(input);
  const next=clone(source);
  next.results=canonicalMap(source.results,canonicalSphere,newerResult);
  next.drafts=canonicalMap(source.drafts,canonicalSphere,(a,b,id)=>mergeDraft(a,b,id,options.currentQuizVersion));
  for(const [id,draft] of Object.entries(next.drafts))next.drafts[id]=normalizeDraft(draft,id);
  next.active=canonicalActive(source.active,canonicalSphere);
  if(source.legacyActive)next.legacyActive=canonicalActive(source.legacyActive,canonicalSphere)||clone(source.legacyActive);
  next.firstBaseline=normalizeBaseline(source.firstBaseline,canonicalSphere);
  next.repeatRuns=normalizeRepeatRuns(source.repeatRuns,canonicalSphere,assessmentVersion);
  return next;
}

export function mergeAssessmentStates(localInput,remoteInput,options){
  const canonicalSphere=requireCanonical(options);
  const currentQuizVersion=options.currentQuizVersion||'dc9-immersive-v1';
  const assessmentVersion=options.assessmentVersion||'dc9-v1';
  const local=normalizeAssessmentState(localInput,options),remote=normalizeAssessmentState(remoteInput,options);
  const merged={...clone(remote),...clone(local)};

  merged.results={};
  for(const id of new Set([...Object.keys(remote.results||{}),...Object.keys(local.results||{})]))merged.results[id]=newerResult(local.results?.[id],remote.results?.[id]);

  merged.drafts={};
  for(const id of new Set([...Object.keys(remote.drafts||{}),...Object.keys(local.drafts||{})])){
    const draft=mergeDraft(local.drafts?.[id],remote.drafts?.[id],id,currentQuizVersion);
    if(draft)merged.drafts[id]=draft;
  }
  merged.active=mergeActive(local.active,remote.active,merged.drafts,currentQuizVersion,canonicalSphere);
  merged.repeatRuns=unionRepeatRuns(local.repeatRuns,remote.repeatRuns,canonicalSphere,assessmentVersion);

  const localBaseline=normalizeBaseline(local.firstBaseline,canonicalSphere),remoteBaseline=normalizeBaseline(remote.firstBaseline,canonicalSphere);
  let baselineConflict=null;
  if(localBaseline&&remoteBaseline&&baselineMeaning(localBaseline)!==baselineMeaning(remoteBaseline)){
    baselineConflict={type:'FIRST_BASELINE_CONFLICT',detectedAt:new Date().toISOString(),local:clone(localBaseline),remote:clone(remoteBaseline)};
  }
  merged.firstBaseline=clone(localBaseline||remoteBaseline||null);
  const conflicts=mergeConflicts(local.syncIntegrityConflicts,remote.syncIntegrityConflicts,baselineConflict);
  if(conflicts.length)merged.syncIntegrityConflicts=conflicts;else delete merged.syncIntegrityConflicts;

  if(local.quizVersion===currentQuizVersion||remote.quizVersion===currentQuizVersion)merged.quizVersion=currentQuizVersion;
  else if(local.quizVersion||remote.quizVersion)merged.quizVersion=local.quizVersion||remote.quizVersion;

  return merged;
}

export function collectCompletedRuns(state,options){
  const canonicalSphere=requireCanonical(options);
  const assessmentVersion=options.assessmentVersion||'dc9-v1';
  const normalized=normalizeAssessmentState(state,options);
  const runs=new Map();
  const add=(rawSphere,result)=>{
    const sphere=canonicalSphere(rawSphere);if(!sphere||!validResult(result))return;
    const key=`${assessmentVersion}:${sphere}:${result.date}`;
    if(!runs.has(key))runs.set(key,{sphere,result:clone(result),sourceKey:key});
  };
  for(const [sphere,result] of Object.entries(normalized.firstBaseline?.results||{}))add(sphere,result);
  for(const [sphere,list] of Object.entries(normalized.repeatRuns||{}))for(const result of Array.isArray(list)?list:[])add(sphere,result);
  for(const [sphere,result] of Object.entries(normalized.results||{}))add(sphere,result);
  return [...runs.values()].sort((a,b)=>dateStamp(a.result.date)-dateStamp(b.result.date));
}
