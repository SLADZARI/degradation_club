from pathlib import Path
p=Path(__file__).resolve().parents[1]/'tests/browser-smoke.mjs'
s=p.read_text()
old="await page.locator(`[data-brain-target=\"${reactionId}\"]`).click();assert.equal(await page.locator('#brain-graph .brain-stack-edge').count(),1,'explicit connect creates the body causal edge');"
new="await page.locator(`[data-brain-target=\"${reactionId}\"]`).click();assert.equal(Number(await page.locator('#brain-graph').getAttribute('data-edge-count')),1,'explicit connect creates the real body causal edge');await page.waitForTimeout(34);assert.equal(await page.locator('#brain-graph .brain-stack-edge').count(),1,'real body edge paints on the next animation frame');"
if old not in s: raise SystemExit('edge paint target not found')
s=s.replace(old,new)
p.write_text(s)
