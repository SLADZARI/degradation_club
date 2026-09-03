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
  '.git', '.github', '_site', 'node_modules', 'docs', 'references', 'scripts',
  'components', 'design-system', 'staging', 'test', 'tests', 'fixtures', 'admin', 'cart',
]);

const productionDependencies = [
  'components/course-cover-v1.css',
  'design-system/design-system.css',
  'design-system/dementor-workspace/workspace.css',
];

const productionProjections = [
  { from:'design-system/index.html', to:'workspace/admin/design/index.html', ownerGate:true },
  { from:'design-system/ui-lab-v2.css', to:'design-system/ui-lab-v2.css' },
  { from:'design-system/ui-lab-v2.js', to:'design-system/ui-lab-v2.js' },
  { from:'design-system/admin/tests/index.html', to:'workspace/admin/tests/index.html' },
  { from:'design-system/auth-test/index.html', to:'workspace/admin/auth-test/index.html', ownerGate:true },
  { from:'design-system/sync-test/index.html', to:'workspace/admin/sync-test/index.html', ownerGate:true },
];

const skipRootFiles = new Set([
  '.deploy-trigger', 'DEPLOY_TRIGGER.txt', 'DRIVE.md', 'README.md', 'production-route-manifest.json',
  'dementor-cart-v1.js', 'merch-cart-bridge-v1.js',
]);
const textExt = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.webmanifest']);
const privateFooterPrefixes = [
  'workspace/', 'community/board/', 'community/artifact/', 'join/apply/', 'join/result/', 'auth/callback/', 'profile/'
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function normalizeProductionText(text, ext='') {
  let result = text;
  for (const legacy of legacyOrigins) result = result.replaceAll(legacy, productionOrigin);

  // Source supports the historical GitHub Pages sub-path. Production does not.
  // Never run a blind `/degradation_club/ -> /` replacement across JS: it also
  // matches the slash inside regex literals such as /^\/degradation_club/ and
  // turns them into syntactically invalid /^\/. Keep compatibility checks as
  // harmless never-match sentinels, then normalize actual path literals/markup.
  if (ext === '.js') {
    result = result.replaceAll('\\/degradation_club/', '\\/__dc_source_path_disabled__/');
    result = result.replaceAll("'/degradation_club/'", "'/__dc_source_path_disabled__/'");
    result = result.replaceAll('"/degradation_club/"', '"/__dc_source_path_disabled__/"');
  }
  result = result.replaceAll('/degradation_club/', '/');
  result = result.replaceAll('/assets/ink/home-interruption-03.webp', '/assets/ink/home_01.webp');
  return result;
}

function shouldSkipFile(src, entryName) {
  const rel = path.relative(root, src).replaceAll('\\', '/');
  if (path.dirname(src) === root && skipRootFiles.has(entryName)) return true;
  if (entryName.toLowerCase().endsWith('.md')) return true;
  if (entryName.toLowerCase().endsWith('.example.html')) return true;
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
    if (textExt.has(ext)) fs.writeFileSync(to, normalizeProductionText(fs.readFileSync(from, 'utf8'), ext));
    else fs.copyFileSync(from, to);
  }
}

function copyProductionDependency(rel) {
  const from = path.join(root, rel);
  const to = path.join(out, rel);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) throw new Error(`Approved production dependency is missing: ${rel}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const ext = path.extname(rel).toLowerCase();
  if (textExt.has(ext)) fs.writeFileSync(to, normalizeProductionText(fs.readFileSync(from, 'utf8'), ext));
  else fs.copyFileSync(from, to);
}

function copyProductionProjection(spec) {
  const from = path.join(root, spec.from);
  const to = path.join(out, spec.to);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) throw new Error(`Approved production projection is missing: ${spec.from}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const ext = path.extname(spec.from).toLowerCase();
  if (!textExt.has(ext)) { fs.copyFileSync(from, to); return; }
  let text = normalizeProductionText(fs.readFileSync(from, 'utf8'), ext);
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

function isPrivateFooter(rel) {
  return privateFooterPrefixes.some(prefix => rel.startsWith(prefix));
}

function isWorkspaceShell(rel) {
  return rel.startsWith('workspace/');
}

function normalizeShellMarkup(html, rel) {
  if (rel === 'auth/callback/index.html') return html;
  const workspaceShell=isWorkspaceShell(rel);

  // A public page never owns the primary club header. Workspace is a separate
  // authenticated shell and must not receive the public header at all.
  if(!workspaceShell){
    html = html.replace(/<header[^>]*class=["']topbar(?:\s[^"']*)?["'][^>]*>[\s\S]*?<\/header>/gi, '');
    if (!html.includes('/global-header.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/global-header.css">\n</head>');
    if (!html.includes('/global-header.js')) html = html.replace('</body>', '<script src="/global-header.js" defer></script>\n</body>');
  }else{
    html = html.replace(/<link[^>]+href=["']\/global-header\.css["'][^>]*>/gi,'');
    html = html.replace(/<script[^>]+src=["']\/global-header\.js["'][^>]*><\/script>/gi,'');
  }

  if (!isPrivateFooter(rel)) {
    // Local footer markup is source history only. It must not survive into production.
    html = html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');
    if (!html.includes('/global-footer.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/global-footer.css">\n</head>');
    if (!html.includes('/global-footer.js')) html = html.replace('</body>', '<script src="/global-footer.js" defer></script>\n</body>');
  }
  return html;
}

function injectProductionModules() {
  walk(out, full => {
    if (!full.endsWith('.html')) return;
    const rel = path.relative(out, full).replaceAll('\\','/');
    let html = fs.readFileSync(full, 'utf8');
    html = normalizeShellMarkup(html, rel);
    const isPrivateTool = rel.startsWith('workspace/admin/');
    if (!isPrivateTool) {
      if (!html.includes('/entity-recommendations-v1.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/entity-recommendations-v1.css">\n</head>');
      if (!html.includes('/entity-recommendations-v1.js')) html = html.replace('</body>', '<script src="/entity-recommendations-v1.js" defer></script>\n</body>');
    }
    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/logic-awareness-covers-v1.js')) html = html.replace('</body>', '<script src="/logic-awareness-covers-v1.js" defer></script>\n</body>');
    fs.writeFileSync(full, html);
  });
}

function hardenProductionRuntime() {
  const configPath = path.join(out, 'site-config.js');
  if (fs.existsSync(configPath)) {
    let source = fs.readFileSync(configPath, 'utf8');
    source = source.replace(/internalTools:\{enabled:true,holdMs:\d+,path:'[^']*'\}/, "internalTools:{enabled:false,holdMs:0,path:null}");
    source = source.replace(/const legacyOrigins=\[[^\]]*\];/, 'const legacyOrigins=[];');
    source = source.replace("link.href=canonical+path.replace(/^\\/degradation_club/,'')", 'link.href=canonical+path');
    fs.writeFileSync(configPath, source);
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
injectProductionModules();
hardenProductionRuntime();
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'CNAME'), 'dementor.club\n');

console.log(`GitHub Pages production candidate ready for ${productionOrigin} at ${out}`);
console.log(`Approved runtime dependencies shipped: ${productionDependencies.length}`);
console.log(`Approved internal tool projections shipped: ${productionProjections.length}`);
