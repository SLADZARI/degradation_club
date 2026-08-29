import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const artifact=path.join(root,'_site');
const errors=[];

if(!fs.existsSync(artifact)){
  console.error('PRODUCTION NAVIGATION BLOCKED');
  console.error('- _site artifact missing');
  process.exit(1);
}

const configPath=path.join(artifact,'site-config.js');
const config=fs.existsSync(configPath)?fs.readFileSync(configPath,'utf8'):'';
const cartEnabled=/cartEnabled\s*:\s*true/.test(config);
const internalToolsEnabled=/internalTools\s*:\s*\{\s*enabled\s*:\s*true/.test(config);

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()){walk(full);continue;}
    if(!entry.name.endsWith('.html'))continue;
    const rel=path.relative(artifact,full).replaceAll('\\','/');
    const html=fs.readFileSync(full,'utf8');
    for(const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)){
      const href=match[1].split('#',1)[0].split('?',1)[0];
      if(!href||/^(?:https?:|mailto:|tel:|#)/i.test(href))continue;
      let pathname=href;
      try{pathname=new URL(href,'https://dementor.club/'+rel).pathname;}catch{}
      if(pathname.startsWith('/design-system/')&&!internalToolsEnabled){
        errors.push(`${rel}: production link exposes QA-only internal route ${pathname}`);
      }
      if(pathname.startsWith('/cart/')&&!cartEnabled){
        errors.push(`${rel}: production link exposes disabled cart route ${pathname}`);
      }
    }
  }
}
walk(artifact);

if(fs.existsSync(path.join(artifact,'design-system','admin','index.html'))&&!internalToolsEnabled){
  errors.push('design-system/admin/index.html: QA-only admin surface leaked into production artifact');
}

if(errors.length){
  console.error('PRODUCTION NAVIGATION BLOCKED');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Production navigation guard passed. cartEnabled=${cartEnabled}; internalToolsEnabled=${internalToolsEnabled}`);
