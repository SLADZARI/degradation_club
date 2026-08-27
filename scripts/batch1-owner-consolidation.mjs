import fs from 'node:fs';

const changed = [];
function edit(file, transform){
  const before = fs.readFileSync(file,'utf8');
  const after = transform(before);
  if(after === before) return false;
  fs.writeFileSync(file,after);
  changed.push(file);
  return true;
}
function requireChange(ok,label){
  if(!ok) throw new Error(`Expected cleanup did not match: ${label}`);
}

requireChange(edit('presentation-standard-v1.css', css =>
  css.replace(/body \.dc-dementor-hero__portrait img\{[^}]*\}\n?/g,'')
),'presentation-standard hero portrait rule');

requireChange(edit('dementors-v1.css', css => {
  let out = css;
  out = out.replace(/\.dc-dementor-hero\{[\s\S]*?\.dc-dementor-hero__portrait::after\{[^}]*\}/,
    '/* Profile HERO geometry is owned exclusively by /dementor-profile.css. */');
  out = out.replace(/,\.dc-dementor-hero__layout/g,'');
  out = out.replace(/,\.dc-dementor-hero__copy,\.dc-dementor-hero__portrait/g,'');
  out = out.replace(/\.dc-dementor-hero__(?:meta|layout|copy|portrait)(?:\s+img|::after)?\{[^}]*\}/g,'');
  return out;
}),'dementors-v1 legacy profile hero geometry');

requireChange(edit('visual-standard-v2.css', css => {
  let out = css;
  out = out.replace(/\/\* HERO — approved WEB \/ TABLET \/ MOBILE composition\. \*\/[\s\S]*?\/\* MICRO \*\//,
    '/* Profile HERO geometry is owned exclusively by /dementor-profile.css. */\n\n/* MICRO */');
  // Remove profile portrait from shared selector lists without damaging the remaining list.
  out = out.replace(/\.dc-dementor-hero__portrait(?:\s+img)?\s*,/g,'');
  out = out.replace(/,\s*\.dc-dementor-hero__portrait(?:\s+img)?/g,'');
  // Remove any standalone residual profile hero rules, including responsive overrides.
  out = out.replace(/^\s*\.dc-dementor-hero__(?:layout|copy|portrait)[^\{]*\{[^}]*\}\s*$/gm,'');
  out = out.replace(/\.dc-dementor-hero__portrait(?:\s+img)?[^\{,]*\{[^}]*\}/g,'');
  return out;
}),'visual-standard legacy profile hero geometry');

requireChange(edit('event-system.css', css => {
  let out = css;
  // Fuengirola EVENT HERO is owned by visual-standard-v2.css. event-system.css owns programme/lifecycle/detail only.
  out = out.replace(/^\s*\.dc-fuengirola-page \.dc-entity-hero(?:::[a-z-]+|__[a-zA-Z0-9_-]+(?:>[^\{]+)?)?[^\{]*\{[^}]*\}\s*$/gm,'');
  return out;
}),'event-system Fuengirola hero ownership');

console.log(`Batch 1 owner consolidation changed ${changed.length} files`);
for(const file of changed) console.log(`- ${file}`);
