from pathlib import Path
p=Path('dementor-lab/tests/browser-smoke.mjs')
s=p.read_text()
old="assert.equal(await page.locator('#brain-graph .brain-stack-edge').count(),2,'adding nodes extends the primary sequence');"
new="assert.equal(await page.locator('#brain-graph .brain-stack-edge').count(),1,'body stack renders only the behavioral edge while trigger entry stays in the hub');"
if old not in s: raise SystemExit('edge assertion not found')
p.write_text(s.replace(old,new))
