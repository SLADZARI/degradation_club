import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '_site');
const base = '/degradation_club';
const skip = new Set(['.git', '_site', 'node_modules']);
const textExt = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.webmanifest', '.txt', '.md']);
const isRewritePassthrough = (name) => /^dementor-account-sync-v\d+\.js$/.test(name);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function rewrite(text) {
  let outText = text;
  // Root URL exactly "/" in quoted attributes/strings.
  outText = outText.replace(/(["'])\/\1/g, `$1${base}/$1`);
  // Root-relative quoted paths such as href="/about/", src='/assets/x', url('/styles.css'), fetch('/content/x.json').
  outText = outText.replace(/(["'])\/(?!\/)(?=[A-Za-z0-9_.-])/g, `$1${base}/`);
  return outText;
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (textExt.has(ext)) {
      const text = fs.readFileSync(from, 'utf8');
      fs.writeFileSync(to, isRewritePassthrough(entry.name) ? text : rewrite(text));
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

copyDir(root, out);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`GitHub Pages artifact ready at ${out} with base ${base}/`);
