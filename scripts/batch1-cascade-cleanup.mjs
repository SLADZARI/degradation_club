import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const changed = [];

function walk(dir){
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if (ent.name === '.git' || ent.name === 'node_modules') continue;
    const p = path.join(dir,ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && p.endsWith('.html')) cleanHtml(p);
  }
}

function cleanHtml(file){
  const src = fs.readFileSync(file,'utf8');
  if (!src.includes('/styles.css') || !src.includes('/ui-v2.css')) return;
  const next = src.replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/ui-v2\.css["']\s*\/?>/gi,'');
  if (next !== src){
    fs.writeFileSync(file,next);
    changed.push(path.relative(ROOT,file));
  }
}

walk(ROOT);

const stylesPath = path.join(ROOT,'styles.css');
const styles = fs.readFileSync(stylesPath,'utf8');
const cleanedStyles = styles.replace("@import url('/home-visual-standard-v2.css');\n",'');
if (cleanedStyles !== styles){
  fs.writeFileSync(stylesPath,cleanedStyles);
  changed.push('styles.css');
}

console.log(`Batch 1 cascade cleanup changed ${changed.length} files`);
for (const file of changed) console.log(`- ${file}`);
