import fs from 'node:fs';
const css=fs.readFileSync('ui-v2.css','utf8');
const errors=[];
const count=(css.match(/!important/g)||[]).length;
if(count!==0) errors.push(`ui-v2.css must be override-free; found ${count} !important`);
for(const token of ["@import url('/ink-interventions.css');","@import url('/editorial-system.css');","@import url('/mouthwash-v1.css');","@import url('/dia-v1.css');","@import url('/accessibility-v1.css');"]){
  if(!css.includes(token)) errors.push(`ui-v2.css lost required shared import ${token}`);
}
if(css.includes('mobile-qa.css')||css.includes('mobile-overflow-fix.css')) errors.push('ui-v2.css must not restore legacy mobile imports');
if(errors.length){
  console.error('UI pressure audit failed');
  for(const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('UI pressure audit passed: ui-v2 has 0 !important and shared imports remain explicit');
