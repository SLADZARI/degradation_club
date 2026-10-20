// Browser acceptance for the v0.4 interface and persistent CIVIC landscaping; no prod save writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process');
const pw=require('playwright'),root=path.dirname(__dirname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-polish-')),port=Number(process.env.DEMENTOR_POLISH_PORT||4192),base='http://127.0.0.1:'+port;
const wait=ms=>new Promise(r=>setTimeout(r,ms));let server,browser;
async function patch(player,patch){const r=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player,patch})});assert.equal(r.status,200);return r.json();}
(async()=>{const errors=[];try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});
 let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
 let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}if(server.exitCode!==null)throw Error(logs);await wait(100);}assert.ok(ready,logs);
 browser=await pw.chromium.launch({channel:process.env.DEMENTOR_BROWSER_CHANNEL||'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill('Полировка');await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 assert.match(await page.locator('#connection').innerText(),/Жители.*1/);
 assert.equal(await page.locator('#quest').isVisible(),true);assert.equal(await page.locator('#questActive').isVisible(),true);
 assert.equal(await page.locator('#questList').isVisible(),false);
 await page.locator('#questViewToggle').click();assert.equal(await page.locator('#questList').isVisible(),true);
 await page.locator('#questToggle').click();assert.equal(await page.locator('#quest').evaluate(e=>e.classList.contains('collapsed')),true);
 await page.locator('#questToggle').click();
 const before=await page.evaluate(()=>({x:me.x,y:me.y}));
 await page.keyboard.down('ArrowDown');await wait(700);await page.keyboard.up('ArrowDown');await wait(220);
 const after=await page.evaluate(()=>({x:me.x,y:me.y}));
 const screenX=((after.x-after.y)-(before.x-before.y))*Math.sqrt(3)/2;
 const screenY=((after.x+after.y)-(before.x+before.y))*.5;
 assert.ok(screenY>.4,'ArrowDown must travel visibly downward');assert.ok(Math.abs(screenX)<.5,'ArrowDown must not move sideways');
 const player=await page.evaluate(()=>me.id);
 await patch(player,{x:16.7,y:4,wallet:5});await page.waitForFunction(()=>Math.abs(me.x-16.7)<.01&&me.wallet===5);
 await page.evaluate(()=>openCityPanel('landscape'));
 await page.getByRole('button',{name:'Купить 10 · 1 PAPER'}).first().click();
 await page.waitForFunction(()=>me.terrainBag?.paving===10);
 await page.getByRole('button',{name:'Укладывать'}).first().click();
 assert.equal(await page.evaluate(()=>placementKind),'paving');
 await patch(player,{x:14,y:9});await page.waitForFunction(()=>Math.abs(me.x-14)<.01&&Math.abs(me.y-9)<.01);
 const point=await page.evaluate(()=>screen(14.5,9.5));await page.mouse.click(point.x,point.y);
 await page.waitForFunction(()=>state.landscape?.tiles?.some(t=>t.x===14&&t.y===9&&t.kind==='paving'));
 assert.equal(await page.evaluate(()=>me.terrainBag.paving),9);
 assert.deepEqual(errors,[],'Browser page errors');
 console.log('PASS: quest modes, residents count, arrow-down axes, landscape store and placed paving');
} catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}fs.rmSync(tmp,{recursive:true,force:true});}})();
