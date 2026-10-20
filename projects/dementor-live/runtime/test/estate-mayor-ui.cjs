// Two-feature integration smoke: permanent ID/gender, business lease + mayor's active-play modal.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process');
const {chromium}=require('playwright'),root=path.join(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dl-estate-ui-')),port=4198,base='http://127.0.0.1:'+port;
let server,browser;const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const errors=[];try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:'pipe'});
 let logs='';server.stdout.on('data',b=>logs+=b);server.stderr.on('data',b=>logs+=b);
 let ok=false;for(let n=0;n<90;n++){try{if((await fetch(base+'/api/health')).ok){ok=true;break;}}catch{}await delay(90)}assert.ok(ok,logs);
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill('Василиса');await page.locator('#genderInput').selectOption('female');
 await page.getByRole('button',{name:'Войти в мир'}).click();await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);
 assert.equal(await page.evaluate(()=>me.gender),'female');
 const id=await page.evaluate(()=>me.id);
 async function patch(values){const r=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player:id,patch:values})});assert.equal(r.status,200);}
 await patch({wallet:200,x:7,y:22});await page.waitForFunction(()=>me.wallet===200&&Math.abs(me.x-7)<.05);
 await page.evaluate(()=>{selected='plot-2';openCityPanel('estate');});
 await page.locator('#estate-rent').click();
 await page.waitForFunction(()=>state.plots.find(t=>t.id==='plot-2')?.lease?.dueAt>state.now);
 assert.equal(await page.evaluate(()=>state.plots.find(t=>t.id==='plot-2').publicAccess),true);
 assert.equal(await page.evaluate(()=>me.wallet),199);
 await page.locator('#cityPanel [data-close]').click();
 await patch({activeGameMs:900000,x:9,y:3});
 await page.mouse.click(260,210);await page.waitForFunction(()=>me.activeGameMs>=900000);
 await page.locator('#mayorIdea').waitFor({state:'visible',timeout:18000});
 await page.locator('#mayorIdeaText').fill('Предлагаю добавить публичную библиотеку с книгами и рассказами жителей нашего города');
 await page.locator('#mayorIdeaForm button[type=submit]').click();
 await page.waitForFunction(()=>state.mayorMail?.length===1);
 assert.equal(await page.evaluate(()=>me.wallet),249);
 assert.equal(await page.evaluate(()=>state.mayorMail[0].reward),50);
 await page.evaluate(()=>{selected='mayor';openCityPanel('mayor');});
 await page.locator('#mayor-letter-form textarea').waitFor();
 assert.match(await page.locator('#cityPanelRows').innerText(),/Твоё письмо/);
 assert.deepEqual(errors,[]);
 console.log('ESTATE MAYOR UI PASS',JSON.stringify({gender:'female',lease:'business-open',prompt:'active-15min',mail:'persisted',reward:50,errors}));
 }catch(e){console.error('ESTATE MAYOR UI FAIL',e,errors);process.exitCode=1;}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),delay(1200)])}fs.rmSync(tmp,{recursive:true,force:true});}})();
