import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {setTimeout as pause} from 'node:timers/promises';
import {Game,createWorld} from '../world.mjs';
import {createRecoveryKit,verifyRecoveryKit,beginRecovery,confirmRecovery,
  createReturnTicket,claimReturnTicket,retryReturnTicket,
  admitCharacterAttempt,RECOVERY_PENDING_MS} from '../character-return.mjs';

const runtime=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const id1='a'.repeat(32),id2='b'.repeat(32);
async function port(){return new Promise((resolve,reject)=>{
  const s=createServer();s.once('error',reject);
  s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});
});}
async function start(world,failOnce=false){
  const p=await port(),base=`http://127.0.0.1:${p}`,logs=[];
  const child=spawn(process.execPath,['server.mjs','--test'],{
    cwd:runtime,env:{...process.env,DEMENTOR_STATE:world,DEMENTOR_PORT:String(p),
    DEMENTOR_IDENTITY_TRANSFER_ENABLED:'1',DEMENTOR_TEST_IDENTITY_SAVE_FAIL_ONCE:failOnce?'1':''},
    stdio:['ignore','pipe','pipe']});
  child.stderr.on('data',x=>logs.push(String(x).slice(0,200)));
  for(let i=0;i<100;i++){
    if(child.exitCode!==null)throw Error('server exited: '+logs.join(''));
    try{const r=await fetch(base+'/api/health',{signal:AbortSignal.timeout(250)});
      if(r.ok)return{child,base};}catch{}
    await pause(30);
  }
  child.kill('SIGTERM');throw Error('server unavailable: '+logs.join(''));
}
async function stop(s){
  if(!s||s.child.exitCode!==null)return;
  const done=new Promise(resolve=>s.child.once('exit',resolve));
  s.child.kill('SIGTERM');
  await Promise.race([done,pause(1400).then(()=>{throw Error('server did not exit');})]);
}
async function post(base,endpoint,payload,token='',headers={}){
  const r=await fetch(base+endpoint,{method:'POST',headers:{'Content-Type':'application/json',
  Origin:base,...(token?{Authorization:'Bearer '+token}:{}),...headers},
  body:JSON.stringify(payload),signal:AbortSignal.timeout(3000)});
  return {status:r.status,data:await r.json()};
}
async function get(base,endpoint,token='',headers={}){
  return fetch(base+endpoint,{headers:{...(token?{Authorization:'Bearer '+token}:{}),...headers},
    signal:AbortSignal.timeout(2000)});
}
function economy(s,id){
  const w=s.origin||s,p=w.players[id];
  return {id:p.id,wallet:p.wallet,bag:JSON.stringify(p.bag),tools:JSON.stringify(p.tools),
    plots:JSON.stringify(w.plots.map(x=>({id:x.id,owner:x.owner}))),
    receipts:JSON.stringify(p.results),transactions:JSON.stringify(w.transactions),
    treasury:w.treasury,ids:Object.keys(w.players).sort()};
}
function fixture(dir){
  const game=new Game(createWorld());
  const resident=game.join('90','unspecified'),other=game.join('90','unspecified');
  resident.wallet=151;other.wallet=59;game.state.treasury-=210;
  game.state.plots[0].owner=resident.id;resident.bag.wood=4;
  resident.results.push({id:'already-paid',result:{ok:true,reward:151}});
  const kit=createRecoveryKit(resident);
  const world=path.join(dir,'world.json');
  fs.writeFileSync(world,JSON.stringify({schema:'dementor-cities-v1',origin:game.state,cities:{}}),{mode:0o600});
  return{world,resident,other,kit};
}
test('offline proof is independent of all lost bearer tokens; one pending requestId and confirmed rotation',()=>{
  const p={id:'45e2e1d2-8000-4434-b559-e24ce3adc491',token:'old bearer'};
  const kit=createRecoveryKit(p,100);
  assert.equal(kit.recoveryCode.length,43);
  assert.equal(JSON.stringify(p).includes(kit.recoveryCode),false);
  assert.equal(verifyRecoveryKit(p,kit.recoveryCode),true);
  assert.equal(beginRecovery(p,'bad',id1,200),null);
  const first=beginRecovery(p,kit.recoveryCode,id1,300);
  assert.notEqual(first.token,'old bearer');
  assert.equal(beginRecovery(p,kit.recoveryCode,id1,301).token,first.token);
  assert.equal(beginRecovery(p,kit.recoveryCode,id2,302),null);
  const reloaded=JSON.parse(JSON.stringify(p));
  assert.equal(beginRecovery(reloaded,kit.recoveryCode,id1,303).token,first.token);
  const renewed=confirmRecovery(reloaded,500);
  assert.ok(renewed.recoveryCode);
  assert.equal(verifyRecoveryKit(reloaded,kit.recoveryCode),false);
  assert.equal(verifyRecoveryKit(reloaded,renewed.recoveryCode),true);
  const oneTime=createReturnTicket(reloaded,600);
  assert.ok(claimReturnTicket(reloaded,oneTime.code,601,id1));
  assert.ok(retryReturnTicket(reloaded,oneTime.code,id1,602));
  createRecoveryKit(reloaded,603);
  assert.equal(retryReturnTicket(reloaded,oneTime.code,id1,604),null);
  assert.equal(beginRecovery(p,kit.recoveryCode,id2,300+RECOVERY_PENDING_MS+1).id,p.id);
  // Legacy resident without an independently issued key: fail CLOSED, even with public id/name.
  assert.equal(beginRecovery({id:p.id,name:'90',token:null},kit.recoveryCode,id1,200),null);
});
test('durable attempt limiter persists across JSON process restart',()=>{
  const p={id:'45e2e1d2-8000-4434-b559-e24ce3adc491'};
  for(let i=0;i<5;i++)assert.equal(admitCharacterAttempt(p,100),true);
  const reloaded=JSON.parse(JSON.stringify(p));
  assert.equal(admitCharacterAttempt(reloaded,101),false);
  assert.equal(admitCharacterAttempt(reloaded,100+10*60*1000+1),true);
});
test('HTTP: lost session restores SAME resident using pre-enrolled offline key; replay after lost ACK/restart',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-no-bearer-recovery-'));
  let s;
  try{
    const f=fixture(dir);
    s=await start(f.world);
    const before=economy(JSON.parse(fs.readFileSync(f.world,'utf8')),f.resident.id);
    const missing=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.other.id,name:'90',recoveryCode:f.kit.recoveryCode,requestId:id1});
    assert.equal(missing.status,401);
    const noId=await post(s.base,'/api/identity/recovery/claim',{name:'90',recoveryCode:f.kit.recoveryCode,requestId:id1});
    assert.equal(noId.status,401);
    const usingUrl=await get(s.base,'/api/events?token='+encodeURIComponent(f.resident.token));
    assert.equal(usingUrl.status,403,'the feature-on server must not accept bearer URL');
    const oldState=await get(s.base,'/api/state',f.resident.token);
    assert.equal(oldState.status,200);
    assert.equal((await oldState.text()).includes(f.kit.recoveryCode),false);
    const xff=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:'x'.repeat(43),requestId:id1},
      '',{'X-Forwarded-For':'203.0.113.47'});
    assert.equal(xff.status,401);
    // The test intentionally discards the first response (client never receives bearer).
    const ackLost=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:f.kit.recoveryCode,requestId:id1});
    assert.equal(ackLost.status,200);
    assert.equal(ackLost.data.id,f.resident.id);
    const firstToken=ackLost.data.token;
    assert.equal((await get(s.base,'/api/state',f.resident.token)).status,401);
    assert.equal((await get(s.base,'/api/state',f.other.token)).status,200);
    await stop(s);s=null;
    s=await start(f.world);
    const recovered=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:f.kit.recoveryCode,requestId:id1});
    assert.equal(recovered.status,200);
    assert.equal(recovered.data.replayed,true);
    assert.equal(recovered.data.token,firstToken);
    assert.equal((await get(s.base,'/api/state',firstToken)).status,200);
    const otherRequest=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:f.kit.recoveryCode,requestId:id2});
    assert.equal(otherRequest.status,401);
    const confirm=await post(s.base,'/api/identity/recovery/confirm',
      {acknowledgeStoredToken:true},firstToken);
    assert.equal(confirm.status,200);
    assert.notEqual(confirm.data.recoveryCode,f.kit.recoveryCode);
    assert.equal((await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:f.kit.recoveryCode,requestId:id2})).status,401);
    assert.equal((await get(s.base,'/api/state',firstToken)).status,200);
    assert.deepEqual(economy(JSON.parse(fs.readFileSync(f.world,'utf8')),f.resident.id),before);
    assert.equal(fs.readFileSync(f.world,'utf8').includes(confirm.data.recoveryCode),false);
    // Explicit enrollment requires authenticated bearer and acknowledgement.
    const enrollWithoutAck=await post(s.base,'/api/identity/recovery/enroll',{},firstToken);
    assert.equal(enrollWithoutAck.status,428);
    const enroll=await post(s.base,'/api/identity/recovery/enroll',
      {acknowledgeSecureStorage:true},firstToken);
    assert.equal(enroll.status,200);
    assert.equal(fs.readFileSync(f.world,'utf8').includes(enroll.data.recoveryCode),false);
  }finally{if(s)await stop(s);fs.rmSync(dir,{recursive:true,force:true});}
});
test('HTTP: old client onboarding is rejected when rescue UI not acknowledged; persistent per-target rate',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-recovery-onboard-'));let s;
  try{
    const f=fixture(dir);s=await start(f.world);
    const denied=await post(s.base,'/api/join',{name:'new','gender':'unspecified'});
    assert.equal(denied.status,428);
    const join=await post(s.base,'/api/join',{name:'new',gender:'unspecified',acceptRecoveryKit:true});
    assert.equal(join.status,200);
    assert.equal(join.data.recoveryCode.length,43);
    assert.equal(fs.readFileSync(f.world,'utf8').includes(join.data.recoveryCode),false);
    const target=f.other.id;
    for(let i=0;i<5;i++){
      const bad=await post(s.base,'/api/identity/recovery/claim',
        {characterId:target,recoveryCode:'x'.repeat(43),requestId:id1});
      assert.equal(bad.status,401);
    }
    assert.equal((await post(s.base,'/api/identity/recovery/claim',
      {characterId:target,recoveryCode:'x'.repeat(43),requestId:id1})).status,401);
    await stop(s);s=null;
    s=await start(f.world);
    assert.equal((await post(s.base,'/api/identity/recovery/claim',
      {characterId:target,recoveryCode:'x'.repeat(43),requestId:id1},
      '',{'X-Forwarded-For':'192.0.2.55'})).status,401);
  }finally{if(s)await stop(s);fs.rmSync(dir,{recursive:true,force:true});}
});
test('HTTP: simulated failed durable token save rolls back; valid proof still works',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-recovery-failed-save-'));let s;
  try{
    const f=fixture(dir);s=await start(f.world,true);
    const before=economy(JSON.parse(fs.readFileSync(f.world,'utf8')),f.resident.id);
    const denied=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:f.kit.recoveryCode,requestId:id1});
    assert.equal(denied.status,400);
    assert.equal((await get(s.base,'/api/state',f.resident.token)).status,200);
    assert.deepEqual(economy(JSON.parse(fs.readFileSync(f.world,'utf8')),f.resident.id),before);
    const claim=await post(s.base,'/api/identity/recovery/claim',
      {characterId:f.resident.id,recoveryCode:f.kit.recoveryCode,requestId:id1});
    assert.equal(claim.status,200);
    assert.equal((await get(s.base,'/api/state',f.resident.token)).status,401);
    assert.deepEqual(economy(JSON.parse(fs.readFileSync(f.world,'utf8')),f.resident.id),before);
  }finally{if(s)await stop(s);fs.rmSync(dir,{recursive:true,force:true});}
});
