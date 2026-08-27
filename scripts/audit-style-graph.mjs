import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['.git','node_modules']);
const htmlFiles = [];
const cssFiles = [];

function walk(dir){
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir,ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && p.endsWith('.html')) htmlFiles.push(p);
    else if (ent.isFile() && p.endsWith('.css')) cssFiles.push(p);
  }
}
walk(ROOT);

const rel = p => '/' + path.relative(ROOT,p).replaceAll('\\','/');
const read = p => fs.readFileSync(p,'utf8');
const uniq = a => [...new Set(a)];

const globalStyles = read(path.join(ROOT,'styles.css'));
const globalImports = [...globalStyles.matchAll(/@import\s+url\(['\"]([^'\"]+)['\"]\)/g)].map(m=>m[1]);

const routeRows = [];
const duplicateLinks = [];
for (const file of htmlFiles){
  const html = read(file);
  const linked = [...html.matchAll(/<link[^>]+rel=['\"]stylesheet['\"][^>]+href=['\"]([^'\"]+)['\"]/gi)].map(m=>m[1]);
  if (!linked.length) continue;
  const duplicatedGlobal = linked.filter(x => globalImports.includes(x));
  const repeated = linked.filter((x,i,a)=>a.indexOf(x)!==i);
  routeRows.push({file:rel(file),linked,duplicatedGlobal:uniq(duplicatedGlobal),repeated:uniq(repeated)});
  if (duplicatedGlobal.length || repeated.length) duplicateLinks.push(routeRows.at(-1));
}

const cssStats = [];
for (const file of cssFiles){
  const css = read(file);
  const pseudo = (css.match(/::before|::after/g)||[]).length;
  const important = (css.match(/!important/g)||[]).length;
  const has = (css.match(/:has\(/g)||[]).length;
  const z = [...css.matchAll(/z-index\s*:\s*([^;}]+)/g)].map(m=>m[1].trim());
  const blend = (css.match(/mix-blend-mode\s*:/g)||[]).length;
  const isolation = (css.match(/isolation\s*:/g)||[]).length;
  const bgImages = [...css.matchAll(/background(?:-image)?\s*:[^;]*url\(([^)]+)\)/g)].map(m=>m[1].replaceAll(/["']/g,'').trim());
  if (pseudo||important||has||z.length||blend||isolation||bgImages.length){
    cssStats.push({file:rel(file),pseudo,important,has,z,blend,isolation,bgImages:uniq(bgImages)});
  }
}

cssStats.sort((a,b)=>(b.important+b.pseudo+b.has)-(a.important+a.pseudo+a.has));

const conflicts = [
  ['.dc-dementor-hero__portrait','dementor hero portrait'],
  ['.dc-dementor-hero__layout','dementor hero layout'],
  ['.dc-fuengirola-page .dc-entity-hero::after','Fuengirola hero pseudo layer'],
  ['.dc-home section.dc-event:has','Home feature/event structural selector'],
  ['.dc-ink-slot','generic ink slot']
];
const selectorOwners = {};
for (const [needle,label] of conflicts){
  selectorOwners[label] = cssFiles.filter(f=>read(f).includes(needle)).map(rel);
}

const out = {
  generatedAt:new Date().toISOString(),
  globalImports,
  routesScanned:routeRows.length,
  duplicateStylesheetRoutes:duplicateLinks,
  selectorOwners,
  cssRiskStats:cssStats
};

fs.mkdirSync(path.join(ROOT,'artifacts'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'artifacts','design-style-graph.json'),JSON.stringify(out,null,2));

console.log(`Style graph audit: ${routeRows.length} HTML routes/components with stylesheet links`);
console.log(`Duplicate global stylesheet links: ${duplicateLinks.length}`);
for (const row of duplicateLinks) console.log(`- ${row.file}: ${row.duplicatedGlobal.join(', ')}`);
console.log('Selector ownership:');
for (const [label,owners] of Object.entries(selectorOwners)) console.log(`- ${label}: ${owners.join(', ') || 'NONE'}`);
console.log('Top CSS risk files:');
for (const row of cssStats.slice(0,12)) console.log(`- ${row.file}: pseudo=${row.pseudo} important=${row.important} :has=${row.has} z=${row.z.length} blend=${row.blend} isolation=${row.isolation}`);
