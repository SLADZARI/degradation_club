import fs from 'node:fs';

const errors=[];
const graph=JSON.parse(fs.readFileSync('artifacts/design-style-graph.json','utf8'));
const shared=new Set([
  '/styles.css','/visual-tokens.css','/illustration-surfaces.css','/ui-v2.css','/presentation-standard-v1.css','/visual-standard-v2.css','/mobile-guardrails.css',
  '/accessibility-v1.css','/dia-v1.css','/mouthwash-v1.css','/editorial-system.css','/ink-interventions.css'
]);
const targets=new Set(['/course-bridge-v1.css']);
for(const route of graph.routeStyles||[]){
  for(const css of route.linked||[]){
    if(css.endsWith('.css')&&!shared.has(css)) targets.add(css);
  }
}
for(const css of [...targets].sort()){
  const p=css.replace(/^\//,'');
  if(!fs.existsSync(p)) continue;
  const text=fs.readFileSync(p,'utf8');
  const n=(text.match(/!important/g)||[]).length;
  if(n) errors.push(`${css}: ${n} !important remains in route/course owner`);
}

const a11y=fs.readFileSync('accessibility-v1.css','utf8');
if(!a11y.includes('ACCESSIBILITY / CONTRAST CONTRACT')) errors.push('accessibility contrast contract marker missing');
if(!a11y.includes('ACID (#d8ff3e) is a light signal surface')) errors.push('acid contrast invariant missing');
const a11yImportant=(a11y.match(/!important/g)||[]).length;
if(a11yImportant<4) errors.push(`accessibility protection unexpectedly weakened: ${a11yImportant} !important`);
if(!/color:var\(--dc-on-acid\)!important/.test(a11y)) errors.push('acid foreground protection is no longer enforced');
if(!/background-color:var\(--dc-acid,#d8ff3e\)!important/.test(a11y)) errors.push('acid background protection is no longer enforced');

if(errors.length){
  console.error('Route owner sweep audit failed');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log(`Route owner sweep audit passed: ${targets.size} route/course owners override-free; accessibility protections preserved (${a11yImportant})`);
