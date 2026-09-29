import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/, ''));
  if(!full.startsWith(path.resolve(artifact)+path.sep)&&full!==path.resolve(artifact))return null;
  return full;
}

const authStub=`
<script>
window.DEMENTOR_SUPABASE_CLIENT={
  auth:{
    getSession:async()=>({data:{session:null},error:null}),
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    signInWithOAuth:async()=>({data:{},error:null})
  },
  from:()=>({select(){return this},eq(){return this},maybeSingle:async()=>({data:null,error:null}),then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}})
};
</script>`;

const earlyHtml=`<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>GlobalHeader early body QA</title>
<link rel="stylesheet" href="/global-header.css">
${authStub}
<script>
window.__QA_GLOBAL_HEADER_STAGES__=[];
addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    document.body?.remove();
    window.__QA_GLOBAL_HEADER_STAGES__.push({stage:'body-removed',bodyNull:document.body===null,readyState:document.readyState});
    const script=document.createElement('script');
    script.src='/global-header.js';
    script.onload=()=>{
      window.__QA_GLOBAL_HEADER_STAGES__.push({stage:'header-runtime-loaded',bodyNull:document.body===null,readyState:document.readyState});
      setTimeout(()=>{
        const body=document.createElement('body');
        body.innerHTML='<main id="qaMain">BODY READY</main>';
        document.documentElement.appendChild(body);
        window.__QA_GLOBAL_HEADER_STAGES__.push({stage:'body-restored',bodyNull:document.body===null,readyState:document.readyState});
      },0);
    };
    document.head.appendChild(script);
  },0);
},{once:true});
</script>
</head>
<body><main>SEED BODY</main></body>
</html>`;

const ordinaryHtml=`<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>GlobalHeader ordinary QA</title>
${authStub}
<script src="/global-header.js"></script>
<link rel="stylesheet" href="/global-header.css">
</head>
<body><main id="qaMain">ORDINARY BODY</main></body>
</html>`;

const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url||'/','http://local').pathname;
  if(pathname==='/__qa_global_header_early__/'){
    res.statusCode=200;res.setHeader('content-type','text/html; charset=utf-8');res.end(earlyHtml);return;
  }
  if(pathname==='/__qa_global_header_ordinary__/'){
    res.statusCode=200;res.setHeader('content-type','text/html; charset=utf-8');res.end(ordinaryHtml);return;
  }
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.statusCode=200;
  res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');
  res.end(fs.readFileSync(file));
});

await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

async function injectHeaderAgain(page){
  await page.evaluate(()=>new Promise((resolve,reject)=>{
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const script=document.createElement('script');
    script.src='/global-header.js?qa-repeat=1';
    script.onload=resolve;
    script.onerror=()=>reject(new Error('repeat global-header.js load failed'));
    document.head.appendChild(script);
  }));
}

try{
  for(const width of [1280,390,360]){
    const context=await browser.newContext({viewport:{width,height:844}});
    const page=await context.newPage();
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(error.message));

    await page.goto(base+'/__qa_global_header_early__/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.body!==null&&document.querySelectorAll('header.dc-global-header').length===1,{timeout:5000});
    await page.waitForFunction(()=>document.querySelector('.dc-global-header')?.dataset.dcHeaderAuth==='guest',{timeout:5000});

    const stages=await page.evaluate(()=>globalThis.__QA_GLOBAL_HEADER_STAGES__||[]);
    const loaded=stages.find(stage=>stage.stage==='header-runtime-loaded');
    expect(Boolean(loaded),'early-body: runtime-load stage missing at '+width);
    expect(loaded?.bodyNull===true,'early-body: global-header.js did not execute while body was null at '+width);
    expect(loaded?.readyState!=='loading','early-body: regression did not exercise non-loading document state at '+width);
    expect(pageErrors.length===0,'early-body '+width+': page errors: '+pageErrors.join(' | '));
    expect(await page.locator('header.dc-global-header').count()===1,'early-body '+width+': canonical Header count is not exactly one');

    if(width<=900){
      const menu=page.locator('.dc-global-menu');
      await menu.waitFor({state:'visible',timeout:3000});
      await menu.click();
      await page.locator('#dc-global-nav').waitFor({state:'visible',timeout:3000});
      expect((await menu.getAttribute('aria-expanded'))==='true','early-body '+width+': mobile burger did not open');
    }else{
      expect(await page.locator('.dc-global-menu').isHidden(),'early-body desktop: mobile burger unexpectedly visible');
    }

    await injectHeaderAgain(page);
    await page.waitForTimeout(50);
    expect(await page.locator('header.dc-global-header').count()===1,'early-body '+width+': repeated DOM-ready/runtime invocation duplicated Header');
    expect((await page.evaluate(()=>document.documentElement.dataset.dcGlobalHeader))==='1','early-body '+width+': canonical idempotency marker missing');

    await context.close();
  }

  {
    const context=await browser.newContext({viewport:{width:1280,height:844}});
    const page=await context.newPage();
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(error.message));
    await page.goto(base+'/__qa_global_header_ordinary__/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('.dc-global-header')?.dataset.dcHeaderAuth==='guest',{timeout:5000});
    expect(await page.locator('header.dc-global-header').count()===1,'ordinary boot: canonical Header count is not exactly one');
    await injectHeaderAgain(page);
    await page.waitForTimeout(50);
    expect(await page.locator('header.dc-global-header').count()===1,'ordinary boot: repeated runtime invocation duplicated Header');
    expect(pageErrors.length===0,'ordinary boot: page errors: '+pageErrors.join(' | '));
    await context.close();
  }
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}

if(errors.length){
  console.error('GLOBAL HEADER BOOTSTRAP STABILITY BLOCKED');
  for(const error of errors)console.error('- '+error);
  process.exit(1);
}
console.log('Global Header bootstrap stability PASS');
console.log('✓ early-body request waits once for body and then executes canonical boot');
console.log('✓ desktop / 390 / 360 early-body regression PASS');
console.log('✓ mobile burger remains functional at 390 / 360');
console.log('✓ ordinary boot + repeated DOM-ready/runtime invocation keeps exactly one canonical Header');
