import {DC_SPHERES,DC_ASSESSMENT_VERSION,DC_LOCAL_STORAGE_KEY,canonicalSphereId} from '/community-runtime-v1.js';

const allowed=new Set(DC_SPHERES.map(([id])=>id));
const readLocal=()=>{try{return JSON.parse(localStorage.getItem(DC_LOCAL_STORAGE_KEY)||'null')||{}}catch{return{}}};
const valid=result=>result&&typeof result==='object'&&typeof result.date==='string'&&Number.isFinite(Date.parse(result.date));
const keyFor=(sphere,result)=>`${DC_ASSESSMENT_VERSION}:${sphere}:${result.date}`;

function collectLocalRuns(local){
  const runs=new Map();
  const add=(rawSphere,result)=>{
    const sphere=canonicalSphereId(rawSphere);
    if(!allowed.has(sphere)||!valid(result))return;
    const key=keyFor(sphere,result);
    if(!runs.has(key))runs.set(key,{sphere,result});
  };
  for(const [sphere,result] of Object.entries(local.firstBaseline?.results||{}))add(sphere,result);
  for(const [sphere,list] of Object.entries(local.repeatRuns||{}))for(const result of Array.isArray(list)?list:[])add(sphere,result);
  for(const [sphere,result] of Object.entries(local.results||{}))add(sphere,result);
  return [...runs.values()].sort((a,b)=>Date.parse(a.result.date)-Date.parse(b.result.date));
}

export async function syncDc9LocalHistory(client,userId){
  if(!client||!userId)return{synced:0};
  const local=readLocal();
  const runs=collectLocalRuns(local);
  let synced=0;
  for(const {sphere,result} of runs){
    const {error}=await client.from('assessment_runs').upsert({
      profile_id:userId,
      sphere_id:sphere,
      assessment_version:DC_ASSESSMENT_VERSION,
      result_json:result,
      answers_json:null,
      started_at:null,
      completed_at:result.date,
      source_key:keyFor(sphere,result)
    },{onConflict:'profile_id,source_key',ignoreDuplicates:true});
    if(error&&error.code!=='23505')throw error;
    synced++;
  }
  return{synced,baselineRule:local.firstBaseline?.rule||null};
}
