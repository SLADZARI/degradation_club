import fs from 'node:fs';

const graph=JSON.parse(fs.readFileSync('artifacts/design-style-graph.json','utf8'));
const shared=new Set([
  '/styles.css','/visual-tokens.css','/illustration-surfaces.css','/ui-v2.css','/presentation-standard-v1.css','/visual-standard-v2.css','/mobile-guardrails.css',
  '/accessibility-v1.css','/dia-v1.css','/mouthwash-v1.css','/editorial-system.css','/ink-interventions.css'
]);

const targets=new Set(['/course-bridge-v1.css']);
for(const route of graph.routeStyles||[]){
  for(const css of route.linked||[]){
    if(!css.endsWith('.css')) continue;
    if(shared.has(css)) continue;
    targets.add(css);
  }
}

const changed=[];
const stats=[];
for(const css of [...targets].sort()){
  const p=css.replace(/^\//,'');
  if(!fs.existsSync(p)) continue;
  const before=fs.readFileSync(p,'utf8');
  const count=(before.match(/!important/g)||[]).length;
  if(!count){stats.push({file:css,before:0,after:0});continue;}
  const after=before.replace(/\s*!important\b/g,'');
  fs.writeFileSync(p,after);
  changed.push(p);
  stats.push({file:css,before:count,after:(after.match(/!important/g)||[]).length});
}

const a11y=fs.readFileSync('accessibility-v1.css','utf8');
const a11yCount=(a11y.match(/!important/g)||[]).length;
const report={generatedAt:new Date().toISOString(),targets:[...targets].sort(),changed,stats,accessibilityImportant:a11yCount};
fs.writeFileSync('artifacts/design-batch5b-route-owner-report.json',JSON.stringify(report,null,2)+'\n');
console.log(`Batch 5B route owner sweep: ${changed.length} files changed; accessibility !important preserved=${a11yCount}`);
for(const row of stats.filter(x=>x.before)) console.log(`${row.file}: ${row.before} -> ${row.after}`);
