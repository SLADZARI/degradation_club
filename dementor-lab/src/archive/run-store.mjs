const STORAGE_KEY='dementor-lab:runs:v0.8';

function safeStorage(storage=globalThis.localStorage){return storage&&typeof storage.getItem==='function'?storage:null}
function clone(value){return JSON.parse(JSON.stringify(value))}

export function encounterToRunRecord(encounter,{rerun=null}={}){
  const actorA=encounter.actors.A,actorB=encounter.actors.B;
  const result=encounter.result||null;
  return {
    runId:encounter.id||`run-${Date.now()}`,
    createdAt:new Date().toISOString(),
    scenarioId:encounter.scenario.id,
    scenarioTitle:encounter.scenario.title,
    objective:encounter.scenario.objective,
    player:{name:actorA.name,characterId:actorA.visual?.characterId||'character-01',brainPresetId:actorA.visual?.brainPresetId||null},
    opponent:{name:actorB.name,profileId:actorB.visual?.opponentPresetId||null,characterId:actorB.visual?.characterId||'character-02'},
    outcome:clone(result),
    finalState:{A:clone(actorA.state),B:clone(actorB.state)},
    highlights:encounter.transcript.map(entry=>({turn:entry.turn,actorId:entry.actorId,phrase:entry.phrase||null,intent:entry.intent||null,event:entry.event||null,brainVoice:entry.brainVoice||null})),
    traces:clone(encounter.traces),
    patches:clone(encounter.patches||[]),
    rerun:rerun?clone(rerun):null
  };
}

export function loadRunRecords(storage=globalThis.localStorage){
  const s=safeStorage(storage);if(!s)return [];
  try{const data=JSON.parse(s.getItem(STORAGE_KEY)||'[]');return Array.isArray(data)?data:[]}catch{return []}
}

export function saveRunRecord(record,storage=globalThis.localStorage){
  const s=safeStorage(storage);if(!s)return record;
  const rows=loadRunRecords(s).filter(x=>x.runId!==record.runId);
  rows.unshift(record);s.setItem(STORAGE_KEY,JSON.stringify(rows.slice(0,100)));return record;
}

export function getRunRecord(runId,storage=globalThis.localStorage){return loadRunRecords(storage).find(x=>x.runId===runId)||null}
export function clearRunRecords(storage=globalThis.localStorage){const s=safeStorage(storage);if(s)s.removeItem(STORAGE_KEY)}
