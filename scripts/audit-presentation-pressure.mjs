import fs from 'node:fs';

const css=fs.readFileSync('presentation-standard-v1.css','utf8');
const errors=[];
const count=(css.match(/!important/g)||[]).length;
if(count!==0) errors.push(`presentation-standard-v1.css must be override-free; found ${count} !important`);
if(!css.startsWith("@import url('/course-bridge-v1.css');")) errors.push('presentation-standard-v1.css must preserve course-bridge import order');
if(!css.includes('/* ACTION CONTRACT')) errors.push('presentation-standard-v1.css lost action contract');
if(!css.includes('/* ENTITY REGISTER')) errors.push('presentation-standard-v1.css lost entity register contract');
if(!css.includes('/* MOBILE 390 CONTRACT')) errors.push('presentation-standard-v1.css lost mobile contract');

if(errors.length){
  console.error('Presentation pressure audit failed');
  for(const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('Presentation pressure audit passed: baseline layer has 0 !important and contracts remain present');
