import fs from 'node:fs';

const targets = [
  ['404.html','/404-inline.css'],
  ['contacts/index.html','/contacts/inline-v1.css'],
  ['design-system/preorder/index.html','/design-system/preorder/inline-v1.css'],
  ['design-system/support/index.html','/design-system/support/inline-v1.css'],
  ['donate/index.html','/donate/inline-v1.css'],
  ['join/index.html','/join/inline-v1.css'],
  ['projects/logic-awareness/index.html','/projects/logic-awareness/inline-v1.css'],
  ['projects/logic-awareness/dossiers/index.html','/projects/logic-awareness/dossiers/inline-v1.css'],
  ['projects/logic-awareness/dossiers/logic/index.html','/projects/logic-awareness/dossiers/logic/inline-v1.css'],
  ['projects/logic-awareness/dossiers/awareness/index.html','/projects/logic-awareness/dossiers/awareness/inline-v1.css'],
];
const errors=[];
for (const [htmlPath, href] of targets) {
  const html=fs.readFileSync(htmlPath,'utf8');
  if (/<style[\s>]/i.test(html)) errors.push(`${htmlPath}: inline <style> remains`);
  if (!html.includes(`href="${href}"`)) errors.push(`${htmlPath}: missing ${href}`);
  const cssPath=href.replace(/^\//,'');
  if (!fs.existsSync(cssPath) || !fs.readFileSync(cssPath,'utf8').trim()) errors.push(`${cssPath}: missing or empty extracted stylesheet`);
}
if(errors.length){
  console.error('Inline style audit failed');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log(`Inline style audit passed: ${targets.length} routes / zero inline style owners`);
