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

// Selected internal tools are projected into authenticated/noindex Workspace
// routes. The source design-system tree itself remains excluded from production.
const productionProjections = [
  { from:'design-system/index.html', to:'workspace/admin/design/index.html', ownerGate:true },
  { from:'design-system/ui-lab-v2.css', to:'design-system/ui-lab-v2.css' },
  { from:'design-system/ui-lab-v2.js', to:'design-system/ui-lab-v2.js' },
  { from:'design-system/admin/tests/index.html', to:'workspace/admin/tests/index.html' },
  { from:'design-system/auth-test/index.html', to:'workspace/admin/auth-test/index.html', ownerGate:true },
  { from:'design-system/sync-test/index.html', to:'workspace/admin/sync-test/index.html', ownerGate:true },
];

const skipRootFiles = new Set([
  '.deploy-trigger',
  'DEPLOY_TRIGGER.txt',
  'DRIVE.md',
  'README.md',
  'production-route-manifest.json',
  'dementor-cart-v1.js',
  'merch-cart-bridge-v1.js',
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

function copyProductionProjection(spec) {
  const from = path.join(root, spec.from);
  const to = path.join(out, spec.to);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) throw new Error(`Approved production projection is missing: ${spec.from}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const ext = path.extname(spec.from).toLowerCase();
  if (!textExt.has(ext)) { fs.copyFileSync(from, to); return; }
  let text = normalizeProductionText(fs.readFileSync(from, 'utf8'));
  if (spec.to.startsWith('workspace/admin/')) {
    text = text.replaceAll('href="../admin/"', 'href="/workspace/admin/"');
    text = text.replaceAll("href='../admin/'", "href='/workspace/admin/'");
  }
  if (spec.ownerGate && ext === '.html' && !text.includes('/workspace/owner-admin-gate-v1.js')) {
    text = text.replace('</body>', '<script type="module" src="/workspace/owner-admin-gate-v1.js"></script>\n</body>');
  }
  fs.writeFileSync(to, text);
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
    const isPrivateTool = rel.startsWith('workspace/admin/');

    if (!isPrivateTool) {
      html = injectOnce(html, '/entity-recommendations-v1.css', '<link rel="stylesheet" href="/entity-recommendations-v1.css">', '</head>');
      html = injectOnce(html, '/entity-recommendations-v1.js', '<script src="/entity-recommendations-v1.js" defer></script>', '</body>');
    }

    // About v10 owns its complete page layout in /about-v1.css. The previous
    // about-definition-v1.css production override is intentionally not injected:
    // keeping it would overwrite the approved v10 Dementor composition.
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
  if (fs.existsSync(configPath)) {
    let source = fs.readFileSync(configPath, 'utf8');
    source = source.replace(/internalTools:\{enabled:true,holdMs:\d+,path:'[^']*'\}/, "internalTools:{enabled:false,holdMs:0,path:null}");
    source = source.replace(/cartEnabled:true/g, 'cartEnabled:false');
    source = source.replace(/checkoutEnabled:true/g, 'checkoutEnabled:false');
    source = source.replace(/registrationEnabled:true/g, 'registrationEnabled:false');
    fs.writeFileSync(configPath, source);
  }
  const globalHeaderPath = path.join(out, 'global-header.js');
  if (fs.existsSync(globalHeaderPath)) {
    let source = fs.readFileSync(globalHeaderPath, 'utf8');
    const disabledCommerceLoader = "if(cartEnabled&&(path.startsWith('/merch/')||path.startsWith('/objects/')||path.startsWith('/cart/'))){load('/site-config.js');load('/dementor-cart-v1.js');if(path.startsWith('/merch/drop-001/')||path.startsWith('/objects/'))load('/merch-cart-bridge-v1.js')}";
    source = source.replace(disabledCommerceLoader, '');
    fs.writeFileSync(globalHeaderPath, source);
  }
  const motionPath = path.join(out, 'motion-v1.js');
  if (fs.existsSync(motionPath)) {
    let source = fs.readFileSync(motionPath, 'utf8');
    source = source.replace("location.assign('/design-system/');", 'unlocked=false;');
    source = source.replace("window.DEMENTOR_SITE_CONFIG?.internalTools?.enabled&&location.assign('/design-system/')", 'unlocked=false');
    fs.writeFileSync(motionPath, source);
  }
}

copyDir(root, out);
for (const rel of productionDependencies) copyProductionDependency(rel);
for (const spec of productionProjections) copyProductionProjection(spec);
injectProductionPublicModules();
hardenProductionRuntime();

fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'CNAME'), 'dementor.club\n');

console.log(`GitHub Pages production candidate ready for ${productionOrigin} at ${out}`);
console.log(`Approved runtime dependencies shipped: ${productionDependencies.length}`);
console.log(`Approved internal tool projections shipped: ${productionProjections.length}`);
console.log('Production-only modules injected: recommendations, project visual overrides, consent-gated analytics.');
