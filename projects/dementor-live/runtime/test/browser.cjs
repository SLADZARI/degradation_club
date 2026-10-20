// Browser QA needs an installed Chrome and Playwright; the game itself has no npm dependencies.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
let pw;for(const modulePath of [process.env.DEMENTOR_PLAYWRIGHT_MODULE,'playwright',path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)){try{pw=require(modulePath);break;}catch{}}
if(!pw)throw Error('Для browser QA укажи DEMENTOR_PLAYWRIGHT_MODULE, путь к установленному Playwright. Для игры он не нужен.');
const root=path.dirname(__dirname),out=path.dirname(root),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-browser-')),port=Number(process.env.DEMENTOR_BROWSER_PORT||4179),base=`http://127.0.0.1:${port}`;
const report={scope:'two independent Chrome contexts; full resource/plot flow through UI; isolated fixtures only for focused hunger/race tests',checks:[],consoleErrors:[],networkErrors:[],screenshots:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let server,browser,seq=0;
async function req(route,body,token){const response=await fetch(base+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(route==='/__test'?{'x-test-key':'local-integration-tests'}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.ok(response.ok,`HTTP ${response.status} ${route}`);return response.json();}
async function start(){server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(tmp,'world.json')},stdio:['ignore','pipe','pipe']});let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);for(let i=0;i<60;i++){try{if((await fetch(base+'/api/health')).ok)return;}catch{}if(server.exitCode!==null)throw Error(logs);await sleep(100);}throw Error('Server startup: '+logs);}
async function stop(){if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}}
async function player(name,mobile=false){const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:960},deviceScaleFactor:1});const page=await context.newPage();page.on('pageerror',e=>report.consoleErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});page.on('requestfailed',r=>{if(!r.url().includes('/api/events')&&!r.failure()?.errorText?.includes('ABORTED'))report.networkErrors.push(r.url()+': '+r.failure()?.errorText);});await page.goto(base);await page.getByLabel('Как тебя зовут?').fill(name);await page.getByRole('button',{name:'Войти в мир'}).click();await page.waitForFunction(()=>typeof me!=='undefined'&&me&&connected);const id=await page.evaluate(()=>me.id),token=await page.evaluate(()=>sessionStorage.getItem('dementor-token'));return {context,page,id,token,name};}
async function snap(p){return p.page.evaluate(()=>JSON.parse(JSON.stringify(me)));}
async function go(p,id){
 const page=p.page;console.log('NAVIGATE',p.name,id);
 await page.bringToFront();
 await page.locator('#centerButton').click();
 await page.locator('#goto-'+id).click();
 try{
  await page.waitForFunction(id=>{const t=allTargets().find(t=>t.id===id);return t&&Math.hypot(t.x-me.x,t.y-me.y)<=state.config.actionRange&&route.length===0;},id,{timeout:30000});
  await page.waitForFunction(id=>context?.id===id,id,{timeout:4000});
 }catch(error){
  const details=await page.evaluate(id=>{
   const t=allTargets().find(t=>t.id===id);
   return {target:id,targetExists:!!t,coordinates:t&&{x:t.x,y:t.y},position:{x:me.x,y:me.y},distance:t?Math.hypot(t.x-me.x,t.y-me.y):null,
    routeLength:route.length,routePreview:route.slice(0,6),context,selected,
    notification:document.getElementById('toast')?.textContent,scene:state.scene,
    navigationAlternative:t?[[0,1.4],[-1.4,0],[1.4,0],[0,-1.4]].map(([dx,dy])=>findPath({x:t.x+dx,y:t.y+dy})?.length||0):[]};
  },id);
  console.error('LEGACY_FULL_BROWSER_NAVIGATION_FAILURE',JSON.stringify({player:p.name,...details}));
  throw error;
 }
}
async function action(p){
 const isMobile=await p.page.evaluate(()=>innerWidth<760&&getComputedStyle(document.getElementById('mobileActionButton')).display!=='none');
 await p.page.locator(isMobile?'#mobileActionButton':'#actionButton').click();
}
async function purchaseEstate(p,id){
  await go(p,id);
  await action(p);
  const dialog=p.page.locator('#cityPanel[open]');
  await dialog.waitFor({state:'visible'});
  assert.match(await p.page.locator('#cityPanelTitle').innerText(),/Земл|участ|Имуществ|Недвижим/i,'Action should open current estate panel');
  const buy=p.page.locator('#estate-buy');
  await buy.waitFor({state:'visible'});
  assert.equal(await buy.isEnabled(),true,'Estate purchase not available for this player');
  await buy.click();
  await p.page.waitForFunction(id=>state.plots.find(x=>x.id===id)?.owner===me.id,id);
  await p.page.locator('[data-close="cityPanel"]').click();
}
async function tools(p){await go(p,'tools');await action(p);await p.page.waitForFunction(()=>me.tools.axe===state.config.toolDurability&&me.tools.pick===state.config.toolDurability);}
async function harvestDeliver(p,kind,quantity,forge=false){let remaining=quantity;while(remaining){const batch=Math.min(kind==='wood'?12:6,remaining),tool=kind==='wood'?'axe':'pick';if((await snap(p)).tools[tool]<batch)await tools(p);await p.page.keyboard.press(kind==='wood'?'Digit1':'Digit2');await p.page.waitForFunction(tool=>me.equipped===tool,tool);await go(p,kind+(forge?'-2':'-1'));for(let i=0;i<batch;i++){const before=(await snap(p)).bag[kind];await action(p);await p.page.waitForFunction(({kind,before})=>me.bag[kind]===before+1&&!me.job,{kind,before},{timeout:5000});}
  const current=await snap(p);assert.ok(current.bag.wood+current.bag.stone*2+current.bag.food<=12);const money=current.wallet;await go(p,forge?'forge-drop':'project');await action(p);await p.page.waitForFunction(({money,batch,rate})=>me.wallet===money+batch*rate,{money,batch,rate:kind==='wood'?2:3});remaining-=batch;console.log(`${p.name}: ${kind} delivered ${quantity-remaining}/${quantity}`);
}}
async function work(p,n,target='build'){await go(p,target);for(let i=0;i<n;i++){const money=(await snap(p)).wallet;await action(p);await p.page.waitForFunction(money=>me.wallet===money+10&&!me.job,money,{timeout:6000});}}
async function patch(p,fields){return req('/__test',{player:p.id,patch:fields});}
async function screenshot(p,name){const file=path.join(out,name);await p.page.screenshot({path:file});report.screenshots.push(name);}
(async()=>{try{
  await start();browser=await pw.chromium.launch({channel:process.env.DEMENTOR_BROWSER_CHANNEL||'chrome',headless:true});const a=await player('Лист'),b=await player('Крафт');await a.page.waitForFunction(()=>state.players.filter(p=>p.online).length===2);assert.equal((await snap(a)).wallet,0);assert.notEqual(a.id,b.id);report.checks.push('two independent browser clients, distinct identities, shared visible positions');
  await screenshot(a,'dementor-live-ui.png');await tools(a);await tools(b);await work(a,2);
  await harvestDeliver(a,'wood',20);await harvestDeliver(a,'stone',20);await harvestDeliver(b,'wood',20);await harvestDeliver(b,'stone',20);report.checks.push('real UI movement, free tools, wood/stone extraction, changing durability/replacement, cargo, physical delivery and individual immediate pay');
  await work(b,4);await work(b,1);await go(a,'build');await go(b,'build');const before=(await snap(a)).wallet+(await snap(b)).wallet;await Promise.all([action(a),action(b)]);await a.page.waitForFunction(()=>state.project.stage===3);await b.page.waitForFunction(()=>state.project.stage===3);assert.equal((await snap(a)).wallet+(await snap(b)).wallet,before+10);report.checks.push('simultaneous final work: one payment and one stage completion');
  const project=await a.page.evaluate(()=>state.project);assert.deepEqual(project.stock,{wood:0,stone:0});assert.deepEqual(project.consumed,{wood:40,stone:40});assert.equal(project.spent,280);
  await purchaseEstate(a,'plot-1');await purchaseEstate(b,'plot-2');assert.equal((await snap(a)).wallet+(await snap(b)).wallet,40);assert.equal(await a.page.evaluate(()=>state.treasury),960);report.checks.push('square completed, all materials consumed, two earned plot purchases, conserved money');
  await a.page.locator('#chatInput').fill('Мы построили площадь!');await a.page.locator('#chatInput').press('Enter');await b.page.waitForFunction(()=>state.chat.some(m=>m.text==='Мы построили площадь!'));report.checks.push('local chat between real browser clients');
  await screenshot(a,'dementor-live-completed.png');const saved=await snap(a);await a.page.reload();await a.page.waitForFunction(()=>me&&connected);assert.equal((await snap(a)).id,saved.id);assert.equal((await snap(a)).wallet,saved.wallet);assert.equal(await a.page.evaluate(()=>state.plots[0].owner===me.id),true);report.checks.push('actual browser reload retains identity, wallet and owned plot');
  for(const p of [a,b]){await harvestDeliver(p,'wood',12,true);await harvestDeliver(p,'stone',12,true);}
  await work(a,2,'forge-build');await work(b,3,'forge-build');await work(a,1,'forge-build');
  await go(a,'forge-build');await go(b,'forge-build');const forgeBefore=(await snap(a)).wallet+(await snap(b)).wallet;
  await Promise.all([action(a),action(b)]);await a.page.waitForFunction(()=>state.forge.stage===3);await b.page.waitForFunction(()=>state.forge.stage===3);
  assert.equal((await snap(a)).wallet+(await snap(b)).wallet,forgeBefore+10);
  assert.deepEqual(await a.page.evaluate(()=>state.forge.consumed),{wood:24,stone:24});
  await screenshot(a,'dementor-live-forge.png');report.checks.push('both residents build forge through full UI resource chain; stages, consumed materials and single final payout');
  await patch(b,{hunger:.001,health:100,x:8,y:8});await b.page.waitForFunction(()=>me.spirit);const rejected=await b.page.evaluate(()=>api('action',{type:'build',target:'build',requestId:crypto.randomUUID()}));assert.equal(rejected.ok,false);await go(b,'food-1');await action(b);await b.page.waitForFunction(()=>!me.spirit&&me.hunger>50);report.checks.push('online hunger creates spirit; work rejected; self-recovery via actual bush UI');
  await go(a,'food-1');await action(a);await a.page.waitForFunction(()=>me.bag.food>0);await patch(b,{spirit:true,hunger:0,health:0,x:8,y:8});
 await b.page.waitForFunction(()=>me.spirit);
 // Wait for the second player's new location to reach the FIRST client's SSE
 // snapshot before routing toward them. An old target position is not a valid
 // recipient for a proximity-based social action.
 await a.page.waitForFunction(id=>{
  const other=state.players.find(p=>p.id===id);
  return other&&other.spirit&&Math.hypot(other.x-8,other.y-8)<.15;
 },b.id,{timeout:6000});
 await go(a,b.id);
 await a.page.waitForFunction(id=>{
  const other=state.players.find(p=>p.id===id);
  return other&&Math.hypot(me.x-other.x,me.y-other.y)<=state.config.actionRange;
 },b.id,{timeout:5000});
 await a.page.evaluate(id=>{selected=id;updateContext();},b.id);
 await action(a);
 await a.page.locator('#cityPanel[open]').waitFor({state:'visible'});
 await a.page.getByRole('button',{name:'🫐 Накормить',exact:true}).click();await a.page.locator('[data-close="cityPanel"]').click();await b.page.waitForFunction(()=>!me.spirit);report.checks.push('actual UI food assistance from other player');
  await b.page.goto('about:blank');await sleep(200);const offBefore=await req('/api/state',null,b.token);const offHunger=offBefore.players.find(p=>p.id===b.id).hunger;await req('/__test',{advanceMs:5000});const offAfter=await req('/api/state',null,b.token);assert.equal(offAfter.players.find(p=>p.id===b.id).hunger,offHunger);await b.page.goto(base);await b.page.waitForFunction(()=>me&&connected);report.checks.push('real client disconnect pauses hunger; reconnect resumes same identity');
  await req('/__test',{resources:[{id:'wood-3',stock:1}]});for(const p of [a,b])await patch(p,{x:28,y:7,spirit:false,hunger:100,bag:{wood:0,stone:0,food:0},tools:{axe:1,pick:1},equipped:'axe'});await Promise.all([req('/api/action',{type:'mine',target:'wood-3',requestId:'race-'+(++seq)},a.token),req('/api/action',{type:'mine',target:'wood-3',requestId:'race-'+(++seq)},b.token)]);await req('/__test',{advanceMs:551});let sa=await req('/api/state',null,a.token),sb=await req('/api/state',null,b.token);assert.equal(sa.players.find(p=>p.id===a.id).bag.wood+sb.players.find(p=>p.id===b.id).bag.wood,1);report.checks.push('concurrent last physical resource across browser identities: no duplication (isolated fixture)');
  await patch(a,{x:33.6,y:13});await a.page.waitForFunction(()=>me.x>33);await a.page.keyboard.down('KeyD');await sleep(700);await a.page.keyboard.up('KeyD');assert.ok((await snap(a)).x<34);report.checks.push('real keyboard movement cannot cross river at planned bridge');
  const mobile=await player('Росток',true);await screenshot(mobile,'dementor-live-mobile.png');assert.equal(await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await tools(mobile);report.checks.push('390px mobile UI renders and tool action works');await mobile.context.close();
  await a.context.close();await b.context.close();await stop();await start();const restored=await req('/api/state',null,a.token);assert.equal(restored.project.stage,3);assert.equal(restored.forge.stage,3);assert.equal(restored.plots[0].owner,a.id);assert.equal(restored.plots[1].owner,b.id);report.checks.push('actual server process restart retains completed project and both plot owners');
  assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.networkErrors,[]);report.pass=true;console.log(JSON.stringify(report,null,2));
}catch(e){report.pass=false;report.error=e.stack;console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();await stop();fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports/browser.json'),JSON.stringify(report,null,2)+'\n');fs.rmSync(tmp,{recursive:true,force:true});}})();
