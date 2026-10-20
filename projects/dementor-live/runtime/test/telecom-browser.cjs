// Playwright: phone receiver > searchable subscriber > dial > 100-character message > two-client delivery.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-pager-browser-')),port=4199,base='http://127.0.0.1:'+port;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));let server,browser;
async function patch(player,changes){const r=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player,patch:changes})});assert.equal(r.status,200);return r.json();}
async function create(name,viewport){
 const page=await browser.newPage({viewport});
 await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected&&state.telecom?.number);
 return page;
}
(async()=>{try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(temp,'world.json')},stdio:'pipe'});
 let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
 let running=false;for(let i=0;i<90;i++){try{if((await fetch(base+'/api/health')).ok){running=true;break;}}catch{}await pause(100);}assert.ok(running,logs);
 browser=await chromium.launch({channel:'chrome',headless:true});
 const a=await create('Отправитель',{width:1440,height:900}),b=await create('Получатель',{width:390,height:844});
 const sender=await a.evaluate(()=>me.id),recipient=await b.evaluate(()=>me.id),number=await b.evaluate(()=>state.telecom.number);
 assert.match(number,/^\d{6}$/);
 await patch(sender,{wallet:5,x:10,y:12});await patch(recipient,{wallet:200,x:24,y:3});
 await b.waitForFunction(()=>me.wallet===200&&Math.abs(me.x-24)<.02);
 await b.locator('#openPager').click();await b.getByRole('button',{name:'Купить'}).click();
 await b.waitForFunction(()=>state.telecom.hasPager);
 await b.getByRole('button',{name:'Опубликовать номер'}).click();
 await b.waitForFunction(()=>state.telecom.listed);
 await b.locator('#cityPanel [data-close]').click();
 await a.waitForFunction(()=>Math.abs(me.x-10)<.02);
 await a.evaluate(()=>window.__openPayphone('phone-square'));
 await a.getByRole('button',{name:'СНЯТЬ ТРУБКУ'}).click();
 await a.locator('#phoneSearch').fill('Получатель');
 await a.getByRole('button',{name:new RegExp('Получатель · '+number)}).click();
 assert.equal((await a.locator('#phoneDisplay').innerText()).trim(),number);
 await a.getByRole('button',{name:'ПОЗВОНИТЬ →'}).click();
 await a.locator('#phoneText').fill('Проверка пейджера с двух устройств.');
 await a.getByRole('button',{name:'ОТПРАВИТЬ · 1 PAPER'}).click();
 await b.waitForFunction(()=>state.telecom.unread===1,{timeout:10000});
 await a.waitForFunction(()=>me.wallet===4,{timeout:10000});
 assert.equal(await a.evaluate(()=>me.wallet),4);
 await b.locator('#openPager').click();
 assert.match(await b.locator('#cityPanelRows').innerText(),/Проверка пейджера с двух устройств/);
 await b.getByRole('button',{name:'Прочитано'}).click();
 await b.waitForFunction(()=>state.telecom.unread===0);
 const from=await a.evaluate(()=>state.telecom.number);
 await b.getByRole('button',{name:'Заблокировать'}).click();
 await b.waitForFunction(()=>state.telecom.blocked.includes(state.telecom.inbox[0].from));
 await a.evaluate(async(number)=>{const r=await act('pagerSend','phone-square',{number,text:'Нельзя доставлять после блокировки'});window.__blockedDelivery=r;},number);
 assert.equal(await a.evaluate(()=>window.__blockedDelivery.ok),false);
 await a.locator('#qaVideoMarker').click();
 const auth=await a.evaluate(()=>token);
 const exportResult=await fetch(base+'/api/qa-export',{headers:{Authorization:'Bearer '+auth}});
 assert.equal(exportResult.status,200);const stream=await exportResult.text();
 assert.match(stream,/video_marker/);assert.match(stream,/pagerSend/);
 assert.ok(!stream.includes('Проверка пейджера с двух устройств'),'QA recording must redact private messages');
 console.log('TELECOM BROWSER PASS — two clients, paid message, inbox, read status, sanitized QA export');
}catch(e){console.error('TELECOM BROWSER FAIL',e);process.exitCode=1;}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(resolve=>server.once('exit',resolve)),pause(1000)]);}fs.rmSync(temp,{recursive:true,force:true});}})();
