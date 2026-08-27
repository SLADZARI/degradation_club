import fs from 'node:fs';
const path='visual-standard-v2.css';
const marker='/* Any remaining event media uses the same upper-right crop rule. */';
let lines=fs.readFileSync(path,'utf8').split('\n');
const i=lines.findIndex(line=>line.trim()===marker);
if(i>=0){
  lines.splice(i,2);
  if(lines[i]?.trim()==='') lines.splice(i,1);
}
fs.writeFileSync(path,lines.join('\n'));
console.log(i>=0?'Removed Event fallback rule':'Event fallback rule already absent');
