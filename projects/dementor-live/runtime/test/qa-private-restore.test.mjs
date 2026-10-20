import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createWorld} from '../world-expansion-adapter.mjs';
import {CityNetwork} from '../city-network.mjs';

const tool=path.resolve(import.meta.dirname,'../tools/qa-restore-identity-audit.mjs');
function run(input){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-ops-private-fixture-'));
  const file=path.join(dir,'world.json');
  try{
    const data=JSON.stringify(input);
    fs.writeFileSync(file,data,{mode:0o600});
    const before=fs.readFileSync(file);
    const a=spawnSync(process.execPath,[tool,file],{encoding:'utf8',timeout:20000});
    const b=spawnSync(process.execPath,[tool,file],{encoding:'utf8',timeout:20000});
    assert.equal(a.status,0,'first synthetic cold-load failed');
    assert.equal(b.status,0,'second synthetic cold-load failed');
    assert.equal(a.stdout,b.stdout,'success summaries must match between separate processes');
    assert.deepEqual(fs.readFileSync(file),before,'restored input must remain untouched');
    return JSON.parse(a.stdout);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
}

test('private QA reload preserves character PAPER plot and cached requestId',()=>{
  const net=new CityNetwork(createWorld()),g=net.origin;
  const p=g.join('Synthetic QA account');
  p.wallet=27;p.bag.wood=6;p.bag.stone=2;
  g.state.treasury=700;
  g.state.plots[0].owner=p.id;
  p.results.push({id:'qa-original-receipt-once',result:{ok:true,message:'Synthetic test only',reward:2}});
  const receipt=run(net.serialize());
  assert.equal(receipt.status,'PASS_PRIVATE_RESTORE_RELOAD');
  assert.equal(receipt.players,1);
  assert.equal(receipt.ownedPlots,1);
  assert.equal(receipt.treasuryPAPER,700);
  assert.equal(receipt.walletPAPER,27);
  assert.equal(receipt.receipts,1);
  assert.equal(receipt.requestIdReplayCases,1);
  assert.equal(receipt.requestIdReplayStatus,'PASS');
  assert.equal(receipt.sourceFileUntouched,true);
});

test('no receipt is NOT misrepresented as replay PASS',()=>{
  const net=new CityNetwork(createWorld());
  const summary=run(net.serialize());
  assert.equal(summary.requestIdReplayCases,0);
  assert.equal(summary.requestIdReplayStatus,'NOT_TESTED_NO_CACHED_RECEIPTS');
  assert.equal(summary.players,0);
  assert.equal(summary.sourceFileUntouched,true);
});
