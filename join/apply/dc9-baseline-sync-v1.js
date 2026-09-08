import {DC_ASSESSMENT_VERSION,DC_LOCAL_STORAGE_KEY,canonicalSphereId} from '/community-runtime-v1.js';
import {collectCompletedRuns} from '/join/dc9-sync-state-v1.js';

const readLocal=()=>{try{return JSON.parse(localStorage.getItem(DC_LOCAL_STORAGE_KEY)||'null')||{}}catch{return{}}};
const mergeOptions={canonicalSphere:canonicalSphereId,currentQuizVersion:'dc9-immersive-v1',assessmentVersion:DC_ASSESSMENT_VERSION};

export async function syncDc9LocalHistory(client,userId){
  if(!client||!userId)return{synced:0};
  const local=readLocal();
  const runs=collectCompletedRuns(local,mergeOptions);
  let synced=0;
  for(const {sphere,result,sourceKey} of runs){
    const {error}=await client.from('assessment_runs').upsert({
      profile_id:userId,
      sphere_id:canonicalSphereId(sphere),
      assessment_version:DC_ASSESSMENT_VERSION,
      result_json:result,
      answers_json:null,
      started_at:null,
      completed_at:result.date,
      source_key:sourceKey
    },{onConflict:'profile_id,source_key',ignoreDuplicates:true});
    if(error&&error.code!=='23505')throw error;
    synced++;
  }
  return{synced,baselineRule:local.firstBaseline?.rule||null};
}
