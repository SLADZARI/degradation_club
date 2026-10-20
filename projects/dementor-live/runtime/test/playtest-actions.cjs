// Two concrete regressions from the 20 Oct Warsaw two-person video test:
// pressing E on well/bed must perform the action, not merely open an unusable menu.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dl-video-action-')),port=4197,base='http://127.0.0.1:'+port;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let server,browser;
async function patch(id,patch){const resp=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player:id,patch})});assert.equal(resp.status,200);}
(async()=>{try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let log='';server.stdout.on('data',x=>log+=x);server.stderr.on('data',x=>log+=x);
 let ok=false;for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok){ok=true;break;}}catch{}await sleep(85);}assert.ok(ok,log);
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill('Контроль Е');await page.getByRole('button',{name:'Войти в мир'}).click();await page.waitForFunction(()=>me&&connected);
 const id=await page.evaluate(()=>me.id);
 await patch(id,{wallet:220,x:7,y:14});
 await page.waitForFunction(()=>me.wallet===220&&Math.abs(me.x-7)<.05);
 async function action(type,target){return page.evaluate(async({type,target})=>await act(type,target),{type,target});}
 assert.equal((await action('buy','plot-1')).ok,true);
 assert.equal((await action('enterPlot','plot-1')).ok,true);
 await page.waitForFunction(()=>state.scene==='plot');
 await patch(id,{x:14,y:3});
 await page.waitForFunction(()=>Math.abs(me.x-14)<.05&&Math.abs(me.y-3)<.05);
 await page.evaluate(()=>{selected='well';updateContext();});
 await page.keyboard.press('KeyE');
 await page.waitForFunction(()=>me.bag.water>=1,{timeout:5000});
 assert.equal(await page.evaluate(()=>me.bag.water),1);
 assert.equal(await page.evaluate(()=>$('cityPanel').open),false,'E must collect water without a dialog');
 await patch(id,{scene:'interior',x:10,y:5,stamina:25});
 await page.waitForFunction(()=>state.scene==='interior'&&me.stamina<40);
 await page.evaluate(()=>{selected='bed';updateContext();});
 await sleep(250);await page.keyboard.press('KeyE');
 await page.waitForFunction(()=>me.stamina===100,{timeout:5000});
 assert.equal(await page.evaluate(()=>$('cityPanel').open),false,'E must restore stamina without a dialog');
 assert.deepEqual(errors,[]);
 console.log('VIDEO PLAYTEST ACTIONS PASS · mobile E well+bed, saved water and stamina');
}catch(e){console.error('VIDEO PLAYTEST ACTIONS FAIL',e);process.exitCode=1;}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),sleep(1100)]);}fs.rmSync(tmp,{recursive:true,force:true});}})();
