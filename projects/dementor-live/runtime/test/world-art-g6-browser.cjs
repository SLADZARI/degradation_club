/* G6 screenshots on two real browser contexts, with disposable world ONLY.
 * Requires Playwright Chromium on CI or operator machine; never uses live saves. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),
 path=require('node:path'),net=require('node:net'),{spawn}=require('node:child_process');
const pw=require('playwright');
const root=path.resolve(__dirname,'..');
const shots=path.resolve(process.env.ART_G6_SCREENSHOT_DIR||path.join(os.tmpdir(),'dementor-g6-art-screenshots'));
const sleep=t=>new Promise(resolve=>setTimeout(resolve,t));
async function port(){
 const server=net.createServer();
 await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
 const p=server.address().port;await new Promise(r=>server.close(r));return p;
}
async function main(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-g6-browser-'));
 fs.mkdirSync(shots,{recursive:true});
 let child,browser;const contexts=[],errors=[];
 try{
  const p=await port(),url='http://127.0.0.1:'+p;
  child=spawn(process.execPath,['server.mjs','--test'],{
   cwd:root,env:{...process.env,DEMENTOR_PORT:String(p),
     DEMENTOR_STATE:path.join(dir,'world.json'),DEMENTOR_ART_G6:'1'},stdio:['ignore','pipe','pipe']});
  let logs='';child.stdout.on('data',d=>logs+=String(d));child.stderr.on('data',d=>logs+=String(d));
  let ready=false;
  for(let i=0;i<100;i++){
   if(child.exitCode!==null)throw Error('Disposable game exited: '+logs.slice(-2000));
   try{if((await fetch(url+'/api/health')).ok){ready=true;break;}}catch{}
   await sleep(100);
  }
  assert.ok(ready,'G6 browser test server failed to start: '+logs.slice(-2000));
  browser=await pw.chromium.launch({headless:true,args:['--no-sandbox']});
  const people=[];
  for(const {name,mode,mobile} of [
   {name:'G6 Alpha',mode:'compare',mobile:false},
   {name:'G6 Beta',mode:'replace',mobile:true}
  ]){
   const context=await browser.newContext({
    viewport:mobile?{width:390,height:844}:{width:1440,height:900},
    deviceScaleFactor:mobile?2:1,hasTouch:mobile,isMobile:mobile
   });
   contexts.push(context);
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(name+': '+e.message));
   await page.goto(url+'/?artG6='+mode,{waitUntil:'domcontentloaded'});
   await page.getByLabel('Как тебя зовут?').fill(name);
   await page.getByRole('button',{name:'Войти в мир'}).click();
   await page.waitForFunction(()=>typeof me!=='undefined'&&!!me&&connected&&window.DLWorldArtG6?.enabled,{timeout:20000});
   people.push({name,mode,mobile,page,id:await page.evaluate(()=>me.id)});
  }
  assert.notEqual(people[0].id,people[1].id,'two independent character identities are required');
  const results=[];
  for(const person of people){
   const {page,name,mode,mobile}=person;
   await page.waitForFunction(()=>window.DLWorldArtG6?.debugHealth().loaded>0,null,{timeout:20000});
   await page.waitForFunction(ids=>ids.every(id=>state.players.some(p=>p.id===id)),
     people.map(p=>p.id),{timeout:20000});
   const before=await page.evaluate(()=>({
    mode:window.DLWorldArtG6.mode,
    health:window.DLWorldArtG6.debugHealth(),
    peers:state.players.map(p=>p.id),
    scene:state.scene
   }));
   assert.equal(before.mode,mode);
   assert.ok(before.peers.includes(people[0].id)&&before.peers.includes(people[1].id));
   assert.equal(before.health.failed,0,'source-art requests must not fail');
   assert.ok(before.health.loaded>0,'must render an actual SVG, not empty panel');
   for(const zoom of [0.65,1,2]){
    await page.evaluate(z=>{view.zoom=z;resize();},zoom);
    await page.waitForTimeout(140);
    const suffix=mobile?'mobile-dpr2':'desktop-dpr1';
    await page.screenshot({path:path.join(shots,'g6-'+mode+'-'+suffix+'-zoom'+zoom+'.png')});
   }
   results.push({name,mode,scene:before.scene,peers:before.peers.length,loaded:before.health.loaded,failed:before.health.failed});
  }
  assert.deepEqual(errors,[],'no client-side exceptions');
  const report={status:'AUTOMATED_BROWSER_PASS_NOT_ART_APPROVAL',exactSha:process.env.GITHUB_SHA||'local',
   clients:results,shots:fs.readdirSync(shots).filter(n=>n.endsWith('.png')),
   caveats:['screenshots require human visual/CU/door validation','mobile viewport is not physical iPhone Safari',
    'test server uses disposable empty world; not production']};
  fs.writeFileSync(path.join(shots,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('G6 BROWSER PASS',JSON.stringify({clients:results,shots:report.shots.length}));
 }finally{
  for(const context of contexts)await context.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(child){
   child.kill('SIGTERM');await Promise.race([new Promise(resolve=>child.once('exit',resolve)),sleep(1300)]);
   if(child.exitCode===null)child.kill('SIGKILL');
  }
  fs.rmSync(dir,{recursive:true,force:true});
 }
}
main().catch(error=>{console.error('G6 BROWSER FAIL',error.stack||error);process.exitCode=1;});
