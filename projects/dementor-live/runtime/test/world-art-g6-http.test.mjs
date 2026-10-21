import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function freePort(){
 const server=net.createServer();
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const port=server.address().port;
 await new Promise(resolve=>server.close(resolve));
 return port;
}
async function withIsolatedGame(allowArt,callback){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-g6-'));
 const port=await freePort();
 const child=spawn(process.execPath,['server.mjs','--test'],{
  cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(dir,'world.json'),DEMENTOR_ART_G6:allowArt?'1':'0'},stdio:'ignore'
 });
 const base='http://127.0.0.1:'+port;
 try{
  let good=false;
  for(let tries=0;tries<60;tries++){
   if(child.exitCode!==null)throw Error('Game server terminated before startup');
   try{const r=await fetch(base+'/api/health');if(r.ok){good=true;break;}}catch{}
   await delay(100);
  }
  assert.ok(good,'Disposable test server did not start');
  await callback(base,dir);
 }finally{
  child.kill('SIGTERM');
  await Promise.race([new Promise(resolve=>child.once('exit',resolve)),delay(1200)]);
  if(child.exitCode===null)child.kill('SIGKILL');
  fs.rmSync(dir,{recursive:true,force:true});
 }
}
test('G6 test HTTP safely provides only manifest-listed SVGs, not arbitrary files',async()=>{
 await withIsolatedGame(true,async base=>{
  const ok=await fetch(base+'/__art-g6/city-tool-shop.svg');
  assert.equal(ok.status,200);
  assert.match(ok.headers.get('content-type')||'',/image\/svg\+xml/);
  assert.match(await ok.text(),/data-asset-id="city-tool-shop"/);
  assert.equal((await fetch(base+'/__art-g6/city-unknown.svg')).status,404);
  assert.equal((await fetch(base+'/__art-g6/..%2Fserver.mjs')).status,404);
  const script=await fetch(base+'/world-art-g6.js');assert.equal(script.status,200);
  assert.match(await script.text(),/DLWorldArtG6/);
  const page=await fetch(base+'/?artG6=compare');
  assert.equal(page.status,200);
  assert.ok((await page.text()).includes('<script src="/world-art-g6.js" defer></script>'));
 });
});
test('G6 is unavailable without explicit QA environment, even with --test',async()=>{
 await withIsolatedGame(false,async base=>{
  assert.equal((await fetch(base+'/__art-g6/city-tool-shop.svg')).status,404);
  assert.equal((await fetch(base+'/world-art-g6.js')).status,404);
  const r=await fetch(base+'/?artG6=replace');assert.equal(r.status,200);
  assert.equal((await r.text()).includes('<script src="/world-art-g6.js" defer></script>'),false);
 });
});
