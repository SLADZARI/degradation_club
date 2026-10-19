// Combat feel regression. Verifies gameplay effects, not HTTP 200 or ammo spend alone.
// Real Chromium input + rendered tracer + HP reduction + FPS sample, disposable local world.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const baseDir=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dl-combat-feel-'));
const port=Number(process.env.DEMENTOR_COMBAT_FEEL_PORT||4197),base='http://127.0.0.1:'+port;
const report={name:'Combat feel / interactive render QA',passed:[],metrics:{},errors:[],context:'Linux headless Chromium, mobile emulation; not real iOS Safari'};
const sleep=n=>new Promise(r=>setTimeout(r,n));
let child,browser;
async function start(){
 child=spawn(process.execPath,['server.mjs','--test'],{cwd:baseDir,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
 for(let i=0;i<120;i++){try{if((await fetch(base+'/api/health',{signal:AbortSignal.timeout(200)})).ok)return;}catch{}await sleep(60);}
 throw Error('Server failed: '+logs.slice(-800));
}
async function enter(name,mobile=false){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1366,height:850},
   isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(name+': '+e.message));
 await page.goto(base+'/');await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 const id=await page.evaluate(()=>me.id),token=await page.evaluate(()=>sessionStorage.getItem('dementor-token'));
 const p=await fetch(base+'/__test',{method:'POST',headers:{'x-test-key':'local-integration-tests','Content-Type':'application/json'},
   body:JSON.stringify({player:id,patch:{x:29,y:35,bag:{food:5}}})});
 assert.equal(p.status,200);
 await page.waitForFunction(()=>me&&Math.hypot(me.x-29,me.y-35)<.05&&context?.type==='combat');
 await page.locator('#actionButton').click();await page.waitForURL('**/combat');
 await page.waitForFunction(()=>document.querySelector('#lobby')&&!document.querySelector('#lobby').hidden);
 return {context,page,id,token};
}
async function fight(a,b){
 await a.page.locator('#create').click();await a.page.waitForFunction(()=>battle?.status==='LOBBY');
 await b.page.waitForFunction(()=>document.querySelector('#lobbies button'));
 await b.page.locator('#lobbies button').first().click();
 await a.page.waitForFunction(()=>battle&&Object.keys(battle.members).length===2);
 await a.page.locator('#start').click();
 await Promise.all([a.page.waitForFunction(()=>battle?.status==='ACTIVE'),b.page.waitForFunction(()=>battle?.status==='ACTIVE')]);
 report.passed.push('2 players entered a closed PvE battle from the city');
}
async function targetGeometry(page){
 return page.evaluate(()=>{
   const e=battle.enemies.find(x=>x.alive),p=project(e.x,e.y),hero=project(self.x,self.y),
     r=canvas.getBoundingClientRect();
   if(!e)throw Error('No target to shoot');
   return {id:e.id,hp:e.hp,x:r.left+p.x,y:r.top+p.y,
      ux:p.x-hero.x,uy:p.y-hero.y,screen:{x:p.x,y:p.y}};
 });
}
async function waitForHit(page,initial){
 return page.waitForFunction(before=>__combatQa.hits>before,initial,{timeout:5000});
}
(async()=>{try{
 await start();browser=await chromium.launch({headless:true});
 const desktop=await enter('FEEL DESKTOP'),mobile=await enter('FEEL MOBILE',true);
 await fight(desktop,mobile);
 // UI truth: reticle must actually be drawn and the live canvas must have an area.
 await desktop.page.waitForFunction(()=>__combatQa.reticleVisible&&__combatQa.fps>0);
 report.metrics.canvas=await mobile.page.evaluate(()=>({w:canvas.width,h:canvas.height,clientW:canvas.clientWidth,clientH:canvas.clientHeight}));
 assert.ok(report.metrics.canvas.clientH>=200,'Mobile canvas hidden by HUD');
 report.passed.push('live crosshair rendered; playable mobile canvas area');

 // Finger gesture from Chromium CDP (not a DOM dispatchEvent): right stick aims in SCREEN space and fires.
 const mobileTarget=await targetGeometry(mobile.page);
 const pad=await mobile.page.locator('#aimPad').boundingBox();
 const cx=pad.x+pad.width/2,cy=pad.y+pad.height/2;
 const n=Math.hypot(mobileTarget.ux,mobileTarget.uy)||1;
 const px=cx+mobileTarget.ux/n*32,py=cy+mobileTarget.uy/n*32;
 const cdp=await mobile.context.newCDPSession(mobile.page);
 const oldHp=mobileTarget.hp;
 const beforeMobile=await mobile.page.evaluate(()=>__combatQa.hits);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:cx,y:cy}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:px,y:py}]});
 await sleep(820);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await waitForHit(mobile.page,beforeMobile);
 report.metrics.mobile=await mobile.page.evaluate(()=>({fps:__combatQa.fps,shots:__combatQa.shots,hits:__combatQa.hits,
   traces:__combatQa.tracesRendered,reticle:__combatQa.reticleVisible,
   lastShot:__combatQa.lastShot,lastLatencyMs:Math.round(__combatQa.lastLatencyMs)}));
 assert.ok(report.metrics.mobile.traces>0,'No tracer pixels drawn');
 assert.ok(report.metrics.mobile.lastShot?.hit,'Mobile fired but no HP hit');
 assert.ok(report.metrics.mobile.lastShot.damage>0,'Mobile fired but registered zero damage');
 report.passed.push('CDP finger gesture: server damage + visible flying tracer + hit marker');
 const latestTarget=await mobile.page.evaluate(id=>battle.enemies.find(x=>x.id===id)?.hp??0,mobileTarget.id);
 assert.ok(latestTarget<oldHp,'Enemy HP did not decrease after mobile shot');
 report.metrics.mobile.enemyHpBefore=oldHp;report.metrics.mobile.enemyHpAfter=latestTarget;

 // Desktop physical mouse click must actually hit; shoot toward CURRENT enemy position.
 await desktop.page.bringToFront();await sleep(250);
 const desktopTarget=await targetGeometry(desktop.page);
 const beforeDesktop=await desktop.page.evaluate(()=>__combatQa.hits);
 await desktop.page.mouse.move(desktopTarget.x,desktopTarget.y);
 await desktop.page.mouse.down();await sleep(850);await desktop.page.mouse.up();
 report.metrics.desktopAfterFire=await desktop.page.evaluate(()=>({shots:__combatQa.shots,hits:__combatQa.hits,lastHitShot:__combatQa.lastHitShot,lastShot:__combatQa.lastShot,ammo:data?.profile?.ammo}));
 await waitForHit(desktop.page,beforeDesktop);
 report.metrics.desktop=await desktop.page.evaluate(()=>({fps:__combatQa.fps,shots:__combatQa.shots,hits:__combatQa.hits,
   traces:__combatQa.tracesRendered,lastLatencyMs:Math.round(__combatQa.lastLatencyMs),shot:__combatQa.lastHitShot}));
 assert.ok(report.metrics.desktop.shot?.damage>0,'Desktop attack spent ammo but no damage');
 report.passed.push('real mouse aim: enemy loses HP and hit tracer is painted');

 // Keep the game active for a meaningful rendering sample: no instant-only screenshot smoke.
 await desktop.page.bringToFront();const samples=[];
 for(let i=0;i<5;i++){await sleep(1050);samples.push(await desktop.page.evaluate(()=>__combatQa.fps));}
 report.metrics.desktop.fpsSamples=samples;
 const steady=samples.slice(1).sort((a,b)=>a-b);
 const median=steady[Math.floor(steady.length/2)];
 report.metrics.desktop.medianFps=median;
 assert.ok(median>=24,'Canvas median FPS below 24 during active play: '+samples.join(','));
 report.passed.push('five-second active 2D render median FPS >= 24, Linux CI headless');

 // Screenshot artifacts to make QA reviewable, rather than opaque PASS.
 const folder=path.join(baseDir,'reports','combat-feel');fs.mkdirSync(folder,{recursive:true});
 await mobile.page.screenshot({path:path.join(folder,'mobile-pve.png')});
 await desktop.page.screenshot({path:path.join(folder,'desktop-pve.png')});
 assert.deepEqual(report.errors,[],'Browser JavaScript errors observed');
 fs.writeFileSync(path.join(folder,'report.json'),JSON.stringify(report,null,2));
 console.log('COMBAT FEEL PASS '+JSON.stringify(report));
}catch(e){
 console.error('COMBAT FEEL FAIL '+String(e)+' '+JSON.stringify(report));
 process.exitCode=1;
 try{const folder=path.join(baseDir,'reports','combat-feel');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'report.json'),JSON.stringify({...report,failure:String(e)},null,2));}catch{}
}finally{
 if(browser)await browser.close();
 if(child&&child.exitCode===null){child.kill('SIGTERM');await Promise.race([new Promise(r=>child.once('exit',r)),sleep(1500)]);}
 fs.rmSync(tmp,{recursive:true,force:true});
}})();
