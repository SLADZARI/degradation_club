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
        const frame=owner?.querySelector('.dc-projects-v2__hero-reel-frame')||null;
        const iframe=frame?.querySelector('iframe')||null;
        const fallback=frame?.querySelector('.dc-projects-v2__hero-reel-fallback')||null;
        const open=owner?.querySelector('.dc-projects-v2__hero-reel-label a[href]')||null;
        const rect=frame?.getBoundingClientRect()||null;
        const src=iframe?.getAttribute('src')||'';
        const url=src?new URL(src,location.href):null;
        const style=fallback?getComputedStyle(fallback):null;
        return {
          state:owner?.getAttribute('data-project-media-state')||null,
          ownerVisible:!!owner&&getComputedStyle(owner).display!=='none',
          frameVisible:!!frame&&rect?.width>0&&rect?.height>0,
          iframeCount:owner?.querySelectorAll('iframe').length??-1,
          videoCount:owner?.querySelectorAll('video').length??-1,
          src,
          origin:url?.origin||null,
          path:url?.pathname||null,
          autoplay:url?.searchParams.get('autoplay'),
          mute:url?.searchParams.get('mute'),
          playsinline:url?.searchParams.get('playsinline'),
          loop:url?.searchParams.get('loop'),
          playlist:url?.searchParams.get('playlist'),
          controls:url?.searchParams.get('controls'),
          iframeTitle:iframe?.getAttribute('title')||'',
          iframeAllow:iframe?.getAttribute('allow')||'',
          externalHref:open?.href||null,
          externalTarget:open?.getAttribute('target')||null,
          externalRel:open?.getAttribute('rel')||'',
          externalText:(open?.innerText||'').trim().replace(/\s+/g,' '),
          unavailableCopy:/ФРАГМЕНТ\s+ВРЕМЕННО\s+НЕДОСТУПЕН|Источник видео больше не воспроизводится/i.test(owner?.innerText||''),
          fallbackVisible:!!fallback&&style?.display!=='none',
          fallbackBackground:style?.backgroundColor||null,
          width:rect?.width??0,
          height:rect?.height??0,
          viewportWidth:innerWidth
        };
      });
      expect(media.state==='video',`${width}px Projects hub: canonical media state must be video`);
      expect(media.ownerVisible&&media.frameVisible,`${width}px Projects hub: video owner/frame is not visible`);
      expect(media.iframeCount===1&&media.videoCount===0,`${width}px Projects hub: expected one canonical iframe and no parallel video runtime`);
      expect(media.origin==='https://www.youtube-nocookie.com'&&media.path==='/embed/dWokndhJLKQ',`${width}px Projects hub: privacy-respecting YouTube embed source drifted (${media.src})`);
      expect(media.autoplay==='1'&&media.mute==='1'&&media.playsinline==='1'&&media.loop==='1'&&media.playlist==='dWokndhJLKQ',`${width}px Projects hub: autoplay/mute/playsinline/loop contract drifted`);
      expect(media.controls==='1',`${width}px Projects hub: iframe controls must remain available when autoplay is blocked`);
      expect(/autoplay/.test(media.iframeAllow),`${width}px Projects hub: iframe allow contract must include autoplay`);
      expect(media.iframeTitle.length>8,`${width}px Projects hub: iframe accessible title missing`);
      expect(media.externalHref==='https://www.youtube.com/shorts/dWokndhJLKQ',`${width}px Projects hub: manual external playback fallback drifted`);
      expect(media.externalTarget==='_blank'&&/noopener/.test(media.externalRel)&&/noreferrer/.test(media.externalRel),`${width}px Projects hub: external playback fallback security contract drifted`);
      expect(/ОТКРЫТЬ ВИДЕО/.test(media.externalText),`${width}px Projects hub: visible manual playback affordance missing`);
      expect(!media.unavailableCopy,`${width}px Projects hub: owner-rejected unavailable message survived`);
      expect(media.fallbackVisible,`${width}px Projects hub: non-black fallback layer missing behind iframe`);
      expect(media.width<=media.viewportWidth+1,`${width}px Projects hub: video frame exceeds viewport width`);
      const ratio=media.width&&media.height?media.width/media.height:0;
      expect(Math.abs(ratio-(9/16))<0.03,`${width}px Projects hub: video frame must stay 9:16, got ${ratio.toFixed(3)}`);

      await page.reload({waitUntil:'load'});
      await page.waitForSelector('[data-project-media-state="video"] iframe');
      const reloaded=await page.evaluate(()=>({
        state:document.querySelector('[data-project-media-state]')?.getAttribute('data-project-media-state')||null,
        iframeSrc:document.querySelector('[data-project-media-state="video"] iframe')?.getAttribute('src')||'',
        fallbackLink:document.querySelector('.dc-projects-v2__hero-reel-label a[href]')?.href||null,
        unavailableCopy:/ФРАГМЕНТ\s+ВРЕМЕННО\s+НЕДОСТУПЕН|Источник видео больше не воспроизводится/i.test(document.querySelector('[data-project-media-state]')?.innerText||'')
      }));
      expect(reloaded.state==='video',`${width}px Projects hub reload: video state drifted`);
      expect(/youtube-nocookie\.com\/embed\/dWokndhJLKQ/.test(reloaded.iframeSrc),`${width}px Projects hub reload: iframe source drifted`);
      expect(reloaded.fallbackLink==='https://www.youtube.com/shorts/dWokndhJLKQ',`${width}px Projects hub reload: manual fallback link drifted`);
      expect(!reloaded.unavailableCopy,`${width}px Projects hub reload: rejected unavailable state returned`);
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
console.log('Projects v2 browser regression PASS: fresh-top + Logic hashes + history restoration + no overflow + mobile heading fit + canonical shell/routes on 1440/390/360 + BQA-21 9:16 youtube-nocookie autoplay/muted/playsinline/manual-fallback/reload contract. Visual evidence captured for Hub + Lab.');