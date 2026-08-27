import fs from 'node:fs';

const files=['ui-v2.css','illustration-surfaces.css','community-v2.css','visual-standard-v2.css'];
const css=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
const errors=[];

if(css['ui-v2.css'].includes('/* Dementor Ink raster integration — fixed editorial scenes. */')) errors.push('ui-v2.css still owns generic Ink slot block');
if(!css['illustration-surfaces.css'].includes('/* GENERIC INK SLOT — canonical owner. */')) errors.push('illustration-surfaces.css missing canonical generic Ink slot owner');
if(!css['illustration-surfaces.css'].includes('.dc-ink-slot{position:relative')) errors.push('illustration-surfaces.css missing base .dc-ink-slot geometry');
if(!css['illustration-surfaces.css'].includes('object-fit:contain')) errors.push('illustration-surfaces.css missing contain-first image rule');

const genericOwners=files.filter(f=>/\.dc-ink-slot\{/.test(css[f]));
if(genericOwners.length!==1 || genericOwners[0]!=='illustration-surfaces.css') errors.push(`generic .dc-ink-slot owner must be illustration-surfaces.css only; got ${genericOwners.join(', ')||'none'}`);

const communityImgOwners=files.filter(f=>/\.dc-community-opening__art img\{/.test(css[f]));
if(communityImgOwners.length!==1 || communityImgOwners[0]!=='illustration-surfaces.css') errors.push(`Community art image owner must be illustration-surfaces.css only; got ${communityImgOwners.join(', ')||'none'}`);

const veilOwners=files.filter(f=>/\.dc-community-opening__veil\{/.test(css[f]));
if(veilOwners.length!==1 || veilOwners[0]!=='community-v2.css') errors.push(`Community veil owner must be community-v2.css only; got ${veilOwners.join(', ')||'none'}`);

if(css['visual-standard-v2.css'].includes('Any remaining event media uses the same upper-right crop rule')) errors.push('visual-standard-v2.css still owns fallback event media crop');

if(errors.length){
  console.error('Ink surface audit failed');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log('Ink surface audit passed: canonical surface owner + Community opening ownership');
