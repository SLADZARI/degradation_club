import fs from 'node:fs';

const errors=[];
const home=fs.readFileSync('index.html','utf8');
const event=fs.readFileSync('events/fuengirola/index.html','utf8');
const css=fs.readFileSync('visual-standard-v2.css','utf8');

for(const token of [
  'class="dc-dementor-feature dc-dementor-feature--valentin"',
  'class="dc-dementor-feature__portrait"',
  '/assets/people/dementors/valentin/dementor_valentin.webp',
]) if(!home.includes(token)) errors.push(`Home FEATURE missing ${token}`);

if(home.includes('section.dc-event:has(a[href="/courses/dumai-s-opasnostyu/"])::after')) errors.push('Home Valentin still uses pseudo portrait layer');

for(const token of [
  'class="dc-dementor-feature dc-dementor-feature--gabil"',
  'class="dc-event-hero__relation dc-dementor-relation dc-dementor-relation--event"',
  'dc-dementor-relation__portrait',
  'dc-dementor-relation__copy',
]) if(!event.includes(token)) errors.push(`Fuengirola missing ${token}`);

for(const token of [
  '/* RELATION — approved compact entity relation card. */',
  'grid-template-columns:118px minmax(0,1fr) 40px',
  '/* FEATURE — approved two-surface component: image left, copy right, one acid divider. */',
  'border-left:6px solid var(--dc-acid)',
  '@media(max-width:700px)',
  'border-top:6px solid var(--dc-acid)',
]) if(!css.includes(token)) errors.push(`visual-standard-v2.css missing ${token}`);

const featureOwners=(css.match(/\.dc-dementor-feature\{/g)||[]).length;
if(featureOwners!==1) errors.push(`FEATURE base owner count must be 1, got ${featureOwners}`);
const relationOwners=(css.match(/\.dc-dementor-relation\{/g)||[]).length;
if(relationOwners!==1) errors.push(`RELATION base owner count must be 1, got ${relationOwners}`);

if(errors.length){
  console.error('FEATURE / RELATION audit failed');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log('FEATURE / RELATION audit passed: Home Valentin + Fuengirola Gabil + Event relation');
