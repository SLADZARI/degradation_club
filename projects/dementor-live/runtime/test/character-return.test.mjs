import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer as socketServer} from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as sleep} from 'node:timers/promises';
import {Game,createWorld} from '../world.mjs';
import {createReturnTicket,verifyReturnTicket,claimReturnTicket,revokeReturnTicket,ReturnAttemptLimiter,RETURN_TTL_MS} from '../character-return.mjs';

const runtime=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
function freePort() {
  return new Promise((resolve,reject)=>{
    const srv=socketServer();srv.once('error',reject);
    srv.listen(0,'127.0.0.1',()=>{const port=srv.address().port;srv.close(()=>resolve(port));});
  });
}
async function launch(statePath,testMode=true,enabled='') {
  const port=await freePort(),base=`http://127.0.0.1:${port}`;
  const proc=spawn(process.execPath,['server.mjs',...(testMode?['--test']:[])],{
    cwd:runtime,env:{...process.env,DEMENTOR_STATE:statePath,DEMENTOR_PORT:String(port),
      DEMENTOR_HOST:'127.0.0.1',DEMENTOR_PUBLIC_URL:'',DEMENTOR_IDENTITY_TRANSFER_ENABLED:enabled},
    stdio:['ignore','pipe','pipe']
  });
  let exited=false,details='';
  proc.once('exit',()=>{exited=true;});
  proc.stderr.on('data',chunk=>{details+=String(chunk).slice(0,300);});
  for(let i=0;i<100;i++){
    if(exited)throw Error('isolated server exited early: '+details);
    try{const r=await fetch(base+'/api/health',{signal:AbortSignal.timeout(250)});
      if(r.ok)return {proc,base};
    }catch{}
    await sleep(40);
  }
  proc.kill('SIGTERM');
  throw Error('isolated server failed to become healthy: '+details);
}
async function shutdown(proc) {
  if(proc.exitCode!==null)return;
  const exited=new Promise(resolve=>proc.once('exit',resolve));
  proc.kill('SIGTERM');
  await Promise.race([exited,sleep(1200).then(()=>{throw Error('isolated test server did not stop');})]);
}
async function post(base,endpoint,payload,token='',origin=base) {
  const r=await fetch(base+endpoint,{method:'POST',headers:{'Content-Type':'application/json',
    'Origin':origin,...(token?{'Authorization':'Bearer '+token}:{})},
    body:JSON.stringify(payload),signal:AbortSignal.timeout(3000)});
  return {status:r.status,data:await r.json(),headers:r.headers};
}
async function self(base,token) {
  const r=await fetch(base+'/api/state',{headers:{Authorization:'Bearer '+token}});
  return {status:r.status,data:await r.json()};
}
function freeze(data,id) {
  const s=data.origin||data;
  const p=s.players[id];
  return {wallet:p.wallet,bag:JSON.stringify(p.bag),plots:JSON.stringify(s.plots),
    treasury:s.treasury,receipts:JSON.stringify(p.results),transactions:JSON.stringify(s.transactions),
    playerCount:Object.keys(s.players).length,allIds:Object.keys(s.players).sort()};
}

test('secret is 256 bits; only salted verifier saved, expires, one-use and no identity lookup by name',()=>{
  const p={id:'47b6cd48-21d5-46be-84e4-620831bc8ba7',token:'legacy-token'};
  const x=createReturnTicket(p,1000),y=createReturnTicket(p,1100);
  assert.equal(x.code.length,43);
  assert.notEqual(x.code,y.code);
  assert.equal(x.characterId,p.id);
  assert.equal(JSON.stringify(p).includes(y.code),false);
  assert.equal(verifyReturnTicket(p,x.code,1100),false);
  assert.equal(verifyReturnTicket(p,y.code,1100),true);
  assert.equal(verifyReturnTicket(p,y.code,1100+RETURN_TTL_MS),false);
  assert.equal(claimReturnTicket(p,'short',1110),null);
  assert.equal(p.token,'legacy-token');
  const t=claimReturnTicket(p,y.code,1110,'a'.repeat(32));
  assert.equal(t.id,p.id);
  assert.notEqual(t.token,'legacy-token');
  assert.equal(t.token.length,43);
  assert.equal(claimReturnTicket(p,y.code,1111,'a'.repeat(32)).token,t.token);
  assert.equal(claimReturnTicket(p,y.code,1111,'b'.repeat(32)),null);
  const z=createReturnTicket(p,1200);
  revokeReturnTicket(p);
  assert.equal(verifyReturnTicket(p,z.code,1201),false);
});
test('per-peer and per-character admission fails closed within sliding window',()=>{
  let now=10;const x=new ReturnAttemptLimiter(()=>now);
  for(let i=0;i<5;i++)assert.equal(x.admit('char:A',5),true);
  assert.equal(x.admit('char:A',5),false);
  assert.equal(x.admit('char:B',5),true);
  now+=600001;
  assert.equal(x.admit('char:A',5),true);
});

