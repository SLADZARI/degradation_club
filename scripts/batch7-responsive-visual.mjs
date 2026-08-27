import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const OUT = path.join(ROOT, 'artifacts', 'batch7');
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const viewports = [
  { name: 'm390', width: 390, height: 844 },
  { name: 'm430', width: 430, height: 932 },
  { name: 'tablet768', width: 768, height: 1024 },
  { name: 'desktop1024', width: 1024, height: 900 },
  { name: 'desktop1440', width: 1440, height: 1100 },
];

const skipDirs = new Set(['.git', 'node_modules', 'artifacts', 'assets', 'docs', 'scripts']);
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.isFile() && (ent.name === 'index.html' || ent.name === '404.html')) out.push(p);
  }
  return out;
}
function toRoute(file) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}
const routes = walk(ROOT).map(toRoute).sort();

function safeName(route) {
  return (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replace(/[^a-zA-Z0-9._-]+/g, '__')) || 'home';
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(String(err.message || err)));
    const url = new URL(route, BASE).href;
    let status = null;
    let loadError = null;
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      status = res?.status() ?? null;
      await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
      await page.waitForTimeout(120);
    } catch (e) {
      loadError = String(e.message || e);
    }

    const metrics = loadError ? null : await page.evaluate(({ width }) => {
      const d = document.documentElement;
      const body = document.body;
      const visible = el => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0;
      };
      const selectorOf = el => {
        let s = el.tagName.toLowerCase();
        if (el.id) s += `#${el.id}`;
        else if (el.classList?.length) s += '.' + [...el.classList].slice(0, 3).join('.');
        return s;
      };
      const protrusions = [];
      const clippedText = [];
      const all = [...document.querySelectorAll('body *')];
      for (const el of all) {
        if (!visible(el)) continue;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const pos = cs.position;
        const intentionallyWide = el.closest('.dc-notice__track,.ticker,.dc-course-strip') || cs.whiteSpace === 'nowrap' && el.closest('[class*="ticker"],[class*="strip"]');
        if (!intentionallyWide && pos !== 'fixed' && (r.left < -3 || r.right > width + 3) && r.width < width * 2.2) {
          protrusions.push({ selector: selectorOf(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) });
        }
        const text = (el.childElementCount === 0 ? el.textContent : '').trim();
        const srOnly = /(^|\s)(dc-global-sr|sr-only|visually-hidden)(\s|$)/.test(el.className || '');
        if (!srOnly && text.length > 2 && ['hidden','clip'].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 3) {
          clippedText.push({ selector: selectorOf(el), text: text.slice(0, 80), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth });
        }
      }
      const brokenImages = [...document.images].filter(img => (img.getAttribute('src') || '').trim() && img.complete && img.naturalWidth === 0).map(img => ({ src: img.getAttribute('src'), alt: img.alt }));
      const images = [...document.images].filter(visible).map(img => {
        const cs = getComputedStyle(img); const r = img.getBoundingClientRect();
        return { src: img.getAttribute('src'), fit: cs.objectFit, position: cs.objectPosition, w: Math.round(r.width), h: Math.round(r.height) };
      });
      const topbar = document.querySelector('.topbar');
      const main = document.querySelector('main');
      let topbarOverlap = false;
      if (topbar && main) {
        const tb = topbar.getBoundingClientRect();
        const first = [...main.children].find(visible);
        if (first) {
          const fr = first.getBoundingClientRect();
          topbarOverlap = getComputedStyle(topbar).position === 'fixed' && fr.top < tb.bottom - 2;
        }
      }
      return {
        viewportWidth: width,
        scrollWidth: Math.max(d.scrollWidth, body?.scrollWidth || 0),
        horizontalOverflow: protrusions.some(x => !['div.dc-notice__track'].includes(x.selector)),
        protrusions: protrusions.slice(0, 30),
        clippedText: clippedText.slice(0, 30),
        brokenImages,
        topbarOverlap,
        images,
      };
    }, { width: vp.width });

    const screenshot = path.join(SHOTS, `${safeName(route)}__${vp.name}.png`);
    if (!loadError) await page.screenshot({ path: screenshot, fullPage: true });
    const severity = loadError || (status && status >= 400 && route !== '/404.html') || metrics?.brokenImages.length || metrics?.horizontalOverflow || metrics?.topbarOverlap || metrics?.clippedText.length ? 'fail' : metrics?.protrusions.length ? 'warn' : 'pass';
    results.push({ route, viewport: vp, status, loadError, consoleErrors: consoleErrors.slice(0, 20), pageErrors: pageErrors.slice(0, 20), severity, metrics, screenshot: path.relative(ROOT, screenshot).replaceAll(path.sep, '/') });
    await page.close();
  }
  await context.close();
}
await browser.close();

