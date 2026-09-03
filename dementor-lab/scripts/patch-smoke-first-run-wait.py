from pathlib import Path
p=Path(__file__).resolve().parents[1]/'tests/browser-smoke.mjs'
s=p.read_text()
old="await page.locator('.bottom-nav [data-nav=\"brain\"]').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.equal(await page.locator('#brain-help-ok').count(),1,'first BRAIN visit explains the mental model outside permanent editor chrome');"
new="await page.locator('.bottom-nav [data-nav=\"brain\"]').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');await page.locator('#brain-help-ok').waitFor({state:'visible'});assert.equal(await page.locator('#brain-help-ok').count(),1,'first BRAIN visit explains the mental model outside permanent editor chrome');"
if old not in s: raise SystemExit('first-run wait target not found')
s=s.replace(old,new)
p.write_text(s)
