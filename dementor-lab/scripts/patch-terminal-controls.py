from pathlib import Path

root=Path('dementor-lab')

p=root/'src/core/graph.mjs'
s=p.read_text()
s=s.replace("function edgeFamiliesCompatible(fromNode,toNode){const fromFam=familyOf(fromNode),toFam=familyOf(toNode);return toFam!=='TRIGGER'&&Boolean(NEXT_FAMILY_COMPAT[fromFam]?.has(toFam))}", "function terminalControl(node){return node?.type==='stop'||node?.type==='repeat'}\nfunction edgeFamiliesCompatible(fromNode,toNode){if(terminalControl(fromNode))return false;const fromFam=familyOf(fromNode),toFam=familyOf(toNode);return toFam!=='TRIGGER'&&Boolean(NEXT_FAMILY_COMPAT[fromFam]?.has(toFam))}")
s=s.replace("  const incompatible=(graph.edges||[]).find(e=>!edgeFamiliesCompatible(graph.nodes.find(n=>n.id===e.from),graph.nodes.find(n=>n.id===e.to)));", "  const terminalOutgoing=(graph.edges||[]).find(e=>terminalControl(graph.nodes.find(n=>n.id===e.from)));\n  if(terminalOutgoing){const source=graph.nodes.find(n=>n.id===terminalOutgoing.from);return {runnable:false,code:'TERMINAL_CONTROL_OUTGOING',edgeId:terminalOutgoing.id,nodeId:source?.id,detail:`ПОСЛЕ «${NODE_SPECS[source?.type]?.title||source?.type}» ВЕТКА УЖЕ ЗАКОНЧЕНА. УБЕРИ СВЯЗЬ ПОСЛЕ НЕГО.`}};\n  const incompatible=(graph.edges||[]).find(e=>!edgeFamiliesCompatible(graph.nodes.find(n=>n.id===e.from),graph.nodes.find(n=>n.id===e.to)));")
p.write_text(s)

p=root/'src/core/model.mjs'
s=p.read_text()
s=s.replace("repeat:{family:'CONTROL',title:'REPEAT',description:'повторяет ту же реакцию до лимита; явное согласие собеседника отменяет оставшиеся повторы',defaults:{count:2}},", "repeat:{family:'CONTROL',title:'REPEAT',description:'повторяет ту же реакцию до лимита и завершает ветку; явное согласие собеседника отменяет оставшиеся повторы',defaults:{count:2}},")
p.write_text(s)

p=root/'tests/gameplay-regression-selftest.mjs'
s=p.read_text()
s=s.replace("const stopGraph={id:'stop-semantics',nodes:[{id:'t',type:'criticism',p:{}},{id:'j',type:'joke',p:{}},{id:'s',type:'stop',p:{}},{id:'p',type:'pressure',p:{}}],edges:[edge('e1','t','j'),edge('e2','j','s'),edge('e3','s','p')]};\nconst stopPrediction=predictTurn(encounterWithGraph(stopGraph));assert.deepEqual(stopPrediction.chosen.path.map(n=>n.id),['t','j','s']);assert.equal(stopPrediction.chosen.reaction,'joke');", "const stopGraph={id:'stop-semantics',nodes:[{id:'t',type:'criticism',p:{}},{id:'j',type:'joke',p:{}},{id:'s',type:'stop',p:{}}],edges:[edge('e1','t','j'),edge('e2','j','s')]};\nconst stopPrediction=predictTurn(encounterWithGraph(stopGraph));assert.deepEqual(stopPrediction.chosen.path.map(n=>n.id),['t','j','s']);assert.equal(stopPrediction.chosen.reaction,'joke');\nconst deadAfterStop={id:'dead-after-stop',nodes:[{id:'t',type:'criticism',p:{}},{id:'j',type:'joke',p:{}},{id:'s',type:'stop',p:{}},{id:'p',type:'pressure',p:{}}],edges:[edge('s1','t','j'),edge('s2','j','s'),edge('s3','s','p')]};assert.equal(validateGraph(deadAfterStop).code,'TERMINAL_CONTROL_OUTGOING','STOP cannot advertise a route runtime will never execute');\nconst deadAfterRepeat={id:'dead-after-repeat',nodes:[{id:'t',type:'criticism',p:{}},{id:'j',type:'joke',p:{}},{id:'x',type:'repeat',p:{count:2}},{id:'p',type:'pressure',p:{}}],edges:[edge('r1','t','j'),edge('r2','j','x'),edge('r3','x','p')]};assert.equal(validateGraph(deadAfterRepeat).code,'TERMINAL_CONTROL_OUTGOING','REPEAT ends the authored branch after scheduling repeats');")
p.write_text(s)