const summary = {
  generatedAt: new Date().toISOString(), baseUrl: BASE, routes: routes.length, viewports,
  totalCases: results.length,
  pass: results.filter(r => r.severity === 'pass').length,
  warn: results.filter(r => r.severity === 'warn').length,
  fail: results.filter(r => r.severity === 'fail').length,
  failuresByType: {
    load: results.filter(r => r.loadError).length,
    http: results.filter(r => r.status && r.status >= 400 && r.route !== '/404.html').length,
    overflow: results.filter(r => r.metrics?.horizontalOverflow).length,
    brokenImages: results.filter(r => r.metrics?.brokenImages?.length).length,
    clippedText: results.filter(r => r.metrics?.clippedText?.length).length,
    topbarOverlap: results.filter(r => r.metrics?.topbarOverlap).length,
    consoleErrors: results.filter(r => r.consoleErrors.length).length,
    pageErrors: results.filter(r => r.pageErrors.length).length,
  }
};
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ summary, results }, null, 2));
const bad = results.filter(r => r.severity !== 'pass');
let md = `# Batch 7 — Responsive visual sign-off\n\nGenerated: ${summary.generatedAt}\n\nRoutes: **${summary.routes}** · Viewports: **${viewports.length}** · Cases: **${summary.totalCases}**\n\nPASS **${summary.pass}** · WARN **${summary.warn}** · FAIL **${summary.fail}**\n\n## Failure counters\n\n`;
for (const [k,v] of Object.entries(summary.failuresByType)) md += `- ${k}: ${v}\n`;
md += `\n## Non-pass cases\n\n`;
for (const r of bad) {
  md += `### ${r.severity.toUpperCase()} — ${r.route} @ ${r.viewport.name} (${r.viewport.width}px)\n`;
  if (r.loadError) md += `- load: ${r.loadError}\n`;
  if (r.status && r.status >= 400) md += `- HTTP: ${r.status}\n`;
  if (r.metrics?.horizontalOverflow) md += `- horizontal overflow: scrollWidth ${r.metrics.scrollWidth}\n`;
  if (r.metrics?.brokenImages?.length) md += `- broken images: ${r.metrics.brokenImages.map(x=>x.src).join(', ')}\n`;
  if (r.metrics?.clippedText?.length) md += `- clipped text: ${r.metrics.clippedText.slice(0,5).map(x=>x.selector).join(', ')}\n`;
  if (r.metrics?.topbarOverlap) md += `- topbar/main overlap detected\n`;
  if (r.metrics?.protrusions?.length) md += `- protrusions: ${r.metrics.protrusions.slice(0,5).map(x=>x.selector).join(', ')}\n`;
  if (r.consoleErrors.length) md += `- console errors: ${r.consoleErrors.slice(0,3).join(' | ')}\n`;
  if (r.pageErrors.length) md += `- page errors: ${r.pageErrors.slice(0,3).join(' | ')}\n`;
  md += `- screenshot: \`${r.screenshot}\`\n\n`;
}
fs.writeFileSync(path.join(OUT, 'REPORT.md'), md);
console.log(JSON.stringify(summary, null, 2));
if (summary.fail > 0) process.exitCode = 2;
