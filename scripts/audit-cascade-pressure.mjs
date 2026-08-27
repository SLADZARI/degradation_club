import fs from 'node:fs';

const visual = fs.readFileSync('visual-standard-v2.css','utf8');
const profile = fs.readFileSync('dementor-profile.css','utf8');
const surfaces = fs.readFileSync('illustration-surfaces.css','utf8');

const failures=[];
const count=(s,re)=>(s.match(re)||[]).length;

const canonicalBlocks=[
  ['DEMENTOR FEATURE', /\/\* FEATURE — approved[\s\S]*?(?=@media\(max-width:1024px\))/],
  ['DEMENTOR RELATION', /\/\* RELATION — approved[\s\S]*?(?=\/\* FEATURE — approved)/],
  ['EVENT HERO', /\/\* EVENT HERO — approved[\s\S]*?(?=\/\* Existing Fuengirola Dementor section|$)/]
];
for(const [name,re] of canonicalBlocks){
  const m=visual.match(re);
  if(!m){ failures.push(`${name}: canonical block not found`); continue; }
  const n=count(m[0],/!important/g);
  if(n) failures.push(`${name}: still contains ${n} !important declarations`);
}

if(/\.dc-dementor-relation__portrait img\{[^}]*object-fit:cover/.test(visual)){
  failures.push('DEMENTOR RELATION: portrait still crops with object-fit:cover');
}
if(!/\.dc-dementor-relation__portrait img\{[^}]*object-fit:contain/.test(visual)){
  failures.push('DEMENTOR RELATION: canonical contain rule missing');
}

const profileImportant=count(profile,/!important/g);
const surfaceImportant=count(surfaces,/!important/g);
const visualImportant=count(visual,/!important/g);
const visualHas=count(visual,/:has\(/g);

console.log(`Cascade pressure: visual-standard !important=${visualImportant}, :has=${visualHas}; dementor-profile !important=${profileImportant}; illustration-surfaces !important=${surfaceImportant}`);

if(failures.length){
  console.error('Cascade pressure audit failed');
  failures.forEach(x=>console.error(`- ${x}`));
  process.exit(1);
}
console.log('Cascade pressure audit passed: canonical FEATURE / RELATION / EVENT HERO are override-free');
