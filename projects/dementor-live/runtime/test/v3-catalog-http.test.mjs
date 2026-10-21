import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const runtime=fileURLToPath(new URL('../',import.meta.url));
const wait=ms=>new Promise(done=>setTimeout(done,ms));
async function freePort(){
 return new Promise((resolve,reject)=>{
  const tcp=createServer();
  tcp.once('error',reject);
  tcp.listen(0,'127.0.0.1',()=>{
   const {port}=tcp.address();
   tcp.close(error=>error?reject(error):resolve(port));
  });
 });
}
test('actual local runtime exposes only approved new-v3 catalog by GET/HEAD and retains protected v2', {timeout:30000}, async()=>{
 const tmp=await mkdtemp(join(tmpdir(),'dementor-catalog-http-'));
 const port=await freePort();
 const root='http://127.0.0.1:'+port;
 const proc=spawn(process.execPath,['server.mjs','--test'],{
  cwd:runtime,
  env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:join(tmp,'world.json'),DEMENTOR_QA_LOG:'0'},
  stdio:['ignore','pipe','pipe']
 });
 let diagnostic='';
 for(const stream of [proc.stdout,proc.stderr])stream.on('data',chunk=>{diagnostic+=(String(chunk)).slice(-1000);diagnostic=diagnostic.slice(-3000)});
 try{
  let ready=false;
  for(let i=0;i<80;i++){
   if(proc.exitCode!==null)throw Error('Isolated server exited early '+proc.exitCode+' '+diagnostic);
   try{
    const res=await fetch(root+'/api/health',{signal:AbortSignal.timeout(500)});
    if(res.status===200&&((await res.json()).ok===true)){ready=true;break}
   }catch{}
   await wait(100);
  }
  assert.ok(ready,'Isolated game server did not start: '+diagnostic);
  const url=root+'/assets/paper-icons-new-v3/manifest-new-only.json';
  const catalog=await fetch(url);
  assert.equal(catalog.status,200,'catalog must not return 404');
  assert.match(catalog.headers.get('content-type')||'',/^application\/json/);
  assert.equal(catalog.headers.get('x-content-type-options'),'nosniff');
  const data=await catalog.json();
  assert.equal(data.items.length,42);
  assert.deepEqual(data.items.map(x=>x.number),Array.from({length:42},(_,i)=>'DL-ICON-'+String(i+21).padStart(3,'0')));
  const head=await fetch(url,{method:'HEAD'});
  assert.equal(head.status,200);
  assert.match(head.headers.get('content-type')||'',/^application\/json/);
  assert.equal((await head.text()).length,0);
  for(const bad of [
   '/assets/paper-icons-new-v3/manifest-secret.json',
   '/assets/paper-icons-new-v3/manifest-new-only.json.old',
   '/assets/paper-icons-new-v3/../../world.json'
  ]){
   const res=await fetch(root+bad);
   assert.notEqual(res.status,200,'nonallowlisted catalog must not be public: '+bad);
  }
  const v2=await fetch(root+'/assets/paper-icons/png_256/wood.png');
  assert.equal(v2.status,200,'v2 icon still available');
  assert.match(v2.headers.get('content-type')||'',/^image\/png/);
  const unauth=await fetch(root+'/api/state');
  assert.equal(unauth.status,401,'unauthed state is still private');
  console.log('PASS RC4 CATALOG HTTP: 42 new icons, GET+HEAD, 3 denied neighboring paths, protected v2 PNG, private state');
 }finally{
  proc.kill('SIGTERM');
  await Promise.race([new Promise(resolve=>proc.once('exit',resolve)),wait(1500)]);
  if(proc.exitCode===null)proc.kill('SIGKILL');
  await rm(tmp,{recursive:true,force:true});
 }
});
