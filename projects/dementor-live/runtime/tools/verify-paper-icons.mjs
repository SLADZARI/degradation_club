// Release blocker: approved visual binary must be present; do not silently ship emojis.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const folder=path.join(root,'public/assets/paper-icons');
const manifestPath=path.join(folder,'manifest.json');
const atlasPath=path.join(folder,'paper_atlas_64_indexed.png');
const adapterPath=path.join(root,'public/paper-icons.js');
const expectedIds=[
  'wood','stone','food','seed_hemp','seed_carrot','hemp','carrot','water','axe','pick',
  'rifle','ammo','map','shirt','souvenir','paper','backpack','cargo','health','stamina'
];
const errors=[];
let manifest;
if(!fs.existsSync(manifestPath))errors.push('Missing canonical icon manifest.json');
else {
  try {manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));}
  catch(e){errors.push('Invalid manifest JSON: '+e.message);}
}
if(manifest){
  if(manifest.schema!=='dementor-paper-cut-ui-icons-v1')errors.push('Unexpected icon registry schema');
  if(JSON.stringify(manifest.ids)!==JSON.stringify(expectedIds))errors.push('20-icon id/order mismatch');
  if(manifest.atlas?.cols!==5||manifest.atlas?.rows!==4||manifest.atlas?.cellPx!==64)errors.push('Atlas layout must be 5x4 of 64px');
  if(manifest.atlas?.sha256!=='607e40f07a2695148ecbb8e541ec234eeeb92de7a223a26438d754d104576193')errors.push('Approved atlas SHA-256 differs from canonical checksum');
}
if(!fs.existsSync(atlasPath))errors.push('Missing APPROVED icon atlas: public/assets/paper-icons/paper_atlas_64_indexed.png');
else {
  const data=fs.readFileSync(atlasPath);
  if(data.length<24||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')errors.push('Atlas is not a valid PNG header');
  else if(data.readUInt32BE(16)!==320||data.readUInt32BE(20)!==256)errors.push('Atlas must be 320x256 PNG');
  const sha=createHash('sha256').update(data).digest('hex');
  if(sha!==manifest?.atlas?.sha256)errors.push('Atlas mismatch: SHA-256 '+sha+' is not approved');
}
if(!fs.existsSync(adapterPath))errors.push('Missing public/paper-icons.js runtime adapter');
if(errors.length){
  console.error('PAPER CUT ICON CANON v1: BLOCKED — do not release without approved files.');
  for(const error of errors)console.error(' - '+error);
  process.exit(1);
}
console.log('PAPER CUT ICON CANON v1: asset integrity PASS (20/20 IDs, atlas geometry + SHA-256).');
console.log('WARNING: this gate verifies files, not the actual HUD rendering. Browser visual QA remains mandatory.');
