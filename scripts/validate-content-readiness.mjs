#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const fail=[];
const warn=[];
const allowed=new Set(['FINAL','PLACEHOLDER','REQUIRES_APPROVAL']);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const json=p=>JSON.parse(read(p));
const routeToFile=route=>route==='/404.html'?'404.html':route==='/'?'index.html':`${route.replace(/^\//,'').replace(/\/$/,'')}/index.html`;

if(!exists('content/page-readiness.json')){
  console.error('✗ content/page-readiness.json missing');
  process.exit(1);
}

const data=json('content/page-readiness.json');
if(!Array.isArray(data.pages))fail.push('page-readiness.pages must be an array');
const pages=Array.isArray(data.pages)?data.pages:[];
const routes=new Set();
for(const page of pages){
  if(!page.route)fail.push('readiness entry missing route');
  if(routes.has(page.route))fail.push(`duplicate readiness route ${page.route}`);else routes.add(page.route);
  if(!allowed.has(page.state))fail.push(`${page.route}: invalid state ${page.state}`);
  if(!Array.isArray(page.source)||page.source.length===0)fail.push(`${page.route}: source list required`);
  if(!Array.isArray(page.blockingFields))fail.push(`${page.route}: blockingFields must be an array`);
  if(page.state==='FINAL'&&Array.isArray(page.blockingFields)&&page.blockingFields.length)fail.push(`${page.route}: FINAL page cannot have blockingFields`);
  if(page.state!=='FINAL'&&Array.isArray(page.blockingFields)&&page.blockingFields.length===0)warn.push(`${page.route}: non-FINAL page has no blockingFields`);
  const file=routeToFile(page.route);
  if(!exists(file))fail.push(`${page.route}: page file missing (${file})`);
}

const required=['/','/about/','/events/','/events/fuengirola/','/projects/','/projects/logic-awareness/','/community/','/community/valentin/','/community/nikita/','/community/evgeniy/','/community/gabil/','/merch/','/join/','/courses/dumai-s-opasnostyu/','/catalog/','/archive/','/donate/','/contacts/','/legal/privacy/','/legal/terms/','/404.html'];
for(const route of required)if(!routes.has(route))fail.push(`readiness registry missing required route ${route}`);

if(exists('content/registry.json')){
  const registry=json('content/registry.json');
  for(const entity of registry.entities||[]){
    if(entity.publicUrl&&!routes.has(entity.publicUrl))fail.push(`entity ${entity.id} publicUrl missing from page readiness: ${entity.publicUrl}`);
  }
}

const counts=pages.reduce((acc,p)=>(acc[p.state]=(acc[p.state]||0)+1,acc),{});
console.log(`Content readiness: ${pages.length} pages`);
for(const state of allowed)console.log(`✓ ${state}: ${counts[state]||0}`);
for(const message of warn)console.warn(`⚠ ${message}`);
for(const message of fail)console.error(`✗ ${message}`);
if(fail.length)process.exit(1);
