import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const artifactRoot = path.join(root, '_site');
const productionOrigin = 'https://dementor.club';
const legacyOrigins = [
  'https://sladzari.github.io/degradation_club',
  'https://degradation-club.vercel.app',
];
const blockedMarkers = [
  'TEST MATERIAL',
  'TEST DATA',
  'INTERNAL ONLY',
  'LOREM IPSUM',
  'DEMO CONTENT',
  'APPROVED DRAFT',
  ' WIP ',
];
const forbiddenArtifactPaths = [
  'docs',
  'references',
  'scripts',
  'test',
  'tests',
  'fixtures',
  'content/page-readiness.json',
  '.github',
  'README.md',
  'DRIVE.md',
  '.deploy-trigger',
  'DEPLOY_TRIGGER.txt',
  'cart',
];
const allowedInternalRuntimeAssets = new Set([
  'components/course-cover-v1.css',
  'design-system/design-system.css',
  'design-system/dementor-workspace/workspace.css',
  'design-system/ui-lab-v2.css',
  'design-system/ui-lab-v2.js',
]);
const technicalRouteAllowlist = new Set([
  '/auth/callback/',
  '/profile/',
  '/workspace/admin/',
  '/workspace/admin/design/',
  '/workspace/admin/tests/',
  '/workspace/admin/auth-test/',
  '/workspace/admin/sync-test/',
]);
const publicTextExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.json', '.js', '.css']);
const errors = [];
const shippedHtmlRoutes = new Set();

const artifactPath = rel => path.join(artifactRoot, rel);
const toPosix = value => value.replaceAll('\\', '/');

if (!fs.existsSync(artifactRoot)) {
  console.error('PRODUCTION RELEASE BLOCKED');
  console.error('- _site artifact is missing; build must run before the production guard.');
  process.exit(1);
}

for (const rel of forbiddenArtifactPaths) {
  if (fs.existsSync(artifactPath(rel))) errors.push(`${rel}: internal/staging material must not exist in production artifact`);
}

function collectFiles(dir, base = dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(full, base));
    else files.push(toPosix(path.relative(base, full)));
  }
  return files;
}

for (const internalRoot of ['components', 'design-system']) {
  const dir = artifactPath(internalRoot);
  for (const sub of collectFiles(dir)) {
    const rel = `${internalRoot}/${sub}`;
    if (!allowedInternalRuntimeAssets.has(rel)) {
      errors.push(`${rel}: unapproved internal dependency leaked into production artifact`);
    }
  }
}
for (const rel of allowedInternalRuntimeAssets) {
  if (!fs.existsSync(artifactPath(rel))) errors.push(`${rel}: approved runtime dependency is missing from production artifact`);
}

