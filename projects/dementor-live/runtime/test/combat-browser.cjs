// Isolated browser acceptance for COMBAT-01 P0, NOT live or iOS Safari certification.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const pw=require('playwright');
const root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-combat-browser-'));
const port=Number(process.env.DEMENTOR_COMBAT_BROWSER_PORT||4188),base='http://127.0.0.1:'+port;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let server,browser;const errors=[];
async function start(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let logs='';server.stdout.on('data',x=>logs+=x.toString());server.stderr.on('data',x=>logs+=x.toString());
 for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}if(server.exitCode!==null)throw Error(logs);await sleep(75);}
 throw Error('No test server: '+logs);
}
async function player(name,mobile=false){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1366,height:850},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(name+': '+e.message));
 page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource: the server responded with a status of 400 \(Bad Request\)/.test(m.text()))errors.push(name+': '+m.text());});
 await page.goto(base+'/');await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 const id=await page.evaluate(()=>me.id);
 const token=await page.evaluate(()=>sessionStorage.getItem('dementor-token'));
 return {context,page,id,token,mobile};
}
async function req(pathname,body){
 const r=await fetch(base+pathname,{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify(body)});
 assert.equal(r.status,200,pathname);return r.json();
}
async function toCombat(p){
 await req('/__test',{player:p.id,patch:{x:29,y:35}});
 await p.page.waitForFunction(()=>me&&Math.hypot(me.x-29,me.y-35)<.1&&context?.type==='combat',{timeout:10000});
 await p.page.locator(p.mobile?'#mobileCombatButton':'#actionButton').click();await p.page.waitForURL('**/combat');
 await p.page.waitForFunction(()=>typeof battle!=='undefined'&&document.querySelector('#lobby')!==null);
}
(async()=>{
 try{
  await start();
  browser=await pw.chromium.launch({headless:true});
  const a=await player('Бой QA A'),b=await player('Бой QA B',true);
  assert.notEqual(a.id,b.id);
  await toCombat(a);await toCombat(b);
  assert.equal(await a.page.locator('#lobby').isVisible(),true);
  // Reproduce HTTP LAN Safari: randomUUID is unavailable in insecure contexts.
  await a.page.evaluate(()=>{
    try{Object.defineProperty(window.crypto,'randomUUID',{value:undefined,configurable:true});}catch{}
    if(typeof window.crypto?.randomUUID==='function')throw Error('Failed to emulate missing randomUUID');
  });
  await a.page.locator('#create').click();
  await a.page.waitForFunction(()=>battle?.status==='LOBBY');
  await b.page.waitForFunction(()=>document.querySelector('#lobbies button')?.textContent.includes('Бой QA A'));
  await b.page.locator('#lobbies button').first().click();
  await b.page.waitForFunction(()=>battle?.status==='LOBBY'&&Object.keys(battle.members).length===2);
  await a.page.locator('#start').click();
  await a.page.waitForFunction(()=>battle?.status==='ACTIVE'&&battle.stage===1);
  await b.page.waitForFunction(()=>battle?.status==='ACTIVE'&&battle.stage===1);
  assert.equal(await a.page.locator('#play').isVisible(),true);
  assert.equal(await b.page.locator('#play').isVisible(),true);
  // Browser-rendered target requires the main canvas to exist and the game to draw without script errors.
  const mobile=await b.page.evaluate(()=>{
    const box=id=>{const r=document.getElementById(id).getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
    return {map:box('field'),left:box('movePad'),right:box('aimPad'),stage:battle.stage};
  });
  assert.equal(mobile.stage,1);
  assert.ok(mobile.map.width>=375&&mobile.map.height>200,'Mobile gameplay viewport too small');
  assert.ok(mobile.left.left>=0&&mobile.right.right<=390,'Virtual sticks offscreen');
  // Fire from actual mouse input toward the initial CHASER (same server-verified shot path).
  const target=await a.page.evaluate(()=>{
    const enemy=battle.enemies[0],p=project(enemy.x,enemy.y),r=canvas.getBoundingClientRect();
    return {x:r.left+p.x,y:r.top+p.y};
  });
  await a.page.mouse.move(target.x,target.y);
  await a.page.mouse.down();await sleep(1250);await a.page.mouse.up();
  await a.page.waitForFunction(()=>data?.profile?.ammo<24,{timeout:5000});
  assert.ok((await a.page.evaluate(()=>data.profile.ammo))<24);
  await b.page.reload();await b.page.waitForFunction(()=>battle?.status==='ACTIVE'&&Object.keys(battle.members).length===2);
  assert.equal(await b.page.locator('#touchPads').isVisible(),true);
  a.page.on('dialog',d=>d.accept());
  await a.page.locator('#retreat').click();
  await a.page.waitForFunction(()=>battle===null||battle.status==='CLOSED',{timeout:5000});
  await b.page.waitForFunction(()=>battle===null||battle.status==='CLOSED',{timeout:5000});
  assert.deepEqual(errors,[],'Browser JS/console errors');
  console.log('COMBAT BROWSER PASS: city gate, 2 contexts, mobile pads, actual mouse shot, reload, retreat');
 }catch(e){console.error('BROWSER FAIL',e,errors);process.exitCode=1;}
 finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),sleep(1800)]);}fs.rmSync(tmp,{recursive:true,force:true});}
})();