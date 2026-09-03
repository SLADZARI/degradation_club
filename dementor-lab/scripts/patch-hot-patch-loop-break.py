from pathlib import Path
root=Path('dementor-lab')

p=root/'src/encounter/runtime.mjs'
s=p.read_text()
s=s.replace("if(patch.kind==='reduce-repeat'){const n=nodeById(graph,patch.nodeId);if(!n||n.type!=='repeat')throw new Error('repeat node required');before=n.p.count||1;n.p.count=Math.max(1,before-(patch.amount||1));after=n.p.count;const pending=encounter.pendingRepeats.A;if(pending?.repeatNodeId===n.id){pending.total=after;pending.remaining=Math.min(pending.remaining,Math.max(0,after-1));if(pending.remaining<=0)encounter.pendingRepeats.A=null}}", "if(patch.kind==='reduce-repeat'){const n=nodeById(graph,patch.nodeId);if(!n||n.type!=='repeat')throw new Error('repeat node required');before=n.p.count||1;n.p.count=1;after=1;const pending=encounter.pendingRepeats.A;if(pending?.repeatNodeId===n.id)encounter.pendingRepeats.A=null}")
p.write_text(s)

p=root/'src/ui/app.mjs'
s=p.read_text().replace("${repeat?`<button data-patch=\"repeat\">REPEAT ×${repeat.p.count} → ×${Math.max(1,repeat.p.count-1)}</button>`:''}", "${repeat?`<button data-patch=\"repeat\">ОБОРОТЬ REPEAT ×${repeat.p.count} → ×1</button>`:''}")
p.write_text(s)

p=root/'tests/encounter-runtime-selftest.mjs'
s=p.read_text().replace("assert.equal(changed.before,4);assert.equal(changed.after,3);", "assert.equal(changed.before,4);assert.equal(changed.after,1,'HOT PATCH breaks the dangerous loop instead of shaving one repetition');")
s=s.replace("assert.equal(h.transcript.length,beforeTranscript);assert.equal(h.status,'NEXT_TURN');", "assert.equal(h.transcript.length,beforeTranscript);assert.equal(h.status,'NEXT_TURN');const afterPatchTurn=executeActorTurn(h);assert.equal(afterPatchTurn.trace.selectedReaction,'explain');assert.equal(h.pendingRepeats.A,null,'loop-break patch prevents new pending repeats on the repaired route');")
p.write_text(s)
