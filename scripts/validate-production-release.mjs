import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const artifact = path.join(root, '_site');
const productionOrigin = 'https://dementor.club';

const publicTextExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.json', '.js', '.css']);
const blockedMarkers = [
  'TEST MATERIAL',
  'TEST DATA',
  'DEMO CONTENT',
  'MOCK CONTENT',
  'PLACEHOLDER',
  'INTERNAL ONLY',
  'APPROVED DRAFT',
  ' WIP ',
];
const blockedFragments = [
  '/degradation_club/',
  'sladzari.github.io/degradation_club',
  'degradation-club.vercel.app',
  '/design-system/admin/',
  '/staging/',
  '/test/',
  '/tests/',
  'localhost:',
  '127.0.0.1:',
];
const forbiddenTopLevel = ['design-system', 'staging', 'test', 'tests', 'admin'];
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
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rel(full) {
  return path.relative(artifact, full).replaceAll('\\', '/');
}

function localPathExists(raw, owner) {
  if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(raw)) return;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) return;
  let target;
  if (clean.startsWith('/')) target = path.join(artifact, clean.replace(/^\/+/, ''));
  else target = path.resolve(path.dirname(owner), clean);
  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) errors.push(`${rel(owner)}: broken production reference ${raw}`);
}

for (const name of forbiddenTopLevel) {
  if (fs.existsSync(path.join(artifact, name))) errors.push(`forbidden production route/surface present: /${name}/`);
}

const files = walk(artifact);
for (const full of files) {
  const ext = path.extname(full).toLowerCase();
  if (!publicTextExtensions.has(ext)) continue;
  const text = fs.readFileSync(full, 'utf8');
  const file = rel(full);
  const lower = text.toLowerCase();

  for (const fragment of blockedFragments) {
    if (lower.includes(fragment.toLowerCase())) errors.push(`${file}: blocked legacy/staging fragment found: ${fragment}`);
  }

  const upper = ` ${text.toUpperCase()} `;
  for (const marker of blockedMarkers) {
    if (upper.includes(marker)) errors.push(`${file}: blocked pre-production marker found: ${marker.trim()}`);
  }

  if (ext === '.html') {
    const refs = [...text.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(m => m[1]);
    for (const ref of refs) localPathExists(ref, full);

    const ogUrl = text.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || text.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i)?.[1];
    if (ogUrl && !ogUrl.startsWith(productionOrigin)) errors.push(`${file}: og:url must use ${productionOrigin}`);

    const canonical = text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
      || text.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
    if (canonical && !canonical.startsWith(productionOrigin)) errors.push(`${file}: canonical must use ${productionOrigin}`);
  }

  if (ext === '.css') {
    for (const match of text.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/gi)) localPathExists(match[1].trim(), full);
  }

  if (ext === '.js') {
    for (const match of text.matchAll(/["'](\/[^"']+\.(?:js|css|webp|png|jpg|jpeg|svg|json)(?:\?[^"']*)?)["']/gi)) localPathExists(match[1], full);
  }
}

const cnamePath = path.join(artifact, 'CNAME');
if (!fs.existsSync(cnamePath) || fs.readFileSync(cnamePath, 'utf8').trim() !== 'dementor.club') {
  errors.push('CNAME must contain dementor.club');
}

const robotsPath = path.join(artifact, 'robots.txt');
if (!fs.existsSync(robotsPath)) errors.push('robots.txt missing from production artifact');
else if (!fs.readFileSync(robotsPath, 'utf8').includes(`${productionOrigin}/sitemap.xml`)) {
  errors.push(`robots.txt: sitemap must point to ${productionOrigin}/sitemap.xml`);
}

const sitemapPath = path.join(artifact, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) errors.push('sitemap.xml missing from production artifact');
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(`<loc>${productionOrigin}/</loc>`)) errors.push(`sitemap.xml: production origin ${productionOrigin} is missing`);
  if (/sladzari\.github\.io|degradation-club\.vercel\.app|\/degradation_club\//i.test(sitemap)) errors.push('sitemap.xml contains legacy origin/path');
}

const configPath = path.join(artifact, 'site-config.js');
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf8');
  if (!/internalTools:\{enabled:false,holdMs:0,path:null\}/.test(config)) errors.push('site-config.js: internal tools must be disabled in production artifact');
  if (/checkoutEnabled:true/.test(config)) warnings.push('site-config.js: checkout is enabled; confirm source-of-truth approval');
  if (/registrationEnabled:true/.test(config)) warnings.push('site-config.js: event registration is enabled; confirm source-of-truth approval');
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
