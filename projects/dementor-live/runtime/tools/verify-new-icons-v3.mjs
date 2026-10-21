import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const url=rel=>new URL('../'+rel,import.meta.url);
const hash=rel=>createHash('sha256').update(fs.readFileSync(url(rel))).digest('hex');
const manifest=JSON.parse(fs.readFileSync(url('public/assets/paper-icons-new-v3/manifest-new-only.json'),'utf8'));
assert.equal(manifest.items.length,42,'expected 42 numbered icons');
for(let i=0;i<42;i++){
 const item=manifest.items[i],stem=item.id.replaceAll(':','__');
 assert.equal(item.number,'DL-ICON-'+String(i+21).padStart(3,'0'));
 assert.equal(hash('public/assets/paper-icons-new-v3/svg/'+stem+'.svg'),item.svg_sha256);
 for(const size of [32,48,64,128,256]){
   assert.equal(hash('public/assets/paper-icons-new-v3/png_'+size+'/'+stem+'.png'),item.png_sha256[String(size)]);
 }
}
const server=fs.readFileSync(url('server.mjs'),'utf8');
const index=fs.readFileSync(url('public/index.html'),'utf8');
assert.ok(server.includes('V3-NEW-ONLY STATIC ROUTE'));
assert.ok(server.includes('V3-NEW-ONLY CATALOG ROUTE'), 'approved v3 manifest must have a dedicated public route');
assert.ok(server.includes("'/assets/paper-icons-new-v3/manifest-new-only.json'"), 'v3 catalog URL must be exact');
assert.ok(server.includes("'/new-icons-v3.js'"));
assert.ok(index.includes('/new-icons-v3.js'));
console.log('NEW ONLY V3.1 PASS: 42 SVG, 210 PNG SHA-256, static route and UI activation; run check:icons to certify old 20');
