import fs from 'node:fs';

const html=fs.readFileSync('events/fuengirola/index.html','utf8');
const css=fs.readFileSync('visual-standard-v2.css','utf8');
const errors=[];

const htmlRequired=[
  'dc-event-hero__media',
  'dc-event-hero__subtitle',
  'dc-event-hero__relation',
  'dc-event-hero__relation-portrait',
  'dc-event-hero__relation-copy',
  '/assets/ink/event-fuengirola-03.webp',
  '/assets/people/dementors/gabil/dementor_gabil.webp',
  'EVENT-001 / PLANNED / OFFLINE',
];
for(const token of htmlRequired){
  if(!html.includes(token)) errors.push(`events/fuengirola/index.html: missing ${token}`);
}

const hero=html.indexOf('<section class="dc-entity-hero"');
const media=html.indexOf('dc-event-hero__media',hero);
const meta=html.indexOf('dc-entity-hero__meta',hero);
const title=html.indexOf('id="fuengirola-title"',hero);
const subtitle=html.indexOf('dc-event-hero__subtitle',hero);
const relation=html.indexOf('dc-event-hero__relation ',hero);
if(!(hero>=0 && media>hero && meta>media && title>meta && subtitle>title && relation>subtitle)){
  errors.push('Fuengirola hero DOM order must be media -> meta -> title -> subtitle -> relation');
}

const cssRequired=[
  'body.dc-fuengirola-page .dc-entity-hero::after{content:none!important}',
  'body.dc-fuengirola-page .dc-event-hero__media',
  'body.dc-fuengirola-page .dc-event-hero__relation',
  '@media(max-width:900px) and (min-width:561px)',
  '@media(max-width:560px)',
  'order:1',
  'order:5',
  'aspect-ratio:360/270',
  'grid-template-columns:86px minmax(0,1fr)',
];
for(const token of cssRequired){
  if(!css.includes(token)) errors.push(`visual-standard-v2.css: missing Event HERO contract token ${token}`);
}

if(/\.dc-entity-hero::after\{[^}]*background:url\('\/assets\/ink\/event-fuengirola-03\.webp'\)/.test(css)){
  errors.push('Fuengirola event image must be DOM media, not ::after background');
}

if(errors.length){
  console.error('Event HERO audit failed');
  for(const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('Event HERO audit passed: Fuengirola WEB + TABLET + MOBILE contract');
