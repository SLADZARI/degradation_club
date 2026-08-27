import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT=process.cwd();
const BASE=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUT=path.join(ROOT,'artifacts','batch8');
const SHOTS=path.join(OUT,'screenshots');
fs.mkdirSync(SHOTS,{recursive:true});

const vpAll=[{name:'mobile390',width:390,height:844},{name:'desktop1440',width:1440,height:1100}];
const vpTablet={name:'tablet768',width:768,height:1024};
const keyRoutes=new Set(['/','/about/','/community/','/community/valentin/','/community/nikita/','/community/evgeniy/','/community/gabil/','/events/','/events/fuengirola/','/courses/','/courses/dengi-na-veter/','/courses/dumai-s-opasnostyu/','/courses/ne-komanda/','/courses/slaboumie-i-otvaga/','/projects/','/projects/logic-awareness/','/merch/','/join/','/support/']);
const skipDirs=new Set(['.git','node_modules','artifacts','assets','docs','scripts','design-system']);

function walk(dir,out=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(skipDirs.has(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p,out);else if(ent.isFile()&&ent.name==='index.html')out.push(p)}return out}
function routeOf(file){const rel=path.relative(ROOT,file).replaceAll(path.sep,'/');return rel==='index.html'?'/':'/'+rel.slice(0,-'index.html'.length)}
function isPublicFile(file){const html=fs.readFileSync(file,'utf8');const robots=(html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)||[])[1]||'';return !/noindex/i.test(robots)}
const routeFiles=walk(ROOT).filter(isPublicFile);
const publicRoutes=routeFiles.map(routeOf).sort();
const publicSet=new Set(publicRoutes);
function safe(route){return route==='/'?'home':route.replace(/^\//,'').replace(/\/$/,'').replace(/[^a-zA-Z0-9._-]+/g,'__')}

const browser=await chromium.launch({headless:true});
const results=[];
const internalLinks=new Map();

async function inspect(route,vp,capture=true){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const consoleErrors=[];const pageErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
  let status=null,loadError=null;
  try{const res=await page.goto(new URL(route,BASE).href,{waitUntil:'networkidle',timeout:25000});status=res?.status()??null;await page.evaluate(async()=>{if(document.fonts?.ready)await document.fonts.ready});await page.waitForTimeout(100)}catch(e){loadError=String(e.message||e)}
  let metrics=null;
  if(!loadError){metrics=await page.evaluate(({width,route})=>{
    const visible=el=>{const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>0&&r.height>0};
    const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;else if(el.classList?.length)s+='.'+[...el.classList].slice(0,3).join('.');return s};
    const d=document.documentElement,b=document.body;
    const offenders=[];
    for(const el of document.querySelectorAll('h1,h2,h3,a,button,input,select,textarea,img')){if(!visible(el))continue;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);const intentional=el.closest('.dc-notice__track,.ticker,.dc-course-strip,[class*="carousel"],[class*="strip"]');if(!intentional&&cs.position!=='fixed'&&(r.left<-8||r.right>width+8))offenders.push({selector:sel(el),left:Math.round(r.left),right:Math.round(r.right),text:(el.textContent||'').trim().slice(0,70),src:el.getAttribute('src')})}
    const scrollWidth=Math.max(d.scrollWidth,b?.scrollWidth||0);
    const brokenImages=[...document.images].filter(i=>(i.getAttribute('src')||'').trim()&&i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src'));
    const legacyPortraits=[...document.images].map(i=>i.getAttribute('src')||'').filter(src=>src.includes('/people/dementors/')&&src.includes('portrait-ink.webp'));
    const ids=[...document.querySelectorAll('[id]')].map(x=>x.id).filter(Boolean);const duplicateIds=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
    const viewportMeta=!!document.querySelector('meta[name="viewport"]');
    const h1=!!document.querySelector('h1');
    const main=!!document.querySelector('main');
    const topbar=document.querySelector('.topbar');let topbarOverlap=false;if(topbar&&main){const first=[...document.querySelector('main').children].find(visible);if(first&&getComputedStyle(topbar).position==='fixed')topbarOverlap=first.getBoundingClientRect().top<topbar.getBoundingClientRect().bottom-2}
    const hrefs=[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(Boolean);
    const links=hrefs.filter(h=>!h.startsWith('#')&&!/^(mailto:|tel:|javascript:)/i.test(h)).map(h=>{try{const u=new URL(h,location.href);return u.origin===location.origin?u.pathname+u.search:null}catch{return null}}).filter(Boolean);
    const legacyInjectedFuengirola=route==='/events/fuengirola/'&&!!document.querySelector('.dc-event-hero__relation .dc-dementor-link');
    return{scrollWidth,horizontalOverflow:scrollWidth>width+12&&offenders.length>0,offenders:offenders.slice(0,20),brokenImages,legacyPortraits,duplicateIds,viewportMeta,h1,main:!!main,topbarOverlap,links:[...new Set(links)],legacyInjectedFuengirola};
  },{width:vp.width,route})}
  if(metrics?.links)for(const l of metrics.links)internalLinks.set(l,null);
  let shot=null;if(capture&&!loadError){shot=path.join(SHOTS,`${safe(route)}__${vp.name}.png`);await page.screenshot({path:shot,fullPage:true})}
  const p0=[];const p1=[];const p2=[];
  if(loadError)p0.push('load-error');if(status&&status>=400)p0.push(`http-${status}`);if(metrics?.brokenImages?.length)p0.push(`broken-images:${metrics.brokenImages.length}`);
  if(pageErrors.length)p1.push(`page-errors:${pageErrors.length}`);if(metrics?.horizontalOverflow)p1.push('real-horizontal-overflow');if(metrics?.topbarOverlap)p1.push('topbar-overlap');if(vp.width<=430&&!metrics?.viewportMeta)p1.push('missing-viewport-meta');if(!metrics?.h1)p1.push('missing-h1');if(!metrics?.main)p1.push('missing-main');if(metrics?.legacyPortraits?.length)p1.push(`legacy-dementor-assets:${metrics.legacyPortraits.length}`);if(metrics?.legacyInjectedFuengirola)p1.push('duplicate-fuengirola-relation-injection');
  if(consoleErrors.length)p2.push(`console-errors:${consoleErrors.length}`);if(metrics?.duplicateIds?.length)p2.push(`duplicate-ids:${metrics.duplicateIds.length}`);
  const rec={route,viewport:vp,status,loadError,p0,p1,p2,consoleErrors:consoleErrors.slice(0,10),pageErrors:pageErrors.slice(0,10),metrics,screenshot:shot?path.relative(ROOT,shot).replaceAll(path.sep,'/'):null};results.push(rec);await context.close();return rec;
}

for(const vp of vpAll)for(const route of publicRoutes)await inspect(route,vp,true);
for(const route of publicRoutes.filter(r=>keyRoutes.has(r)))await inspect(route,vpTablet,true);

const request=await browser.newContext();
const brokenLinks=[];
for(const href of internalLinks.keys()){
  if(href.startsWith('/api/'))continue;
  try{const res=await request.request.get(new URL(href,BASE).href,{timeout:12000});const s=res.status();internalLinks.set(href,s);if(s>=400)brokenLinks.push({href,status:s})}catch(e){brokenLinks.push({href,error:String(e.message||e)})}
}
await request.close();await browser.close();

const p0Count=results.reduce((n,r)=>n+r.p0.length,0)+brokenLinks.length;
const p1Count=results.reduce((n,r)=>n+r.p1.length,0);
const p2Count=results.reduce((n,r)=>n+r.p2.length,0);
const summary={generatedAt:new Date().toISOString(),publicRoutes:publicRoutes.length,keyRoutes:[...keyRoutes].filter(r=>publicSet.has(r)),cases:results.length,p0:p0Count,p1:p1Count,p2:p2Count,brokenInternalLinks:brokenLinks.length,releaseDecision:p0Count===0&&p1Count===0?'GO':'NO-GO'};
const report={summary,publicRoutes,brokenLinks,linkStatuses:Object.fromEntries(internalLinks),results};
fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));
let md=`# Batch 8 — Release Candidate Audit\n\nGenerated: ${summary.generatedAt}\n\nDecision: **${summary.releaseDecision}**\n\nPublic routes: **${summary.publicRoutes}** · Cases: **${summary.cases}**\n\nP0 **${summary.p0}** · P1 **${summary.p1}** · P2 **${summary.p2}**\n\n## Stop rule\n\nRelease is blocked only by P0/P1. P2 is recorded for post-release backlog unless a human visual review promotes it. No architecture refactor is allowed in Batch 8. At most one release fix-pack.\n\n## Broken internal links\n\n`;
md+=brokenLinks.length?brokenLinks.map(x=>`- ${x.href} — ${x.status||x.error}`).join('\n'):'None.';
md+='\n\n## P0 / P1 cases\n\n';
for(const r of results.filter(x=>x.p0.length||x.p1.length)){md+=`### ${r.route} @ ${r.viewport.name}\n- P0: ${r.p0.join(', ')||'none'}\n- P1: ${r.p1.join(', ')||'none'}\n`;if(r.metrics?.offenders?.length)md+=`- offenders: ${r.metrics.offenders.slice(0,6).map(x=>x.selector).join(', ')}\n`;if(r.metrics?.legacyPortraits?.length)md+=`- legacy portraits: ${r.metrics.legacyPortraits.join(', ')}\n`;if(r.screenshot)md+=`- screenshot: \`${r.screenshot}\`\n`;md+='\n'}
md+='## P2 backlog\n\n';for(const r of results.filter(x=>x.p2.length))md+=`- ${r.route} @ ${r.viewport.name}: ${r.p2.join(', ')}\n`;
md+='\n## Human visual review set\n\nScreenshots are generated for every public route at 390 and 1440, plus the key public journey at 768. Review only approved composition, readability, image crop/contain, hierarchy, duplicated UI and CTA clarity. Cosmetic differences that do not impair use are not release blockers.\n';
fs.writeFileSync(path.join(OUT,'REPORT.md'),md);
console.log(JSON.stringify(summary,null,2));
if(summary.releaseDecision==='NO-GO')process.exitCode=2;
