// Isolated Chromium mobile trade regression: NOT a physical iPhone/human acceptance test.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'dl-mobile-social-'));
const port=Number(process.env.DEMENTOR_BROWSER_PORT||4194),base='http://127.0.0.1:'+port;
const save=path.join(dir,'world.json'),reportDir=path.join(root,'reports');
fs.mkdirSync(reportDir,{recursive:true});
let server=null,browser=null,pass=false;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function request(route,body){
 const response=await fetch(base+route,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json','x-test-key':'local-integration-tests'}:undefined,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(5000)});
 assert.equal(response.status,200,route+' HTTP status');return response.json();
}
async function start(){
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_HOST:'127.0.0.1',DEMENTOR_PORT:String(port),DEMENTOR_STATE:save},stdio:['ignore','pipe','pipe']});
 let logs='';server.stdout.on('data',d=>logs=(logs+String(d)).slice(-1000));server.stderr.on('data',d=>logs=(logs+String(d)).slice(-1000));
 for(let i=0;i<80;i++){try{const r=await request('/api/health');if(r.testMode===true)return;}catch{}if(server.exitCode!==null)throw Error('Game exited: '+logs);await sleep(100);}
 throw Error('Isolated loopback test server did not become healthy: '+logs);
}
async function player(name,mobile){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:960},deviceScaleFactor:1});
 const page=await context.newPage();await page.goto(base);
 await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&!!me&&connected,null,{timeout:12000});
 const id=await page.evaluate(()=>me.id);return {context,page,id};
}
(async()=>{
 try{
  await start();browser=await chromium.launch({channel:'chrome',headless:true});
  const seller=await player('QA-Продавец',false),buyer=await player('QA-Покупатель',true);
  await request('/__test',{player:seller.id,patch:{wallet:0,bag:{wood:1,stone:0,food:0}}});
  await request('/__test',{player:buyer.id,patch:{wallet:10,bag:{wood:0,stone:0,food:0}}});
  await seller.page.waitForFunction(()=>me.bag.wood===1);
  await buyer.page.waitForFunction(()=>me.wallet===10);
  await seller.page.locator('#socialButton').click();
  await seller.page.locator('#trade-person').selectOption(buyer.id);
  await seller.page.locator('#trade-give').selectOption('wood');
  await seller.page.locator('#trade-give-qty').fill('1');
  await seller.page.locator('#trade-take-paper').fill('2');
  await seller.page.getByRole('button',{name:'Подтвердить условия и предложить'}).click();
  await buyer.page.locator('#socialButton').click();
  const button=buyer.page.locator('#trade-accept'),panel=buyer.page.locator('#cityPanel');
  await button.waitFor({state:'visible',timeout:5000});
  const metrics=await buyer.page.evaluate(()=>{
   const a=document.querySelector('#cityPanel'),b=document.querySelector('#trade-accept'),r=a.getBoundingClientRect(),s=b.getBoundingClientRect();
   return {viewport:[innerWidth,innerHeight],panel:{left:r.left,right:r.right,top:r.top,bottom:r.bottom},action:{left:s.left,right:s.right,top:s.top,bottom:s.bottom},transform:getComputedStyle(a).transform,mode:a.dataset.mode};
  });
  assert.equal(metrics.mode,'social','Trade panel opened');
  assert(metrics.panel.left>=-1&&metrics.panel.right<=metrics.viewport[0]+1,'Social panel offscreen '+JSON.stringify(metrics));
  assert(metrics.action.left>=0&&metrics.action.right<=metrics.viewport[0]+1,'Trade accept action offscreen '+JSON.stringify(metrics));
  await buyer.page.screenshot({path:path.join(reportDir,'h0-mobile-social.png')});
  await button.click({timeout:5000});
  await buyer.page.waitForFunction(()=>me.wallet===8&&me.bag.wood===1,null,{timeout:8000});
  await seller.page.waitForFunction(()=>me.wallet===2&&me.bag.wood===0,null,{timeout:8000});
  console.log('H0 MOBILE SOCIAL UI PASS '+JSON.stringify(metrics));pass=true;
 }catch(e){console.error('H0 MOBILE SOCIAL UI FAIL',e.stack);process.exitCode=1;}
 finally{fs.writeFileSync(path.join(reportDir,'h0-mobile-social.json'),JSON.stringify({status:pass?'PASS':'FAIL',sourceSha:process.env.SOURCE_SHA||null,scope:'synthetic isolated Chrome mobile viewport, not iPhone/humans'},null,2));if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(res=>server.once('exit',res)),sleep(2500)]);if(server.exitCode===null)server.kill('SIGKILL');}fs.rmSync(dir,{recursive:true,force:true});}
})();
