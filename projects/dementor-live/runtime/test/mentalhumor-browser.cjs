// Real browser journey for the isolated MentalHumor museum world — mobile Chrome emulation.
// Sandbox-only node test server, disposable save, never the public game or Club DB.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const dir=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-mentalhumor-'));
const port=Number(process.env.MENTALHUMOR_BROWSER_PORT||4195),base='http://127.0.0.1:'+port;
const wait=ms=>new Promise(ok=>setTimeout(ok,ms));const checks=[],errors=[];
let server,browser;
async function boot(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:dir,env:{...process.env,DEMENTOR_STATE:path.join(temp,'test-save.json'),DEMENTOR_PORT:String(port)},stdio:'pipe'});
 let logs='';server.stderr.on('data',b=>logs+=b);server.stdout.on('data',b=>logs+=b);
 for(let i=0;i<150;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}await wait(60);}
 throw Error('Server failed to boot: '+logs.slice(-1500));
}
async function join(name,width=390,height=844){
 const ctx=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(name+': '+e.message));
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 return {ctx,page,id:await page.evaluate(()=>me.id),token:await page.evaluate(()=>sessionStorage.getItem('dementor-token'))};
}
async function relocate(p,x,y){
 const r=await fetch(base+'/__test',{method:'POST',headers:{'x-test-key':'local-integration-tests','Content-Type':'application/json'},body:JSON.stringify({player:p.id,patch:{x,y}})});
 assert.equal(r.status,200,'test server teleport must be accepted');
 await p.page.waitForFunction(([x,y])=>me&&Math.hypot(me.x-x,me.y-y)<.2,[x,y],{timeout:7000});
}
async function tap(p,id){
 const rect=await p.page.locator(id).boundingBox();assert.ok(rect&&rect.width>30&&rect.height>25,'Mobile target missing '+id);
 await p.page.touchscreen.tap(rect.x+rect.width/2,rect.y+rect.height/2);
}
async function assertRoom(p,scene){
 await p.page.waitForFunction(scene=>state&&state.scene===scene,scene,{timeout:7000});
 const e=await p.page.evaluate(()=>({scene:state.scene,region:state.mentalhumor?.id,players:state.players.filter(p=>p.online).length,me:me.id}));
 assert.equal(e.scene,scene);
}
(async()=>{try{
 await boot();browser=await chromium.launch({headless:true});
 const a=await join('MH A'),b=await join('MH B',375,667);
 const original=await a.page.evaluate(()=>({id:me.id,wallet:me.wallet,bag:structuredClone(me.bag)}));
 assert.equal(await a.page.locator('#mentalRouteButton').count(),1);
 await relocate(a,17,2);await tap(a,'#world01ActionButton');await assertRoom(a,'mentalhumor');
 assert.equal(await a.page.evaluate(()=>state.mentalhumor.objects.filter(o=>o.type==='mental-display').length),4);
 checks.push('touch action enters separate MentalHumor park from city; central museum and 4 research points exist');
 await relocate(b,17,2);await tap(b,'#world01ActionButton');await assertRoom(b,'mentalhumor');
 assert.equal(await a.page.evaluate(()=>state.players.filter(p=>p.online&&p.scene==='mentalhumor').length),2);
 checks.push('two mobile residents in shared park');
 const stick=await a.page.locator('#world01MovePad').boundingBox();
 const x=stick.x+stick.width/2,y=stick.y+stick.height/2;
 const before=await a.page.evaluate(()=>({x:me.x,y:me.y}));
 const cdp=await a.ctx.newCDPSession(a.page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:42,x,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:42,x:x+24,y:y-23}]});await wait(700);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await a.page.waitForFunction(p=>Math.hypot(me.x-p.x,me.y-p.y)>.15,before,{timeout:5000});
 checks.push('museum world left touch stick moves player using authoritative server input');
 const artifacts=path.join(dir,'reports','mentalhumor');fs.mkdirSync(artifacts,{recursive:true});
 await relocate(a,39,33);await a.page.screenshot({path:path.join(artifacts,'museum-exterior-mobile.png')});
 await a.page.setViewportSize({width:844,height:390});
 await a.page.screenshot({path:path.join(artifacts,'museum-exterior-landscape.png')});
 await a.page.setViewportSize({width:390,height:844});
 await relocate(a,60,40);await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>document.querySelector('#world01Card').open);
 assert.match(await a.page.locator('#world01CardSource').textContent(),/RESEARCH_DEMO_NOT_PARTNERED/);
 assert.equal(await a.page.locator('#world01CardLink').isVisible(),false);
 await a.page.locator('#world01CardClose').click();
 checks.push('research stand opens clearly demo-only card without unlicensed audio or fictional affiliation');
 await relocate(a,39,29.5);await tap(a,'#world01ActionButton');await assertRoom(a,'mentalhumor-hall');
 await a.page.screenshot({path:path.join(artifacts,'museum-gallery-mobile.png')});
 checks.push('touch enters independent indoor museum gallery');
 await relocate(a,10,5);await tap(a,'#world01ActionButton');
 await a.page.waitForFunction(()=>document.querySelector('#world01Card').open);
 assert.equal(await a.page.locator('#world01CardLink').getAttribute('href'),'https://eestihuumor.ee/');
 await a.page.locator('#world01CardClose').click();
 checks.push('official museum page linked in read-only information card');
 await a.page.reload();await assertRoom(a,'mentalhumor-hall');
 assert.equal(await a.page.evaluate(()=>me.id),original.id);
 checks.push('scene and identity persist after reload');
 await relocate(a,10,15);await tap(a,'#world01ActionButton');await assertRoom(a,'mentalhumor');
 await relocate(a,14,50);await tap(a,'#world01ActionButton');await assertRoom(a,'forest');
 await relocate(a,37,28);await tap(a,'#world01ActionButton');await assertRoom(a,'mentalhumor');
 await relocate(a,39,57);await tap(a,'#world01ActionButton');await assertRoom(a,'city');
 checks.push('hall to park to forest to museum park to city fully round-trips');
 const final=await a.page.evaluate(()=>({id:me.id,wallet:me.wallet,bag:structuredClone(me.bag)}));
 assert.deepEqual(final,original,'museum visit must not mint or lose wallet and inventory');
 assert.deepEqual(errors,[],'Browser JavaScript errors');
 checks.push('same player/PAPER/stock and no JS page errors');
 fs.writeFileSync(path.join(artifacts,'report.json'),JSON.stringify({checks,errors,environment:'chromium touch emulation / no physical iOS Safari'},null,2));
 console.log('MENTALHUMOR BROWSER PASS '+JSON.stringify(checks));
}catch(e){console.error('MENTALHUMOR BROWSER FAIL '+String(e));console.error(errors);process.exitCode=1;
 const artifacts=path.join(dir,'reports','mentalhumor');fs.mkdirSync(artifacts,{recursive:true});
 fs.writeFileSync(path.join(artifacts,'report.json'),JSON.stringify({checks,errors,error:String(e)},null,2));
}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),wait(1500)]);}fs.rmSync(temp,{recursive:true,force:true});}})();
