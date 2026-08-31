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

function injectQaHud(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      injectQaHud(target);
      continue;
    }
    if (!entry.name.toLowerCase().endsWith('.html')) continue;
    let html = fs.readFileSync(target, 'utf8');
    if (html.includes('/qa/qa-hud-v1.js')) continue;
    const script = '<script src="/qa/qa-hud-v1.js" defer></script>';
    if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${script}\n</body>`);
    else html += `\n${script}\n`;
    fs.writeFileSync(target, html);
  }
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
copyDir(root, out);

// QA-only instrumentation is injected into the generated QA artifact, not source pages.
// This keeps production/staging semantics and markup untouched while giving screenshots
// deterministic route/surface/block/build context during manual review.
injectQaHud(out);

// QA is intentionally not production-hardened. Internal tools may stay enabled
// according to QA_ENVIRONMENT_POLICY_v1.md. Production-only CNAME/analytics
// mutation is deliberately absent here.
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'QA_BUILD.txt'), `branch=dementor-club-qa\ncommit=${process.env.GITHUB_SHA || 'local'}\n`);

console.log(`QA preview artifact ready at ${out}`);
