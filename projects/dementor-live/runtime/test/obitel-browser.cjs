// Isolated browser test; never touches live server data or world.json.
const {spawn}=require('node:child_process');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.dirname(__dirname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'obitel-p0-qa-'));
const port=Number(process.env.DEMENTOR_OBITEL_QA_PORT||4292),base='http://127.0.0.1:'+port;
let server,browser;const failures=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function post(route,payload,headers={}){
  const res=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(payload)});
  assert.equal(res.status,200,route+' '+await res.text());return res.json();
}
async function goContext(page,id){
  await page.evaluate(id=>{selected=id;updateContext();},id);
  await page.waitForFunction(id=>context?.id===id&&context.enabled,id,{timeout:5000});
  await page.locator('#actionButton').click();
}
(async()=>{try{
  server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});
  let logs='';server.stdout.on('data',v=>logs+=v);server.stderr.on('data',v=>logs+=v);
  let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}if(server.exitCode!==null)throw Error(logs);await sleep(100);}
  assert.ok(ready,'server did not start: '+logs);
  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  page.on('pageerror',e=>failures.push(e.message));
  await page.goto(base);
  await page.getByLabel('Как тебя зовут?').fill('Obitel Browser QA');
  await page.getByRole('button',{name:'Войти в мир'}).click();
  await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
  const playerId=await page.evaluate(()=>me.id),wallet=await page.evaluate(()=>me.wallet);
  async function position(x,y){await post('/__test',{player:playerId,patch:{x,y}},{'x-test-key':'local-integration-tests'});await page.waitForFunction(([x,y])=>Math.hypot(me.x-x,me.y-y)<.1,[x,y]);}
  await position(138,72);
  await goContext(page,'obitel-zen-entry');
  await page.waitForFunction(()=>state.scene==='obitel-zen');
  assert.equal(await page.evaluate(()=>state.worldTravel.targets.filter(x=>x.type==='obitel-card').length),7);
  await position(7,7);
  await goContext(page,'OB-C01');
  await page.locator('#obitelCardDialog').waitFor({state:'visible'});
  assert.match(await page.locator('#obitelCardQuestion').innerText(),/Какой путь/);
  await page.locator('#obitelCardAnswer').fill('К другим');
  await page.locator('#obitelCardSave').click();
  await page.waitForFunction(()=>(state.obitel?.cards?.['OB-C01']?.answerCount||0)===1);
  await page.locator('#obitelCardContinue').click();
  await page.waitForFunction(()=>!!state.obitel?.cards?.['OB-C01']?.continuationRequestedAt);
  await page.locator('#obitelCardSkip').click();
  await page.locator('#obitelCardDialog').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>me.wallet),wallet);
  assert.equal(await page.evaluate(()=>state.obitel.mountainUnlocked),false);
  // Dialog remains usable in narrow mobile viewport.
  await page.setViewportSize({width:390,height:844});
  await position(14,6);
  await goContext(page,'OB-C02');
  await page.locator('#obitelCardDialog').waitFor({state:'visible'});
  assert.match(await page.locator('#obitelCardQuestion').innerText(),/идеальный день/);
  await page.locator('#obitelCardClose').click();
  await position(2,17);
  await goContext(page,'obitel-zen-exit');
  await page.waitForFunction(()=>state.scene==='city');
  assert.deepEqual(failures,[]);
  console.log('OBITEL BROWSER PASS: enter, 7 cards, answer, pending, skip, mobile dialog, safe exit, no money change');
}catch(e){console.error(e);process.exitCode=1;}
finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}fs.rmSync(tmp,{recursive:true,force:true});}
})();
