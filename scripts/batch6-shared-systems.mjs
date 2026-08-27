import fs from 'node:fs';

const read = p => fs.readFileSync(p,'utf8');
const write = (p,s) => fs.writeFileSync(p,s);
const countImportant = s => (s.match(/!important/g)||[]).length;

const report={generatedAt:new Date().toISOString(),files:{}};

// DIA: keep reduced-motion hard stops as accessibility invariants, remove ordinary mobile force overrides.
{
  const p='dia-v1.css'; let s=read(p); const before=countImportant(s);
  const reduced=s.match(/@media\(prefers-reduced-motion:reduce\)\{[\s\S]*$/)?.[0]||'';
  let head=reduced?s.slice(0,s.length-reduced.length):s;
  head=head.replace(/!important/g,'');
  s=head+reduced;
  write(p,s); report.files[p]={before,after:countImportant(s),note:'Only reduced-motion hard stops may remain'};
}

// Mouthwash: composition is a normal shared owner; no force overrides.
{
  const p='mouthwash-v1.css'; let s=read(p); const before=countImportant(s);
  s=s.replace(/!important/g,''); write(p,s);
  report.files[p]={before,after:countImportant(s)};
}

// Ink interventions: stop owning generic raster slots. Canonical raster geometry/crop/surface belongs to illustration-surfaces.css.
{
  const p='ink-interventions.css'; let s=read(p); const before=countImportant(s);
  const start='/* Shared scene contract. */';
  const trace='/* L1 / TRACE';
  const l2='/* L2 / CONTAMINATION';
  const l3='/* L3 / TAKEOVER';
  const neighbor='/* Neighboring content';
  const mobile='@media(max-width:700px){';
  let pre=s;
  if(s.includes(start)&&s.includes(trace)) pre=s.slice(0,s.indexOf(start))+s.slice(s.indexOf(trace));
  s=pre;
  if(s.includes(l2)&&s.includes(neighbor)) s=s.slice(0,s.indexOf(l2))+s.slice(s.indexOf(neighbor));
  // Remove any remaining home/slot intervention declarations in responsive/reduced-motion blocks.
  s=s.replace(/\n\s*\.dc-ink-slot--about[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/\n\s*\.dc-ink-slot--logic[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/\n\s*\.dc-ink-slot--event[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/\n\s*\.dc-home \.dc-ink-slot--home[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/\n\s*\.dc-ink-slot::before[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/\n\s*\.dc-ink-slot--about>img[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/\n\s*\.dc-home \.dc-ink-slot--home>img[^\n}]*\{[^}]*\}/g,'');
  s=s.replace(/!important/g,'');
  write(p,s); report.files[p]={before,after:countImportant(s),note:'Generic dc-ink-slot ownership removed; trace interventions retained'};
}

// Legacy root stylesheet: remove force overrides only. Do not redesign legacy primitives in this batch.
{
  const p='styles.css'; let s=read(p); const before=countImportant(s);
  s=s.replace(/!important/g,''); write(p,s);
  report.files[p]={before,after:countImportant(s),note:'Legacy primitives retained; force overrides removed'};
}

fs.writeFileSync('artifacts/design-batch6-shared-systems-report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));