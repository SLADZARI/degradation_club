import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '_site');
const productionOrigin = 'https://dementor.club';
const skip = new Set([
  '.git',
  '.github',
  '_site',
  'node_modules',
  'docs',
  'references',
  'scripts',
  'design-system',
  'staging',
  'test',
  'tests',
  'admin',
]);
const textual = new Set(['.html','.css','.js','.json','.xml','.txt','.webmanifest']);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function walk(dir, fn) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fn); else fn(full);
  }
}

function normalizeProductionOrigins() {
  walk(out, full => {
    if (!textual.has(path.extname(full).toLowerCase())) return;
    let source = fs.readFileSync(full, 'utf8');
    source = source
      .replaceAll('https://degradation-club.vercel.app', productionOrigin)
      .replaceAll('https://sladzari.github.io/degradation_club', productionOrigin);
    fs.writeFileSync(full, source);
  });
}

function injectProductionModules() {
  walk(out, full => {
    if (!full.endsWith('.html')) return;
    const rel = path.relative(out, full).replaceAll('\\','/');
    let html = fs.readFileSync(full, 'utf8');

    if (!html.includes('/entity-recommendations-v1.css')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/entity-recommendations-v1.css">\n</head>');
    }
    if (!html.includes('/entity-recommendations-v1.js')) {
      html = html.replace('</body>', '<script src="/entity-recommendations-v1.js" defer></script>\n</body>');
    }
    if (rel === 'about/index.html' && !html.includes('/about-definition-v1.css')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/about-definition-v1.css">\n</head>');
    }
    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/logic-awareness-covers-v1.js')) {
      html = html.replace('</body>', '<script src="/logic-awareness-covers-v1.js" defer></script>\n</body>');
    }
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
    fs.writeFileSync(motionPath, source);
  }
}

copyDir(root, out);
normalizeProductionOrigins();
injectProductionModules();
hardenProductionRuntime();
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'CNAME'), 'dementor.club\n');

console.log(`GitHub Pages production artifact ready for ${productionOrigin} at ${out}`);
