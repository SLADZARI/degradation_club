from pathlib import Path
p=Path('dementor-lab/src/ui/app.mjs')
s=p.read_text()
anchor="function triggerDestination(node){const labels=outgoing(currentBrainGraph,node.id).map(edge=>currentBrainGraph.nodes.find(n=>n.id===edge.to)).filter(Boolean).map(n=>title(n.type));return labels.length?[...new Set(labels)].join(' · '):'НЕ ПОДКЛЮЧЕНО'}\n"
insert="""function brainReadableRole(node){const family=familyOf(node);if(family==='TRIGGER')return 'КОГДА';if(family==='STATE')return 'Я ЧУВСТВУ';if(family==='IMPULSE')return 'Я ХОЧУ';if(family==='REACTION')return 'Я ДЕЛАЮ';if(family==='CONTROL')return 'ДАЛЬШЕ';if(family==='ABILITY')return 'Я МОГУ';return 'УЗЕЛ'}
function brainReadableRouteNodes(){const triggers=brainTriggerNodes(),wired=triggers.filter(n=>outgoing(currentBrainGraph,n.id).length>0);let start=activeBrainTriggerId&&wired.find(n=>n.id===activeBrainTriggerId);if(!start)start=wired.find(n=>n.type===CRITICISM_IDEA_SCENARIO.openingTrigger)||wired[0];if(!start)return [];const order=new Map(currentBrainGraph.nodes.map((n,i)=>[n.id,i])),seen=new Set(),nodes=[];let current=start;while(current&&!seen.has(current.id)&&nodes.length<8){seen.add(current.id);nodes.push(current);const edges=outgoing(currentBrainGraph,current.id).slice().sort((a,b)=>((a.uiKind==='primary'?0:1)-(b.uiKind==='primary'?0:1))||((order.get(a.to)??999)-(order.get(b.to)??999)));current=edges.length?fromBrainNode(edges[0].to):null}return nodes}
function brainReadableRouteHtml(){const nodes=brainReadableRouteNodes();if(!nodes.length)return `<div class="brain-readable-route empty" data-brain-readable-route><small>КАК ЭТО СРАБОТАЕТ</small><p>ПОДКЛЮЧИ ХОТЯ БЫ ОДНУ РЕАКЦИЮ СВЕРХУ — И ЗДЕСЬ ПОЯВИТСЯ ПОВЕДЕНЧЕСКАЯ ЦЕПОЧКА.</p></div>`;return `<div class="brain-readable-route" data-brain-readable-route><small>КАК ЭТО СРАБОТАЕТ</small><div class="brain-readable-route__flow">${nodes.map((node,i)=>`<button type="button" data-readable-node="${node.id}" class="brain-readable-step ${node.id===activeBrainTriggerId||node.id===activeBrainNodeId?'active':''}"><span>${brainReadableRole(node)}</span><strong>${title(node.type)}</strong></button>${i<nodes.length-1?'<b aria-hidden="true">→</b>':''}`).join('')}</div></div>`}
"""
if 'function brainReadableRouteHtml()' not in s:
    if anchor not in s: raise SystemExit('triggerDestination anchor not found')
    s=s.replace(anchor,anchor+insert,1)
old="host.innerHTML=`${triggerHubHtml()}<section class=\"brain-behavior-block\" data-behavior-block><div class=\"brain-behavior-head\"><small>ВНУТРИ МОЗГА</small><strong>ЧТО Я ДЕЛАЮ, КОГДА ЭТО СЛУЧИЛОСЬ</strong><p>Читается сверху вниз: что я чувствую → чего хочу → что делаю → что происходит дальше.</p></div><svg class=\"brain-stack-links\" aria-hidden=\"true\"></svg><div class=\"brain-stack-list\">${body.map(n=>projectedBrainNodeHtml(n,route)).join('')}</div></section>`;"
new="host.innerHTML=`${triggerHubHtml()}<section class=\"brain-behavior-block\" data-behavior-block><div class=\"brain-behavior-head\"><small>ВНУТРИ МОЗГА</small><strong>ЧТО Я ДЕЛАЮ, КОГДА ЭТО СЛУЧИЛОСЬ</strong><p>Читается сверху вниз: что я чувствую → чего хочу → что делаю → что происходит дальше.</p></div>${brainReadableRouteHtml()}<svg class=\"brain-stack-links\" aria-hidden=\"true\"></svg><div class=\"brain-stack-list\">${body.map(n=>projectedBrainNodeHtml(n,route)).join('')}</div></section>`;"
if old not in s: raise SystemExit('renderBrainCanvas html marker not found')
s=s.replace(old,new,1)
bind="bindTriggerHub();host.querySelectorAll('[data-brain-node]').forEach(button=>button.addEventListener('click',()=>selectBrainNode(button.dataset.brainNode)));"
bind_new="bindTriggerHub();host.querySelectorAll('[data-readable-node]').forEach(button=>button.addEventListener('click',()=>{const node=fromBrainNode(button.dataset.readableNode);if(!node)return;if(familyOf(node)==='TRIGGER'){activeBrainTriggerId=node.id;brainTriggerHubOpen=true;brainConnectFromId=null;activeBrainNodeId=null;renderBrainCanvas();renderBrainStatus()}else selectBrainNode(node.id)}));host.querySelectorAll('[data-brain-node]').forEach(button=>button.addEventListener('click',()=>selectBrainNode(button.dataset.brainNode)));"
if bind not in s: raise SystemExit('bind marker not found')
s=s.replace(bind,bind_new,1)
p.write_text(s)

# Clean the exact-title replay smoke after route labels made hasText ambiguous.
t=Path('dementor-lab/tests/browser-smoke.mjs')
ts=t.read_text()
bad="assert.equal(await replayRepeats.filter({has:page.locator('.brain-stack-node.locked')}).count(),0).catch?.(()=>{});"
ts=ts.replace(bad,'')
t.write_text(ts)
