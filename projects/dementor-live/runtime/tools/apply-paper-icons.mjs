// Import the exact user-approved artwork from the immutable canonical ZIP.
// Uses only Node.js built-ins; never modifies game/world/server save state.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const archive=path.join(root,'assets/Dementor_Live_Paper_Icons_v1_FULL.zip');
const prefix='Dementor_Live_Paper_Icons_v1/runtime/public/';
const expected=['wood','stone','food','seed_hemp','seed_carrot','hemp','carrot','water','axe','pick','rifle','ammo','map','shirt','souvenir','paper','backpack','cargo','health','stamina'];
const hash=(b)=>createHash('sha256').update(b).digest('hex');
const approved='607e40f07a2695148ecbb8e541ec234eeeb92de7a223a26438d754d104576193';
if(!fs.existsSync(archive)){
  // Portable release ZIPs intentionally omit nested ZIP sources. Their actual PNGs were
  // already materialized by the release builder, and check:icons validates every file.
  const atlas=path.join(root,'public/assets/paper-icons/paper_atlas_64_indexed.png');
  const adapter=path.join(root,'public/paper-icons.js');
  if(fs.existsSync(atlas)&&fs.existsSync(adapter)){
    console.log('PAPER CUT UI ICONS: using materialized portable release assets');
    process.exit(0);
  }
  throw Error('Approved Paper Cut icon ZIP or preinstalled atlas missing: '+archive);
}
const zip=fs.readFileSync(archive);
let eocd=-1;
for(let p=zip.length-22;p>=Math.max(0,zip.length-65558);--p){
 if(zip.readUInt32LE(p)===0x06054b50){eocd=p;break;}
}
if(eocd<0)throw Error('ZIP central directory missing');
const count=zip.readUInt16LE(eocd+10);
let off=zip.readUInt32LE(eocd+16);
const imported=new Map();
for(let n=0;n<count;n++){
 if(zip.readUInt32LE(off)!==0x02014b50)throw Error('Invalid ZIP central header');
 const method=zip.readUInt16LE(off+10), compressedSize=zip.readUInt32LE(off+20), plainSize=zip.readUInt32LE(off+24);
 const nameLength=zip.readUInt16LE(off+28),extraLength=zip.readUInt16LE(off+30),commentLength=zip.readUInt16LE(off+32);
 const local=zip.readUInt32LE(off+42);
 const name=zip.subarray(off+46,off+46+nameLength).toString('utf8');
 off+=46+nameLength+extraLength+commentLength;
 if(!name.startsWith(prefix))continue;
 const rel=name.slice(prefix.length);
 // Only one JS adapter and exactly the approved icon assets: no path traversal or other runtime files.
 const selected=rel==='paper-icons.js'||/^assets\/paper-icons\/(?:manifest\.json|icons_registry\.json|paper_atlas_64_indexed\.png)$/.test(rel)||/^assets\/paper-icons\/icons_(?:64|256)\/(?:wood|stone|food|seed_hemp|seed_carrot|hemp|carrot|water|axe|pick|rifle|ammo|map|shirt|souvenir|paper|backpack|cargo|health|stamina)\.png$/.test(rel);
 if(!selected)continue;
 if(zip.readUInt32LE(local)!==0x04034b50)throw Error('Bad local ZIP entry for '+rel);
 const dataStart=local+30+zip.readUInt16LE(local+26)+zip.readUInt16LE(local+28);
 const packed=zip.subarray(dataStart,dataStart+compressedSize);
 const value=method===8?inflateRawSync(packed):method===0?packed:null;
 if(!value||value.length!==plainSize)throw Error('Invalid compressed entry: '+rel);
 imported.set(rel,value);
}
const required=['paper-icons.js','assets/paper-icons/manifest.json','assets/paper-icons/icons_registry.json','assets/paper-icons/paper_atlas_64_indexed.png',...expected.flatMap(id=>['assets/paper-icons/icons_256/'+id+'.png','assets/paper-icons/icons_64/'+id+'.png'])];
for(const name of required)if(!imported.has(name))throw Error('Approved ZIP missing '+name);
const manifest=JSON.parse(imported.get('assets/paper-icons/manifest.json').toString('utf8'));
const registry=JSON.parse(imported.get('assets/paper-icons/icons_registry.json').toString('utf8'));
if(JSON.stringify(manifest.ids)!==JSON.stringify(expected)||manifest.status!=='approved_and_packaged')throw Error('Approved manifest IDs/status mismatch');
if(JSON.stringify(registry.icons.map(i=>i.id))!==JSON.stringify(expected))throw Error('Source registry does not match 20-icon canon');
if(manifest.atlas.sha256!==approved||hash(imported.get('assets/paper-icons/paper_atlas_64_indexed.png'))!==approved)throw Error('Approved atlas SHA-256 mismatch');
const dims=(b)=>[b.readUInt32BE(16),b.readUInt32BE(20)];
for(const [rel,b] of imported){
 if(rel.endsWith('.png')){
  if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Not PNG: '+rel);
  const expectedSize=rel.includes('icons_256/')?256:rel.includes('icons_64/')?64:null;
  const size=expectedSize?[expectedSize,expectedSize]:[320,256];
  if(JSON.stringify(dims(b))!==JSON.stringify(size))throw Error('Unexpected image dimensions: '+rel);
 }
}
for(const icon of registry.icons){
 if(hash(imported.get('assets/paper-icons/'+icon.static_file))!==icon.image_sha256)throw Error('Approved 256px asset changed: '+icon.id);
}
for(const [rel,bytes] of imported){
 const dest=path.join(root,'public',rel);
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(bytes))fs.writeFileSync(dest,bytes);
}
console.log('PAPER CUT UI ICONS: 20/20 approved source images; exact atlas SHA-256 PASS; '+imported.size+' files imported into public/');
