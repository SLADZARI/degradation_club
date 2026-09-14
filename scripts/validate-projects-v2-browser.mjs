import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=process.cwd();
const artifact=path.join(root,'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
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
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const routes=[
  '/projects/',
  '/projects/logic-awareness/',
  '/projects/dementor-lab/',
  '/projects/dementor-battle/',
  '/projects/dementor-robo-games/'
];
const widths=[1440,390];

for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:1000}});
  for(const route of routes){
    const page=await context.newPage();
    await page.goto(base+route,{waitUntil:'load'});
    await page.waitForSelector('.dc-global-header');
    await page.waitForTimeout(120);
    const state=await page.evaluate(()=>({
      scrollY:window.scrollY,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      header:!!document.querySelector('.dc-global-header'),
      path:location.pathname
    }));
    expect(state.path===route,`${width}px ${route}: canonical path changed to ${state.path}`);
    expect(Math.abs(state.scrollY)<=2,`${width}px ${route}: fresh non-hash navigation must start at top, scrollY=${state.scrollY}`);
    expect(state.overflow<=1,`${width}px ${route}: horizontal overflow ${state.overflow}px`);
    expect(state.header,`${width}px ${route}: canonical public Header missing`);
    await page.close();
  }

  for(const hash of ['#series-01','#series-03']){
    const page=await context.newPage();
    await page.goto(base+'/projects/logic-awareness/'+hash,{waitUntil:'load'});
    await page.waitForSelector('.dc-global-header');
    await page.waitForTimeout(160);
    const state=await page.evaluate((hash)=>{
      const target=document.querySelector(hash);
      return {exists:!!target,scrollY:window.scrollY,top:target?.getBoundingClientRect().top??null,hash:location.hash};
    },hash);
    expect(state.exists,`${width}px Logic ${hash}: target missing`);
    expect(state.hash===hash,`${width}px Logic ${hash}: fragment not preserved`);
    expect(state.scrollY>20,`${width}px Logic ${hash}: explicit hash was reset to top`);
    expect(state.top!==null&&state.top>-80&&state.top<260,`${width}px Logic ${hash}: target not landed near viewport top (${state.top})`);
    await page.close();
  }

  const history=await context.newPage();
  await history.goto(base+'/projects/',{waitUntil:'load'});
  await history.waitForSelector('.dc-global-header');
  await history.evaluate(()=>scrollTo(0,Math.min(900,document.documentElement.scrollHeight-innerHeight-10)));
  const before=await history.evaluate(()=>scrollY);
  await history.goto(base+'/projects/dementor-lab/',{waitUntil:'load'});
  await history.goBack({waitUntil:'load'});
  await history.waitForSelector('.dc-global-header');
  await history.waitForTimeout(160);
  const afterBack=await history.evaluate(()=>({path:location.pathname,y:scrollY,restoration:history.scrollRestoration}));
  expect(afterBack.path==='/projects/',`${width}px history: Back did not return to Projects`);
  expect(afterBack.restoration!=='manual',`${width}px history: page globally disables browser scroll restoration`);
  if(before>100)expect(afterBack.y>20,`${width}px history: Back position was indiscriminately forced to top (before=${before}, after=${afterBack.y})`);
  await history.close();
  await context.close();
}

const hub=await browser.newPage({viewport:{width:1440,height:1000}});
await hub.goto(base+'/projects/',{waitUntil:'load'});
await hub.waitForSelector('.dc-global-header');
const links=await hub.evaluate(()=>Object.fromEntries([...document.querySelectorAll('a[href]')].map(a=>[(a.textContent||'').trim().replace(/\s+/g,' '),a.getAttribute('href')])));
expect(links['ОТКРЫТЬ DEMENTOR LAB →']==='/projects/dementor-lab/','Projects hub: Lab CTA must use canonical Lab slug');
expect(links['ОТКРЫТЬ ПРОЕКТ →']==='/projects/logic-awareness/','Projects hub: Logic CTA must use canonical Logic slug');
expect(Object.entries(links).some(([label,href])=>label==='ОБСУДИТЬ НА BOARD →'&&href==='/workspace/board/'),'Projects hub: development projects must bridge to canonical Board');
await hub.close();

await browser.close();
await new Promise(resolve=>server.close(resolve));

if(errors.length){
  console.error('PROJECTS V2 BROWSER REGRESSION BLOCKED');
  for(const e of errors)console.error(`- ${e}`);
  process.exit(1);
}
console.log('Projects v2 browser regression PASS: fresh-top + Logic hashes + history restoration + no overflow + canonical shell/routes on 1440/390.');