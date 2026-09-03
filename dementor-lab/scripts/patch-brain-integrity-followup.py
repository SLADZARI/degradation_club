from pathlib import Path
root=Path(__file__).resolve().parents[1]

p=root/'src/ui/app.mjs'
s=p.read_text()
s=s.replace("function deleteBrainNode(id){if(replayMode)return;const node=fromBrainNode(id);if(!node||familyOf(node)==='TRIGGER')return;removeBrainNode(currentBrainGraph,id);activeBrainNodeId=null;brainConnectFromId=null;activeBrainPresetId='custom';rebuildBrainSequence();renderBrain()}","function deleteBrainNode(id){if(replayMode)return;const node=fromBrainNode(id);if(!node||familyOf(node)==='TRIGGER')return;removeBrainNode(currentBrainGraph,id);activeBrainNodeId=null;brainConnectFromId=null;activeBrainPresetId='custom';groupBrainNodes();normalizeBrainStack();renderBrain()}")
s=s.replace('<div class="brain-behavior-head"><small>РЕДАКТОР</small><strong>ИЗ ЧЕГО ЭТО СОБРАНО</strong><p>Нажми на узел, чтобы изменить параметр, связь или порядок.</p></div>','<div class="brain-behavior-head"><small>РЕДАКТОР</small><strong>ИЗ ЧЕГО ЭТО СОБРАНО</strong></div>')
p.write_text(s)

p=root/'tests/browser-smoke.mjs'
s=p.read_text()
s=s.replace("assert.equal(await page.locator('[data-part]').count(),6,'appearance panel exposes six semantic parts');","assert.equal(await page.locator('.appearance-panel button').count(),4,'PERSON exposes four compact appearance categories');")
old="await page.waitForTimeout(20);const reactionHandle=page.locator(`[data-brain-drag=\"${reactionId}\"]`),reactionHandleBox=await reactionHandle.boundingBox(),impulseBox=await impulseWrap.boundingBox();assert.ok(reactionHandleBox&&impulseBox,'drag geometry exists');"
new="await page.waitForTimeout(20);const edgesBeforeDrag=Number(await page.locator('#brain-graph').getAttribute('data-edge-count'));const reactionHandle=page.locator(`[data-brain-drag=\"${reactionId}\"]`),reactionHandleBox=await reactionHandle.boundingBox(),impulseBox=await impulseWrap.boundingBox();assert.ok(reactionHandleBox&&impulseBox,'drag geometry exists');"
if old in s:s=s.replace(old,new)
old2="assert.equal(await page.locator(`[data-trigger-row=\"${triggerId}\"]`).count(),1,'Trigger Hub survives body reorder');"
new2=old2+"assert.equal(Number(await page.locator('#brain-graph').getAttribute('data-edge-count')),edgesBeforeDrag,'drag changes presentation order without rewriting causal edges');assert.equal(await page.locator('#to-setup').isDisabled(),false,'custom graph remains runnable after visual reorder');"
if old2 in s:s=s.replace(old2,new2)
p.write_text(s)
