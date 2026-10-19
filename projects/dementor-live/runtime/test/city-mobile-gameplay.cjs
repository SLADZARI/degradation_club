// Critical mobile city UX acceptance: actual touch stick, permanent action button, battle entry.
// Runs only against an isolated --test server with disposable save, never against production.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const sleep=n=>new Promise(ok=>setTimeout(ok,n));
const root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dl-city-mobile-'));
const port=Number(process.env.DEMENTOR_CITY_MOBILE_PORT||4217),base='http://127.0.0.1:'+port;
const report={checks:[],screens:[],notes:[],errors:[],device:'Chromium mobile emulation, not physical iOS Safari'};
let server,browser;
async function start(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,
 env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});
 let logs='';server.stdout.on('data',b=>logs+=b);server.stderr.on('data',b=>logs+=b);
 for(let i=0;i<120;i++){try{const r=await fetch(base+'/api/health',{signal:AbortSignal.timeout(250)});if(r.ok)return;}catch{}await sleep(50);}
 throw Error('No server: '+logs.slice(-600));
}
async function createPlayer(name,width=390,height=844){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(name+' '+e.message));
 await page.goto(base+'/');
 await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 return {context,page,id:await page.evaluate(()=>me.id),name};
}
async function patchPlayer(p,x,y){
 const r=await fetch(base+'/__test',{method:'POST',headers:{'x-test-key':'local-integration-tests','Content-Type':'application/json'},
 body:JSON.stringify({player:p.id,patch:{x,y}})});
 assert.equal(r.status,200,'test-only teleport failed');
 await p.page.waitForFunction(({x,y})=>me&&Math.hypot(me.x-x,me.y-y)<.2,{x,y},{timeout:6000});
}
function boxIntersect(a,b){
 const x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
 const y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));return x*y;
}
async function auditLayout(page,width,height){
 await page.setViewportSize({width,height});await sleep(350);
 const data=await page.evaluate(()=>{
  const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();
   return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
  return {viewport:{w:innerWidth,h:innerHeight},world:rect('world'),move:rect('cityMovePad'),
   action:rect('mobileActionButton'),combat:rect('mobileCombatButton'),eat:rect('mobileEatButton'),
   bag:rect('bagButton'),chat:rect('chatForm'),dpad:document.querySelectorAll('[data-move]').length,
   visible:{move:!!document.getElementById('cityMovePad').getClientRects().length,
     action:!!document.getElementById('mobileActionButton').getClientRects().length},
   scrollW:document.documentElement.scrollWidth};
 });
 assert.equal(data.dpad,0,'Arrow D-pad still exists');
 assert.ok(data.visible.move&&data.visible.action,'mobile controls are hidden');
 assert.ok(data.world.width>=width-1&&data.world.height>=height-1,'game canvas not full screen');
 assert.ok(data.move.width>=85&&data.move.height>=85,'left joystick too small');
 for(const name of ['move','action','combat','eat']){
  const b=data[name];assert.ok(b.left>=-1&&b.right<=width+1&&b.top>=-1&&b.bottom<=height+1,name+' outside viewport '+JSON.stringify(data));
 }
 for(const name of ['action','combat','eat']){
  const b=data[name];assert.ok(b.height>=31&&b.width>=85,name+' too small');
  assert.equal(boxIntersect(b,data.move),0,'right controls overlap movement joystick');
 }
 assert.ok(data.scrollW<=width+1,'horizontal overflow');
 report.screens.push(width+'x'+height);report.checks.push('analog-left + right-action layout '+width+'x'+height);
}
async function sendStick(page,dx=35,dy=0,hold=850){
 const rect=await page.locator('#cityMovePad').boundingBox();
 const cdp=await page.context().newCDPSession(page);
 const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:5,x,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:5,x:x+dx,y:y+dy}]});
 await sleep(hold);
 const val=await page.evaluate(()=>window.__cityMobileInput());
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 return val;
}
async function tap(page,selector){
 const r=await page.locator(selector).boundingBox();
 assert.ok(r,'button not visible '+selector);
 await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);
}
(async()=>{try{
 await start();browser=await chromium.launch({headless:true});
 const manifest=await fetch(base+'/manifest.webmanifest');assert.equal(manifest.status,200);
 const m=await manifest.json();assert.equal(m.display,'standalone');
 report.checks.push('PWA manifest display=standalone served on /');
 const a=await createPlayer('CITY MOBILE A');
 for(const [w,h] of [[390,844],[375,667],[844,390],[667,375]])await auditLayout(a.page,w,h);
 await a.page.setViewportSize({width:390,height:844});
 const startPos=await a.page.evaluate(()=>({x:me.x,y:me.y}));
 const move=await sendStick(a.page,39,0,900);
 assert.ok(move.movement&&move.movement[0]>.5,'left pad did not output analog direction');
 await a.page.waitForFunction(({x,y})=>Math.hypot(me.x-x,me.y-y)>.1,startPos,{timeout:3500});
 report.checks.push('real touchscreen joystick changes persistent city character coordinates');
 const folder=path.join(root,'reports','city-mobile');fs.mkdirSync(folder,{recursive:true});
 await a.page.screenshot({path:path.join(folder,'city-portrait.png')});
 await a.page.setViewportSize({width:844,height:390});await a.page.screenshot({path:path.join(folder,'city-landscape.png')});
 await a.page.setViewportSize({width:390,height:844});
 await patchPlayer(a,29,35);
 await a.page.waitForFunction(()=>context?.type==='combat'&&window.__cityMobileInput().nearCombat,{timeout:5000});
 await tap(a.page,'#mobileActionButton');
 await a.page.waitForURL('**/combat',{timeout:5000});
 report.checks.push('permanently visible ACTION button actually enters combat from mobile city');
 const b=await createPlayer('CITY MOBILE B',375,667);
 await patchPlayer(b,29,35);
 await tap(b.page,'#mobileCombatButton');
 await b.page.waitForURL('**/combat',{timeout:5000});
 report.checks.push('right-side COMBAT button opens combat gate on second phone');
 assert.deepEqual(report.errors,[],'uncaught browser script errors');
 fs.writeFileSync(path.join(folder,'report.json'),JSON.stringify(report,null,2));
 console.log('CITY MOBILE PASS '+JSON.stringify(report));
}catch(e){console.error('CITY MOBILE FAIL '+String(e)+' '+JSON.stringify(report));process.exitCode=1;
 const folder=path.join(root,'reports','city-mobile');fs.mkdirSync(folder,{recursive:true});
 fs.writeFileSync(path.join(folder,'report.json'),JSON.stringify({...report,error:String(e)},null,2));
}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),sleep(1400)]);}
fs.rmSync(tmp,{recursive:true,force:true});}})();
