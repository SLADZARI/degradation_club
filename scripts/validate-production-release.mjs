import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productionOrigin = 'https://dementor.club';
const legacyOrigin = 'https://sladzari.github.io/degradation_club';

const excludedTopLevel = new Set([
  '.git',
  '.github',
  '_site',
  'node_modules',
  'docs',
  'references',
  'scripts',
  'design-system',
  'archive',
]);

const publicTextExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.json']);
const blockedMarkers = [
  'TEST MATERIAL',
  'TEST DATA',
  'PLACEHOLDER',
  'INTERNAL ONLY',
  'APPROVED DRAFT',
  ' WIP ',
];

const errors = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dir === root && excludedTopLevel.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!publicTextExtensions.has(ext)) continue;

    const rel = path.relative(root, full);
    const text = fs.readFileSync(full, 'utf8');

    if (text.includes(legacyOrigin)) {
      errors.push(`${rel}: legacy GitHub Pages origin remains (${legacyOrigin})`);
    }

    const upper = ` ${text.toUpperCase()} `;
    for (const marker of blockedMarkers) {
      if (upper.includes(marker)) {
        errors.push(`${rel}: blocked pre-production marker found: ${marker.trim()}`);
      }
    }
  }
}

walk(root);

const robotsPath = path.join(root, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`${productionOrigin}/sitemap.xml`)) {
    errors.push(`robots.txt: sitemap must point to ${productionOrigin}/sitemap.xml`);
  }
}

const sitemapPath = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(`<loc>${productionOrigin}/</loc>`)) {
    errors.push(`sitemap.xml: production origin ${productionOrigin} is missing`);
  }
}

if (errors.length) {
  console.error('PRODUCTION RELEASE BLOCKED');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nTest/demo/draft material must be removed or explicitly converted to approved public content before production.');
  process.exit(1);
}

console.log('Production release guard passed.');
