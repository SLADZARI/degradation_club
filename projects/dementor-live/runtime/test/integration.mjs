// Real HTTP + two SSE clients. Run only with permission to bind loopback sockets.
// Focused cases may use the explicitly isolated --test fixture route; no such route exists on the normal server.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),dir=await mkdtemp(path.join(os.tmpdir(),'dementor-integration-'));
const port=Number(process.env.DEMENTOR_TEST_PORT||4178),base=`http://127.0.0.1:${port}`;
let child,streams=[];const log=[];let sequence=0;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function start(){child=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(dir,'world.json')},stdio:['ignore','pipe','pipe']});child.stdout.on('data',d=>log.push(String(d)));child.stderr.on('data',d=>log.push(String(d)));for(let i=0;i<60;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}if(child.exitCode!==null)throw Error(log.join(''));await pause(100);}throw Error('Server did not start: '+log.join(''));}
async function stop(){if(!child||child.exitCode!==null)return;child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
async function request(route,body,token){const r=await fetch(base+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(route==='/__test'?{'x-test-key':'local-integration-tests'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();return data;}
async function connect(p){const control=new AbortController();streams.push(control);const r=await fetch(base+'/api/events?token='+p.token,{signal:control.signal});assert.equal(r.status,200);const reader=r.body.getReader(),decoder=new TextDecoder();let text='';const seen=[];const first=(async()=>{while(true){let{value,done}=await reader.read();if(done)break;text+=decoder.decode(value,{stream:true});let split;while((split=text.indexOf('\n\n'))>=0){const frame=text.slice(0,split);text=text.slice(split+2);if(frame.startsWith('data: '))seen.push(JSON.parse(frame.slice(6)));}}})();first.catch(()=>{});for(let i=0;i<30&&!seen.length;i++)await pause(20);assert.ok(seen.length);return seen;}
const act=(p,type,target,extra={})=>request('/api/action',{type,target,requestId:'http-'+(++sequence),...extra},p.token);
const state=p=>request('/api/state',null,p.token);
async function place(p,x,y){await request('/__test',{player:p.id,patch:{x,y}});}
async function advance(ms){await request('/__test',{advanceMs:ms});}
let passed=0;
const report={createdAt:new Date().toISOString(),scope:'real HTTP and independent SSE connections; intensive cases use isolated server fixtures; not browser UI verification',pass:false};
try{
  await start();const a=await request('/api/join',{name:'Лист'}),b=await request('/api/join',{name:'Крафт'});const aEvents=await connect(a),bEvents=await connect(b);
  assert.equal((await state(a)).players.filter(p=>p.online).length,2);passed++;
  // A pre-upgrade persisted receipt remains exact in the save even when an HTTP
  // client retries its ID with a different action type.
  const oldReceipt={ok:true,message:'Склад принял 3 · +6 PAPER',reward:6};
  await request('/__test',{player:b.id,patch:{results:[{id:'legacy-i18n-replay',result:oldReceipt}]}});
  const walletLegacy=(await state(b)).players.find(p=>p.id===b.id).wallet;
  const legacyReplay=await request('/api/action',{type:'buy',target:'plot-1',requestId:'legacy-i18n-replay'},b.token);
  assert.equal(legacyReplay.code,'action.warehouse.deposit');
  assert.deepEqual(legacyReplay.params,{quantity:3,reward:6});
  assert.equal(legacyReplay.message,oldReceipt.message);
  assert.equal((await state(b)).players.find(p=>p.id===b.id).wallet,walletLegacy);
  const rawSaved=(await request('/__test',{})).state.players[b.id].results.find(r=>r.id==='legacy-i18n-replay');
  assert.deepEqual(rawSaved.result,oldReceipt,'legacy receipt is not modified on disk');
  passed++;
  const before=(await state(a)).players.find(p=>p.id===a.id);await request('/api/input',{dx:1,dy:0},a.token);await pause(180);await request('/api/input',{dx:0,dy:0},a.token);const after=(await state(a)).players.find(p=>p.id===a.id);assert.ok(after.x>before.x);await pause(150);assert.ok(bEvents.at(-1).players.find(p=>p.id===a.id).x>before.x);passed++;
  await place(a,9,7);assert.equal((await act(a,'tools','tools')).ok,true);await place(b,9,7);await act(b,'tools','tools');
  for(const kind of ['wood','stone']){
    let left=40;while(left){await place(a,9,7);await act(a,'tools','tools');await act(a,'equip',kind==='wood'?'axe':'pick');await place(a,kind==='wood'?14:12,kind==='wood'?6:21);const n=Math.min(left,kind==='wood'?12:6);
      for(let i=0;i<n;i++){assert.equal((await act(a,'mine',kind+'-1')).ok,true);await advance(551);}
      // Each full batch fills capacity; the final partial batch exhausts this node.
      assert.equal((await act(a,'mine',kind+'-1')).ok,false);
      await act(a,'cancel');await place(a,13,12);const id='deposit-'+(++sequence);const result=await request('/api/action',{type:'deliver',target:'project',requestId:id},a.token);assert.equal(result.ok,true);assert.equal(result.code,'action.project.deliver');assert.deepEqual(result.params,{quantity:n,reward:result.reward});const wallet=(await state(a)).players.find(p=>p.id===a.id).wallet;const duplicate=await request('/api/action',{type:'deliver',target:'project',requestId:id},a.token);assert.deepEqual(duplicate,result);assert.equal((await state(a)).players.find(p=>p.id===a.id).wallet,wallet);left-=n;
    }
  }passed++;
  for(const count of [2,4,2]){await place(a,18,15);for(let i=0;i<count;i++){assert.equal((await act(a,'build','build')).ok,true);await advance(1101);}}
  let snap=await state(a);assert.equal(snap.project.stage,3);assert.equal(snap.players.find(p=>p.id===a.id).wallet,280);assert.deepEqual(snap.project.stock,{wood:0,stone:0});passed++;
  await place(a,7,14);assert.equal((await act(a,'buy','plot-1')).ok,true);const own=(await state(a)).plots.find(p=>p.id==='plot-1').owner;assert.equal(own,a.id);passed++;
  await request('/__test',{player:b.id,patch:{spirit:true,hunger:0,health:0,x:8,y:11}});assert.equal((await act(b,'gather','food-1')).ok,true);assert.equal((await state(b)).players.find(p=>p.id===b.id).spirit,false);passed++;
  await request('/__test',{player:b.id,patch:{spirit:true,hunger:0,health:0,x:8,y:8}});await request('/__test',{player:a.id,patch:{x:8,y:8,bag:{wood:0,stone:0,food:1}}});assert.equal((await act(a,'give',b.id)).ok,true);assert.equal((await state(b)).players.find(p=>p.id===b.id).spirit,false);passed++;
  await act(a,'chat',null,{text:'Привет, сосед!'});await pause(150);assert.equal(bEvents.at(-1).chat.at(-1).text,'Привет, сосед!');passed++;
  for(const control of streams)control.abort();streams=[];await pause(50);await stop();await start();snap=await state(a);assert.equal(snap.project.stage,3);assert.equal(snap.plots.find(p=>p.id==='plot-1').owner,a.id);assert.equal(snap.players.find(p=>p.id===a.id).wallet,160);passed++;
  const c=await request('/api/join',{name:'Спор 1'}),d=await request('/api/join',{name:'Спор 2'});await connect(c);await connect(d);
  for(const p of [c,d])await request('/__test',{player:p.id,patch:{wallet:120,x:7,y:22}});
  const treasury=(await state(c)).treasury;const purchases=await Promise.all([act(c,'buy','plot-2'),act(d,'buy','plot-2')]);assert.equal(purchases.filter(x=>x.ok).length,1);assert.equal((await state(c)).treasury,treasury+120);assert.equal((await state(c)).players.find(p=>p.id===c.id).wallet+(await state(d)).players.find(p=>p.id===d.id).wallet,120);passed++;
  await request('/__test',{resources:[{id:'wood-3',stock:1}]});for(const p of [c,d])await request('/__test',{player:p.id,patch:{x:28,y:7,bag:{wood:0,stone:0,food:0},tools:{axe:1,pick:1},equipped:'axe'}});
  assert.ok((await Promise.all([act(c,'mine','wood-3'),act(d,'mine','wood-3')])).every(x=>x.ok));await advance(551);assert.equal((await state(c)).players.find(p=>p.id===c.id).bag.wood+(await state(d)).players.find(p=>p.id===d.id).bag.wood,1);passed++;
  await request('/__test',{player:c.id,patch:{x:12,y:24,bag:{wood:6,stone:0,food:0}}});
  assert.equal((await act(c,'warehouseSell','warehouse',{kind:'wood'})).reward,6);
  for(const p of [c,d])await place(p,3.2,8);
  const claims=await Promise.all([act(c,'courierAccept','board',{kind:'wood'}),act(d,'courierAccept','board',{kind:'wood'})]);
  assert.equal(claims.filter(r=>r.ok).length,1);const courier=claims[0].ok?c:d;
  await place(courier,12,24);assert.equal((await act(courier,'courierPickup','warehouse')).ok,true);
  assert.equal((await state(courier)).warehouse.stock.wood,0);
  await place(courier,9,3);const walletBefore=(await state(courier)).players.find(p=>p.id===courier.id).wallet;
  const delivery={type:'courierDeliver',target:'mayor',requestId:'network-delivery-once'};
  assert.equal((await request('/api/action',delivery,courier.token)).reward,2);assert.equal((await request('/api/action',delivery,courier.token)).reward,2);
  const cityState=await state(courier);assert.equal(cityState.warehouse.municipal.wood,6);assert.equal(cityState.players.find(p=>p.id===courier.id).wallet,walletBefore+2);passed++;
  report.pass=true;report.passed=passed;console.log(JSON.stringify(report));
}finally{for(const s of streams)s.abort();await stop();await rm(dir,{recursive:true,force:true});const fs=await import('node:fs/promises');await fs.mkdir(path.join(root,'reports'),{recursive:true});await fs.writeFile(path.join(root,'reports/integration.json'),JSON.stringify({...report,passed},null,2)+'\n');}
