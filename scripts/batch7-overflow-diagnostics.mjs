import fs from 'node:fs';
import { chromium } from 'playwright';
const data=JSON.parse(fs.readFileSync('artifacts/batch7/classified.json','utf8'));
const cases=data.results.filter(r=>r.severity==='fail');
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const out=[];
for(const c of cases){
  const ctx=await browser.newContext({viewport:{width:c.viewport.width,height:c.viewport.height},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  await page.goto(new URL(c.route,base).href,{waitUntil:'domcontentloaded',timeout:10000});
  await page.waitForTimeout(100);
  const d=await page.evaluate(({vw})=>{
    const html=document.documentElement,body=document.body;
    const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;else if(el.classList?.length)s+='.'+[...el.classList].slice(0,4).join('.');return s};
    const offenders=[];
    for(const el of document.querySelectorAll('body *')){
      if(!visible(el)) continue;
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
      const overLeft=r.left < -1, overRight=r.right > vw + 1;
      const ownScroll=el.scrollWidth > el.clientWidth + 2;
      if(overLeft||overRight||ownScroll){
        offenders.push({selector:sel(el),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,position:cs.position,display:cs.display,overflowX:cs.overflowX,whiteSpace:cs.whiteSpace,transform:cs.transform,maxWidth:cs.maxWidth,minWidth:cs.minWidth,fontSize:cs.fontSize,text:(el.childElementCount===0?(el.textContent||'').trim().slice(0,80):'')});
      }
    }
    offenders.sort((a,b)=>Math.max(b.right-vw, -b.left, b.scrollWidth-b.clientWidth)-Math.max(a.right-vw,-a.left,a.scrollWidth-a.clientWidth));
    const topbar=document.querySelector('.topbar');const main=document.querySelector('main');
    let overlap=null;
    if(topbar&&main){const tb=topbar.getBoundingClientRect();const first=[...main.children].find(visible);if(first){const fr=first.getBoundingClientRect();overlap={topbar:{top:tb.top,bottom:tb.bottom,height:tb.height,position:getComputedStyle(topbar).position},first:{selector:sel(first),top:fr.top,bottom:fr.bottom,position:getComputedStyle(first).position}}}}
    return {scrollWidth:Math.max(html.scrollWidth,body.scrollWidth),htmlOverflowX:getComputedStyle(html).overflowX,bodyOverflowX:getComputedStyle(body).overflowX,offenders:offenders.slice(0,20),overlap};
  },{vw:c.viewport.width});
  out.push({route:c.route,viewport:c.viewport,diagnostic:d});
  await page.close(); await ctx.close();
}
await browser.close();
fs.writeFileSync('artifacts/batch7/overflow-diagnostics.json',JSON.stringify(out,null,2));
let md='# Batch 7 — overflow diagnostics\n\n';
for(const r of out){md+=`## ${r.route} @ ${r.viewport.name} (${r.viewport.width}px)\n- scrollWidth: ${r.diagnostic.scrollWidth}\n- html/body overflow-x: ${r.diagnostic.htmlOverflowX} / ${r.diagnostic.bodyOverflowX}\n`;if(r.diagnostic.overlap)md+=`- topbar/first: ${JSON.stringify(r.diagnostic.overlap)}\n`;md+='\nTop offenders:\n';for(const o of r.diagnostic.offenders.slice(0,8)){md+=`- ${o.selector} | L ${o.left} R ${o.right} W ${o.width} | scroll ${o.scrollWidth}/${o.clientWidth} | overflow ${o.overflowX} | ws ${o.whiteSpace} | fs ${o.fontSize} | ${o.text}\n`;}md+='\n';}
fs.writeFileSync('artifacts/batch7/OVERFLOW_DIAGNOSTICS.md',md);
console.log(`diagnosed ${out.length} cases`);
