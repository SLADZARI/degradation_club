// Server restart regression: world.json is not ephemeral and materials survive process replacement.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-city-persist-')),root=path.dirname(__dirname);
const port=Number(process.env.DEMENTOR_PERSIST_PORT||4188),base='http://127.0.0.1:'+port,file=path.join(tmp,'world.json');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let server,streamController;
async function start(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:file},stdio:'pipe'});
 let log='';server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
 for(let i=0;i<80;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}if(server.exitCode!==null)throw Error(log);await sleep(100);}
 throw Error('Server did not start: '+log);
}
async function stop(){streamController?.abort();if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}}
async function request(url,payload,token,test=false){
 const res=await fetch(base+url,{method:payload?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(test?{'x-test-key':'local-integration-tests'}:{})},...(payload?{body:JSON.stringify(payload)}:{})});
 const body=await res.json();assert.equal(res.status,200,JSON.stringify({url,body,status:res.status}));return body;
}
(async()=>{try{
 await start();
 const join=await request('/api/join',{name:'Складовщик'}),token=join.token;
 streamController=new AbortController();
 const stream=await fetch(base+'/api/events?token='+encodeURIComponent(token),{signal:streamController.signal});
 assert.equal(stream.status,200);
 await request('/__test',{player:join.id,patch:{x:12,y:24,bag:{wood:3,stone:5,food:0}}},null,true);
 const sellStone=await request('/api/action',{type:'warehouseSell',target:'warehouse',kind:'stone',requestId:'persist-stone'},token);
 assert.equal(sellStone.ok,true);
 const sellWood=await request('/api/action',{type:'warehouseSell',target:'warehouse',kind:'wood',requestId:'persist-wood'},token);
 assert.equal(sellWood.ok,true);
 let data=JSON.parse(fs.readFileSync(file,'utf8'));assert.equal(data.schema,'dementor-cities-v1');
 assert.equal(data.origin.warehouse.stock.stone,5);assert.equal(data.origin.warehouse.stock.wood,3);
 await stop();streamController=null;
 await start();
 let after=await request('/api/state',null,token);
 assert.equal(after.warehouse.stock.stone,5);assert.equal(after.warehouse.stock.wood,3);
 assert.equal(after.materials.stone.onWarehouse,5);
 assert.equal(after.materials.wood.onWarehouse,3);
 assert.equal(after.players.find(p=>p.id===join.id).wallet,8);
 console.log('PERSISTENCE PASS: physical wood and stone, wallet and ledger survive actual server restart');
}catch(e){console.error(e);process.exitCode=1;}
finally{await stop();fs.rmSync(tmp,{force:true,recursive:true});}})();
