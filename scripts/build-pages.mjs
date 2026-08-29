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

// These files are runtime dependencies of approved public/product surfaces.
// Their source folders stay excluded so internal design-system/component pages
// can never leak into the production artifact.
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
    if (textExt.has(ext)) {
      const text = fs.readFileSync(from, 'utf8');
      fs.writeFileSync(to, normalizeProductionText(text));
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function copyProductionDependency(rel) {
  const from = path.join(root, rel);
  const to = path.join(out, rel);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) {
    throw new Error(`Approved production dependency is missing: ${rel}`);
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const ext = path.extname(rel).toLowerCase();
  if (textExt.has(ext)) {
    fs.writeFileSync(to, normalizeProductionText(fs.readFileSync(from, 'utf8')));
  } else {
    fs.copyFileSync(from, to);
  }
}

copyDir(root, out);
for (const rel of productionDependencies) copyProductionDependency(rel);

fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'CNAME'), 'dementor.club\n');

console.log(`GitHub Pages artifact ready for ${productionOrigin} at ${out}`);
console.log(`Approved runtime dependencies shipped: ${productionDependencies.length}`);
