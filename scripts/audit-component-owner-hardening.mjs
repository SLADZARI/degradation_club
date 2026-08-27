import fs from 'node:fs';

const errors=[];
const files=['home-v1.css','dementor-roster.css','event-system.css','illustration-surfaces.css'];
for(const file of files){
  const css=fs.readFileSync(file,'utf8');
  const count=(css.match(/!important/g)||[]).length;
  if(count!==0) errors.push(`${file} must be override-free; found ${count} !important`);
}

const home=fs.readFileSync('home-v1.css','utf8');
if(!home.includes('.dc-home .dc-ink-slot--home{display:none')) errors.push('Home cached-slot suppression contract missing');
if(!home.includes('.dc-home .dc-index-row::before,.dc-home .dc-sphere::before')) errors.push('Home full-bleed row surface contract missing');

const roster=fs.readFileSync('dementor-roster.css','utf8');
if(!roster.includes('object-fit:contain')) errors.push('Roster portrait contain contract missing');
if(!roster.includes('grid-template-columns:58px minmax(0,1fr) 22px')) errors.push('Roster mobile grid contract missing');

const event=fs.readFileSync('event-system.css','utf8');
if(!event.includes('.dc-event-relation')) errors.push('Event relation contract missing');
if(!event.includes('.dc-lifecycle')) errors.push('Event lifecycle contract missing');

const surfaces=fs.readFileSync('illustration-surfaces.css','utf8');
if(!surfaces.includes('object-fit:contain')) errors.push('Illustration contain-first contract missing');
if(!surfaces.includes('.dc-community-page .dc-ink-editorial--community{display:none')) errors.push('Community duplicate-scene suppression missing');

if(errors.length){
  console.error('Component owner hardening audit failed');
  for(const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('Component owner hardening audit passed: Home / Roster / Event / Illustration surfaces are override-free');
