import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const probe=createServer();
await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(0,'127.0.0.1',resolve);});
const port=probe.address().port;
await new Promise(resolve=>probe.close(resolve));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-icons-v3-http-'));
const child=spawn(process.execPath,['server.mjs','--test'],{
  cwd:root,
  env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(temp,'world.json')},
  stdio:'ignore'
});
const baseUrl=`http://127.0.0.1:${port}`;
try{
  let ready=false;
  for(let i=0;i<60;i++){
    if(child.exitCode!==null)throw new Error(`server exited with ${child.exitCode}`);
    try{const response=await fetch(baseUrl+'/api/health',{signal:AbortSignal.timeout(500)});if(response.ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert.ok(ready,'isolated test server did not become ready');
  const manifestResponse=await fetch(baseUrl+'/assets/paper-icons-new-v3/manifest-new-only.json');
  assert.equal(manifestResponse.status,200,'manifest GET must be served');
  assert.match(manifestResponse.headers.get('content-type')||'',/application\\/json/);
  const manifest=await manifestResponse.json();
  assert.equal(manifest.items.length,42,'all 42 new-only icons must be cataloged');
  const head=await fetch(baseUrl+'/assets/paper-icons-new-v3/manifest-new-only.json',{method:'HEAD'});
  assert.equal(head.status,200,'manifest HEAD must be served');
  assert.equal(await head.text(),'','HEAD must have no response body');
  const unknown=await fetch(baseUrl+'/assets/paper-icons-new-v3/png_64/not-an-icon.png');
  assert.equal(unknown.status,404,'unknown icon names must remain denied');
  console.log('PASS: v3 manifest GET/HEAD, 42 entries, unknown icon denied');
}finally{
  child.kill('SIGTERM');
  await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('exit',resolve);setTimeout(resolve,2000).unref();});
  fs.rmSync(temp,{recursive:true,force:true});
}
