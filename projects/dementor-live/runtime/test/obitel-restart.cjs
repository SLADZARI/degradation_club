// P0: full disk/server restart with built municipal arch and saved ZEN answers.
// Disposable temp world only; never touches production saves.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'obitel-portal-restart-')),root=path.dirname(__dirname);
const port=Number(process.env.DEMENTOR_OBITEL_PERSIST_PORT||4293),base='http://127.0.0.1:'+port,file=path.join(tmp,'world.json');
const pause=ms=>new Promise(r=>setTimeout(r,ms));let server,controller;
async function start(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:file},stdio:'pipe'});
 let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
 for(let i=0;i<80;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}if(server.exitCode!==null)throw Error(logs);await pause(100);}
 throw Error('Server startup timeout '+logs);
}
async function stop(){
 controller?.abort();controller=null;
 if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}
}
async function req(url,data,token,test=false){
 const res=await fetch(base+url,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(test?{'x-test-key':'local-integration-tests'}:{})},...(data?{body:JSON.stringify(data)}:{})});
 const json=await res.json();assert.equal(res.status,200,JSON.stringify({url,json}));return json;
}
async function connect(token){
 controller=new AbortController();
 const res=await fetch(base+'/api/events?token='+encodeURIComponent(token),{signal:controller.signal});
 assert.equal(res.status,200);
}
(async()=>{try{
 await start();
 const {id,token}=await req('/api/join',{name:'P0 Obitel Persistence'});
 await connect(token);
 const before=await req('/api/state',null,token);
 await req('/__test',{player:id,patch:{x:138,y:72,bag:{wood:4,stone:3,food:0}}},null,true);
 const built=await req('/api/action',{type:'worldUse',target:'obitel-zen-entry',requestId:'portal-build-restart'},token);
 assert.equal(built.ok,true);
 const entered=await req('/api/action',{type:'worldUse',target:'obitel-zen-entry',requestId:'portal-enter-restart'},token);
 assert.equal(entered.ok,true);
 await req('/__test',{player:id,patch:{x:7,y:7}},null,true);
 const answered=await req('/api/action',{type:'obitelAnswer',target:'OB-C01',answer:'Сохраняем ответ после перезапуска',requestId:'obitel-answer-restart'},token);
 assert.equal(answered.ok,true);
 const requested=await req('/api/action',{type:'obitelContinue',target:'OB-C01',requestId:'obitel-pending-restart'},token);
 assert.equal(requested.ok,true);
 const current=await req('/api/state',null,token);
 assert.ok(current.worldTravel.obitelPortal.builtAt);
 assert.equal(current.scene,'obitel-zen');
 assert.equal(current.obitel.cards['OB-C01'].answerCount,1);
 assert.equal(current.treasury,before.treasury-30);
 await stop();
 const saved=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(saved.schema,'dementor-cities-v1');
 assert.equal(saved.origin.obitelPortal.consumed.wood,4);
 assert.equal(saved.origin.obitelPortal.consumed.stone,3);
 await start();
 const after=await req('/api/state',null,token);
 assert.ok(after.worldTravel.obitelPortal.builtAt);
 assert.equal(after.treasury,before.treasury-30);
 assert.equal(after.scene,'obitel-zen');
 assert.equal(after.obitel.cards['OB-C01'].answerCount,1);
 assert.ok(after.obitel.cards['OB-C01'].continuationRequestedAt);
 assert.equal(after.materials.wood.inStructures>=4,true);
 assert.equal(after.materials.stone.inStructures>=3,true);
 assert.equal(after.obitel.mountainUnlocked,false);
 console.log('OBITEL DURABLE PASS: portal funding, structure, character answers/pending, 1-way scene and material ledger survived server restart');
}catch(err){console.error(err);process.exitCode=1;}
finally{await stop();fs.rmSync(tmp,{recursive:true,force:true});}
})();
