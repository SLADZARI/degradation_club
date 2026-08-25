#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const errors=[];
const ok=[];
const fail=msg=>errors.push(msg);
const pass=msg=>ok.push(msg);
const exists=p=>fs.existsSync(path.join(root,p));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));

const storePath='content/merch/store.json';
const registryPath='content/registry.json';

if(!exists(storePath)) fail(`${storePath} missing`);
if(!exists(registryPath)) fail(`${registryPath} missing`);

let store=null;
let registry=null;
try{if(exists(storePath))store=json(storePath);}catch(e){fail(`${storePath}: invalid JSON: ${e.message}`);}
try{if(exists(registryPath))registry=json(registryPath);}catch(e){fail(`${registryPath}: invalid JSON: ${e.message}`);}

const stockAllowed=new Set(['unknown','preorder','in-stock','low-stock','out-of-stock','made-to-order']);
const saleAllowed=new Set(['closed','preview','preorder','open','paused','sold-out']);
const publicProductStatuses=new Set(['approved','production','available','sold-out','archived']);

if(store){
  if(store.currency?.canonical!=='EUR') fail('store.currency.canonical must remain EUR');
  if(store.checkout?.cartEnabled!==false) fail('v1 store must keep cartEnabled=false');
  if(store.checkout?.accountRequired!==false) fail('v1 store must keep accountRequired=false');
  if(!Array.isArray(store.products)) fail('store.products must be an array');
  if(!Array.isArray(store.categories)||store.categories.length===0) fail('store.categories must be a non-empty array');

  const ids=new Set();
  const urls=new Set();
  const skus=new Set();
  const categoryIds=new Set();
  const registryById=new Map((registry?.entities||[]).map(e=>[e.id,e]));

  for(const category of store.categories||[]){
    if(!category.id||!category.label) fail('store category requires id and label');
    if(categoryIds.has(category.id)) fail(`duplicate store category ${category.id}`); else categoryIds.add(category.id);
    if(!Number.isInteger(category.publicCount)||category.publicCount<0) fail(`store category ${category.id}: publicCount must be non-negative integer`);
  }
  if(!categoryIds.has('all')) fail('store.categories must include all');

  for(const product of store.products||[]){
    const label=`store product ${product.id||'UNKNOWN'}`;
    for(const field of ['id','title','category','categoryId','status','saleStatus','publicUrl','record']){
      if(product[field]===undefined||product[field]===null||product[field]==='') fail(`${label}: missing ${field}`);
    }
    if(ids.has(product.id)) fail(`${label}: duplicate id`); else ids.add(product.id);
    if(urls.has(product.publicUrl)) fail(`${label}: duplicate publicUrl`); else urls.add(product.publicUrl);
    if(!categoryIds.has(product.categoryId)) fail(`${label}: unknown categoryId ${product.categoryId}`);
    if(!publicProductStatuses.has(product.status)) fail(`${label}: status ${product.status} is not public-store eligible`);
    if(!saleAllowed.has(product.saleStatus)) fail(`${label}: invalid saleStatus ${product.saleStatus}`);
    if(typeof product.fromPriceEur!=='number'||product.fromPriceEur<=0) fail(`${label}: fromPriceEur must be positive number`);

    const registryEntity=registryById.get(product.id);
    if(!registryEntity) fail(`${label}: missing from content/registry.json`);
    else{
      for(const field of ['title','status','publicUrl','record']){
        if(registryEntity[field]!==product[field]) fail(`${label}: ${field} differs from registry`);
      }
      if(registryEntity.entityType!=='merch') fail(`${label}: registry entityType must be merch`);
    }

    const recordPath=String(product.record||'').replace(/^\//,'');
    if(!exists(recordPath)){fail(`${label}: record missing ${recordPath}`);continue;}
    let record;
    try{record=json(recordPath);}catch(e){fail(`${label}: invalid record JSON: ${e.message}`);continue;}
    for(const field of ['id','title','status','saleStatus','publicUrl']){
      if(record[field]!==product[field]) fail(`${label}: ${field} differs from ${recordPath}`);
    }
    if(!Array.isArray(record.variants)||record.variants.length===0) fail(`${label}: variants[] required`);

    let minPrice=Infinity;
    let hasLiveOffer=false;
    for(const variant of record.variants||[]){
      const vlabel=`${label} / ${variant.sku||'UNKNOWN SKU'}`;
      if(!variant.sku) fail(`${vlabel}: sku required`);
      if(skus.has(variant.sku)) fail(`${vlabel}: duplicate SKU`); else skus.add(variant.sku);
      if(typeof variant.basePriceEur!=='number'||variant.basePriceEur<=0) fail(`${vlabel}: basePriceEur must be positive number`);
      else minPrice=Math.min(minPrice,variant.basePriceEur);
      if(!stockAllowed.has(variant.stockStatus)) fail(`${vlabel}: invalid stockStatus ${variant.stockStatus}`);
      const offer=variant.offer||{};
      if(!saleAllowed.has(offer.saleStatus)) fail(`${vlabel}: invalid offer.saleStatus ${offer.saleStatus}`);
      if(['open','preorder'].includes(offer.saleStatus)){
        hasLiveOffer=true;
        if(!offer.purchaseUrl) fail(`${vlabel}: ${offer.saleStatus} requires purchaseUrl`);
        if(record.status!=='available') fail(`${vlabel}: live offer requires product status available`);
      }
      if(!['open','preorder'].includes(offer.saleStatus)&&offer.purchaseUrl) fail(`${vlabel}: purchaseUrl present while saleStatus=${offer.saleStatus}`);
    }
    if(Number.isFinite(minPrice)&&minPrice!==product.fromPriceEur) fail(`${label}: fromPriceEur ${product.fromPriceEur} != minimum variant price ${minPrice}`);
    if(hasLiveOffer&&!['open','preorder'].includes(product.saleStatus)) fail(`${label}: variant has live offer but product saleStatus=${product.saleStatus}`);
    if(['open','preorder'].includes(product.saleStatus)&&record.status!=='available') fail(`${label}: product saleStatus ${product.saleStatus} requires status available`);
  }

  for(const category of store.categories||[]){
    const actual=category.id==='all'?(store.products||[]).length:(store.products||[]).filter(p=>p.categoryId===category.id).length;
    if(category.publicCount!==actual) fail(`store category ${category.id}: publicCount ${category.publicCount} != actual ${actual}`);
  }

  const publicIds=new Set((store.products||[]).map(p=>p.id));
  for(const previewRaw of store.privatePreviewRecords||[]){
    const previewPath=String(previewRaw).replace(/^\//,'');
    if(!exists(previewPath)){fail(`private preview missing ${previewPath}`);continue;}
    let preview;
    try{preview=json(previewPath);}catch(e){fail(`${previewPath}: invalid JSON: ${e.message}`);continue;}
    if(preview.visibility!=='private-wip') fail(`${previewPath}: visibility must be private-wip`);
    if(preview.publicCatalog!==false) fail(`${previewPath}: publicCatalog must be false`);
    for(const concept of preview.productConcepts||[]){
      if(publicIds.has(concept.id)) fail(`${previewPath}: prototype ${concept.id} also appears in public store products[]`);
      if(concept.publicCatalog!==false) fail(`${previewPath}: productConcept ${concept.id} must keep publicCatalog=false`);
      if(concept.status!=='prototype') fail(`${previewPath}: productConcept ${concept.id} expected prototype status`);
      if(concept.priceEur!==null) fail(`${previewPath}: prototype ${concept.id} price must remain null until approved`);
    }
  }
  pass(`store manifest: ${(store.products||[]).length} public products validated`);
  pass(`store categories: ${(store.categories||[]).length} counts validated`);
  pass(`private previews: ${(store.privatePreviewRecords||[]).length} checked`);
}

if(exists('site-config.js')){
  const sandbox={window:{}};
  try{
    vm.runInNewContext(read('site-config.js'),sandbox,{filename:'site-config.js',timeout:1000});
    const cfg=sandbox.window.DEMENTOR_SITE_CONFIG;
    if(cfg?.merch?.checkoutEnabled){
      const hasOpen=(store?.products||[]).some(p=>{
        const recordPath=String(p.record||'').replace(/^\//,'');
        if(!exists(recordPath))return false;
        const record=json(recordPath);
        if(record.status!=='available')return false;
        return (record.variants||[]).some(v=>['open','preorder'].includes(v.offer?.saleStatus)&&Boolean(v.offer?.purchaseUrl||cfg.merch.checkoutUrl));
      });
      if(!hasOpen) fail('merch.checkoutEnabled=true but no AVAILABLE product has an open/preorder offer with checkout URL');
    }
    pass(`checkout flag: ${cfg?.merch?.checkoutEnabled?'ENABLED':'DISABLED'}`);
  }catch(e){fail(`site-config.js cannot be evaluated: ${e.message}`);}
}

if(exists('vercel.json')){
  try{
    const vercel=json('vercel.json');
    const wip=vercel?.git?.deploymentEnabled?.['wip-merch-store-architecture'];
    if(wip!==false) fail('vercel.json must explicitly keep wip-merch-store-architecture deployment disabled');
    else pass('Vercel WIP branch deployment explicitly disabled');
  }catch(e){fail(`vercel.json invalid: ${e.message}`);}
}

console.log('\nDementor Club merch store validation');
for(const msg of ok)console.log(`✓ ${msg}`);
for(const msg of errors)console.error(`✗ ${msg}`);
console.log(`\n${errors.length} error(s)`);
if(errors.length)process.exit(1);
