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
  'components',
  'design-system',
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
const technicalRouteAllowlist = new Set([
  '/auth/callback/',
  '/profile/',
]);
const publicTextExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.json', '.js', '.css']);
const errors = [];
const shippedHtmlRoutes = new Set();

const artifactPath = rel => path.join(artifactRoot, rel);

if (!fs.existsSync(artifactRoot)) {
  console.error('PRODUCTION RELEASE BLOCKED');
  console.error('- _site artifact is missing; build must run before the production guard.');
  process.exit(1);
}

for (const rel of forbiddenArtifactPaths) {
  if (fs.existsSync(artifactPath(rel))) errors.push(`${rel}: internal/staging material must not exist in production artifact`);
}

function htmlFileToRoute(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}/`;
  return `/${rel}`;
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

    const rel = path.relative(artifactRoot, full).replaceAll('\\', '/');
    const text = fs.readFileSync(full, 'utf8');

    if (ext === '.html') shippedHtmlRoutes.add(htmlFileToRoute(rel));

    for (const legacy of legacyOrigins) {
      if (text.includes(legacy)) errors.push(`${rel}: legacy origin remains (${legacy})`);
    }

    const upper = ` ${text.toUpperCase()} `;
    for (const marker of blockedMarkers) {
      if (upper.includes(marker)) errors.push(`${rel}: blocked pre-production marker found: ${marker.trim()}`);
    }
  }
}

walk(artifactRoot);

const readinessPath = path.join(root, 'content/page-readiness.json');
if (!fs.existsSync(readinessPath)) {
  errors.push('content/page-readiness.json: source readiness registry missing');
} else {
  const readiness = JSON.parse(fs.readFileSync(readinessPath, 'utf8'));
  const readinessRoutes = new Set();

  for (const page of readiness.pages || []) {
    readinessRoutes.add(page.route);
    if (page.state === 'FINAL') continue;
    if (page.productionAllowed === true) continue;
    errors.push(`${page.route}: readiness state ${page.state} is not explicitly approved for production`);
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
}

if (errors.length) {
  console.error('PRODUCTION RELEASE BLOCKED');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nProduction requires explicit content approval and an artifact free of staging/test material.');
  process.exit(1);
}

console.log(`Production release guard passed: ${shippedHtmlRoutes.size} HTML routes covered.`);
