import fs from 'node:fs';
const must=p=>{if(!fs.existsSync(p)) throw new Error(`Missing ${p}`); return fs.readFileSync(p,'utf8')};
const imp=s=>(s.match(/!important/g)||[]).length;
const dia=must('dia-v1.css');
const mouth=must('mouthwash-v1.css');
const ink=must('ink-interventions.css');
const root=must('styles.css');
const surface=must('illustration-surfaces.css');

if(imp(mouth)!==0) throw new Error('mouthwash-v1.css must have 0 !important');
if(imp(root)!==0) throw new Error('styles.css must have 0 !important');
if(imp(ink)!==0) throw new Error('ink-interventions.css must have 0 !important');
const diaHead=dia.split('@media(prefers-reduced-motion:reduce)')[0];
if(imp(diaHead)!==0) throw new Error('dia-v1.css ordinary runtime must have 0 !important');
if(!surface.includes('GENERIC INK SLOT — canonical owner')) throw new Error('illustration-surfaces.css lost generic Ink ownership');
const forbidden=[
  '.dc-ink-slot>img,.dc-ink-slot__image',
  '.dc-ink-slot--about{',
  '.dc-ink-slot--logic{',
  '.dc-ink-slot--event{',
  '.dc-home .dc-ink-slot--home{'
];
for(const token of forbidden){ if(ink.includes(token)) throw new Error(`ink-interventions still owns canonical slot geometry: ${token}`); }
if(!ink.includes('.dc-ink-trace')) throw new Error('Ink trace intervention was accidentally removed');
console.log(JSON.stringify({ok:true,important:{dia:imp(dia),mouthwash:imp(mouth),ink:imp(ink),styles:imp(root)},inkOwner:'illustration-surfaces.css'},null,2));