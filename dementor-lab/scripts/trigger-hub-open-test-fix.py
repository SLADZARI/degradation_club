from pathlib import Path
p=Path('dementor-lab/tests/browser-smoke.mjs')
s=p.read_text()
old="await page.locator('[data-trigger-hub-toggle]').click();assert.equal(await page.locator('[data-trigger-row]').count(),1,'hub expands to the real entry node');await page.locator(`[data-trigger-connect=\"${triggerId}\"]`).click();"
new="assert.equal(await page.locator('[data-trigger-hub-toggle]').getAttribute('aria-expanded'),'true','custom BRAIN keeps Trigger Hub open for authoring');assert.equal(await page.locator('[data-trigger-row]').count(),1,'open hub exposes the real entry node');await page.locator(`[data-trigger-connect=\"${triggerId}\"]`).click();"
if old not in s: raise SystemExit('open-state assertion not found')
p.write_text(s.replace(old,new))
