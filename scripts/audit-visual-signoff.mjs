import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const graph = JSON.parse(fs.readFileSync('artifacts/design-style-graph.json','utf8'));
const baseURL = process.env.DC_AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const outDir = 'artifacts/batch7-visual-signoff';
const shotDir = path.join(outDir,'screenshots');
fs.mkdirSync(shotDir,{recursive:true});

const viewports = [
  {name:'desktop-1440',width:1440,height:1100},
  {name:'desktop-1024',width:1024,height:900},
  {name:'tablet-768',width:768,height:1024},
  {name:'mobile-430',width:430,height:932},
  {name:'mobile-390',width:390,height:844},
];

function fileToRoute(file){
  if(file === '/index.html') return '/';
  if(file.endsWith('/index.html')) return file.slice(0,-10) + '/';
  return file;
}
function slug(route){
  return (route === '/' ? 'home' : route.replace(/^\//,'').replace(/\/$/,'').replace(/[^a-zA-Z0-9_-]+/g,'__')) || 'home';
}

const routes = [...new Set(graph.routeStyles.map(r=>fileToRoute(r.file)))];
const browser = await chromium.launch({headless:true});
const results = [];
let blockers = 0;

for (const vp of viewports){
  const context = await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1,reducedMotion:'reduce'});
  for (const route of routes){
    const page = await context.newPage();
    const pageErrors = [];
    const badResponses = [];
    const requestFailures = [];
    page.on('pageerror',err=>pageErrors.push(String(err.message || err)));
    page.on('response',res=>{
      try{
        const u = new URL(res.url());
        if(u.origin === new URL(baseURL).origin && res.status() >= 400 && !u.pathname.endsWith('/favicon.ico')){
          badResponses.push({url:u.pathname,status:res.status()});
        }
      }catch{}
    });
    page.on('requestfailed',req=>{
      try{
        const u = new URL(req.url());
        if(u.origin === new URL(baseURL).origin) requestFailures.push({url:u.pathname,error:req.failure()?.errorText || 'failed'});
      }catch{}
    });

    let navStatus = null;
    let navError = null;
    try{
      const res = await page.goto(baseURL + route,{waitUntil:'domcontentloaded',timeout:20000});
      navStatus = res?.status() ?? null;
      await page.waitForTimeout(180);
      await page.evaluate(async()=>{ if(document.fonts?.ready) await document.fonts.ready; });
    }catch(err){ navError = String(err.message || err); }

    const metrics = await page.evaluate(({vw,vh})=>{
      const doc = document.documentElement;
      const body = document.body;
      const visible = el => {
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) !== 0 && r.width > 0 && r.height > 0;
      };
      const brokenImages = [...document.images].filter(img=>visible(img) && img.complete && img.naturalWidth === 0).map(img=>img.getAttribute('src')||'');
      const imageFits = {};
      [...document.images].filter(visible).forEach(img=>{ const fit=getComputedStyle(img).objectFit || 'fill'; imageFits[fit]=(imageFits[fit]||0)+1; });
      const clippedText = [...document.querySelectorAll('h1,h2,h3,p,a,button,span,strong')].filter(el=>{
        if(!visible(el)) return false;
        const s=getComputedStyle(el);
        const horizontal = el.scrollWidth > el.clientWidth + 3 && ['hidden','clip'].includes(s.overflowX);
        const vertical = el.scrollHeight > el.clientHeight + 3 && ['hidden','clip'].includes(s.overflowY);
        return horizontal || vertical;
      }).slice(0,30).map(el=>({tag:el.tagName,class:el.className?.toString().slice(0,120)||'',text:(el.textContent||'').trim().slice(0,100)}));
      const outOfViewport = [...document.querySelectorAll('main *')].filter(el=>{
        if(!visible(el)) return false;
        const s=getComputedStyle(el); const r=el.getBoundingClientRect();
        if(['fixed','sticky'].includes(s.position)) return false;
        return r.left < -4 || r.right > vw + 4;
      }).slice(0,40).map(el=>({tag:el.tagName,class:el.className?.toString().slice(0,100)||'',left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)}));
      const pseudoLayers = [...document.querySelectorAll('body *')].reduce((n,el)=>{
        if(!visible(el)) return n;
        for(const p of ['::before','::after']){
          const s=getComputedStyle(el,p);
          if(s.content && s.content !== 'none' && s.content !== 'normal' && s.display !== 'none' && Number(s.opacity)!==0) n++;
        }
        return n;
      },0);
      const stackingContexts = [...document.querySelectorAll('body *')].filter(el=>{
        if(!visible(el)) return false;
        const s=getComputedStyle(el);
        return (s.position !== 'static' && s.zIndex !== 'auto') || s.transform !== 'none' || Number(s.opacity) < 1 || s.isolation === 'isolate' || s.mixBlendMode !== 'normal' || s.filter !== 'none';
      }).length;
      const topbar = document.querySelector('.topbar')?.getBoundingClientRect();
      return {
        title:document.title,
        scrollWidth:Math.max(doc.scrollWidth,body?.scrollWidth||0),
        scrollHeight:Math.max(doc.scrollHeight,body?.scrollHeight||0),
        overflowX:Math.max(doc.scrollWidth,body?.scrollWidth||0) > vw + 4,
        brokenImages,imageFits,clippedText,outOfViewport,pseudoLayers,stackingContexts,
        topbar:topbar?{height:Math.round(topbar.height),top:Math.round(topbar.top),bottom:Math.round(topbar.bottom)}:null,
        viewport:{width:vw,height:vh}
      };
    },{vw:vp.width,vh:vp.height});

    const screenshot = path.join(shotDir,`${slug(route)}__${vp.name}.png`);
    await page.screenshot({path:screenshot,fullPage:true,animations:'disabled'});

    const blocking = [];
    if(navError || (navStatus && navStatus >= 400)) blocking.push('navigation');
    if(metrics.overflowX) blocking.push('horizontal-overflow');
    if(metrics.brokenImages.length) blocking.push('broken-image');
    if(pageErrors.length) blocking.push('page-error');
    if(badResponses.some(r=>['.css','.js','.png','.jpg','.jpeg','.webp','.svg'].some(ext=>r.url.toLowerCase().endsWith(ext)))) blocking.push('asset-404');
    if(requestFailures.length) blocking.push('request-failed');
    blockers += blocking.length ? 1 : 0;
    results.push({route,viewport:vp.name,navStatus,navError,blocking:[...new Set(blocking)],pageErrors,badResponses,requestFailures,metrics,screenshot});
    await page.close();
  }
  await context.close();
}
await browser.close();

