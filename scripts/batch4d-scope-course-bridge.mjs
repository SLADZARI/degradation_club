import fs from 'node:fs';

const presentation='presentation-standard-v1.css';
let css=fs.readFileSync(presentation,'utf8');
css=css.replace(/^@import url\('\/course-bridge-v1\.css'\);\s*/,'');
fs.writeFileSync(presentation,css);

const coursePages=[
  'courses/dengi-na-veter/index.html',
  'courses/dumai-s-opasnostyu/index.html',
  'courses/ne-komanda/index.html',
  'courses/slaboumie-i-otvaga/index.html',
];
for(const file of coursePages){
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('/course-bridge-v1.css')){
    html=html.replace('<link rel="stylesheet" href="/styles.css">','<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/course-bridge-v1.css">');
  }
  fs.writeFileSync(file,html);
}
console.log('Batch 4D course bridge scoping applied');
