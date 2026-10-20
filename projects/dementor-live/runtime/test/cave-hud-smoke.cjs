// UI acceptance for DL-CAVE-01 without public VM access or persistent saves.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.dirname(__dirname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-cave-hud-'));
const port=Number(process.env.DEMENTOR_CAVE_HUD_PORT||4239),base='http://127.0.0.1:'+port;
const sleep=n=>new Promise(r=>setTimeout(r,n));
let proc,browser;const errors=[];
async function openPlayer(width,height,name){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:width<760,hasTouch:width<760});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 await page.waitForSelector('#worldMapButton');
 await page.waitForFunction(()=>document.querySelectorAll('#quickbar .quick-slot').length===6);
 return {context,page};
}
(async()=>{try{
 proc=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});
 let logs='';proc.stderr.on('data',x=>logs+=x);proc.stdout.on('data',x=>logs+=x);
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}await sleep(90);}
 assert.equal(ready,true,'server failed '+logs);
 browser=await chromium.launch({channel:'chrome',headless:true});
 for(const [w,h,name] of [[390,844,'HUD PHONE'],[1440,900,'HUD DESKTOP']]){
  const {context,page}=await openPlayer(w,h,name);
  const layout=await page.evaluate(()=>{
   const $=id=>document.getElementById(id);
   const right=$('worldMapButton').getBoundingClientRect(),header=$('centerButton').closest('.top-right');
   return {placesInHeader:header?.contains($('centerButton')),residentsInHeader:header?.contains($('socialButton')),
    bagInHeader:header?.contains($('bagButton')),slots:document.querySelectorAll('#quickbar .quick-slot').length,
    duplicateBottom: getComputedStyle(document.querySelector('.inventory>.bag')).display,
    toolsBottom:getComputedStyle(document.querySelector('.inventory>.tools')).display,
    map:{right:right.right,bottom:right.bottom,width:right.width,height:right.height},viewport:{w:innerWidth,h:innerHeight},
    zoomMin:(view.zoom=.5,zoom(1),view.zoom),zoomMax:(view.zoom=10,zoom(1),view.zoom)};
  });
  assert.equal(layout.placesInHeader,true);
  assert.equal(layout.residentsInHeader,true);
  assert.equal(layout.bagInHeader,true);
  assert.equal(layout.slots,6);
  assert.equal(layout.duplicateBottom,'none');
  assert.equal(layout.toolsBottom,'none');
  assert.equal(layout.zoomMin,1.05);
  assert.equal(layout.zoomMax,2.5);
  assert.ok(layout.map.right<=w&&layout.map.right>w-80,'map must sit at the right thumb: '+JSON.stringify(layout.map));
  assert.ok(layout.map.bottom<h&&layout.map.bottom>h-260,'map must sit low on screen: '+JSON.stringify(layout.map));
  assert.ok(Math.abs(layout.map.height-layout.map.width)<1,'map must be circular');
  await page.locator('#centerButton').click();
  assert.equal(await page.locator('#cityPanel').evaluate(e=>e.open),true);
  await page.locator('#cityPanel .close').click();
  await page.locator('#bagButton').click();
  assert.equal(await page.locator('#cityPanel').evaluate(e=>e.open),true);
  await context.close();
  console.log('CAVE-HUD PASS '+w+'×'+h+'; 6 slots, topbar icons, round map, zoom 1.05..2.5');
 }
 assert.deepEqual(errors,[],'No uncaught browser errors');
}catch(e){console.error('CAVE-HUD FAIL',e);process.exitCode=1;}finally{
 if(browser)await browser.close();
 if(proc&&!proc.killed){proc.kill('SIGTERM');await Promise.race([new Promise(r=>proc.once('exit',r)),sleep(2000)]);}
 fs.rmSync(tmp,{recursive:true,force:true});
}})();
