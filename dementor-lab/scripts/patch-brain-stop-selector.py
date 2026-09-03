from pathlib import Path
p=Path('dementor-lab/tests/browser-smoke.mjs')
s=p.read_text()
s=s.replace("const stopWrap=page.locator('#brain-graph .brain-stack-node').filter({hasText:'STOP'}).first(),stopId=await stopWrap.getAttribute('data-brain-node-wrap');", "const stopWrap=page.locator('#brain-graph .brain-stack-node').filter({has:page.locator('.brain-stack-title',{hasText:/^STOP$/})}).first(),stopId=await stopWrap.getAttribute('data-brain-node-wrap');")
p.write_text(s)
