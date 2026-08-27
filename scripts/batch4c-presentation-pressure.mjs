import fs from 'node:fs';

const path='presentation-standard-v1.css';
let css=fs.readFileSync(path,'utf8');
const before=(css.match(/!important/g)||[]).length;

// presentation-standard is a baseline layer loaded before visual-standard and route CSS.
// It must not win by force: component/route owners are allowed to override it normally.
css=css.replace(/!important/g,'');

fs.writeFileSync(path,css);
const after=(css.match(/!important/g)||[]).length;
console.log(`Batch 4C presentation pressure: ${before} -> ${after} !important`);
