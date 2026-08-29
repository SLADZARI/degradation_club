import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '_qa_site');

const skipTopLevel = new Set([
  '.git',
  '.github',
  '_site',
  '_qa_site',
  'node_modules',
  'docs',
  'references',
  'scripts',
  'test',
  'tests',
  'fixtures',
]);

const skipRootFiles = new Set([
  '.deploy-trigger',
  'DEPLOY_TRIGGER.txt',
  'DRIVE.md',
  'README.md',
  'CNAME',
]);

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
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
copyDir(root, out);

// QA is intentionally not production-hardened. Internal tools may stay enabled
// according to QA_ENVIRONMENT_POLICY_v1.md. Production-only CNAME/analytics
// mutation is deliberately absent here.
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'QA_BUILD.txt'), `branch=dementor-club-qa\ncommit=${process.env.GITHUB_SHA || 'local'}\n`);

console.log(`QA preview artifact ready at ${out}`);
