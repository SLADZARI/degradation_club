#!/usr/bin/env node
// OPS-01: inspect only a PRIVATE, disposable, OFF-VM restore of an existing
// world.json. No HTTP, no writes, no user-name/ID/token/chat output.
// Run twice in independent Node processes to test deterministic cold reload.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const path=process.argv[2];
if(!path){console.error('QA_RESTORE_FAIL: private restored world path required');process.exit(2);}
const sensitivePlayerFields=[
  'id','token','wallet','bag','tools','toolItems','activeTools','equipped',
  'health','hunger','stamina','pagerOwns','pagerNumber','pagerInbox',
  'results','delivery','scene','plotId','cityId','cityReturn','spirit'
];
const durableCityFields=[
  'treasury','transactions','warehouse','materialEvents','materialScrap',
  'drops','trades','project','forge','bridge','seedMarket','gardenProject',
  'secondBridgeProject','thefts','mayorMail'
];
const durablePlotFields=['id','owner','home','lease','shop','zoning','landUse'];
function worldEntries(raw){
  if(raw?.schema==='dementor-cities-v1'){
    return [['origin',raw.origin],...Object.entries(raw.cities||{}).map(([k,v])=>[k,v.state])];
  }
  return [['origin',raw]];
}
function compareExisting(from,to,fields,label){
  assert.ok(from&&to,label+' object missing');
  for(const field of fields)if(Object.hasOwn(from,field)){
    assert.ok(Object.hasOwn(to,field),label+' field missing');
    assert.deepStrictEqual(to[field],from[field],label+' changed');
  }
}
function compareWorld(before,after){
  const old=new Map(worldEntries(before)),next=new Map(worldEntries(after));
  assert.equal(next.size,old.size,'city count changed');
  let players=0,ownedPlots=0,receipts=0,walletPAPER=0,treasuryPAPER=0,plots=0;
  for(const [city,s] of old){
    const n=next.get(city);assert.ok(n,'city missing');
    const oldPeople=Object.entries(s.players||{}),newPeople=n.players||{};
    assert.equal(Object.keys(newPeople).length,oldPeople.length,'player count changed');
    for(const [id,person] of oldPeople){
      assert.ok(Object.hasOwn(newPeople,id),'player missing');
      compareExisting(person,newPeople[id],sensitivePlayerFields,'character');
      players++;walletPAPER+=Number(person.wallet||0);
      receipts+=(person.results||[]).length;
    }
    const oldPlots=s.plots||[],nextPlots=new Map((n.plots||[]).map(p=>[p.id,p]));
    assert.equal(nextPlots.size,oldPlots.length,'plot count changed');
    for(const p of oldPlots){
      assert.ok(nextPlots.has(p.id),'plot missing');
      compareExisting(p,nextPlots.get(p.id),durablePlotFields,'property');
      plots++;if(p.owner)ownedPlots++;
    }
    const newResources=new Map((n.resources||[]).map(r=>[r.id,r]));
    for(const r of s.resources||[]){
      const nr=newResources.get(r.id);assert.ok(nr,'resource missing');
      for(const key of ['type','stock','initial']){
        if(Object.hasOwn(r,key))assert.deepStrictEqual(nr[key],r[key],'resource changed');
      }
    }
    compareExisting(s,n,durableCityFields,'ledger or construction');
    treasuryPAPER+=Number(s.treasury||0);
  }
  return {cities:old.size,players,plots,ownedPlots,walletPAPER,treasuryPAPER,receipts};
}
try{
  const source=fs.readFileSync(path);
  const sourceDigest=createHash('sha256').update(source).digest('hex');
  const initial=JSON.parse(source.toString('utf8'));
  // Audit using the EXACT RELEASE CANDIDATE's code, not the OPS checkout's
  // possibly older CityNetwork. Path is a private local checked-out runtime.
  const candidateRuntime=process.argv[3];
  const candidateModule=candidateRuntime
    ?pathToFileURL(resolve(candidateRuntime,'city-network.mjs')).href
    :new URL('../city-network.mjs',import.meta.url).href;
  const {CityNetwork}=await import(candidateModule);
  // Constructors only touch structuredClone, never the restored source.
  const first=new CityNetwork(structuredClone(initial));
  const once=structuredClone(first.serialize());
  const counts=compareWorld(initial,once);
  const restarted=new CityNetwork(structuredClone(once));
  compareWorld(initial,restarted.serialize());
  // RequestId must always replay original persisted receipt (even if incoming
  // type differs). Test on in-memory copy and assert ZERO world mutations.
  let replayCases=0;
  for(const game of restarted.values()){
    for(const player of Object.values(game.state.players||{})){
      const receipt=(player.results||[]).find(r=>typeof r?.id==='string'
        &&r.id.length>=4&&r.id.length<=100&&r.result);
      if(!receipt)continue;
      const prior=JSON.stringify(restarted.serialize());
      const repeated=game.command(player,{
        type:'drop',kind:'wood',quantity:1,requestId:receipt.id
      });
      assert.deepStrictEqual(repeated,receipt.result,'stored request result changed');
      assert.equal(JSON.stringify(restarted.serialize()),prior,'replay mutated restored world');
      replayCases++;
    }
  }
  compareWorld(initial,restarted.serialize());
  const afterDigest=createHash('sha256').update(fs.readFileSync(path)).digest('hex');
  assert.equal(afterDigest,sourceDigest,'private restored save modified');
  console.log(JSON.stringify({
    status:'PASS_PRIVATE_RESTORE_RELOAD',
    ...counts,requestIdReplayCases:replayCases,
    requestIdReplayStatus:replayCases?'PASS':'NOT_TESTED_NO_CACHED_RECEIPTS',
    sourceFileUntouched:true,
    productionReadOrModified:false
  }));
}catch{
  // No raw exception: player names/IDs/messages can be embedded in state data.
  console.error('QA_RESTORE_FAIL: data compatibility, cold-reload or replay invariant failed; inspect only in private QA environment');
  process.exitCode=1;
}
