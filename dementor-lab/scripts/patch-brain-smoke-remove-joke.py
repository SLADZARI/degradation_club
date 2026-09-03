from pathlib import Path
p=Path('dementor-lab/tests/browser-smoke.mjs')
s=p.read_text()
s=s.replace("await addNode('beright');await addNode('explain');await addNode('joke');", "await addNode('beright');await addNode('explain');")
s=s.replace("assert.equal(await page.locator('#brain-graph .brain-stack-node').count(),3,'main stack shows behavioral body without duplicating trigger infrastructure');", "assert.equal(await page.locator('#brain-graph .brain-stack-node').count(),2,'main stack shows behavioral body without duplicating trigger infrastructure');")
s=s.replace(",freeReactionWrap=page.locator('#brain-graph .brain-stack-node').filter({hasText:'ПОШУТИТЬ'}).first()", "")
s=s.replace(",freeReactionId=await freeReactionWrap.getAttribute('data-brain-node-wrap')", "")
p.write_text(s)
