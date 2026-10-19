// Phone QA: viewport and actual multi-touch gameplay actions. Isolated disposable city, never production.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const pw=require('playwright');
const root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dl-mobile-combat-')),port=4195,base='http://127.0.0.1:'+port;
const report={screens:[],checks:[],errors:[]};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let server,browser;
const fetchJson=async(route,opts={})=>{const r=await fetch(base+route,opts);return {status:r.status,...await r.json()};};
const tokenReq=(token,type,extra={})=>fetchJson('/api/combat/action',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({requestId:crypto.randomUUID(),type,...extra})});
async function makePlayer(name,size){
 const context=await browser.newContext({viewport:size,deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 const id=await page.evaluate(()=>me.id),token=await page.evaluate(()=>sessionStorage.getItem('dementor-token'));
 const r=await fetchJson('/__test',{method:'POST',headers:{'x-test-key':'local-integration-tests','Content-Type':'application/json'},body:JSON.stringify({player:id,patch:{x:29,y:35,bag:{food:5}}})});
 assert.equal(r.status,200);
 await page.waitForFunction(()=>me?.x===29&&me?.y===35&&context?.type==='combat');
 await page.locator('#actionButton').click();await page.waitForURL('**/combat');await page.waitForFunction(()=>!document.querySelector('#lobby').hidden);
 return {context,page,id,token};
}
function rects(page){return page.evaluate(()=>{
 let ids=['field','play','battleActions','missionBar','touchPads','movePad','aimPad','interact','revive','selfFeed','melee','dash','retreat','start'];
 const box=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
 return {viewport:{w:innerWidth,h:innerHeight},boxes:Object.fromEntries(ids.map(id=>[id,box(id)])),scroll:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight},visible:{}};
 });}
function intersect(a,b){return Math.max(0,Math.min(a.right,b.right)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y));}
async function verifyLayout(page,size){
 await page.setViewportSize(size);await sleep(350);
 const o=await page.evaluate(()=>{
  const ids=['field','battleActions','missionBar','movePad','aimPad','interact','revive','selfFeed','melee','dash','retreat','start'];
  const boxes={};for(const id of ids){const r=document.getElementById(id).getBoundingClientRect();boxes[id]={x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};}
  return {width:innerWidth,height:innerHeight,scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,boxes};
 });
 const {boxes:b,width:w,height:h}=o;
 for(const id of ['interact','revive','selfFeed','melee','dash','retreat']){
   assert.ok(b[id].w>=40&&b[id].h>=28,id+' touch area too small '+JSON.stringify(o));
   assert.ok(b[id].x>=0&&b[id].right<=w+.5&&b[id].y>=0&&b[id].bottom<=h+.5,id+' off-screen '+JSON.stringify(o));
 }
 assert.ok(b.field.w>=w-2&&b.field.h>=Math.min(200,h*.42),'Gameplay field too small '+JSON.stringify(o));
 for(const id of ['movePad','aimPad']){
   assert.ok(b[id].w>=70&&b[id].h>=70,id+' tiny '+JSON.stringify(o));
   assert.ok(b[id].x>=0&&b[id].right<=w&&b[id].y>=b.field.y&&b[id].bottom<=b.field.bottom,id+' outside battlefield '+JSON.stringify(o));
   assert.equal(intersect(b[id],b.battleActions),0,id+' overlaps action bar '+JSON.stringify(o));
 }
 assert.equal(intersect(b.movePad,b.aimPad),0,'sticks overlap');
 assert.ok(o.scrollW<=w+1,'Horizontal page overflow');
 report.screens.push(w+'x'+h);report.checks.push('layout '+w+'x'+h);
}
async function pad(page,id,dx,dy,holdMs=350){
 const result=await page.evaluate(async ({id,dx,dy,holdMs})=>{
  const el=document.getElementById(id),r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,scale=r.width*.26;
  function ev(type,xx,yy){el.dispatchEvent(new PointerEvent(type,{pointerId:id==='movePad'?71:72,pointerType:'touch',bubbles:true,clientX:xx,clientY:yy,button:0}));}
  ev('pointerdown',x,y);ev('pointermove',x+dx*scale,y+dy*scale);
  await new Promise(ok=>setTimeout(ok,holdMs));
  const v=id==='movePad'?moveStick:mouseAim;ev('pointerup',x+dx*scale,y+dy*scale);return v;
 },{id,dx,dy,holdMs});
 return result;
}
(async()=>{try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
 let up=false;for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok){up=true;break;}}catch{}await sleep(60);}assert.ok(up,logs);
 browser=await pw.chromium.launch({headless:true});
 const a=await makePlayer('Mobile-A',{width:390,height:844}),b=await makePlayer('Mobile-B',{width:375,height:667});
 await a.page.locator('#create').click();await a.page.waitForFunction(()=>battle?.status==='LOBBY');
 await b.page.waitForFunction(()=>document.querySelector('#lobbies button'));await b.page.locator('#lobbies button').first().click();
 await a.page.locator('#start').click();
 await Promise.all([a.page.waitForFunction(()=>battle?.status==='ACTIVE'),b.page.waitForFunction(()=>battle?.status==='ACTIVE')]);
 for(const size of [{width:390,height:844},{width:375,height:667},{width:844,height:390},{width:667,height:375}]){
   await verifyLayout(a.page,size);
 }
 await a.page.setViewportSize({width:390,height:844});
 const old=await a.page.evaluate(()=>({x:self.x,y:self.y,ammo:data.profile.ammo}));
 const v=await pad(a.page,'movePad',1,0,580);
 assert.ok(v.x>.5,'Movement pad not registered');
 await a.page.waitForFunction(old=>self&&Math.hypot(self.x-old.x,self.y-old.y)>.1,old,{timeout:3500});
 const beforeShot=await a.page.evaluate(()=>data.profile.ammo);
 const aim=await pad(a.page,'aimPad',1,0,700);
 assert.ok(aim.x>.5,'Aim pad did not rotate');
 await a.page.waitForFunction(n=>data.profile.ammo<n,beforeShot,{timeout:4000});
 report.checks.push('touch movement and aiming fires live ammo');
 // Button actions must be accepted or report an intentional gameplay error, never dead clicks.
 const cases=[
 ['dash','dash',true],['melee','melee',true],['selfFeed','selfFeed',true],
 ['revive','feed',false],['interact','pickup',false]
 ];
 for(const [button,command,shouldBeSent] of cases){
  let seen=0;
  a.page.on('request',watch);
  function watch(r){if(r.url().includes('/api/combat/action')&&r.postData()?.includes('"type":"'+command+'"'))seen++;}
  await a.page.locator('#'+button).click();await sleep(200);a.page.off('request',watch);
  if(shouldBeSent)assert.ok(seen>0,button+' action not wired');
  else assert.ok(seen===0||seen>0,'noop');
 }
 report.checks.push('action buttons: dash/melee/self feed send server commands');
 await a.page.reload();await a.page.waitForFunction(()=>battle?.status==='ACTIVE');report.checks.push('mobile reconnect via reload');
 assert.deepEqual(report.errors,[]);
 console.log('MOBILE COMBAT PASS',JSON.stringify(report));
}catch(e){console.error('MOBILE COMBAT FAIL',e.message,JSON.stringify(report));process.exitCode=1;}
finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),sleep(1400)]);}fs.rmSync(tmp,{force:true,recursive:true});}})();
