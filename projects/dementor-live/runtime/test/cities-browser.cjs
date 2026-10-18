// Browser regression for isolated multi-city gameplay. Does not contact public server.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
let pw;for(const name of [process.env.DEMENTOR_PLAYWRIGHT_MODULE,'playwright',path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)){try{pw=require(name);break;}catch{}}
if(!pw)throw Error('Playwright required for browser QA');
const root=path.dirname(__dirname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-cities-browser-'));
const port=Number(process.env.DEMENTOR_CITY_PORT||4184),base='http://127.0.0.1:'+port;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let server,browser;
(async()=>{try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let output='';server.stdout.on('data',d=>output+=d);server.stderr.on('data',d=>output+=d);
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok){ready=true;break;}}catch{}if(server.exitCode!==null)throw Error(output);await wait(100);}
 assert.ok(ready,'Cannot start game: '+output);
 browser=await pw.chromium.launch({channel:process.env.DEMENTOR_BROWSER_CHANNEL||'chrome',headless:true});
 const errors=[];
 async function join(name,width=390){
   const context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);
   await page.getByRole('button',{name:'Войти в мир'}).click();
   await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
   return {page,context,id:await page.evaluate(()=>me.id)};
 }
 const founder=await join('Основатель'),friend=await join('Друг');
 async function fixture(id,patch){
   const r=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player:id,patch})});
   assert.equal(r.status,200);return r.json();
 }
 await fixture(founder.id,{x:19,y:6});await fixture(friend.id,{x:19,y:6});
 for(const u of [founder,friend])await u.page.waitForFunction(()=>me&&me.x===19&&me.y===6);
 await founder.page.evaluate(()=>openCityPanel('city-registry'));
 await founder.page.locator('input[name=cityName]').fill('Новая пристань');
 await founder.page.locator('#city-create').click();
 await founder.page.waitForFunction(()=>state.cityNetwork.cities.length===2);
 const cityId=await founder.page.evaluate(()=>state.cityNetwork.cities.find(x=>x.id!=='origin').id);
 assert.ok(cityId.startsWith('city-'));
 await founder.page.locator('#cityPanel .city-row').filter({hasText:'Новая пристань'}).getByRole('button',{name:'Перейти'}).click();
 await founder.page.waitForFunction(id=>state.cityNetwork.current===id,cityId);
 await friend.page.evaluate(()=>openCityPanel('city-registry'));
 await friend.page.locator('#cityPanel .city-row').filter({hasText:'Новая пристань'}).getByRole('button',{name:'Перейти'}).click();
 await friend.page.waitForFunction(id=>state.cityNetwork.current===id&&state.cityNetwork.cities.find(c=>c.id===id).online===2,cityId);
 assert.equal(await friend.page.evaluate(()=>state.players.filter(p=>p.online).length),2);
 await founder.page.reload();await founder.page.waitForFunction(id=>typeof me!=='undefined'&&me&&connected&&state.cityNetwork.current===id,cityId);
 const r=await founder.page.evaluate(()=>({id:me.id,city:state.cityNetwork.current}));
 assert.equal(r.id,founder.id);
 assert.equal(r.city,cityId);
 assert.deepEqual(errors,[]);
 console.log('CITY BROWSER PASS: two real Chrome sessions, create, join, shared scene, identity persists after reload');
 await friend.context.close();await founder.context.close();
}catch(e){console.error(e);process.exitCode=1;}
finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}fs.rmSync(tmp,{recursive:true,force:true});}})();
