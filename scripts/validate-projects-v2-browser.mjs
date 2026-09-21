import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=process.cwd();
const artifact=path.join(root,'_site');
const qaDir=path.join(root,'.qa','projects-v2');
fs.mkdirSync(qaDir,{recursive:true});
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif'};

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
const widths=[1440,390,360];
const visualRoutes=new Map([
  ['/projects/','hub'],
  ['/projects/dementor-lab/','lab']
]);

for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:1000}});
  for(const route of routes){
    const page=await context.newPage();
    await page.goto(base+route,{waitUntil:'load'});
    await page.waitForSelector('.dc-global-header');
    await page.waitForTimeout(160);
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

    if(route==='/projects/'&&(width===390||width===360)){
      const headings=await page.evaluate(()=>[...document.querySelectorAll('.dc-projects-v2__territory-main h2,.dc-projects-v2__final-grid h2')].map(el=>({
        text:(el.textContent||'').trim().replace(/\s+/g,' '),
        scrollWidth:el.scrollWidth,
        clientWidth:el.clientWidth
      })));
      for(const heading of headings){
        expect(heading.scrollWidth<=heading.clientWidth+1,`${width}px Projects hub: heading clips inside its owner: ${heading.text} (${heading.scrollWidth}px > ${heading.clientWidth}px)`);
      }
    }

    if(route==='/projects/'){
      const media=await page.evaluate(()=>{
        const owner=document.querySelector('[data-project-media-state]');
        const rect=owner?.getBoundingClientRect()||null;
        const status=owner?.querySelector('.dc-projects-v2__hero-reel-status')||null;
        return {
          state:owner?.getAttribute('data-project-media-state')||null,
          visible:!!owner&&getComputedStyle(owner).display!=='none'&&rect?.width>0&&rect?.height>0,
          text:(status?.querySelector('strong')?.innerText||'').trim().replace(/\s+/g,' '),
          iframeCount:owner?.querySelectorAll('iframe').length??-1,
          videoCount:owner?.querySelectorAll('video').length??-1,
          interactiveCount:owner?.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])').length??-1,
          legacyFrame:!!document.querySelector('.dc-projects-v2__hero-reel-frame'),
          brokenSourceLinks:[...document.querySelectorAll('a[href]')].filter(a=>/dWokndhJLKQ|youtube\.com\/shorts/i.test(a.href)).length,
          width:rect?.width??0,
          height:rect?.height??0,
          viewportWidth:innerWidth,
          viewportHeight:innerHeight
        };
      });
      expect(media.state==='unavailable',`${width}px Projects hub: canonical media state must be unavailable after source verification`);
      expect(media.visible,`${width}px Projects hub: unavailable media state is not visible`);
      expect(/ФРАГМЕНТ ВРЕМЕННО НЕДОСТУПЕН/.test(media.text),`${width}px Projects hub: explicit unavailable copy missing`);
      expect(media.iframeCount===0&&media.videoCount===0,`${width}px Projects hub: unavailable state must not create iframe/video runtime`);
      expect(media.interactiveCount===0,`${width}px Projects hub: unavailable state must not expose dead keyboard-focusable media controls`);
      expect(!media.legacyFrame,`${width}px Projects hub: legacy 9:16 empty media frame survived`);
      expect(media.brokenSourceLinks===0,`${width}px Projects hub: unavailable YouTube source link survived`);
      expect(media.width<=media.viewportWidth+1,`${width}px Projects hub: media fallback exceeds viewport width`);
      expect(media.height<media.viewportHeight*.75,`${width}px Projects hub: unavailable media fallback still consumes excessive viewport height (${media.height}px)`);

      await page.reload({waitUntil:'load'});
      await page.waitForSelector('[data-project-media-state="unavailable"]');
      const reloaded=await page.evaluate(()=>({
        state:document.querySelector('[data-project-media-state]')?.getAttribute('data-project-media-state')||null,
        legacyFrame:!!document.querySelector('.dc-projects-v2__hero-reel-frame'),
        brokenSourceLinks:[...document.querySelectorAll('a[href]')].filter(a=>/dWokndhJLKQ|youtube\.com\/shorts/i.test(a.href)).length
      }));
      expect(reloaded.state==='unavailable',`${width}px Projects hub reload: media fallback state drifted`);
      expect(!reloaded.legacyFrame&&reloaded.brokenSourceLinks===0,`${width}px Projects hub reload: inert video promise returned`);
    }

    const visualName=visualRoutes.get(route);
    if(visualName){
      await page.screenshot({path:path.join(qaDir,`projects-v2-${visualName}-${width}.png`),fullPage:true});
    }
    await page.close();
  }

  for(const hash of ['#series-01','#series-03']){
    const page=await context.newPage();
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(error.message));
    await page.goto(base+'/projects/logic-awareness/'+hash,{waitUntil:'load'});
    await page.waitForSelector('.dc-global-header');
    await page.waitForTimeout(160);
    const state=await page.evaluate((hash)=>{
      const target=document.querySelector(hash);
      const top=target?.getBoundingClientRect().top??null;
      return {
        exists:!!target,
        scrollY:window.scrollY,
        top,
        absoluteTop:top===null?null:top+window.scrollY,
        hash:location.hash,
        path:location.pathname,
        readyState:document.readyState,
        seriesRuntime:window.__DC_CONTENT_SERIES_V1__===true,
        seriesScript:!!document.querySelector('script[src="/content-series-v1.js"]'),
        seriesStyle:!!document.querySelector('#dc-content-series-v1'),
        enhancedTracks:document.querySelectorAll('.dc-carousel-grid.dc-content-series').length,
        navigationType:performance.getEntriesByType?.('navigation')?.[0]?.type??null,
        scrollRestoration:history.scrollRestoration,
        documentHeight:document.documentElement.scrollHeight
      };
    },hash);
    expect(state.exists,`${width}px Logic ${hash}: target missing`);
    expect(state.hash===hash,`${width}px Logic ${hash}: fragment not preserved`);
    expect(state.scrollY>20,`${width}px Logic ${hash}: explicit hash was reset to top`);
    const landed=state.top!==null&&state.top>-80&&state.top<260;
    expect(landed,`${width}px Logic ${hash}: target not landed near viewport top (${state.top}); diagnostics=${JSON.stringify({...state,pageErrors})}`);
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
console.log('Projects v2 browser regression PASS: fresh-top + Logic hashes + history restoration + no overflow + mobile heading fit + canonical shell/routes on 1440/390/360 + BQA-21 unavailable-media fallback/reload contract. Visual evidence captured for Hub + Lab.');