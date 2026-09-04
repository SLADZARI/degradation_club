(()=>{
'use strict';
const STORAGE_KEY='dementorClubOnboardingV3';
const RULE='first-complete-9of9-v1';
const ASSESSMENT_VERSION='dc9-v1';
const SPHERES=['personality','work','consumption','relationships','control','information','self_development','meaning','technology'];
const nativeGet=Storage.prototype.getItem;
const nativeSet=Storage.prototype.setItem;
const clone=value=>JSON.parse(JSON.stringify(value));
const canonical=id=>String(id||'')==='self-development'?'self_development':String(id||'');
const validResult=value=>value&&typeof value==='object'&&typeof value.date==='string'&&Number.isFinite(Date.parse(value.date));

function canonicalResults(raw){
  const out={};
  for(const [rawId,result] of Object.entries(raw&&typeof raw==='object'?raw:{})){
    const id=canonical(rawId);
    if(!SPHERES.includes(id)||!validResult(result))continue;
    const current=out[id];
    if(!current||Date.parse(result.date)>=Date.parse(current.date))out[id]=result;
  }
  return out;
}
function complete(results){return SPHERES.every(id=>validResult(results[id]))}
function baselineFrom(results,source){
  const normalized=canonicalResults(results);
  if(!complete(normalized))return null;
  return Object.freeze({
    rule:RULE,
    assessmentVersion:ASSESSMENT_VERSION,
    completedAt:new Date(Math.max(...SPHERES.map(id=>Date.parse(normalized[id].date)))).toISOString(),
    lockedAt:new Date().toISOString(),
    source,
    results:clone(Object.fromEntries(SPHERES.map(id=>[id,normalized[id]])))
  });
}
function addRepeat(repeatRuns,id,result,baselineResult){
  if(!validResult(result)||result.date===baselineResult?.date)return;
  const list=Array.isArray(repeatRuns[id])?repeatRuns[id]:[];
  if(!list.some(item=>item?.date===result.date))list.push(clone(result));
  list.sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
  repeatRuns[id]=list;
}
function harmonize(incoming,previous,{bootstrap=false}={}){
  const next=incoming&&typeof incoming==='object'&&!Array.isArray(incoming)?incoming:{};
  const prev=previous&&typeof previous==='object'&&!Array.isArray(previous)?previous:{};
  if(prev.firstBaseline)next.firstBaseline=clone(prev.firstBaseline);
  if(!next.firstBaseline){
    const locked=baselineFrom(next.results,bootstrap?'legacy-observed-current-map-v1':'client-first-complete-v1');
    if(locked)next.firstBaseline=locked;
  }
  const repeatRuns=clone(prev.repeatRuns&&typeof prev.repeatRuns==='object'?prev.repeatRuns:{});
  for(const [id,list] of Object.entries(next.repeatRuns&&typeof next.repeatRuns==='object'?next.repeatRuns:{})){
    const canonicalId=canonical(id);
    if(!SPHERES.includes(canonicalId)||!Array.isArray(list))continue;
    for(const result of list)addRepeat(repeatRuns,canonicalId,result,next.firstBaseline?.results?.[canonicalId]);
  }
  if(next.firstBaseline){
    const current=canonicalResults(next.results);
    for(const id of SPHERES)addRepeat(repeatRuns,id,current[id],next.firstBaseline.results?.[id]);
  }
  next.repeatRuns=repeatRuns;
  return next;
}
function parse(value){try{return JSON.parse(value||'null')}catch{return null}}

Storage.prototype.setItem=function(key,value){
  if(key!==STORAGE_KEY)return nativeSet.call(this,key,value);
  const previous=parse(nativeGet.call(this,key));
  const incoming=parse(value);
  return nativeSet.call(this,key,JSON.stringify(harmonize(incoming,previous)));
};

try{
  const existing=parse(nativeGet.call(localStorage,STORAGE_KEY));
  if(existing){
    const normalized=harmonize(existing,existing,{bootstrap:true});
    nativeSet.call(localStorage,STORAGE_KEY,JSON.stringify(normalized));
  }
}catch(error){console.warn('[DC9 baseline bootstrap]',error)}

Object.defineProperty(globalThis,'DC9_BASELINE_RULE',{value:RULE,writable:false,configurable:false});
})();
