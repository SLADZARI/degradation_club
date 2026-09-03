from pathlib import Path
root=Path('dementor-lab')

p=root/'index.html'
s=p.read_text()
old='<div class="result-block"><small>ЧТО ПРОИЗОШЛО</small><strong id="result-cause"></strong></div><div class="result-block"><small>ПОДОЗРИТЕЛЬНОЕ МЕСТО</small><strong id="result-node"></strong></div>'
new='<div class="result-block"><small>ЧТО ПРОИЗОШЛО</small><strong id="result-cause"></strong></div><div class="result-block"><small>КАК МЕНЯЛОСЬ</small><strong id="result-arc"></strong></div><div class="result-block"><small>ПОДОЗРИТЕЛЬНОЕ МЕСТО</small><strong id="result-node"></strong></div>'
if old not in s: raise SystemExit('result markup marker not found')
p.write_text(s.replace(old,new))

p=root/'src/ui/app.mjs'
s=p.read_text()
old="function showResult(result){show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.cause;$('#result-node').textContent=result.stageC.nodeType?title(result.stageC.nodeType):'—';"
new="function showResult(result){show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.cause;$('#result-arc').textContent=result.stageB.arc?.summary||'—';$('#result-node').textContent=result.stageC.nodeType?title(result.stageC.nodeType):'—';"
if old not in s: raise SystemExit('showResult marker not found')
p.write_text(s.replace(old,new))

p=root/'tests/browser-smoke.mjs'
s=p.read_text()
old="assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);await page.locator('#rerun').click();"
new="assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);assert.ok((await page.locator('#result-arc').textContent()).trim().length>0,'RESULT exposes the trace-derived behavior arc');await page.locator('#rerun').click();"
if old not in s: raise SystemExit('browser result marker not found')
p.write_text(s.replace(old,new))
