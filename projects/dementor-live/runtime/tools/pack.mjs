// Portable ZIP writer, built-in Node modules only. Excludes runtime identities and secrets.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output=path.join(path.dirname(root),'dementor-live-workspace.zip');
const excluded=new Set(['node_modules','data','.git','backups','.local','__pycache__']);
const files=[];
function scan(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=path.join(dir,e.name);if(e.isSymbolicLink()||excluded.has(e.name)||e.name.startsWith('.env')||e.name==='.DS_Store'||e.name.endsWith('.zip'))continue;if(e.isDirectory())scan(rel);else if(e.isFile()&&e.name!=='MANIFEST.json')files.push(rel);}}
scan('');files.sort();
const manifest={project:'Dementor Live local workspace',createdAt:new Date().toISOString(),checks:fs.existsSync(path.join(root,'reports/check.json'))?JSON.parse(fs.readFileSync(path.join(root,'reports/check.json'),'utf8')):{browser:'NOT RUN',httpSse:'NOT RUN'},files:files.map(file=>{const bytes=fs.readFileSync(path.join(root,file));return {path:file.split(path.sep).join('/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};})};
fs.writeFileSync(path.join(root,'MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');files.push('MANIFEST.json');
const table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(bytes){let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
const local=[],central=[];let offset=0;
const date=new Date(),time=((date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1)),day=(((date.getFullYear()-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate());
for(const rel of files){const source=path.join(root,rel),data=fs.readFileSync(source),compressed=deflateRawSync(data),name=Buffer.from(path.basename(root)+'/'+rel.split(path.sep).join('/')),checksum=crc(data);
  const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt16LE(time,10);h.writeUInt16LE(day,12);h.writeUInt32LE(checksum,14);h.writeUInt32LE(compressed.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(name.length,26);local.push(h,name,compressed);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(0x0314,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(time,12);c.writeUInt16LE(day,14);c.writeUInt32LE(checksum,16);c.writeUInt32LE(compressed.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE((fs.statSync(source).mode&0xffff)*65536>>>0,38);c.writeUInt32LE(offset,42);central.push(c,name);offset+=h.length+name.length+compressed.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
fs.writeFileSync(output+'.tmp',Buffer.concat([...local,directory,end]));fs.renameSync(output+'.tmp',output);console.log(JSON.stringify({archive:output,files:files.length,bytes:fs.statSync(output).size,sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex')},null,2));