test('isolated HTTP: bearer proof, one-time transfer, unchanged PAPER and receipts, restart and negative cases',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-character-return-'));
  const statePath=path.join(dir,'world.json');
  let server;
  try{
    const g=new Game(createWorld());
    const old=g.join('90','unspecified'),other=g.join('90','unspecified');
    old.wallet=151;other.wallet=59;g.state.treasury-=210;
    old.bag.wood=4;g.state.plots[0].owner=old.id;
    old.results.push({id:'immutable-request-01',result:{ok:true,message:'receipt'}});
    const source={schema:'dementor-cities-v1',origin:g.state,cities:{}};
    fs.writeFileSync(statePath,JSON.stringify(source),{mode:0o600});
    const before=freeze(source,old.id);
    server=await launch(statePath);
    const {base}=server;
    const noBearer=await post(base,'/api/identity/transfer/create',{});
    assert.equal(noBearer.status,401);
    const denied=await post(base,'/api/identity/transfer/create',{},old.token,'https://evil.example');
    assert.equal(denied.status,403);
    const issue=await post(base,'/api/identity/transfer/create',{},old.token);
    assert.equal(issue.status,200);
    assert.equal(issue.data.characterId,old.id);
    assert.equal(issue.headers.get('cache-control'),'no-store');
    const stored=fs.readFileSync(statePath,'utf8');
    assert.equal(stored.includes(issue.data.code),false);
    assert.match(JSON.parse(stored).origin.players[old.id].characterReturn.digest,/^[a-f0-9]{64}$/);
    const snapshot=await self(base,old.token);
    assert.equal(snapshot.status,200);
    assert.equal(JSON.stringify(snapshot.data).includes(issue.data.code),false);
    assert.equal(JSON.stringify(snapshot.data).includes('characterReturn'),false);
    assert.equal(JSON.stringify(snapshot.data).includes('digest'),false);
    const claimByName=await post(base,'/api/identity/transfer/claim',{characterId:old.id,name:'90'});
    assert.equal(claimByName.status,401);
    const crossCharacter=await post(base,'/api/identity/transfer/claim',{characterId:other.id,code:issue.data.code});
    assert.equal(crossCharacter.status,401);
    const crossOrigin=await post(base,'/api/identity/transfer/claim',{characterId:old.id,code:issue.data.code},'', 'https://evil.example');
    assert.equal(crossOrigin.status,403);

    // Real SSE authenticated with old bearer must close after durable handoff.
    const controller=new AbortController();
    const sse=await fetch(base+'/api/events?token='+encodeURIComponent(old.token),{signal:controller.signal});
    assert.equal(sse.status,200);
    const sseReader=sse.body.getReader();
    await sseReader.read();
    const transfer=await post(base,'/api/identity/transfer/claim',{characterId:old.id,code:issue.data.code,requestId:'a'.repeat(32)});
    assert.equal(transfer.status,200);
    assert.equal(transfer.data.id,old.id);
    assert.notEqual(transfer.data.token,old.token);
    assert.equal((await self(base,old.token)).status,401);
    assert.equal((await self(base,transfer.data.token)).status,200);
    // SSE may have buffered snapshot frames; drain them until EOF rather than
    // incorrectly treating the first buffered chunk as proof the old bearer survived.
    const waitForClose=(async()=>{while(true){const frame=await sseReader.read();if(frame.done)return true;}})()
      .catch(()=>false);
    const streamClosed=await Promise.race([waitForClose,sleep(2000).then(()=>false)]);
    assert.equal(streamClosed,true,'prior SSE was not closed');
    controller.abort();
    const retried=await post(base,'/api/identity/transfer/claim',{characterId:old.id,code:issue.data.code,requestId:'a'.repeat(32)});
    assert.equal(retried.status,200);assert.equal(retried.data.token,transfer.data.token);
    assert.equal((await self(base,other.token)).status,200);
    const afterData=JSON.parse(fs.readFileSync(statePath,'utf8'));
    assert.deepEqual(freeze(afterData,old.id),before);
    assert.equal('characterReturn' in afterData.origin.players[old.id],false);
    assert.equal(afterData.origin.players[old.id].token,transfer.data.token);

    // Issue/revoke and concurrent redemption on the same immutable CharacterId.
    const ownIssue=await post(base,'/api/identity/transfer/create',{},transfer.data.token);
    assert.equal(ownIssue.status,200);
    const revoke=await post(base,'/api/identity/transfer/revoke',{},transfer.data.token);
    assert.equal(revoke.status,200);
    const raceIssue=await post(base,'/api/identity/transfer/create',{},transfer.data.token);
    assert.equal(raceIssue.status,200);
    const both=await Promise.all([0,1].map(i=>post(base,'/api/identity/transfer/claim',
      {characterId:old.id,code:raceIssue.data.code,requestId:(i?'e':'d').repeat(32)})));
    assert.equal(both.filter(x=>x.status===200).length,1);
    assert.ok([401,429].includes(both.find(x=>x.status!==200).status)); // replay or capped attempt
    const finalToken=both.find(x=>x.status===200).data.token;
    assert.equal((await self(base,finalToken)).status,200);
    assert.equal((await self(base,transfer.data.token)).status,401);
    await shutdown(server.proc);server=null;

    server=await launch(statePath);
    assert.equal((await self(server.base,finalToken)).status,200);
    assert.equal((await self(server.base,old.token)).status,401);
    assert.deepEqual(freeze(JSON.parse(fs.readFileSync(statePath,'utf8')),old.id),before);
  }finally{
    if(server)await shutdown(server.proc);
    fs.rmSync(dir,{recursive:true,force:true});
  }
});

test('default-off / insecure HTTP: non-test localhost cannot expose identity secret',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-character-return-disabled-'));
  let s;
  try{
    s=await launch(path.join(dir,'world.json'),false,'1');
    const r=await post(s.base,'/api/identity/transfer/claim',{characterId:'47b6cd48-21d5-46be-84e4-620831bc8ba7',code:'x'.repeat(43)});
    assert.equal(r.status,503);
  }finally{if(s)await shutdown(s.proc);fs.rmSync(dir,{recursive:true,force:true});}
});
