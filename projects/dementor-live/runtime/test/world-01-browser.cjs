// WORLD-01 browser acceptance: city > forest > real billboard > scooter > portal > city.
// Isolated temp-save server. No calls to Dementor Club, Supabase or production.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-world01-browser-'));
const port=Number(process.env.DEMENTOR_WORLD01_PORT||4194),base='http://127.0.0.1:'+port;
const wait=n=>new Promise(r=>setTimeout(r,n));
let server,browser;const errors=[],checks=[];
async function start(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let output='';server.stdout.on('data',d=>output+=d);server.stderr.on('data',d=>output+=d);
 for(let i=0;i<120;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}await wait(60);}
 throw Error('Cannot start local world: '+output.slice(-1200));
}
async function resident(name,w=390,h=844){
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(name+': '+e.message));
 await page.goto(base+'/');await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 return {context,page,id:await page.evaluate(()=>me.id),token:await page.evaluate(()=>sessionStorage.getItem('dementor-token'))};
}
async function relocate(p,x,y){
 const r=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},
   body:JSON.stringify({player:p.id,patch:{x,y}})});assert.equal(r.status,200);
 await p.page.waitForFunction(([a,b])=>me&&Math.hypot(me.x-a,me.y-b)<.2,[x,y],{timeout:5000});
}
async function command(p,type,target){
 const token=p.token;
 const r=await fetch(base+'/api/action',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
 body:JSON.stringify({type,target,requestId:'w01-browser-'+Math.random().toString(36).slice(2)})});
 return r.json();
}
async function tap(p,selector){const r=await p.page.locator(selector).boundingBox();assert.ok(r,'Missing '+selector);await p.page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);}
(async()=>{try{
 await start();browser=await chromium.launch({headless:true});
 const a=await resident('WORLD01 Alice'),b=await resident('WORLD01 Bob',375,667);
 assert.equal(await a.page.locator('[data-move]').count(),0,'D-pad still exists');
 checks.push('phone uses left analog stick, no four-arrow D-pad');
 for(const p of [a,b])await relocate(p,30,2);
 await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>state?.scene==='forest'&&state.world01.region.width===64);
 assert.equal(await a.page.evaluate(()=>state.world01.region.objects.filter(o=>o.type==='world01-billboard').length),3);
 checks.push('actual phone ACTION opens forest: 64×48 map and three billboards');
 await tap(b,'#world01ActionButton');
 await b.page.waitForFunction(()=>state?.scene==='forest');
 assert.equal(await a.page.evaluate(()=>state.players.filter(p=>p.online&&p.scene==='forest').length),2);
 checks.push('two independent mobile players see one shared forest');

 // Actual touch movement is sent to the server and the player moves in its forest region.
 const old=await a.page.evaluate(()=>({x:me.x,y:me.y}));
 const bounds=await a.page.locator('#world01MovePad').boundingBox();
 const x=bounds.x+bounds.width/2,y=bounds.y+bounds.height/2;
 const cdp=await a.context.newCDPSession(a.page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:11,x,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:11,x:x+20,y:y-26}]});
 await wait(650);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await a.page.waitForFunction(before=>Math.hypot(me.x-before.x,me.y-before.y)>.1,old,{timeout:5000});
 checks.push('real finger joystick changes shared authoritative forest coordinates');

 const snap=await a.page.evaluate(()=>({wallet:me.wallet,bag:{...me.bag},id:me.id}));
 await relocate(a,17,20);await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>document.querySelector('#world01Card').open);
 assert.match(await a.page.locator('#world01CardTitle').textContent(),/ДЕНЬГИ НА ВЕТЕР/);
 assert.match(await a.page.locator('#world01CardSource').textContent(),/DEMO_PUBLIC_STATIC/);
 const link=await a.page.locator('#world01CardLink').getAttribute('href');assert.equal(link,'https://dementor.club/courses/dengi-na-veter/');
 await a.page.locator('#world01CardClose').click();
 checks.push('real forest billboard opens read-only authenticated-scene public projection; link not fabricated');
 await relocate(a,34,42);await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>state.world01.transport==='scooter');
 checks.push('scooter toggles on in forest and persists via server snapshot');
 await a.page.reload();await a.page.waitForFunction(()=>state?.scene==='forest'&&state.world01.transport==='scooter');
 checks.push('forest and scooter survive browser reload without new character');
 await relocate(a,31,10);await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>state.world01.portalUnlocked===true);
 checks.push('portal discovered only by visiting it');
 await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>state?.scene==='city'&&state.world01.portalUnlocked);
 checks.push('portal returns player to city and preserves identity');
 await relocate(a,30,2);
 assert.equal((await command(a,'world01FastTravel','world01-city-gate')).region,'ideas-forest');
 await a.page.waitForFunction(()=>state?.scene==='forest'&&state.world01.portalUnlocked);
 await relocate(a,31,46);await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>state?.scene==='city');
 checks.push('fast city→forest and actual mobile forest exit back to city');
 const after=await a.page.evaluate(()=>({wallet:me.wallet,bag:{...me.bag},id:me.id}));
 assert.deepEqual(after,snap,'WORLD-01 travel changed player inventory, PAPER or identity');
 checks.push('no new PAPER, stock, inventory, or CharacterId created');
 const out=path.join(root,'reports','world-01');fs.mkdirSync(out,{recursive:true});
 await a.page.screenshot({path:path.join(out,'city-return-mobile.png')});
 await relocate(b,31,24);await b.page.screenshot({path:path.join(out,'forest-board-mobile.png')});
 assert.deepEqual(errors,[],'JS runtime errors');
 fs.writeFileSync(path.join(out,'world-01-browser-report.json'),JSON.stringify({checks,errors,testEnv:'headless Chromium, phone emulation; NOT physical iPhone Safari'},null,2));
 console.log('WORLD01 BROWSER PASS',JSON.stringify(checks));
}catch(e){console.error('WORLD01 BROWSER FAIL',e,errors);process.exitCode=1;}
finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),wait(1400)]);}
 fs.rmSync(tmp,{recursive:true,force:true});}})();
