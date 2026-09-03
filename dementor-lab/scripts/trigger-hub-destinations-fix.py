from pathlib import Path

app=Path('dementor-lab/src/ui/app.mjs')
s=app.read_text()
old="function triggerDestination(node){const first=outgoing(currentBrainGraph,node.id)[0],target=first&&currentBrainGraph.nodes.find(n=>n.id===first.to);return target?title(target.type):'НЕ ПОДКЛЮЧЕНО'}"
new="function triggerDestination(node){const labels=outgoing(currentBrainGraph,node.id).map(edge=>currentBrainGraph.nodes.find(n=>n.id===edge.to)).filter(Boolean).map(n=>title(n.type));return labels.length?[...new Set(labels)].join(' · '):'НЕ ПОДКЛЮЧЕНО'}"
if old not in s: raise SystemExit('triggerDestination not found')
app.write_text(s.replace(old,new))

browser=Path('dementor-lab/tests/browser-smoke.mjs')
b=browser.read_text()
old="assert.match(await page.locator(`[data-trigger-row=\"${triggerId}\"]`).textContent(),/ОБЪЯСНИТЬ/,'hub exposes the trigger destination instead of hiding causality');"
new="const triggerRouteText=await page.locator(`[data-trigger-row=\"${triggerId}\"]`).textContent();assert.match(triggerRouteText,/БЫТЬ ПРАВЫМ/,'hub keeps the authored primary trigger destination visible');assert.match(triggerRouteText,/ОБЪЯСНИТЬ/,'hub also exposes an additional trigger destination instead of hiding causality');"
if old not in b: raise SystemExit('destination assertion not found')
browser.write_text(b.replace(old,new))
