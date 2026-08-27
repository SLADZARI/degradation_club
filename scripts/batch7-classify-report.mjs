import fs from 'node:fs';
const p='artifacts/batch7/report.json';
const data=JSON.parse(fs.readFileSync(p,'utf8'));
const cleaned=data.results.map(r=>{
  const m=r.metrics ? {...r.metrics} : null;
  if(m){
    m.clippedText=(m.clippedText||[]).filter(x=>!/(dc-global-sr|sr-only|visually-hidden)/i.test(x.selector||''));
    m.brokenImages=(m.brokenImages||[]).filter(x=>String(x.src||'').trim());
  }
  const fail=!!(r.loadError || (r.status>=400 && r.route!=='/404.html') || m?.horizontalOverflow || m?.brokenImages?.length || m?.clippedText?.length || m?.topbarOverlap || r.pageErrors?.length);
  const warn=!fail && !!(m?.protrusions?.length || r.consoleErrors?.length);
  return {...r,metrics:m,severity:fail?'fail':warn?'warn':'pass'};
});
const summary={
  routes:data.summary.routes,viewports:data.summary.viewports,totalCases:cleaned.length,
  pass:cleaned.filter(x=>x.severity==='pass').length,
  warn:cleaned.filter(x=>x.severity==='warn').length,
  fail:cleaned.filter(x=>x.severity==='fail').length,
  blockers:{
    overflow:cleaned.filter(x=>x.metrics?.horizontalOverflow).length,
    brokenImages:cleaned.filter(x=>x.metrics?.brokenImages?.length).length,
    clippedText:cleaned.filter(x=>x.metrics?.clippedText?.length).length,
    topbarOverlap:cleaned.filter(x=>x.metrics?.topbarOverlap).length,
    load:cleaned.filter(x=>x.loadError).length,
    http:cleaned.filter(x=>x.status>=400 && x.route!=='/404.html').length,
    pageErrors:cleaned.filter(x=>x.pageErrors?.length).length,
  }
};
const routeBlockers=new Map();
for(const r of cleaned.filter(x=>x.severity==='fail')){
  if(!routeBlockers.has(r.route)) routeBlockers.set(r.route,[]);
  const reasons=[];
  if(r.metrics?.horizontalOverflow) reasons.push(`overflow ${r.metrics.scrollWidth}px @ ${r.viewport.width}px`);
  if(r.metrics?.brokenImages?.length) reasons.push(`broken images: ${r.metrics.brokenImages.map(x=>x.src).join(', ')}`);
  if(r.metrics?.clippedText?.length) reasons.push(`clipped text: ${r.metrics.clippedText.map(x=>x.selector).join(', ')}`);
  if(r.metrics?.topbarOverlap) reasons.push('topbar overlap');
  if(r.loadError) reasons.push('load error');
  if(r.status>=400 && r.route!=='/404.html') reasons.push(`HTTP ${r.status}`);
  if(r.pageErrors?.length) reasons.push(`page errors: ${r.pageErrors.join(' | ')}`);
  routeBlockers.get(r.route).push(`${r.viewport.name}: ${reasons.join('; ')}`);
}
let md=`# Batch 7 — classified visual blockers\n\nRaw false-positive sources excluded: screen-reader-only clipped nodes and images without a src.\n\nCases **${summary.totalCases}** · PASS **${summary.pass}** · WARN **${summary.warn}** · FAIL **${summary.fail}**\n\n## Blocking counters\n`;
for(const [k,v] of Object.entries(summary.blockers)) md+=`- ${k}: ${v}\n`;
md+='\n## Routes with real blockers\n\n';
for(const [route,rows] of routeBlockers){md+=`### ${route}\n${rows.map(x=>`- ${x}`).join('\n')}\n\n`;}
fs.writeFileSync('artifacts/batch7/classified.json',JSON.stringify({summary,results:cleaned},null,2));
fs.writeFileSync('artifacts/batch7/CLASSIFIED.md',md);
console.log(JSON.stringify(summary,null,2));
