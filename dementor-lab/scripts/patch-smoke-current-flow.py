from pathlib import Path
p=Path(__file__).resolve().parents[1]/'tests/browser-smoke.mjs'
s=p.read_text()
old="await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');if(await page.locator('#brain-help-ok').count()){assert.match(await page.locator('.brain-first-run').textContent(),/ВХОДЫ[\\s\\S]*ЦЕПОЧКА[\\s\\S]*РЕЗУЛЬТАТ/,'first BRAIN visit explains the mental model once');await page.locator('#brain-help-ok').click();}assert.equal(await page.locator('#brain-help-ok').count(),1,'first BRAIN visit explains the mental model outside permanent editor chrome');assert.match(await page.locator('.brain-first-run').textContent(),/ВХОДЫ/);assert.match(await page.locator('.brain-first-run').textContent(),/ЛИНИИ ЗАДАЮТ ПРИЧИННОСТЬ/);await page.locator('#brain-help-ok').click();assert.equal(await page.locator('#overlay').isHidden(),true,'first-run guide dismisses into normal editing');assert.ok(await page.locator('#brain-presets [data-brain-preset]').count()>=7,'behavioral preset rail remains available');"
new="assert.equal(await page.locator('#to-brain').isVisible(),false,'duplicate PERSON to BRAIN CTA stays out of the visible mobile flow');await page.locator('.bottom-nav [data-nav=\"brain\"]').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.equal(await page.locator('#brain-help-ok').count(),1,'first BRAIN visit explains the mental model outside permanent editor chrome');assert.match(await page.locator('.brain-first-run').textContent(),/ВХОДЫ[\\s\\S]*ЦЕПОЧКА[\\s\\S]*РЕЗУЛЬТАТ/);assert.match(await page.locator('.brain-first-run').textContent(),/ЛИНИИ ЗАДАЮТ ПРИЧИННОСТЬ/);await page.locator('#brain-help-ok').click();assert.equal(await page.locator('#overlay').isHidden(),true,'first-run guide dismisses into normal editing');assert.ok(await page.locator('#brain-presets [data-brain-preset]').count()>=7,'behavioral preset rail remains available');"
if old not in s: raise SystemExit('smoke current-flow target not found')
s=s.replace(old,new)
# TALK technical details are now opt-in. Ensure smoke opens the panel before asserting it.
old2="await page.locator('#next-turn').click();await page.waitForTimeout(30);assert.equal(await page.locator('#talk-cause .talk-cause__step').count(),3,'TALK exposes action event and next trigger from the real trace');"
new2="await page.locator('#next-turn').click();await page.waitForTimeout(30);await page.locator('#talk-tech-toggle').click();assert.equal(await page.locator('#talk-cause .talk-cause__step').count(),3,'opt-in TALK detail exposes action event and next trigger from the real trace');"
if old2 in s:s=s.replace(old2,new2)
# close tech details before continuing the fight if not already closed in the smoke.
needle="assert.match(await page.locator('.turn').getAttribute('data-flow-label'),/^(A → B|B → A)$/,'center turn marker points toward the next brain');"
if needle in s and "await page.locator('#talk-tech-toggle').click();" not in s[s.find(needle):s.find(needle)+len(needle)+100]:
    s=s.replace(needle,needle+"await page.locator('#talk-tech-toggle').click();")
p.write_text(s)
