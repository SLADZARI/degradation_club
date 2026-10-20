// Verify approved v2 files inside Docker candidate before any production cutover.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const folder=path.join(root,'public/assets/paper-icons');
const m=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
const ids=['wood','stone','food','seed_hemp','seed_carrot','hemp','carrot','water','axe','pick','rifle','ammo','map','shirt','souvenir','paper','backpack','cargo','health','stamina'];
function assert(ok,message){if(!ok)throw Error('Paper Cut v2: '+message);}
assert(m.version==='2.0.0-review','unexpected pack version');
assert(JSON.stringify(m.ids)===JSON.stringify(ids),'20 ID order mismatch');
assert(m.grid.columns===5&&m.grid.rows===4&&m.grid.cell===64,'atlas layout mismatch');
for(const id of ids){
 const png=fs.readFileSync(path.join(folder,'png_256',id+'.png'));
 assert(png.subarray(0,8).toString('hex')==='89504e470d0a1a0a',id+' PNG signature');
 assert(png.readUInt32BE(16)===256&&png.readUInt32BE(20)===256,id+' PNG dimensions');
 assert(createHash('sha256').update(png).digest('hex')===m.asset_sha256[id],id+' checksum mismatch');
 assert(fs.existsSync(path.join(folder,'png_64',id+'.png')),'missing 64px '+id);
}
for(const [file,w,h] of [['paper_atlas_64.png',320,256],['paper_atlas_256.png',1280,1024]]){
 const png=fs.readFileSync(path.join(folder,file));
 assert(png.readUInt32BE(16)===w&&png.readUInt32BE(20)===h,file+' dimensions');
 assert(createHash('sha256').update(png).digest('hex')===m.atlas_sha256[file],file+' checksum mismatch');
}
const adapter=fs.readFileSync(path.join(root,'public/paper-icons.js'),'utf8');
for(const id of ids)assert(adapter.includes("'"+id+"'"),'adapter missing '+id);
for(const f of ['public/index.html','public/combat.html']){
 const html=fs.readFileSync(path.join(root,f),'utf8');
 assert(html.includes('/paper-icons.js')&&html.includes('/paper-icons.css'),f+' not wired');
}
const server=fs.readFileSync(path.join(root,'server.mjs'),'utf8');
assert(server.includes('Paper Cut v2 statics'),'icon routes not served');
console.log('Paper Cut UI v2: PASS 20/20 PNG + 64px + atlas SHA + CSS/JS + both screens');
