import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '_site');
const productionOrigin = 'https://dementor.club';
const legacyOrigins = [
  'https://sladzari.github.io/degradation_club',
  'https://degradation-club.vercel.app',
];

const skipTopLevel = new Set([
  '.git',
  '.github',
  '_site',
  'node_modules',
  'docs',
  'references',
  'scripts',
  'components',
  'design-system',
  'test',
  'tests',
  'fixtures',
  'cart',
]);

// Runtime files required by approved public surfaces are copied explicitly while
// their internal/demo source folders remain excluded from the production tree.
const productionDependencies = [
  'components/course-cover-v1.css',
  'design-system/design-system.css',
  'design-system/dementor-workspace/workspace.css',
];

const skipRootFiles = new Set([
  '.deploy-trigger',
  'DEPLOY_TRIGGER.txt',
  'DRIVE.md',
  'README.md',
]);

const textExt = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.webmanifest']);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function normalizeProductionText(text) {
  let result = text;
  for (const legacy of legacyOrigins) result = result.replaceAll(legacy, productionOrigin);
  // Staging may probe a future home raster. Production must never emit a 404
  // while the replacement binary is absent.
  result = result.replaceAll('/assets/ink/home-interruption-03.webp', '/assets/ink/home_01.webp');
  // Internal design-system navigation stays inert in production.
  result = result.replaceAll("location.assign('/design-system/')", "window.DEMENTOR_SITE_CONFIG?.internalTools?.enabled&&location.assign('/design-system/')");
  return result;
}

function shouldSkipFile(src, entryName) {
  const rel = path.relative(root, src).replaceAll('\\', '/');
  if (path.dirname(src) === root && skipRootFiles.has(entryName)) return true;
  if (entryName.toLowerCase().endsWith('.md')) return true;
  if (rel === 'content/page-readiness.json') return true;
  return false;
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (src === root && skipTopLevel.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
      continue;
    }
    if (shouldSkipFile(from, entry.name)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (textExt.has(ext)) fs.writeFileSync(to, normalizeProductionText(fs.readFileSync(from, 'utf8')));
    else fs.copyFileSync(from, to);
  }
}

function copyProductionDependency(rel) {
  const from = path.join(root, rel);
  const to = path.join(out, rel);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) throw new Error(`Approved production dependency is missing: ${rel}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const ext = path.extname(rel).toLowerCase();
  if (textExt.has(ext)) fs.writeFileSync(to, normalizeProductionText(fs.readFileSync(from, 'utf8')));
  else fs.copyFileSync(from, to);
}

function walk(dir, fn) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fn); else fn(full);
  }
}

function injectOnce(html, marker, payload, target) {
  if (html.includes(marker)) return html;
  return html.replace(target, `${payload}\n${target}`);
}

function injectProductionPublicModules() {
  walk(out, full => {
    if (!full.endsWith('.html')) return;
    const rel = path.relative(out, full).replaceAll('\\', '/');
    let html = fs.readFileSync(full, 'utf8');

    html = injectOnce(html, '/entity-recommendations-v1.css', '<link rel="stylesheet" href="/entity-recommendations-v1.css">', '</head>');
    html = injectOnce(html, '/entity-recommendations-v1.js', '<script src="/entity-recommendations-v1.js" defer></script>', '</body>');

    if (rel === 'about/index.html') {
      html = injectOnce(html, '/about-definition-v1.css', '<link rel="stylesheet" href="/about-definition-v1.css">', '</head>');
    }
    if (rel === 'projects/logic-awareness/index.html') {
      html = injectOnce(html, '/logic-awareness-covers-v1.js', '<script src="/logic-awareness-covers-v1.js" defer></script>', '</body>');
    }

    // Production analytics is injected into the artifact only. The runtime itself
    // is origin-locked to https://dementor.club and consent-gated.
    html = injectOnce(html, '/production-analytics-v1.js', '<script src="/production-analytics-v1.js" defer></script>', '</body>');

    fs.writeFileSync(full, html);
  });
}

function hardenProductionRuntime() {
  const configPath = path.join(out, 'site-config.js');
  if (!fs.existsSync(configPath)) return;
  let source = fs.readFileSync(configPath, 'utf8');
  source = source.replace(/internalTools:\{enabled:true,holdMs:\d+,path:'[^']*'\}/, "internalTools:{enabled:false,holdMs:0,path:null}");
  source = source.replace(/cartEnabled:true/g, 'cartEnabled:false');
  source = source.replace(/checkoutEnabled:true/g, 'checkoutEnabled:false');
  source = source.replace(/registrationEnabled:true/g, 'registrationEnabled:false');
  fs.writeFileSync(configPath, source);
}

copyDir(root, out);
for (const rel of productionDependencies) copyProductionDependency(rel);
injectProductionPublicModules();
hardenProductionRuntime();

fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'CNAME'), 'dementor.club\n');

console.log(`GitHub Pages production candidate ready for ${productionOrigin} at ${out}`);
console.log(`Approved runtime dependencies shipped: ${productionDependencies.length}`);
console.log('Production-only modules injected: recommendations, approved visual overrides, consent-gated analytics.');
