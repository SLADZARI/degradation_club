from pathlib import Path
p=Path('dementor-lab/tests/browser-smoke.mjs')
s=p.read_text()
old="await page.locator(`[data-brain-node=\"${impulseId}\"]`).click();assert.ok(await page.locator('#brain-graph .brain-stack-edge.focus').count()>=1,'selected node highlights its real edges');"
new="if(!String(await impulseWrap.getAttribute('class')).includes('connection-focus'))await page.locator(`[data-brain-node=\"${impulseId}\"]`).click();assert.ok(await page.locator('#brain-graph .brain-stack-edge.focus').count()>=1,'selected node highlights its real edges');"
if old not in s: raise SystemExit('focus smoke pattern not found')
p.write_text(s.replace(old,new,1))
