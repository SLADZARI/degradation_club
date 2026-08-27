import fs from 'node:fs';

const errors=[];
const presentation=fs.readFileSync('presentation-standard-v1.css','utf8');
if(presentation.includes("@import url('/course-bridge-v1.css')")) errors.push('presentation-standard-v1.css must not globally import course-bridge-v1.css');

const coursePages=[
  'courses/dengi-na-veter/index.html',
  'courses/dumai-s-opasnostyu/index.html',
  'courses/ne-komanda/index.html',
  'courses/slaboumie-i-otvaga/index.html',
];
for(const file of coursePages){
  const html=fs.readFileSync(file,'utf8');
  if(!html.includes('/course-bridge-v1.css')) errors.push(`${file}: missing explicit course bridge`);
}

const graph=JSON.parse(fs.readFileSync('artifacts/design-style-graph.json','utf8'));
for(const route of graph.routeStyles||[]){
  if(route.activeStyles?.includes('/course-bridge-v1.css') && !route.file.startsWith('/courses/')){
    errors.push(`${route.file}: course bridge leaked outside /courses/`);
  }
}

if(errors.length){
  console.error('Compatibility layer audit failed');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log('Compatibility layer audit passed: course bridge scoped to course routes');
