import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const rel=pathname.replace(/^\/+/, '');
  const full=path.resolve(artifact,rel);
  if(!full.startsWith(path.resolve(artifact)+path.sep)&&full!==path.resolve(artifact))return null;
  return full;
}

const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    const fallback=path.join(artifact,'404.html');
    res.statusCode=404;res.setHeader('content-type','text/html; charset=utf-8');res.end(fs.existsSync(fallback)?fs.readFileSync(fallback):'Not found');return;
  }
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const base=`http://127.0.0.1:${port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=(mode='guest')=>{
  const authenticated=mode!=='guest';
  const owner=mode==='owner';
  return `
    const user={id:'qa-browser-user',email:'qa-browser@dementor.invalid',user_metadata:{full_name:'QA Browser'}};
    const session=${authenticated?'{user}':'null'};
    const query=(table)=>{const chain={select(){return chain},eq(){return chain},in(){return chain},order(){return chain},limit(){return chain},maybeSingle(){return Promise.resolve({data:null,error:null})},then(resolve,reject){let data=[];if(table==='dc_role_assignments')data=${owner?"[{role:'owner_admin',status:'active',valid_from:null,valid_to:null}]":"[]"};return Promise.resolve({data,error:null}).then(resolve,reject)}};return chain;};
    export function createClient(){return {auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signInWithOAuth:async()=>({error:null}),signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query};}
  `;
};

async function newContext(mode='guest'){
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('https://cdn.jsdelivr.net/**',route=>{
    const url=route.request().url();
    if(url.includes('@supabase/supabase-js'))return route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub(mode)});
    return route.abort();
  });
  return context;
}

async function checkPublicShell(route){
  const context=await newContext('guest');
  const page=await context.newPage();
  const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
  const badResponses=[];page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))badResponses.push(`${response.status()} ${new URL(response.url()).pathname}`)});
  await page.goto(base+route,{waitUntil:'domcontentloaded'});
  try{
    await page.locator('.dc-global-header').waitFor({state:'visible',timeout:3000});
    await page.locator('.dc-global-footer').waitFor({state:'visible',timeout:3000});
  }catch{
    const diag=await page.evaluate(()=>({ready:document.readyState,dataset:document.documentElement.dataset.dcGlobalHeader||'',headers:[...document.querySelectorAll('header')].map(x=>x.className),scripts:[...document.scripts].map(x=>x.getAttribute('src')).filter(Boolean)}));
    errors.push(`${route}: canonical shell did not boot; ready=${diag.ready}; dataset=${diag.dataset||'unset'}; headers=${diag.headers.join(',')||'none'}; pageErrors=${pageErrors.join(' | ')||'none'}; badResponses=${badResponses.join(' | ')||'none'}; scripts=${diag.scripts.join(',')}`);
    await context.close();return;
  }
  await page.waitForTimeout(150);
  expect(await page.locator('.dc-global-header').count()===1,`${route}: expected exactly one canonical header`);
  expect(await page.locator('header.topbar').count()===0,`${route}: legacy topbar exists in browser DOM`);
  expect(await page.locator('.dc-global-footer').count()===1,`${route}: expected exactly one canonical footer`);
  expect(await page.locator('.dc-utility-strip').count()===0,`${route}: legacy utility strip exists beside canonical footer`);
  const labels=(await page.locator('#dc-global-nav > a').allTextContents()).map(v=>v.trim());
  expect(JSON.stringify(labels)===JSON.stringify(['Club','Events','Projects','Community','Merch','Archive','Join','Account']),`${route}: header route labels drifted: ${labels.join(' / ')}`);
  const footerStyle=await page.locator('.dc-global-footer').evaluate(el=>({display:getComputedStyle(el).display,width:el.getBoundingClientRect().width,viewport:innerWidth}));
  expect(footerStyle.display==='block',`${route}: canonical footer display is ${footerStyle.display}, legacy geometry leaked`);
  expect(footerStyle.width>=footerStyle.viewport*.98,`${route}: canonical footer does not span viewport (${footerStyle.width}/${footerStyle.viewport})`);
  expect(!pageErrors.some(e=>/Cannot set properties of null/i.test(e)),`${route}: null DOM runtime error: ${pageErrors.join(' | ')}`);
  await context.close();
}

for(const route of ['/','/about/','/projects/','/community/','/merch/','/archive/','/join/'])await checkPublicShell(route);

{
  const context=await newContext('guest');const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});
  try{await page.getByRole('button',{name:'ВОЙТИ ЧЕРЕЗ GOOGLE'}).waitFor({state:'visible',timeout:4000});}catch{errors.push(`/workspace/: guest login gate did not render; errors=${pageErrors.join(' | ')||'none'}`);}
  expect(await page.locator('#sessionBox').count()===1,'/workspace/: #sessionBox compatibility host missing in browser DOM');
  expect(await page.locator('[data-work-nav]').count()===1,'/workspace/: data-work-nav compatibility host missing in browser DOM');
  expect(await page.locator('.dc-global-header').count()===0,'/workspace/: PublicShell header leaked into guest Workspace');
  expect(!pageErrors.length,`/workspace/ guest recovery produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

