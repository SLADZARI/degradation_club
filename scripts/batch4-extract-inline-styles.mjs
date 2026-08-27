import fs from 'node:fs';
import path from 'node:path';

const targets = [
  ['404.html','404-inline.css','/404-inline.css'],
  ['contacts/index.html','contacts/inline-v1.css','/contacts/inline-v1.css'],
  ['design-system/preorder/index.html','design-system/preorder/inline-v1.css','/design-system/preorder/inline-v1.css'],
  ['design-system/support/index.html','design-system/support/inline-v1.css','/design-system/support/inline-v1.css'],
  ['donate/index.html','donate/inline-v1.css','/donate/inline-v1.css'],
  ['join/index.html','join/inline-v1.css','/join/inline-v1.css'],
  ['projects/logic-awareness/index.html','projects/logic-awareness/inline-v1.css','/projects/logic-awareness/inline-v1.css'],
  ['projects/logic-awareness/dossiers/index.html','projects/logic-awareness/dossiers/inline-v1.css','/projects/logic-awareness/dossiers/inline-v1.css'],
  ['projects/logic-awareness/dossiers/logic/index.html','projects/logic-awareness/dossiers/logic/inline-v1.css','/projects/logic-awareness/dossiers/logic/inline-v1.css'],
  ['projects/logic-awareness/dossiers/awareness/index.html','projects/logic-awareness/dossiers/awareness/inline-v1.css','/projects/logic-awareness/dossiers/awareness/inline-v1.css'],
];

let changed = 0;
for (const [htmlPath, cssPath, href] of targets) {
  const html = fs.readFileSync(htmlPath,'utf8');
  const match = html.match(/\n?\s*<style>([\s\S]*?)<\/style>/i);
  if (!match) continue;
  const css = match[1].trim() + '\n';
  fs.mkdirSync(path.dirname(cssPath), { recursive:true });
  fs.writeFileSync(cssPath, css);
  const link = `\n  <link rel="stylesheet" href="${href}">`;
  fs.writeFileSync(htmlPath, html.replace(match[0], link));
  changed++;
}
console.log(`Batch 4 extracted inline styles from ${changed} routes`);
