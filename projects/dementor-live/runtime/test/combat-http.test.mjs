import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function getFreePort(){
 const s=net.createServer();await new Promise((resolve,reject)=>s.listen(0,'127.0.0.1',resolve).once('error',reject));
 const port=s.address().port;await new Promise(r=>s.close(r));return port;
}
test('isolated actual HTTP: two players, restart persistence, idempotent ammo + city economy', {timeout:25000},async()=>{
 const port=await getFreePort(),origin='http://127.0.0.1:'+port;
 const temp=await mkdtemp(path.join(os.tmpdir(),'dementor-combat-http-')),save=path.join(temp,'world.json');
 const runtime=path.resolve(import.meta.dirname,'..');
 let child=null,logs='';
 async function start(){
   child=spawn(process.execPath,['server.mjs','--test'],{cwd:runtime,
     env:{...process.env,DEMENTOR_STATE:save,DEMENTOR_PORT:String(port)},stdio:['ignore','pipe','pipe']});
   child.stdout.on('data',b=>{logs+=b.toString();});child.stderr.on('data',b=>{logs+=b.toString();});
   let ready=false;
   for(let i=0;i<100;i++){if(child.exitCode!==null)break;
     try{const r=await fetch(origin+'/api/health',{signal:AbortSignal.timeout(200)});
       if(r.ok){ready=true;break;}}catch{}
     await sleep(45);
   }
   if(!ready)throw Error('HTTP runtime failed to start: '+logs.slice(-1500));
 }
 async function stop(){
   if(!child)return;const p=child;child=null;
   p.kill('SIGTERM');await Promise.race([new Promise(r=>p.once('exit',r)),sleep(1400).then(()=>{try{p.kill('SIGKILL');}catch{}})]);
 }
 async function req(route,data,token){
   const res=await fetch(origin+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},
     ...(data?{body:JSON.stringify(data)}:{})});
   const o=await res.json();return {status:res.status,...o};
 }
 let n=0;const act=(token,type,more={})=>req('/api/combat/action',{type,requestId:'qa-'+(++n),...more},token);
 try{
   await start();
   for(const item of ['/combat','/combat.js','/combat.css']){
     const r=await fetch(origin+item);assert.equal(r.status,200,item);assert.ok((await r.text()).length>100);
   }
   const a=await req('/api/join',{name:'QA Alice'}),b=await req('/api/join',{name:'QA Bob'}),c=await req('/api/join',{name:'QA Charlie'});
   assert.equal(a.status,200);assert.equal(b.status,200);
   for(const p of [a,b,c]){const r=await fetch(origin+'/__test',{method:'POST',headers:{'x-test-key':'local-integration-tests','Content-Type':'application/json'},
     body:JSON.stringify({player:p.id,patch:{x:29,y:35}})});assert.equal(r.status,200);}
   const initial=await req('/api/state',null,a.token);
   assert.equal(initial.players.find(p=>p.id===a.id).wallet,0);
   const made=await act(a.token,'create');assert.equal(made.ok,true);assert.ok(made.sessionId);
   const state=await req('/api/combat/state',null,a.token);assert.equal(state.active,true);
   const weaponId=state.profile.weapon.id;assert.equal(state.profile.ammo,24);
   const lobby=await req('/api/combat/lobbies',null,b.token);assert.equal(lobby.lobbies.length,1);
   const joined=await act(b.token,'join',{sessionId:made.sessionId});assert.equal(joined.ok,true);
   const forbidden=await act(c.token,'join',{sessionId:made.sessionId});assert.equal(forbidden.ok,false);
   assert.match(forbidden.message,/full/i);
   assert.equal((await act(a.token,'start')).stage,1);
   const request={type:'fire',dx:1,dy:0,requestId:'unique-shot'};
   const first=await req('/api/combat/action',request,a.token);
   assert.equal(first.ok,true);assert.equal(first.hit,true);
   const duplicate=await req('/api/combat/action',request,a.token);
   assert.deepEqual(duplicate,first);
   const after=await req('/api/combat/state',null,a.token);
   assert.equal(after.profile.ammo,23);assert.equal(after.battle.stage,1);
   assert.equal((await req('/api/state',null,a.token)).players.find(p=>p.id===a.id).wallet,0);
   await stop();await start();
   const reloaded=await req('/api/combat/state',null,a.token);
   assert.equal(reloaded.status,200);assert.equal(reloaded.profile.weapon.id,weaponId);
   assert.equal(reloaded.profile.ammo,23);assert.equal(reloaded.battle.sessionId,made.sessionId);
   const repeatAfterRestart=await req('/api/combat/action',request,a.token);
   assert.deepEqual(repeatAfterRestart,first);
   assert.equal((await req('/api/combat/state',null,a.token)).profile.ammo,23);
   assert.equal((await act(a.token,'retreat')).retreated,true);
   assert.equal((await req('/api/combat/state',null,b.token)).active,false);
   assert.equal((await req('/api/combat/state',null,a.token)).profile.weapon.id,weaponId);
   // A fresh session has the same permanent weapon, no repeated ammo starter bonus.
   const again=await act(a.token,'create');assert.ok(again.sessionId!==made.sessionId);
   assert.equal((await req('/api/combat/state',null,a.token)).profile.ammo,23);
   assert.equal((await act(a.token,'retreat')).retreated,true);
 }finally{await stop();await rm(temp,{recursive:true,force:true});}
});
