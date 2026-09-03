import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=path.join(process.cwd(),'_site');
const errors=[];
let checked=0;

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.isFile()&&entry.name.endsWith('.js')){
      checked++;
      const source=fs.readFileSync(full,'utf8');
      const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:source,encoding:'utf8'});
      if(result.status!==0){
        const rel=path.relative(root,full).replaceAll('\\','/');
        const detail=(result.stderr||result.stdout||'syntax error').trim().split('\n').slice(0,8).join(' | ');
        errors.push(`${rel}: ${detail}`);
      }
    }
  }
}

if(!fs.existsSync(root)){
  console.error('BUILT JS SYNTAX BLOCKED: _site missing; run build first');
  process.exit(1);
}

walk(root);
if(errors.length){
  console.error(`BUILT JS SYNTAX BLOCKED (${errors.length}/${checked} files failed)`);
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Built JavaScript syntax PASS: ${checked} files`);
