// Mobile world-first regression. Requires Playwright + installed Chrome (no runtime dependency).
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
let playwright;
for(const modulePath of [process.env.DEMENTOR_PLAYWRIGHT_MODULE,'playwright',path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)){
  try{playwright=require(modulePath);break;}catch{}
}
if(!playwright)throw Error('Install Playwright or set DEMENTOR_PLAYWRIGHT_MODULE');
const root=path.dirname(__dirname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-mobile-'));
const port=Number(process.env.DEMENTOR_MOBILE_PORT||4182),base='http://127.0.0.1:'+port;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let server,browser;
(async()=>{
try{
  server=spawn(process.execPath,['server.mjs','--test'],{
    cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'
  });
  let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
  let ready=false;
  for(let i=0;i<80;i++){
    try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}
    if(server.exitCode!==null)throw Error(logs);
    await wait(100);
  }
  assert.ok(ready,'Server startup timed out: '+logs);
  browser=await playwright.chromium.launch({channel:process.env.DEMENTOR_BROWSER_CHANNEL||'chrome',headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.getByLabel('Как тебя зовут?').fill('Mobile QA');
  await page.getByRole('button',{name:'Войти в мир'}).click();
  await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
  async function assertHud(width,height){
    await page.setViewportSize({width,height});
    await page.waitForTimeout(180);
    const ui=await page.evaluate(()=>{
      const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
      return {questCollapsed:document.getElementById('quest').classList.contains('collapsed'),quest:rect('quest'),vitals:rect('vitals'),map:rect('zoomIn'),inventory:rect('world'),plus:document.getElementById('zoomIn').getBoundingClientRect().width};
    });
    assert.equal(ui.questCollapsed,true,'Quest must default to collapsed');
    assert.ok(ui.quest.right+8<=ui.vitals.x,'Quest and vitals overlap');
    assert.ok(ui.map.w>=38&&ui.map.x>=0&&ui.map.right<=width&&ui.map.bottom<height,'Zoom button is inaccessible');
    assert.ok(ui.inventory.w>=width-2,'Canvas must fill the viewport');
    console.log('MOBILE HUD PASS',width,height);
  }
  await assertHud(390,844);
  let zoom=await page.evaluate(()=>view.zoom);
  await page.locator('#zoomIn').click();
  assert.ok((await page.evaluate(()=>view.zoom))>zoom,'Zoom + failed');
  zoom=await page.evaluate(()=>view.zoom);
  await page.locator('#zoomOut').click();
  assert.ok((await page.evaluate(()=>view.zoom))<zoom,'Zoom - failed');
  const pinch=await page.evaluate(()=>{
    const c=document.getElementById('world'),z=view.zoom;
    const fire=(name,id,x,y)=>c.dispatchEvent(new PointerEvent(name,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y,bubbles:true}));
    fire('pointerdown',91,160,430);fire('pointerdown',92,240,430);
    fire('pointermove',92,300,430);
    fire('pointerup',92,300,430);fire('pointerup',91,160,430);
    return {before:z,after:view.zoom};
  });
  assert.ok(pinch.after>pinch.before,'Two-touch pinch handler must zoom');
  const target=await page.evaluate(()=>{
    const canvasRect=document.getElementById('world').getBoundingClientRect();
    const candidates=[{x:me.x+2.5,y:me.y},{x:me.x-2.5,y:me.y},{x:me.x,y:me.y+2.5},{x:me.x,y:me.y-2.5}]
      .map(world=>({world,screen:screen(world.x,world.y),path:findPath(world)}));
    const chosen=candidates.find(({world,screen:s,path})=>
      !blocked(world.x,world.y)&&path&&path.length>0&&
      s.x>24&&s.y>100&&s.x<canvasRect.width-24&&s.y<canvasRect.height-60&&
      document.elementFromPoint(s.x,s.y)?.id==='world');
    if(!chosen)throw Error('No visible, tappable and path-connected navigation target: '+JSON.stringify(candidates.map(c=>({world:c.world,screen:c.screen,path:!!c.path}))));
    return {world:chosen.world,screen:chosen.screen};
  });
  // Trace the actual browser -> HTTP movement chain, not merely eventual coordinates.
  await page.evaluate(()=>{
    window.__navQA={inputs:[],startedAt:performance.now()};
    const realFetch=window.fetch.bind(window);
    window.fetch=(url,options)=>{if(String(url).includes('/api/input')&&options?.body){
      try{const x=JSON.parse(options.body);window.__navQA.inputs.push({dx:x.dx,dy:x.dy,at:performance.now()});}catch{}
    }return realFetch(url,options);};
  });
  await page.touchscreen.tap(target.screen.x,target.screen.y);
  await page.waitForFunction(goal=>route.length>0||Math.hypot(me.x-goal.x,me.y-goal.y)<0.8,target.world,{timeout:2500}).catch(async err=>{
    const status=await page.evaluate(()=>({position:{x:me.x,y:me.y},route,selected,inputs:window.__navQA?.inputs}));
    throw Error('Tap never initiated a route: '+JSON.stringify(status)+'; '+err.message);
  });
  await page.waitForFunction(()=>window.__navQA?.inputs.some(p=>Math.hypot(p.dx,p.dy)>0.05),null,{timeout:3500});
  try{
    await page.waitForFunction(goal=>Math.hypot(me.x-goal.x,me.y-goal.y)<0.8&&route.length===0,target.world,{timeout:20000});
  }catch(navigationError){
    // Do not mask timeout: surface all state required to reproduce a stuck
    // route, blocked map tap, oscillation or out-of-bounds tap.
    const diagnostic=await page.evaluate(goal=>({
      target:goal,
      current:{x:me.x,y:me.y,scene:me.scene},
      distance:Math.hypot(me.x-goal.x,me.y-goal.y),
      routeLength:route.length,
      routePreview:route.slice(0,12),
      selected:typeof selected==='undefined'?null:selected,
      viewport:{width:innerWidth,height:innerHeight},
      canvas:(()=>{const r=document.getElementById('world').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};})(),
      zoom:view.zoom,
      browserErrors:window.__navQA?.inputs?.length||0
    }),target.world);
    console.error('MOBILE_NAVIGATION_TIMEOUT_DIAGNOSTIC',JSON.stringify({...diagnostic,pageErrors:errors}));
    throw navigationError;
  }
  const audit=await page.evaluate(goal=>({movementCommands:window.__navQA.inputs.filter(p=>Math.hypot(p.dx,p.dy)>0.05).length,finalDistance:Math.hypot(me.x-goal.x,me.y-goal.y)}),target.world);
  assert.ok(audit.movementCommands>0,'Tap did not trigger any nonzero /api/input');
  console.log('MOBILE TAP_ROUTE_INPUT_ARRIVAL PASS',JSON.stringify(audit));
  console.log('MOBILE NAVIGATION PASS');
  await assertHud(375,667);
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  console.log('MOBILE SMOKE PASS (Chromium emulation, not iOS Safari certification)');
}catch(err){console.error(err);process.exitCode=1;}
finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}fs.rmSync(tmp,{recursive:true,force:true});}
})();
