import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['.git','node_modules','artifacts']);
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

function normalizeCssHref(href, ownerFile){
  if (!href || /^(https?:)?\/\//i.test(href) || href.startsWith('data:')) return null;
  if (href.startsWith('/')) return href;
  const ownerDir = path.dirname(ownerFile);
  return '/' + path.relative(ROOT,path.resolve(ownerDir,href)).replaceAll('\\','/');
}

function importsFor(cssFile){
  const css = read(cssFile);
  return [...css.matchAll(/@import\s+(?:url\()?['\"]([^'\"]+)['\"]\)?/g)]
    .map(m=>normalizeCssHref(m[1],cssFile))
    .filter(Boolean);
}

const importGraph = {};
for (const file of cssFiles) importGraph[rel(file)] = importsFor(file);

function resolveClosure(initial){
  const seen = new Set();
  const stack = [...initial];
  while(stack.length){
    const href = stack.pop();
    if (!href || seen.has(href)) continue;
    seen.add(href);
    for (const child of importGraph[href] || []) stack.push(child);
  }
  return [...seen];
}

const globalImports = importGraph['/styles.css'] || [];

const routeRows = [];
const duplicateLinks = [];
const activeCssSet = new Set();
for (const file of htmlFiles){
  const html = read(file);
  const linkedRaw = [...html.matchAll(/<link[^>]+rel=['\"]stylesheet['\"][^>]+href=['\"]([^'\"]+)['\"]/gi)].map(m=>m[1]);
  if (!linkedRaw.length) continue;
  const linked = linkedRaw.map(x=>normalizeCssHref(x,file)).filter(Boolean);
  const activeStyles = resolveClosure(linked);
  activeStyles.forEach(x=>activeCssSet.add(x));
  const duplicatedGlobal = linked.filter(x => globalImports.includes(x));
  const repeated = linked.filter((x,i,a)=>a.indexOf(x)!==i);
  routeRows.push({file:rel(file),linked,activeStyles,duplicatedGlobal:uniq(duplicatedGlobal),repeated:uniq(repeated)});
  if (duplicatedGlobal.length || repeated.length) duplicateLinks.push(routeRows.at(-1));
}

function statCss(file){
  const css = read(file);
  const pseudo = (css.match(/::before|::after/g)||[]).length;
  const important = (css.match(/!important/g)||[]).length;
  const has = (css.match(/:has\(/g)||[]).length;
  const z = [...css.matchAll(/z-index\s*:\s*([^;}]+)/g)].map(m=>m[1].trim());
  const blend = (css.match(/mix-blend-mode\s*:/g)||[]).length;
  const isolation = (css.match(/isolation\s*:/g)||[]).length;
  const bgImages = [...css.matchAll(/background(?:-image)?\s*:[^;]*url\(([^)]+)\)/g)].map(m=>m[1].replaceAll(/["']/g,'').trim());
  return {file:rel(file),pseudo,important,has,z,blend,isolation,bgImages:uniq(bgImages)};
}

const cssStats = cssFiles.map(statCss).filter(x=>x.pseudo||x.important||x.has||x.z.length||x.blend||x.isolation||x.bgImages.length);
const riskScore = x => x.important + x.pseudo + x.has;
cssStats.sort((a,b)=>riskScore(b)-riskScore(a));
const activeCssRiskStats = cssStats.filter(x=>activeCssSet.has(x.file));
const inactiveCss = cssFiles.map(rel).filter(x=>!activeCssSet.has(x)).sort();

const conflicts = [
  ['.dc-dementor-hero__portrait','dementor hero portrait'],
  ['.dc-dementor-hero__layout','dementor hero layout'],
  ['.dc-fuengirola-page .dc-entity-hero::after','Fuengirola hero pseudo layer'],
  ['.dc-home section.dc-event:has','Home feature/event structural selector'],
  ['.dc-ink-slot','generic ink slot']
];
const selectorOwners = {};
const activeSelectorOwners = {};
for (const [needle,label] of conflicts){
  const all = cssFiles.filter(f=>read(f).includes(needle)).map(rel);
  selectorOwners[label] = all;
  activeSelectorOwners[label] = all.filter(x=>activeCssSet.has(x));
}

const inlineStyleRoutes = [];
for (const file of htmlFiles){
  const html = read(file);
  const blocks = (html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi)||[]).length;
  if (blocks) inlineStyleRoutes.push({file:rel(file),blocks});
}

const out = {
  generatedAt:new Date().toISOString(),
  globalImports,
  routesScanned:routeRows.length,
  routeStyles:routeRows,
  duplicateStylesheetRoutes:duplicateLinks,
  inlineStyleRoutes,
  activeCss:[...activeCssSet].sort(),
  inactiveCss,
  selectorOwners,
  activeSelectorOwners,
  activeCssRiskStats,
  cssRiskStats:cssStats
};

fs.mkdirSync(path.join(ROOT,'artifacts'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'artifacts','design-style-graph.json'),JSON.stringify(out,null,2));

console.log(`Style graph audit: ${routeRows.length} HTML routes/components with stylesheet links`);
console.log(`Duplicate global stylesheet links: ${duplicateLinks.length}`);
console.log(`Active CSS files: ${activeCssSet.size}; inactive CSS files: ${inactiveCss.length}`);
console.log(`Routes with inline <style>: ${inlineStyleRoutes.length}`);
for (const row of inlineStyleRoutes) console.log(`- ${row.file}: ${row.blocks}`);
console.log('Active selector ownership:');
for (const [label,owners] of Object.entries(activeSelectorOwners)) console.log(`- ${label}: ${owners.join(', ') || 'NONE'}`);
console.log('Top ACTIVE CSS risk files:');
for (const row of activeCssRiskStats.slice(0,12)) console.log(`- ${row.file}: pseudo=${row.pseudo} important=${row.important} :has=${row.has} z=${row.z.length} blend=${row.blend} isolation=${row.isolation}`);
