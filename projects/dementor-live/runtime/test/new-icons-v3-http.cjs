// HTTP regression for approved Paper Cut v2 + NEW ONLY v3 static serving.
// Uses disposable local state; never connects to production and never edits world.json.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
// Release guard: a successful HTTP-only source test is insufficient if G7
// disarms rollback before checking that the live catalog actually works.
const safePublisher=fs.readFileSync(path.join(root,'deploy/publish-preserve-world.sh'),'utf8');
const h0Index=safePublisher.indexOf('H0 protected verification:');
const receiptIndex=safePublisher.indexOf('approved_sha=%s');
const disarmIndex=safePublisher.indexOf('CUTOVER=0;STOPPED=0;trap - EXIT');
assert.ok(h0Index>0 && receiptIndex>h0Index && disarmIndex>receiptIndex,
 'H0 manifest HTTP verification must precede receipt and rollback disarm');
assert.match(safePublisher,/manifest-new-only\.json/,'safe release must verify live manifest HTTP');
assert.match(safePublisher,/catalog\.items\.length!==42/,'safe release must validate 42 catalog entries');
assert.match(safePublisher,/rolling back image and world/,'manifest failure must retain rollback behavior');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'public/assets/paper-icons-new-v3/manifest-new-only.json'),'utf8'));
assert.equal(catalog.items.length,42,'approved 21–62 catalog must have all 42 entries');

async function main(){
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-icon-v3-http-'));
 const port=41920+Math.floor(Math.random()*500);
 const base='http://127.0.0.1:'+port;
 let server,logs='';
 try{
  server=spawn(process.execPath,['server.mjs','--test'],{
   cwd:root,
   env:{...process.env,DEMENTOR_HOST:'127.0.0.1',DEMENTOR_PORT:String(port),
    DEMENTOR_STATE:path.join(temp,'world.json'),DEMENTOR_TEST_MODE:'1'},
   stdio:['ignore','pipe','pipe']
  });
  server.stdout.on('data',buf=>{logs+=String(buf);});
  server.stderr.on('data',buf=>{logs+=String(buf);});
  let ready=false;
  for(let i=0;i<120;i++){
   if(server.exitCode!==null)throw Error('server exited: '+logs.slice(-1200));
   try{const r=await fetch(base+'/api/health');if(r.ok){ready=true;break;}}catch{}
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert.ok(ready,'isolated HTTP server failed to start: '+logs.slice(-1200));
  async function check(relative,mime){
   const url=base+relative,r=await fetch(url);
   const buf=Buffer.from(await r.arrayBuffer());
   assert.equal(r.status,200,'HTTP '+r.status+' for '+relative+': '+buf.toString('utf8',0,120));
   assert.match(r.headers.get('content-type')||'',mime,relative+' wrong MIME');
   assert.ok(buf.length>20,'asset empty: '+relative);
   return buf;
  }
  const manifestUrl='/assets/paper-icons-new-v3/manifest-new-only.json';
  const manifestBody=await check(manifestUrl,/application\/json/);
  const head=await fetch(base+manifestUrl,{method:'HEAD'});
  assert.equal(head.status,200,'HEAD catalog returns success');
  assert.match(head.headers.get('content-type')||'',/application\/json/,'HEAD must retain JSON MIME');
  assert.equal((await head.arrayBuffer()).byteLength,0,'HEAD response must have no body');
  const wrongMethod=await fetch(base+manifestUrl,{method:'POST'});
  assert.equal(wrongMethod.status,405,'manifest must reject POST');
  assert.equal(wrongMethod.headers.get('allow'),'GET, HEAD','method whitelist must be discoverable');
  const manifest=JSON.parse(manifestBody.toString('utf8'));
  assert.equal(manifest.items.length,42);
  const images=new Set();
  for(const item of manifest.items){
   const stem=item.id.replaceAll(':','__');
   for(const size of [32,48,64,128,256]){
    const uri='/assets/paper-icons-new-v3/png_'+size+'/'+stem+'.png';
    assert.ok(!images.has(uri),'duplicate icon path: '+uri);images.add(uri);
    const bytes=await check(uri,/image\/png/);
    assert.equal(bytes[0],137,'bad PNG signature '+uri);
    assert.equal(bytes[1],80,'bad PNG signature '+uri);
   }
  }
  assert.equal(images.size,210);
  // Contract of older, locked 20 Paper Cut v2 must still be reachable.
  await check('/assets/paper-icons/png_64/wood.png',/image\/png/);
  await check('/assets/paper-icons/manifest.json',/application\/json/);
  await check('/new-icons-v3.js',/javascript/);
  for(const bad of [
   '/assets/paper-icons-new-v3/png_64/does_not_exist.png',
   '/assets/paper-icons-new-v3/png_4096/shovel.png',
   '/assets/paper-icons-new-v3/png_64/%2e%2e%2f%2e%2e%2fworld.json'
  ]){
   const r=await fetch(base+bad);
   assert.ok([400,403,404].includes(r.status),'unsafe/bogus icon URL allowed: '+bad+' '+r.status);
  }
  console.log('PASS: HTTP GET/HEAD 200, POST 405, manifest + 210 v3 PNGs + locked v2 legacy assets; 3 invalid URLs denied');
 }finally{
  if(server && server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>{server.once('exit',resolve);setTimeout(resolve,1500).unref();});}
  fs.rmSync(temp,{recursive:true,force:true});
 }
}
main().catch(e=>{console.error('FAIL NEW ONLY V3 HTTP CONTRACT:',e);process.exitCode=1;});
