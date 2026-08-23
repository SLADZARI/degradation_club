#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const errors=[];
const warnings=[];
const ok=[];

const fail=(msg)=>errors.push(msg);
const warn=(msg)=>warnings.push(msg);
const pass=(msg)=>ok.push(msg);
const exists=(p)=>fs.existsSync(path.join(root,p));
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const json=(p)=>JSON.parse(read(p));

function routeToHtml(route){
  if(route==='/') return 'index.html';
  const clean=route.replace(/^\//,'').replace(/\/$/,'');
  return `${clean}/index.html`;
}

function requireFields(obj,fields,label){
  for(const field of fields){
    if(obj[field]===undefined||obj[field]===null||obj[field]==='') fail(`${label}: missing ${field}`);
  }
}

function loadConfig(){
  const file='site-config.js';
  if(!exists(file)){fail('site-config.js missing');return null;}
  const sandbox={window:{}};
  try{
    vm.runInNewContext(read(file),sandbox,{filename:file,timeout:1000});
    return sandbox.window.DEMENTOR_SITE_CONFIG||null;
  }catch(e){
    fail(`site-config.js cannot be evaluated: ${e.message}`);
    return null;
  }
}

function sitemapUrls(){
  if(!exists('sitemap.xml')){fail('sitemap.xml missing');return new Set();}
  const xml=read('sitemap.xml');
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  return new Set(urls);
}

function validateRegistry(){
  if(!exists('content/registry.json')){fail('content/registry.json missing');return [];}
  let registry;
  try{registry=json('content/registry.json');}catch(e){fail(`registry JSON invalid: ${e.message}`);return [];}
  if(!Array.isArray(registry.entities)){fail('registry.entities must be an array');return [];}

  const ids=new Set();
  const urls=new Set();
  const records=new Set();
  for(const entity of registry.entities){
    const label=`registry:${entity.id||'UNKNOWN'}`;
    requireFields(entity,['id','entityType','title','status','publicUrl','record'],label);
    if(ids.has(entity.id)) fail(`${label}: duplicate id`); else ids.add(entity.id);
    if(urls.has(entity.publicUrl)) fail(`${label}: duplicate publicUrl ${entity.publicUrl}`); else urls.add(entity.publicUrl);
    if(records.has(entity.record)) fail(`${label}: duplicate record ${entity.record}`); else records.add(entity.record);

    const recordPath=String(entity.record||'').replace(/^\//,'');
    if(!exists(recordPath)){fail(`${label}: record missing ${recordPath}`);continue;}
    let record;
    try{record=json(recordPath);}catch(e){fail(`${label}: record JSON invalid: ${e.message}`);continue;}
    requireFields(record,['id','entityType','title','status','publicUrl','provenance'],`record:${recordPath}`);
    for(const field of ['id','entityType','title','status','publicUrl']){
      if(record[field]!==entity[field]) fail(`${label}: ${field} differs from ${recordPath} (${JSON.stringify(entity[field])} != ${JSON.stringify(record[field])})`);
    }
    if(!record.provenance||!record.provenance.branch||!record.provenance.path) fail(`record:${recordPath}: provenance.branch/path required`);

    const html=routeToHtml(entity.publicUrl);
    if(!exists(html)) fail(`${label}: public page missing ${html}`);
  }

  if(registry.emptyRegisters){
    for(const [name,count] of Object.entries(registry.emptyRegisters)){
      if(!Number.isInteger(count)||count<0) fail(`registry.emptyRegisters.${name} must be a non-negative integer`);
      const actual=registry.entities.filter(e=>e.entityType===name||e.entityType===name.replace(/s$/,'')).length;
      if(count===0&&actual>0) fail(`registry.emptyRegisters.${name}=0 but registry contains ${actual} matching entities`);
    }
  }
  pass(`registry: ${registry.entities.length} entities validated`);
  return registry.entities;
}

function validateSitemap(entities,config){
  const urls=sitemapUrls();
  const origin=config?.canonicalOrigin||'https://degradation-club.vercel.app';
  for(const entity of entities){
    const full=new URL(entity.publicUrl,origin).href;
    if(!urls.has(full)) fail(`sitemap: missing entity URL ${full}`);
  }
  const required=['/','/about/','/events/','/projects/','/community/','/merch/','/join/','/archive/','/catalog/','/donate/','/contacts/','/legal/privacy/','/legal/terms/'];
  for(const route of required){
    const full=new URL(route,origin).href;
    if(!urls.has(full)) fail(`sitemap: missing required route ${full}`);
    const html=routeToHtml(route);
    if(!exists(html)) fail(`required route ${route}: page missing ${html}`);
  }
  pass(`sitemap: ${urls.size} URLs checked`);
}

function validateFeatures(config){
  if(!config){fail('site config unavailable');return;}
  requireFields(config,['version','canonicalOrigin','contacts','donate','merch','events','community','onboarding'],'site-config');
  try{new URL(config.canonicalOrigin);}catch{fail('site-config.canonicalOrigin must be an absolute URL');}

  const rules=[
    ['contacts',config.contacts,'endpoint',['endpoint']],
    ['donate',config.donate,'checkoutUrl',['provider','checkoutUrl','currency']],
    ['merch.checkout',config.merch,'checkoutUrl',['checkoutProvider','checkoutUrl'],'checkoutEnabled'],
    ['events.registration',config.events,'registrationUrl',['registrationProvider','registrationUrl'],'registrationEnabled'],
    ['community.membership',config.community,'membershipUrl',['membershipProvider','membershipUrl'],'membershipEnabled']
  ];
  for(const [name,obj,urlField,required,enabledField='enabled'] of rules){
    if(!obj){fail(`site-config.${name} missing`);continue;}
    const enabled=Boolean(obj[enabledField]);
    if(enabled){
      for(const key of required){if(!obj[key]) fail(`site-config.${name}: ${enabledField}=true requires ${key}`);}
      if(obj[urlField]){try{new URL(obj[urlField],config.canonicalOrigin);}catch{fail(`site-config.${name}.${urlField} invalid URL`);}}
    }else{
      if(obj[urlField]) warn(`site-config.${name}: ${enabledField}=false but ${urlField} is populated`);
    }
  }
  if(config.onboarding.storage!=='localStorage') warn(`onboarding storage is ${config.onboarding.storage}, privacy text may need review`);
  if(!config.onboarding.storageKey) fail('site-config.onboarding.storageKey required');
  pass('feature flags validated');
}

function validatePublicInvariants(entities,config){
  const byId=new Map(entities.map(e=>[e.id,e]));
  const course=byId.get('COURSE-001');
  if(course?.status==='approved-draft'){
    const surfaces=['index.html','community/valentin/index.html'];
    for(const file of surfaces){
      if(!exists(file)) continue;
      const html=read(file);
      if(/ONLINE COURSE\s*\/\s*ACTIVE/i.test(html)) fail(`${file}: COURSE-001 is approved-draft but surface says ONLINE COURSE / ACTIVE`);
      if(/>ACTIVE<\/small>/i.test(html)&&file.includes('valentin')) fail(`${file}: COURSE-001 is approved-draft but profile says ACTIVE`);
    }
    if(course.catalogPlacement&&course.catalogPlacement!=='not-approved') fail('COURSE-001 approved-draft must not be catalog-approved');
  }

  const merchCount=entities.filter(e=>e.entityType==='merch').length;
  if(merchCount===0&&config?.merch?.checkoutEnabled) fail('merch checkout cannot be enabled while registry has 0 merch entities');

  const event=byId.get('event-001-fuengirola');
  if(event?.status==='planned'&&config?.events?.registrationEnabled) fail('Fuengirola is planned; registration cannot be globally enabled before event source status changes');

  if(config?.community?.membershipEnabled){
    const community=exists('community/index.html')?read('community/index.html'):'';
    if(/MEMBERSHIP FORMAT<\/span><strong>NOT APPROVED/i.test(community)) fail('membershipEnabled=true while Community still says MEMBERSHIP FORMAT NOT APPROVED');
  }
  pass('public status invariants validated');
}

const config=loadConfig();
const entities=validateRegistry();
validateSitemap(entities,config);
validateFeatures(config);
validatePublicInvariants(entities,config);

console.log(`\nDementor Club site validation`);
for(const msg of ok) console.log(`✓ ${msg}`);
for(const msg of warnings) console.warn(`⚠ ${msg}`);
for(const msg of errors) console.error(`✗ ${msg}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
if(errors.length) process.exit(1);
