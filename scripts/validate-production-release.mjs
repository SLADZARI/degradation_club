import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const artifact = path.join(root, '_site');
const productionOrigin = 'https://dementor.club';

const publicTextExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.json', '.js', '.css']);
const contentExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.json']);
const blockedContentMarkers = ['TEST MATERIAL','TEST DATA','DEMO CONTENT','MOCK CONTENT','PLACEHOLDER','INTERNAL ONLY',' WIP '];
const warningContentMarkers = ['APPROVED DRAFT'];
const blockedFragments = ['/degradation_club/','sladzari.github.io/degradation_club','degradation-club.vercel.app','/design-system/admin/','/staging/','/test/','/tests/','localhost:','127.0.0.1:'];
const forbiddenTopLevel = ['staging', 'test', 'tests', 'admin', 'cart'];
const errors = [];
const warnings = [];

if (!fs.existsSync(artifact)) {
  console.error('PRODUCTION RELEASE BLOCKED');
  console.error('- _site production artifact is missing. Run build first.');
  process.exit(1);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files); else files.push(full);
  }
  return files;
}
function rel(full) { return path.relative(artifact, full).replaceAll('\\', '/'); }
function localPathExists(raw, owner) {
  if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(raw)) return;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) return;
  let target = clean.startsWith('/') ? path.join(artifact, clean.replace(/^\/+/, '')) : path.resolve(path.dirname(owner), clean);
  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) errors.push(`${rel(owner)}: broken production reference ${raw}`);
}
function visibleContent(text, ext) {
  if (ext !== '.html') return text;
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ');
}
function isNoindexHtml(text){
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text)||/<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(text);
}
function validateRouteLiterals(text, owner){
  const seen=new Set();
  const patterns=[
    /\b(?:location\.(?:assign|replace))\(\s*["'](\/[^"']+)["']/g,
    /\blocation\.href\s*=\s*["'](\/[^"']+)["']/g,
    /\.href\s*=\s*["'](\/[^"']+)["']/g,
    /["'](\/(?:[a-z0-9._~-]+\/)+)["']/gi,
  ];
  for(const pattern of patterns){
    for(const match of text.matchAll(pattern)){
      const raw=match[1];
      if(!raw||seen.has(raw))continue;
      seen.add(raw);
      if(raw.startsWith('/assets/')||raw.startsWith('/design-system/')&&/\.(?:css|js|svg|png|webp)$/i.test(raw))continue;
      localPathExists(raw,owner);
    }
  }
}

for (const name of forbiddenTopLevel) if (fs.existsSync(path.join(artifact, name))) errors.push(`forbidden production route/surface present: /${name}/`);

const files = walk(artifact);
for (const full of files) {
  const ext = path.extname(full).toLowerCase();
  if (!publicTextExtensions.has(ext)) continue;
  const text = fs.readFileSync(full, 'utf8');
  const file = rel(full);
  const lower = text.toLowerCase();

  for (const fragment of blockedFragments) if (lower.includes(fragment.toLowerCase())) errors.push(`${file}: blocked legacy/staging fragment found: ${fragment}`);

  if (contentExtensions.has(ext)) {
    const privateNoindex=ext==='.html'&&isNoindexHtml(text);
    if(!privateNoindex){
      const publicCopy = visibleContent(text, ext);
      const upper = ` ${publicCopy.toUpperCase()} `;
      for (const marker of blockedContentMarkers) if (upper.includes(marker)) errors.push(`${file}: blocked visible pre-production marker found: ${marker.trim()}`);
      for (const marker of warningContentMarkers) if (upper.includes(marker)) warnings.push(`${file}: visible public status requires review before merge: ${marker}`);
    }
  }

  if (ext === '.html') {
    const refs = [...text.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(m => m[1]);
    for (const ref of refs) localPathExists(ref, full);
    validateRouteLiterals(text,full);
    const ogUrl = text.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || text.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i)?.[1];
    if (ogUrl && !ogUrl.startsWith(productionOrigin)) errors.push(`${file}: og:url must use ${productionOrigin}`);
    const canonical = text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
      || text.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
    if (canonical && !canonical.startsWith(productionOrigin)) errors.push(`${file}: canonical must use ${productionOrigin}`);
  }
  if (ext === '.css') for (const match of text.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/gi)) localPathExists(match[1].trim(), full);
  if (ext === '.js') {
    for (const match of text.matchAll(/["'](\/[^"']+\.(?:js|css|webp|png|jpg|jpeg|svg|json)(?:\?[^"']*)?)["']/gi)) localPathExists(match[1], full);
    validateRouteLiterals(text,full);
  }
}

const cnamePath = path.join(artifact, 'CNAME');
if (!fs.existsSync(cnamePath) || fs.readFileSync(cnamePath, 'utf8').trim() !== 'dementor.club') errors.push('CNAME must contain dementor.club');
const robotsPath = path.join(artifact, 'robots.txt');
if (!fs.existsSync(robotsPath)) errors.push('robots.txt missing from production artifact');
else if (!fs.readFileSync(robotsPath, 'utf8').includes(`${productionOrigin}/sitemap.xml`)) errors.push(`robots.txt: sitemap must point to ${productionOrigin}/sitemap.xml`);
const sitemapPath = path.join(artifact, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) errors.push('sitemap.xml missing from production artifact');
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(`<loc>${productionOrigin}/</loc>`)) errors.push(`sitemap.xml: production origin ${productionOrigin} is missing`);
  if (/sladzari\.github\.io|degradation-club\.vercel\.app|\/degradation_club\//i.test(sitemap)) errors.push('sitemap.xml contains legacy origin/path');
  for(const loc of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])){
    try{
      const url=new URL(loc);const route=url.pathname;
      const target=route==='/'?path.join(artifact,'index.html'):path.join(artifact,route.replace(/^\//,''),'index.html');
      if(!fs.existsSync(target))errors.push(`sitemap.xml: URL has no production page ${route}`);
      else if(isNoindexHtml(fs.readFileSync(target,'utf8')))errors.push(`sitemap.xml: noindex/private route must not be indexed ${route}`);
    }catch{errors.push(`sitemap.xml: invalid URL ${loc}`);}
  }
}

const configPath = path.join(artifact, 'site-config.js');
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf8');
  if (!/internalTools:\{enabled:false,holdMs:0,path:null\}/.test(config)) errors.push('site-config.js: internal tools must be disabled in production artifact');
  if (/checkoutEnabled:true/.test(config)) errors.push('site-config.js: checkout is enabled but must remain off until source-of-truth approval');
  if (/registrationEnabled:true/.test(config)) errors.push('site-config.js: event registration is enabled but must remain off until source-of-truth approval');
}

if (errors.length) {
  console.error('PRODUCTION RELEASE BLOCKED');
  for (const error of errors) console.error(`- ${error}`);
  if (warnings.length) {
    console.error('\nWARNINGS');
    for (const warning of warnings) console.error(`- ${warning}`);
  }
  process.exit(1);
}
console.log('Production artifact release gate passed.');
for (const warning of warnings) console.warn(`WARNING: ${warning}`);