const summary = {
  generatedAt:new Date().toISOString(),baseURL,
  routes:routes.length,viewports:viewports.length,cases:results.length,
  failingCases:blockers,
  viewports,
  failures:results.filter(r=>r.blocking.length),
  warnings:{
    clippedTextCases:results.filter(r=>r.metrics.clippedText.length).length,
    outOfViewportCases:results.filter(r=>r.metrics.outOfViewport.length).length,
  },
  results
};
fs.writeFileSync(path.join(outDir,'summary.json'),JSON.stringify(summary,null,2));
const md = [
  '# Batch 7 — Responsive visual sign-off',
  '',`Generated: ${summary.generatedAt}`,
  '',`Routes: **${summary.routes}**`, `Viewports: **${summary.viewports}**`, `Cases: **${summary.cases}**`, `Blocking cases: **${summary.failingCases}**`,
  '', '## Blocking failures',
  ...(summary.failures.length ? summary.failures.map(f=>`- ${f.route} @ ${f.viewport}: ${f.blocking.join(', ')}`) : ['- None']),
  '', '## Diagnostic warnings',
  `- Cases with clipped-text candidates: ${summary.warnings.clippedTextCases}`,
  `- Cases with out-of-viewport candidates: ${summary.warnings.outOfViewportCases}`,
  '', 'Screenshots are stored under `artifacts/batch7-visual-signoff/screenshots/` in the workflow artifact.'
].join('\n');
fs.writeFileSync(path.join(outDir,'SUMMARY.md'),md);
console.log(md);
if(blockers) process.exit(1);
