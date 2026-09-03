import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const artifact=path.join(root,'_site');
const manifestPath=path.join(root,'production-route-manifest.json');
const sitemapPath=path.join(artifact,'sitemap.xml');
const origin='https://dementor.club';
const errors=[];
const pass=[];

const fail=msg=>errors.push(msg);
const routeFile=route=>route==='/'?path.join(artifact,'index.html'):path.join(artifact,route.replace(/^\//,'').replace(/\/$/,''),'index.html');
const routeExists=route=>fs.existsSync(routeFile(route));
const noindex=route=>routeExists(route)&&/name=["']robots["'][^>]*content=["'][^"']*noindex|content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots/i.test(fs.readFileSync(routeFile(route),'utf8'));

if(!fs.existsSync(artifact))fail('_site missing; run build first');
if(!fs.existsSync(manifestPath))fail('production-route-manifest.json missing');
if(!fs.existsSync(sitemapPath))fail('_site/sitemap.xml missing');

if(!errors.length){
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  const sitemap=fs.readFileSync(sitemapPath,'utf8');
  const sitemapRoutes=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname));
  const groups=['indexable','privateNoindex','compatNoindex','disabled','sourceOnly'];
  const seen=new Map();
  for(const group of groups){
    if(!Array.isArray(manifest[group])){fail(`manifest.${group} must be an array`);continue;}
    for(const route of manifest[group]){
      if(seen.has(route))fail(`route ${route} appears in both ${seen.get(route)} and ${group}`);else seen.set(route,group);
    }
  }

  for(const route of manifest.indexable||[]){
    if(!routeExists(route))fail(`indexable route missing from production artifact: ${route}`);
    else if(noindex(route))fail(`indexable route is noindex: ${route}`);
    if(!sitemapRoutes.has(route))fail(`indexable route missing from sitemap: ${route}`);
  }

  for(const route of [...(manifest.privateNoindex||[]),...(manifest.compatNoindex||[])]){
    if(!routeExists(route))fail(`private/compat route missing from production artifact: ${route}`);
    else if(!noindex(route))fail(`private/compat route must be noindex: ${route}`);
    if(sitemapRoutes.has(route))fail(`private/compat route must not be in sitemap: ${route}`);
  }

  for(const route of manifest.disabled||[]){
    if(routeExists(route))fail(`disabled route unexpectedly published: ${route}`);
    if(sitemapRoutes.has(route))fail(`disabled route appears in sitemap: ${route}`);
  }

  for(const route of manifest.sourceOnly||[]){
    if(routeExists(route))fail(`source-only route unexpectedly published: ${route}`);
    if(sitemapRoutes.has(route))fail(`source-only route appears in sitemap: ${route}`);
  }

  const expected=new Set(manifest.indexable||[]);
  for(const route of sitemapRoutes)if(!expected.has(route))fail(`sitemap route is not declared indexable: ${route}`);

  for(const [route,source] of Object.entries(manifest.generatedPrivate||{})){
    if(!fs.existsSync(path.join(root,source)))fail(`generated private source missing for ${route}: ${source}`);
    if(!routeExists(route))fail(`generated private route missing after build: ${route}`);
    else if(!noindex(route))fail(`generated private route must be noindex: ${route}`);
  }

  for(const raw of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]))if(!raw.startsWith(origin+'/')&&raw!==origin+'/')fail(`sitemap URL uses wrong origin: ${raw}`);
  pass.push(`${manifest.indexable?.length||0} indexable routes`);
  pass.push(`${(manifest.privateNoindex?.length||0)+(manifest.compatNoindex?.length||0)} private/compat routes`);
  pass.push(`${manifest.disabled?.length||0} disabled routes`);
}

if(errors.length){console.error('PRODUCTION ROUTE MANIFEST BLOCKED');for(const e of errors)console.error(`- ${e}`);process.exit(1);}
console.log(`Production route manifest passed: ${pass.join(' · ')}`);
