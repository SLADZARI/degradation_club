from pathlib import Path
import re

app=Path('dementor-lab/src/ui/app.mjs')
s=app.read_text()
pattern=r"function brainReadableRouteHtml\(\)\{.*?\}\nfunction triggerHubHtml"
replacement="""function brainReadableAlternatives(node,nextId){const seen=new Set();return outgoing(currentBrainGraph,node.id).filter(edge=>edge.to!==nextId).map(edge=>fromBrainNode(edge.to)).filter(Boolean).filter(target=>{if(seen.has(target.id))return false;seen.add(target.id);return true})}
function brainReadableRouteHtml(){const nodes=brainReadableRouteNodes();if(!nodes.length)return `<div class=\"brain-readable-route empty\" data-brain-readable-route><small>КАК ЭТО СРАБОТАЕТ</small><p>ПОДКЛЮЧИ ХОТЯ БЫ ОДНУ РЕАКЦИЮ СВЕРХУ — И ЗДЕСЬ ПОЯВИТСЯ ПОВЕДЕНЧЕСКАЯ ЦЕПОЧКА.</p></div>`;return `<div class=\"brain-readable-route\" data-brain-readable-route><small>КАК ЭТО СРАБОТАЕТ</small><div class=\"brain-readable-route__flow\">${nodes.map((node,i)=>{const next=nodes[i+1]||null,alts=brainReadableAlternatives(node,next?.id);return `<div class=\"brain-readable-cluster\"><button type=\"button\" data-readable-node=\"${node.id}\" class=\"brain-readable-step ${node.id===activeBrainTriggerId||node.id===activeBrainNodeId?'active':''}\"><span>${brainReadableRole(node)}</span><strong>${title(node.type)}</strong></button>${alts.length?`<div class=\"brain-readable-alts\"><span>ИЛИ</span>${alts.map(alt=>`<button type=\"button\" class=\"brain-readable-alt ${alt.id===activeBrainNodeId||alt.id===activeBrainTriggerId?'active':''}\" data-readable-node=\"${alt.id}\">${title(alt.type)}</button>`).join('')}</div>`:''}</div>${i<nodes.length-1?'<b class=\"brain-readable-arrow\" aria-hidden=\"true\">→</b>':''}`}).join('')}</div></div>`}
function triggerHubHtml"""
s2,n=re.subn(pattern,replacement,s,count=1,flags=re.S)
if n!=1: raise SystemExit(f'readable route replacement count={n}')
app.write_text(s2)

test=Path('dementor-lab/tests/browser-smoke.mjs')
t=test.read_text()
needle="assert.match(await impulseWrap.locator('.brain-stack-route').textContent(),/ОБЪЯСНИТЬ|STOP/,'ordinary node exposes authored outgoing causality in-card');"
insert=needle+"assert.ok(await page.locator('[data-brain-readable-route] .brain-readable-alt').filter({hasText:/STOP/}).count()>=1,'readable route exposes real side branch as ИЛИ');"
if needle not in t: raise SystemExit('branch assertion marker not found')
t=t.replace(needle,insert,1)
old="const replayRepeats=page.locator('#brain-graph .brain-stack-node').filter({hasText:'REPEAT'});assert.equal(await replayRepeats.count(),2,'replay fixture contains two same-type nodes');assert.equal(await page.locator('#brain-graph .brain-stack-node.locked').filter({hasText:'REPEAT'}).count(),1,'only the exact suspicious repeat node is unlocked');"
new="const replayRepeats=page.locator('#brain-graph .brain-stack-node').filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})});assert.equal(await replayRepeats.count(),2,'replay fixture contains two same-type nodes');assert.equal(await replayRepeats.filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})}).locator('..').count()>=0,true);assert.equal(await page.locator('#brain-graph .brain-stack-node.locked').filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})}).count(),1,'only the exact suspicious repeat node is unlocked');"
if old not in t: raise SystemExit('repeat selector marker not found')
t=t.replace(old,new,1)
# Remove the deliberately redundant middle assertion; keep exact-title selectors only.
t=t.replace("assert.equal(await replayRepeats.filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})}).locator('..').count()>=0,true);","")
test.write_text(t)
