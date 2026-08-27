import fs from 'node:fs';
const p='ui-v2.css';
let css=fs.readFileSync(p,'utf8');
css=css.replace(/!important/g,'');
fs.writeFileSync(p,css);
console.log('Batch 4D.3 ui-v2 pressure cleanup applied');
