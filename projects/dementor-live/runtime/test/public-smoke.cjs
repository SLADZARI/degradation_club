// Safe production smoke: read-only HTTP checks and login-screen screenshots.
// Never click login or call any gameplay/action endpoints against production.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const base = (process.env.DEMENTOR_PUBLIC_URL || 'http://138.199.144.94/').replace(/\/?$/, '/');
const output = path.join(__dirname, '..', 'reports');
fs.mkdirSync(output, { recursive: true });
const report = { target: base, mode: 'read-only / no player login', pass: false, checks: [], screenshots: [], errors: [] };
let browser;

(async () => {
  try {
    const healthResponse = await fetch(new URL('api/health', base), { signal: AbortSignal.timeout(15000) });
    assert.equal(healthResponse.status, 200, 'GET /api/health must be HTTP 200');
    const health = await healthResponse.json();
    assert.equal(health.ok, true, 'health.ok must be true');
    assert.equal(health.testMode, false, 'public server must not be in test mode');
    assert.ok(typeof health.version === 'string' && health.version.length > 0, 'missing server version');
    report.version = health.version;
    report.candidateVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version;
    report.versionMatchesCandidate = report.version === report.candidateVersion;
    report.sourceCommitVerified = false; // /api/health currently does not expose a verified build SHA.
    report.warnings = [];
    if (!report.versionMatchesCandidate) {
      const warning = 'VERSION DRIFT: public=' + report.version + ' / tested source=' + report.candidateVersion;
      report.warnings.push(warning);
      console.warn(warning);
    }
    report.checks.push('Health: HTTP 200, ok=true, testMode=false, version=' + health.version);

    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const [label, viewport] of [
      ['desktop', { width: 1440, height: 900 }],
      ['mobile', { width: 390, height: 844 }],
    ]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push('pageerror: ' + e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      page.on('requestfailed', req => {
        const failure = req.failure()?.errorText || '';
        if (!req.url().includes('/api/events') && !failure.includes('ABORTED')) {
          errors.push('network: ' + req.method() + ' ' + req.url() + ' ' + failure);
        }
      });

      const response = await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
      assert.equal(response?.status(), 200, label + ': page HTTP status');
      await page.getByLabel('Как тебя зовут?').waitFor({ state: 'visible', timeout: 15000 });
      assert.ok(await page.getByRole('button', { name: 'Войти в мир' }).isVisible(), label + ': login button missing');
      await page.waitForTimeout(800);
      const file = path.join(output, 'production-' + label + '.png');
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
      report.screenshots.push(path.basename(file));
      if (errors.length) report.errors.push(...errors.map(e => label + ': ' + e));
      report.checks.push(label + ': page loaded, welcome form visible; screenshot captured');
      await context.close();
    }
    assert.deepEqual(report.errors, [], 'Console / network errors found');
    report.pass = true;
    console.log('PASS: read-only public smoke ' + base);
  } catch (error) {
    report.errors.push(error.stack || String(error));
    console.error('FAIL: read-only public smoke', error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    fs.writeFileSync(path.join(output, 'public-smoke.json'), JSON.stringify(report, null, 2) + '\n');
  }
})();
