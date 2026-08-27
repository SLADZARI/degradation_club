import fs from 'node:fs';

const profiles = [
  ['01','community/valentin/index.html'],
  ['02','community/nikita/index.html'],
  ['03','community/evgeniy/index.html'],
  ['04','community/gabil/index.html'],
];

const errors=[];
for(const [num,file] of profiles){
  const html=fs.readFileSync(file,'utf8');
  const required=[
    '<section class="dc-dementor-hero">',
    'class="dc-dementor-hero__layout"',
    'class="dc-dementor-hero__copy"',
    'class="dc-dementor-quote',
    'class="dc-dementor-hero__portrait"',
    '<link rel="stylesheet" href="/dementor-profile.css">',
  ];
  for(const token of required){
    if(!html.includes(token)) errors.push(`${file}: missing ${token}`);
  }
  const copy=html.indexOf('class="dc-dementor-hero__copy"');
  const quote=html.indexOf('class="dc-dementor-quote');
  const portrait=html.indexOf('class="dc-dementor-hero__portrait"');
  if(!(copy>=0 && quote>copy && portrait>quote)) errors.push(`${file}: HERO order must be copy -> formula -> portrait`);
  if(!html.includes(`DEMENTOR / ${num}`)) errors.push(`${file}: missing canonical profile number ${num}`);
}

const css=fs.readFileSync('dementor-profile.css','utf8');
const cssContracts=[
  ['formula frame','.dc-dementor-profile .dc-dementor-quote'],
  ['desktop portrait','.dc-dementor-profile .dc-dementor-hero__portrait'],
  ['tablet breakpoint','@media(max-width:1280px) and (min-width:561px)'],
  ['mobile breakpoint','@media(max-width:560px)'],
  ['mobile image row','grid-row:2'],
  ['approved formula border','border:1px dashed'],
];
for(const [label,token] of cssContracts){
  if(!css.includes(token)) errors.push(`dementor-profile.css: missing ${label}`);
}

if(errors.length){
  console.error('Dementor HERO audit failed');
  for(const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`Dementor HERO audit passed: ${profiles.length} profiles / WEB + TABLET + MOBILE contract`);