{
  const context=await newContext('member');const page=await context.newPage();
  const pageErrors=[];const badResponses=[];const failedRequests=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))badResponses.push(`${response.status()} ${new URL(response.url()).pathname}`)});
  page.on('requestfailed',request=>failedRequests.push(`${request.url()} :: ${request.failure()?.errorText||'failed'}`));
  await page.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1200);
  expect(await page.locator('.dc-global-header').count()===0,'/workspace/: PublicShell header leaked into authenticated Workspace');
  const activityCount=await page.locator('[data-route="activity"]').count();
  if(activityCount===0){
    const diag=await page.evaluate(()=>({
      shellDataset:document.querySelector('[data-workspace-sidebar]')?.dataset.dcWorkspaceShell||'',
      sidebar:document.querySelector('[data-workspace-sidebar]')?.innerHTML||'',
      appText:document.querySelector('#appView')?.innerText||'',
      scripts:[...document.scripts].map(x=>x.getAttribute('src')).filter(Boolean),
      config:Boolean(window.DEMENTOR_SITE_CONFIG),
      ready:document.readyState
    }));
    errors.push(`/workspace/: authenticated shell/controller did not expose MY ACTIVITY; shellDataset=${diag.shellDataset||'unset'}; config=${diag.config}; ready=${diag.ready}; appText=${diag.appText.slice(0,240).replace(/\s+/g,' ')}; sidebar=${diag.sidebar.slice(0,240).replace(/\s+/g,' ')}; pageErrors=${pageErrors.join(' | ')||'none'}; badResponses=${badResponses.join(' | ')||'none'}; failedRequests=${failedRequests.join(' | ')||'none'}; scripts=${diag.scripts.join(',')}`);
  }else{
    try{
      await page.locator('[data-route="activity"]').first().click({timeout:4000});
      await page.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY ACTIVITY',null,{timeout:4000});
      expect((await page.locator('#appView').innerText()).includes('Моя активность'),'Workspace Activity did not render');
      expect(new URL(page.url()).hash==='#activity',`Workspace Activity URL state is ${new URL(page.url()).hash||'empty'}`);
      await page.locator('[data-route="club"]').first().click({timeout:4000});
      await page.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY CLUB',null,{timeout:4000});
      expect((await page.locator('#appView').innerText()).includes('Мой клуб'),'Workspace My Club did not render');
      expect(new URL(page.url()).hash==='#club',`Workspace My Club URL state is ${new URL(page.url()).hash||'empty'}`);
    }catch(error){
      const diag=await page.evaluate(()=>({title:document.querySelector('#topTitle')?.textContent||'',hash:location.hash,appText:document.querySelector('#appView')?.innerText||'',sidebar:document.querySelector('[data-workspace-sidebar]')?.innerText||''}));
      errors.push(`/workspace/: controller-owned route transition failed: ${error.message}; title=${diag.title}; hash=${diag.hash}; appText=${diag.appText.slice(0,220).replace(/\s+/g,' ')}; sidebar=${diag.sidebar.slice(0,220).replace(/\s+/g,' ')}`);
    }
  }
  expect(!pageErrors.length,`/workspace/ authenticated navigation produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

{
  const context=await newContext('member');const page=await context.newPage();
  await page.route('**/community/board/board.js',route=>route.fulfill({status:200,contentType:'text/javascript',body:''}));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  expect(await page.locator('[data-workspace-sidebar]').count()===1,'/workspace/board/: Workspace sidebar missing');
  expect(await page.locator('#boardHost').count()===1,'/workspace/board/: Board content host missing');
  expect(await page.locator('.dc-global-header').count()===0,'/workspace/board/: PublicShell header leaked into Workspace Board');
  expect(new URL(page.url()).pathname==='/workspace/board/','/workspace/board/: route escaped Workspace shell');
  await context.close();
}

{
  const context=await newContext('owner');await context.route('**/workspace/admin/owner-admin-access-v1.js',route=>route.fulfill({status:200,contentType:'text/javascript',body:'document.documentElement.dataset.dcOwnerAdmin="1";'}));
  const page=await context.newPage();await page.goto(base+'/workspace/admin/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(150);
  expect(await page.locator('.dc-global-header').count()===0,'/workspace/admin/: PublicShell header leaked into Admin Workspace');
  const layout=await page.locator('.dcw-app').evaluate(el=>({display:getComputedStyle(el).display,columns:getComputedStyle(el).gridTemplateColumns}));
  expect(layout.display==='grid',`/workspace/admin/: Workspace app display is ${layout.display}, layout CSS missing`);
  expect(layout.columns&&layout.columns!=='none',`/workspace/admin/: grid columns missing (${layout.columns})`);
  expect(await page.locator('.dca-tools').evaluate(el=>getComputedStyle(el).display)==='grid','/workspace/admin/: tool cards are not a grid');
  await context.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('BROWSER SHELL SMOKE BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Browser shell smoke PASS: canonical PublicShell + isolated guest/auth Workspace + Board + Admin layout');
