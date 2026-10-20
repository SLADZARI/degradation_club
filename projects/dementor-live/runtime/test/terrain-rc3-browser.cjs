// Two real browsers in a fully isolated --test world; no production writes.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const pw=require('playwright');
const root=path.dirname(__dirname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-terrain-rc3-'));
const port=Number(process.env.DEMENTOR_TERRAIN_TEST_PORT||4187),base='http://127.0.0.1:'+port;
const sleep=t=>new Promise(resolve=>setTimeout(resolve,t));
let server,browser;
(async()=>{try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let log='';server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);
 let started=false;
 for(let i=0;i<120;i++){try{if((await fetch(base+'/api/health')).ok){started=true;break;}}catch{}if(server.exitCode!==null)throw Error(log);await sleep(100);}
 assert.ok(started,'Game did not start: '+log);
 const manifestResponse=await fetch(base+'/assets/terrain/manifest.json');
 assert.equal(manifestResponse.status,200);
 const manifest=await manifestResponse.json();
 assert.equal(manifest.schema,'DL-TERRAIN-01');
 assert.equal(Object.keys(manifest.assets).length,17);
 assert.equal((await fetch(base+'/assets/terrain/'+manifest.atlas['256'].file)).status,200);
 browser=await pw.chromium.launch({headless:true});
 const errors=[];
 async function join(name,options){
  const context=await browser.newContext(options);
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.getByLabel('Как тебя зовут?').fill(name);
  await page.getByRole('button',{name:'Войти в мир'}).click();
  await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
  await page.waitForFunction(()=>window.DLTerrain01?.ready);
  return {page,context,id:await page.evaluate(()=>me.id)};
 }
 const first=await join('Укладчик',{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const second=await join('Наблюдатель',{viewport:{width:1100,height:780},deviceScaleFactor:1});
 async function fixture(player,patch){
  const response=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},
   body:JSON.stringify({player,patch})});
  assert.equal(response.status,200);
 }
 await fixture(first.id,{wallet:50,x:16.7,y:4});
 await first.page.waitForFunction(()=>me&&me.wallet===50);
 await first.page.evaluate(()=>openCityPanel('landscape'));
 assert.equal(await first.page.locator('#cityPanel canvas.terrain-preview').count(),3,'three product thumbnails');
 await first.page.locator('#cityPanel .city-row').filter({hasText:'Дорожная плитка'}).getByRole('button',{name:'Купить 10 · 1 PAPER'}).click();
 await first.page.waitForFunction(()=>me?.terrainBag?.paving===10);
 await first.page.evaluate(()=>openCityPanel('bag'));
 await first.page.getByText('Покрытия для строительства').waitFor();
 await first.page.locator('#cityPanel .city-row').filter({hasText:'Дорожная плитка'}).getByRole('button',{name:/Выбрать/}).click();
 assert.equal(await first.page.locator('#terrain-placement').isVisible(),true);
 await fixture(first.id,{x:14.2,y:9.2});
 await first.page.waitForFunction(()=>Math.abs(me?.x-14.2)<.01);
 // Touch screen simulates placing one independent cell: no drag-and-drop.
 // Wait until server-side player relocation reaches the interpolated camera; otherwise touch coordinates refer to an obsolete view.
 await first.page.waitForFunction(()=>{const hero=visualPlayers.get(me?.id);return hero&&Math.hypot(hero.x-me.x,hero.y-me.y)<.06&&Math.hypot(view.cx-me.x,view.cy-me.y)<.06;});
 const point=await first.page.evaluate(()=>{const q=screen(14.5,9.5),r=canvas.getBoundingClientRect();return {x:q.x+r.left,y:q.y+r.top};});
 await first.page.touchscreen.tap(point.x,point.y);
 const tapDiagnostic=await first.page.evaluate(({x,y})=>{
   const e=document.elementFromPoint(x,y),r=canvas.getBoundingClientRect();
   return {hit:e?.id||e?.className||e?.tagName,point:{x,y},canvas:{x:r.left,y:r.top,width:r.width,height:r.height},
     selected:typeof placementCell==='undefined'?null:placementCell,kind:typeof placementKind==='undefined'?null:placementKind,
     projected:screen(14.5,9.5),scene:state?.scene,me:{x:me?.x,y:me?.y},bar:document.querySelector('#terrain-placement')?.getBoundingClientRect()?.toJSON?.()};
 },point);
 console.log('TERRAIN TOUCH DIAGNOSTIC',JSON.stringify(tapDiagnostic));
 await first.page.waitForFunction(()=>placementCell?.x===14&&placementCell?.y===9);
 await first.page.getByRole('button',{name:'Применить'}).click();
 await first.page.waitForFunction(()=>state?.landscape?.tiles?.some(t=>t.x===14&&t.y===9&&t.kind==='paving')&&me?.terrainBag?.paving===9);
 await second.page.waitForFunction(()=>state?.landscape?.tiles?.some(t=>t.x===14&&t.y===9));
 // Repeated tap cannot duplicate placement.
 await first.page.evaluate(()=>setPlacementKind('paving'));
 // Camera follows the character; calculate a fresh screen projection before the second tap.
 const repeatPoint=await first.page.evaluate(()=>{const q=screen(14.5,9.5),r=canvas.getBoundingClientRect();return {x:q.x+r.left,y:q.y+r.top};});
 await first.page.touchscreen.tap(repeatPoint.x,repeatPoint.y);
 await first.page.waitForFunction(()=>placementCell?.x===14&&placementCell?.y===9);
 assert.equal(await first.page.getByRole('button',{name:'Применить'}).isDisabled(),true);
 // Existing save and the same tokens survive reload.
 await first.page.reload();await first.page.waitForFunction(()=>me?.terrainBag?.paving===9&&state?.landscape?.tiles?.some(t=>t.x===14&&t.y===9));
 assert.deepEqual(errors,[]);
 console.log('TERRAIN RC3 BROWSER PASS: 3 visual catalog cards, mobile select/apply, 2 clients, protected duplicate, reload');
 await second.context.close();await first.context.close();
}catch(e){console.error(e);process.exitCode=1;}
finally{
 if(browser)await browser.close();
 if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}
 fs.rmSync(tmp,{recursive:true,force:true});
}})();
