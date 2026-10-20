import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {mkdtempSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {aggregateWorld} from '../organism-bridge.mjs';
import {CityNetwork} from '../city-network.mjs';
import {createWorld} from '../world-expansion-adapter.mjs';
const ROOT=dirname(fileURLToPath(new URL('../server.mjs',import.meta.url)));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function freePort(){return new Promise((resolve,reject)=>{const server=createServer();server.on('error',reject);server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});}
test('real CityNetwork observer preserves source and reports money',()=>{
 const network=new CityNetwork(createWorld()),a=network.origin.join('Первый'),b=network.origin.join('Второй');
 a.wallet=11;b.wallet=19;const current=JSON.stringify(network.serialize()),revision=network.origin.state.revision;
 const result=aggregateWorld(network,{version:'qa',testMode:true});
 assert.equal(result.money.playerWallets,30);assert.equal(result.population.players,2);assert.equal(result.money.cityTreasury,network.origin.state.treasury);
 assert.equal(result.money.trackedTotal,result.money.cityTreasury+30+result.money.shopTills);
 assert.equal(network.origin.state.revision,revision);assert.equal(JSON.stringify(network.serialize()),current);
 assert.ok(!JSON.stringify(result).includes(a.token));
});
test('two independent HTTP clients, restricted GET, unchanged live save',async()=>{
 const stateDir=mkdtempSync(join(tmpdir(),'organism-bridge-'));
 const statePath=join(stateDir,'world.json'),port=await freePort(),host='http://127.0.0.1:'+port;
 const child=spawn(process.execPath,['server.mjs','--test'],{cwd:ROOT,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:statePath,DEMENTOR_QA_LOG:'0'},stdio:['ignore','pipe','pipe']});
 let stderr='';child.stderr.on('data',v=>{stderr+=String(v).slice(0,1000)});
 try{
  let healthy=false;for(let i=0;i<75;i++){if(child.exitCode!==null)throw Error('server exited '+child.exitCode+' '+stderr);try{const r=await fetch(host+'/api/health');if(r.ok){healthy=true;break;}}catch{}await wait(100);}assert.equal(healthy,true,'test server must boot');
  const joinPlayer=async name=>{const r=await fetch(host+'/api/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});assert.equal(r.status,200);return r.json();};
  const client1=await joinPlayer('ТестПервый'),client2=await joinPlayer('ТестВторой');assert.notEqual(client1.token,client2.token);
  let denied=await fetch(host+'/api/organism/snapshot');assert.equal(denied.status,403);
  denied=await fetch(host+'/api/organism/snapshot',{headers:{Authorization:'Bearer '+client1.token}});assert.equal(denied.status,403);
  const before=readFileSync(statePath,'utf8');
  const r=await fetch(host+'/api/organism/snapshot',{headers:{'x-test-key':'local-integration-tests'}});assert.equal(r.status,200);const j=await r.json();
  assert.equal(j.schema,'dementor-organism-live-v1');assert.equal(j.population.players,2);assert.equal(j.source,'ISOLATED_RUNTIME');
  for(const secret of [client1.token,client2.token,client1.id,client2.id])assert.ok(!JSON.stringify(j).includes(secret));
  const after=readFileSync(statePath,'utf8');assert.equal(after,before,'GET must not mutate persisted save');
  const second=await (await fetch(host+'/api/organism/snapshot',{headers:{'x-test-key':'local-integration-tests'}})).json();assert.deepEqual(second.money,j.money);
 }finally{child.kill('SIGTERM');await wait(250);if(existsSync(stateDir))rmSync(stateDir,{recursive:true,force:true});}
});
