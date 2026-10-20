import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {createWorld,Game} from '../world-expansion-adapter.mjs';
import {CityNetwork} from '../city-network.mjs';
const root=path.resolve(import.meta.dirname,'..');
function runAudit(data){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-release-audit-'));
 try{
  const name=path.join(dir,'world.json');const raw=JSON.stringify(data);
  fs.writeFileSync(name,raw);
  const out=execFileSync(process.execPath,[path.join(root,'tools/upgrade-audit.mjs'),name],{encoding:'utf8'});
  assert.equal(fs.readFileSync(name,'utf8'),raw,'audit must never write source');
  return JSON.parse(out);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
test('current multi-city save cold-loads without losing plot, material and mailbox rights',()=>{
 const n=new CityNetwork(createWorld()),g=n.origin,p=g.join('Тест','female');
 n.snapshot(p);p.wallet=117;p.bag.wood=12;p.bag.stone=6;
 g.state.plots[0].owner=p.id;g.state.plots[0].home.tent=3;g.state.plots[0].home.beds.push({id:'bed-check',x:6,y:11,crop:'carrot',watered:true,readyAt:123});
 p.pagerOwns=true;p.pagerInbox.push({id:'letter-fixture',from:'410001',text:'Проверка',at:123,readAt:null});
 const report=runAudit(n.serialize());
 assert.equal(report.status,'PASS_READ_ONLY');assert.equal(report.countsBefore.ownedPlots,1);
 assert.equal(report.countsBefore.wallets,117);
});
test('legacy pre-multi-city save passes read-only migration and preserves finite resource quantities',()=>{
 const g=new Game(createWorld()),p=g.join('Старый житель');p.wallet=43;p.bag.stone=5;
 const old=structuredClone(g.state);delete old.forge;delete old.secondBridgeProject;
 const report=runAudit(old);
 assert.equal(report.status,'PASS_READ_ONLY');
 assert.equal(report.countsBefore.wallets,report.countsAfter.wallets);
});
