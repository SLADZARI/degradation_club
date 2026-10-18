// Browser QA needs an installed Chrome and Playwright; the game itself has no npm dependencies.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
let pw;for(const modulePath of [process.env.DEMENTOR_PLAYWRIGHT_MODULE,'playwright',path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)){try{pw=require(modulePath);break;}catch{}}
if(!pw)throw Error('Для browser QA укажи DEMENTOR_PLAYWRIGHT_MODULE, путь к установленному Playwright. Для игры он не нужен.');
const root=path.dirname(__dirname),out=path.dirname(root),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-browser-')),port=Number(process.env.DEMENTOR_BROWSER_PORT||4180),lanAddress=Object.values(os.networkInterfaces()).flat().find(a=>a.family==='IPv4'&&!a.internal&&a.address.startsWith('172.20.10.'))?.address||Object.values(os.networkInterfaces()).flat().find(a=>a.family==='IPv4'&&!a.internal)?.address,base=`http://${lanAddress}:${port}`;
const report={scope:'two browser contexts through real LAN IPv4 over plain HTTP; normal server, no fixtures',checks:[],consoleErrors:[],networkErrors:[],screenshots:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let server,browser,seq=0;
async function req(route,body,token){const response=await fetch(base+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(route==='/__test'?{'x-test-key':'local-integration-tests'}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.ok(response.ok,`HTTP ${response.status} ${route}`);return response.json();}
async function start(){server=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);for(let i=0;i<60;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}if(server.exitCode!==null)throw Error(logs);await sleep(100);}throw Error('Server startup: '+logs);}
async function stop(){if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}}
async function player(name,mobile=false){const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:960},deviceScaleFactor:1});const page=await context.newPage();page.on('pageerror',e=>report.consoleErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});page.on('requestfailed',r=>{if(!r.url().includes('/api/events')&&!r.failure()?.errorText?.includes('ABORTED'))report.networkErrors.push(r.url()+': '+r.failure()?.errorText);});await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);await page.getByRole('button',{name:'Войти в мир'}).click();await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);const id=await page.evaluate(()=>me.id),token=await page.evaluate(()=>sessionStorage.getItem('dementor-token'));return {context,page,id,token,name};}
async function snap(p){return p.page.evaluate(()=>JSON.parse(JSON.stringify(me)));}
async function go(p,id){const page=p.page;await page.bringToFront();await page.locator('#centerButton').click();await page.locator('#goto-'+id).click();await page.waitForFunction(id=>{const t=allTargets().find(t=>t.id===id);return t&&Math.hypot(t.x-me.x,t.y-me.y)<=state.config.actionRange&&route.length===0;},id,{timeout:30000});await page.waitForFunction(id=>context?.id===id,id,{timeout:4000});}
async function action(p){await p.page.locator('#actionButton').click();}
async function tools(p){await go(p,'tools');await action(p);await p.page.waitForFunction(()=>me.tools.axe===state.config.toolDurability&&me.tools.pick===state.config.toolDurability);}
async function harvestDeliver(p,kind,quantity){let remaining=quantity;while(remaining){const batch=Math.min(kind==='wood'?12:6,remaining),tool=kind==='wood'?'axe':'pick';if((await snap(p)).tools[tool]<batch)await tools(p);await p.page.keyboard.press(kind==='wood'?'Digit1':'Digit2');await p.page.waitForFunction(tool=>me.equipped===tool,tool);await go(p,kind+'-1');for(let i=0;i<batch;i++){const before=(await snap(p)).bag[kind];await action(p);await p.page.waitForFunction(({kind,before})=>me.bag[kind]===before+1&&!me.job,{kind,before},{timeout:5000});}
  const current=await snap(p);assert.ok(current.bag.wood+current.bag.stone*2+current.bag.food<=12);const money=current.wallet;await go(p,'project');await action(p);await p.page.waitForFunction(({money,batch,rate})=>me.wallet===money+batch*rate,{money,batch,rate:kind==='wood'?2:3});remaining-=batch;console.log(`${p.name}: ${kind} delivered ${quantity-remaining}/${quantity}`);
}}
async function work(p,n){await go(p,'build');for(let i=0;i<n;i++){const money=(await snap(p)).wallet;await action(p);await p.page.waitForFunction(money=>me.wallet===money+10&&!me.job,money,{timeout:6000});}}
async function patch(p,fields){return req('/__test',{player:p.id,patch:fields});}
async function screenshot(p,name){const file=path.join(out,name);await p.page.screenshot({path:file});report.screenshots.push(name);}
(async()=>{try{
  await start();browser=await pw.chromium.launch({channel:'chrome',headless:true});
  const a=await player('Сосед 1'),b=await player('Сосед 2');
  await a.page.waitForFunction(()=>state.players.filter(p=>p.online).length===2);
  assert.notEqual(a.id,b.id);assert.equal(await a.page.evaluate(()=>isSecureContext),false);
  report.checks.push('two distinct residents connected via LAN IPv4 in insecure HTTP browser context');
  await tools(a);await tools(b);await work(a,1);await work(b,1);
  await b.page.waitForFunction(()=>state.project.stage===1);
  await harvestDeliver(a,'wood',1);await harvestDeliver(b,'stone',1);
  await go(a,'build');await go(b,'build');
  await a.page.locator('#chatInput').fill('Строим вместе по сети');await a.page.locator('#chatInput').press('Enter');
  await b.page.waitForFunction(()=>state.chat.some(m=>m.text==='Строим вместе по сети'));
  report.checks.push('both residents move, obtain tools, contribute construction work, mine and deliver materials; shared stage and chat');
  assert.equal((await fetch(base+'/__test',{method:'POST'})).status,404);
  assert.equal((await fetch(base+'/api/join',{method:'POST',headers:{Origin:'http://foreign.invalid','Content-Type':'application/json'},body:JSON.stringify({name:'Blocked'})})).status,403);
  assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.networkErrors,[]);
  report.checks.push('test endpoint unavailable and foreign origin rejected');report.pass=true;console.log(JSON.stringify(report,null,2));
}catch(e){report.pass=false;report.error=e.stack;console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();await stop();fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports/lan.json'),JSON.stringify(report,null,2)+'\n');fs.rmSync(tmp,{recursive:true,force:true});}})();