function htmlFileToRoute(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}/`;
  return `/${rel}`;
}

function isExternalRef(ref) {
  return !ref || ref.startsWith('#') || ref.startsWith('//') || /^(?:https?:|data:|mailto:|tel:|javascript:|blob:)/i.test(ref);
}

function cleanRef(ref) {
  const value = String(ref || '').trim();
  if (isExternalRef(value)) return null;
  const clean = value.split('#', 1)[0].split('?', 1)[0];
  if (!clean) return null;
  try { return decodeURI(clean); } catch { return clean; }
}

function resolveArtifactRef(sourceRel, rawRef) {
  const ref = cleanRef(rawRef);
  if (!ref) return null;
  const sourceDir = path.posix.dirname(toPosix(sourceRel));
  let targetRel = ref.startsWith('/')
    ? path.posix.normalize(ref.slice(1))
    : path.posix.normalize(path.posix.join(sourceDir, ref));
  if (targetRel === '.' || targetRel === '') targetRel = 'index.html';
  if (targetRel.startsWith('../')) return { ref, targetRel, exists: false };

  const exact = artifactPath(targetRel);
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return { ref, targetRel, exists: true };
  if (fs.existsSync(exact) && fs.statSync(exact).isDirectory()) {
    const indexRel = path.posix.join(targetRel, 'index.html');
    return { ref, targetRel: indexRel, exists: fs.existsSync(artifactPath(indexRel)) };
  }
  if (!path.posix.extname(targetRel)) {
    const indexRel = path.posix.join(targetRel, 'index.html');
    if (fs.existsSync(artifactPath(indexRel))) return { ref, targetRel: indexRel, exists: true };
  }
  return { ref, targetRel, exists: false };
}

function validateRef(sourceRel, rawRef, kind) {
  const resolved = resolveArtifactRef(sourceRel, rawRef);
  if (resolved && !resolved.exists) {
    errors.push(`${sourceRel}: broken ${kind} reference ${resolved.ref} -> ${resolved.targetRel}`);
  }
}

function isNoindexHtml(text) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text)
    || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(text);
}

function validateNavigationTargets(sourceRel, text) {
  const seen = new Set();
  const check = raw => { if (!raw || seen.has(raw)) return; seen.add(raw); validateRef(sourceRel, raw, 'JS navigation'); };
  const direct = [
    /\b(?:location\.(?:assign|replace))\(\s*["'](\/[^"']+)["']/g,
    /\blocation\.href\s*=\s*["'](\/[^"']+)["']/g,
    /\.href\s*=\s*["'](\/[^"']+)["']/g,
  ];
  for (const pattern of direct) for (const match of text.matchAll(pattern)) check(match[1]);

  const vars = new Map();
  for (const match of text.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:[^;\n]*?\+\s*)?["'](\/[^"']+\/)["']/g)) vars.set(match[1], match[2]);
  for (const [name, route] of vars) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const used = new RegExp(`(?:\\.href\\s*=\\s*${escaped}\\b|location\\.(?:assign|replace)\\(\\s*${escaped}\\s*\\)|location\\.href\\s*=\\s*${escaped}\\b)`);
    if (used.test(text)) check(route);
  }
}

function validatePublicReferences(rel, text, ext) {
  if (ext === '.html') {
    for (const match of text.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)) validateRef(rel, match[1], 'HTML');
    for (const match of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const part of match[1].split(',')) validateRef(rel, part.trim().split(/\s+/)[0], 'srcset');
    }
    validateNavigationTargets(rel, text);
  }
  if (ext === '.css') {
    for (const match of text.matchAll(/@import\s+(?:url\()?\s*["']?([^"')\s;]+)["']?/gi)) validateRef(rel, match[1], 'CSS import');
    for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) validateRef(rel, match[1], 'CSS url');
  }
  if (ext === '.js') {
    const jsAssetPattern = /["']((?:\/|\.\.?\/)[^"'\s$]+?\.(?:css|js|mjs|json|xml|txt|webmanifest|png|jpe?g|webp|gif|svg|ico|avif|woff2?|ttf|otf|mp4|webm|mp3|wav))["']/gi;
    for (const match of text.matchAll(jsAssetPattern)) validateRef(rel, match[1], 'JS asset');
    validateNavigationTargets(rel, text);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!publicTextExtensions.has(ext)) continue;

    const rel = toPosix(path.relative(artifactRoot, full));
    const text = fs.readFileSync(full, 'utf8');

    if (ext === '.html') shippedHtmlRoutes.add(htmlFileToRoute(rel));

    for (const legacy of legacyOrigins) {
      if (text.includes(legacy)) errors.push(`${rel}: legacy origin remains (${legacy})`);
    }

    const privateNoindex = ext === '.html' && isNoindexHtml(text);
    if (!privateNoindex) {
      const upper = ` ${text.toUpperCase()} `;
      for (const marker of blockedMarkers) {
        if (upper.includes(marker)) errors.push(`${rel}: blocked pre-production marker found: ${marker.trim()}`);
      }
    }

    validatePublicReferences(rel, text, ext);
  }
}

walk(artifactRoot);

for (const requiredRuntimePath of [
  'site-config.js',
  'auth/callback/index.html',
  'workspace/index.html',
  'required-auth-v1.js',
  'program-account-sync-v1.js',
  'merch-runtime-v1.js',
]) {
  if (!fs.existsSync(artifactPath(requiredRuntimePath))) errors.push(`${requiredRuntimePath}: required production runtime file is missing`);
}

const siteConfigPath = artifactPath('site-config.js');
if (fs.existsSync(siteConfigPath)) {
  const siteConfig = fs.readFileSync(siteConfigPath, 'utf8');
  if (!siteConfig.includes("canonicalOrigin:'https://dementor.club'") && !/canonicalOrigin\s*:\s*['"]https:\/\/dementor\.club['"]/.test(siteConfig)) errors.push('site-config.js: canonicalOrigin must be https://dementor.club');
  if (!/supabase\s*:\s*\{[\s\S]*?enabled\s*:\s*true/.test(siteConfig)) errors.push('site-config.js: Supabase production runtime must be enabled');
}

const readinessPath = path.join(root, 'content/page-readiness.json');
const readinessOverlayPaths = [
  path.join(root, 'docs/COMMUNITY_V1_RELEASE_READINESS.json'),
];
if (!fs.existsSync(readinessPath)) {
  errors.push('content/page-readiness.json: source readiness registry missing');
} else {
  const registries = [JSON.parse(fs.readFileSync(readinessPath, 'utf8'))];
  for (const overlayPath of readinessOverlayPaths) {
    if (fs.existsSync(overlayPath)) registries.push(JSON.parse(fs.readFileSync(overlayPath, 'utf8')));
  }

  const readinessRoutes = new Set();
  for (const registry of registries) {
    for (const page of registry.pages || []) {
      if (!page.route) {
        errors.push('readiness overlay: entry missing route');
        continue;
      }
      if (readinessRoutes.has(page.route)) {
        errors.push(`${page.route}: duplicate readiness route across registries`);
        continue;
      }
      readinessRoutes.add(page.route);
      if (!Array.isArray(page.source) || page.source.length === 0) errors.push(`${page.route}: readiness source list required`);
      if (!Array.isArray(page.blockingFields)) errors.push(`${page.route}: readiness blockingFields must be an array`);
      if (page.state === 'FINAL') continue;
      if (page.productionAllowed === true) continue;
      errors.push(`${page.route}: readiness state ${page.state} is not explicitly approved for production`);
    }
  }

  for (const route of [...shippedHtmlRoutes].sort()) {
    if (readinessRoutes.has(route)) continue;
    if (technicalRouteAllowlist.has(route)) continue;
    errors.push(`${route}: shipped HTML route has no explicit readiness record`);
  }
}

const cnamePath = artifactPath('CNAME');
if (!fs.existsSync(cnamePath) || fs.readFileSync(cnamePath, 'utf8').trim() !== 'dementor.club') {
  errors.push('CNAME: production artifact must contain exactly dementor.club');
}

const robotsPath = artifactPath('robots.txt');
if (!fs.existsSync(robotsPath)) {
  errors.push('robots.txt: missing from production artifact');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`${productionOrigin}/sitemap.xml`)) errors.push(`robots.txt: sitemap must point to ${productionOrigin}/sitemap.xml`);
}

const sitemapPath = artifactPath('sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  errors.push('sitemap.xml: missing from production artifact');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(`<loc>${productionOrigin}/</loc>`)) errors.push(`sitemap.xml: production origin ${productionOrigin} is missing`);
  for (const loc of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])) {
    try {
      const url = new URL(loc);
      const route = url.pathname;
      const target = route === '/' ? artifactPath('index.html') : artifactPath(path.posix.join(route.replace(/^\//, ''), 'index.html'));
      if (!fs.existsSync(target)) errors.push(`sitemap.xml: URL has no production page ${route}`);
      else if (isNoindexHtml(fs.readFileSync(target, 'utf8'))) errors.push(`sitemap.xml: noindex/private route must not be indexed ${route}`);
    } catch {
      errors.push(`sitemap.xml: invalid URL ${loc}`);
    }
  }
}

if (errors.length) {
  console.error('PRODUCTION RELEASE BLOCKED');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nProduction requires explicit content approval, complete runtime references and an artifact free of staging/test material.');
  process.exit(1);
}

console.log(`Production release guard passed: ${shippedHtmlRoutes.size} HTML routes covered; runtime references closed.`);
