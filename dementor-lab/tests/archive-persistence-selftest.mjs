import assert from 'node:assert/strict';
import { createMvpSession, advanceUntilPause, saveSessionToArchive } from '../src/app/mvp-session.mjs';
import { loadRunRecords, getRunRecord } from '../src/archive/run-store.mjs';

function memoryStorage(){
  const data=new Map();return {getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};
}
const storage=memoryStorage();
const one=createMvpSession({playerName:'Первый',playerPresetId:'KEEP_PEACE',objective:'contact'});
const two=createMvpSession({playerName:'Второй',playerPresetId:'EXPLAIN_LOOP',objective:'contact'});
assert.notEqual(one.controller.encounter.id,two.controller.encounter.id,'every experiment needs a unique run id');
advanceUntilPause(one,{maxTurns:80,declineHotPatch:true});advanceUntilPause(two,{maxTurns:80,declineHotPatch:true});
const r1=saveSessionToArchive(one,{storage}),r2=saveSessionToArchive(two,{storage});
const rows=loadRunRecords(storage);
assert.equal(rows.length,2,'saving a second experiment must not overwrite the first');
assert.equal(rows[0].runId,r2.runId);assert.equal(rows[1].runId,r1.runId);
assert.equal(getRunRecord(r1.runId,storage)?.player?.name,'Первый');
assert.equal(getRunRecord(r2.runId,storage)?.player?.name,'Второй');
console.log('archive persistence selftest: PASS — multiple real runs survive serialization with unique ids');
