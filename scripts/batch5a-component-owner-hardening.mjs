import fs from 'node:fs';

const targets=['home-v1.css','dementor-roster.css','event-system.css','illustration-surfaces.css'];
for(const file of targets){
  let css=fs.readFileSync(file,'utf8');
  css=css.replace(/!important/g,'');
  css=css.replace(/[ \t]+\n/g,'\n');
  fs.writeFileSync(file,css);
}
console.log('Batch 5A component owner hardening applied:',targets.join(', '));
