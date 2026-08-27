import fs from 'node:fs';
import path from 'node:path';

const errors=[];
const styles=fs.readFileSync('styles.css','utf8');
const ui=fs.readFileSync('ui-v2.css','utf8');
if(!fs.existsSync('mobile-guardrails.css')) errors.push('mobile-guardrails.css is missing');
const guard=fs.existsSync('mobile-guardrails.css')?fs.readFileSync('mobile-guardrails.css','utf8'):'';

if(!styles.includes("@import url('/mobile-guardrails.css');")) errors.push('styles.css must import mobile-guardrails.css');
if(ui.includes('mobile-qa.css')||ui.includes('mobile-overflow-fix.css')) errors.push('ui-v2.css must not import legacy mobile layers');
if(fs.existsSync('mobile-qa.css')||fs.existsSync('mobile-overflow-fix.css')) errors.push('legacy mobile guardrail files must be removed');
if((guard.match(/!important/g)||[]).length!==0) errors.push('mobile-guardrails.css must be override-free');
if(!guard.includes('viewport safety only')) errors.push('mobile guardrail scope comment is missing');
if(/\.dc-display-(xl|l)\{[^}]*font-size/.test(guard)) errors.push('mobile guardrails must not own display typography scale');

const ignored=new Set(['node_modules','.git','docs','.github','scripts','artifacts']);
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(ignored.has(entry.name)) continue;
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(p);
    else if(/\.(html|css|js)$/.test(entry.name)){
      const text=fs.readFileSync(p,'utf8');
      if(text.includes('mobile-qa.css')||text.includes('mobile-overflow-fix.css')) errors.push(`${p}: legacy runtime mobile layer reference remains`);
    }
  }
}
walk('.');

if(errors.length){
  console.error('Mobile guardrail audit failed');
  for(const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('Mobile guardrail audit passed: one structural layer / zero legacy runtime refs / zero !important');
