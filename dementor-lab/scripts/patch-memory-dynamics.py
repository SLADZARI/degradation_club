from pathlib import Path

root=Path('dementor-lab')

p=root/'src/core/model.mjs'
s=p.read_text()
s=s.replace("export function applyMemoryNode(node,state){\n  const key=node?.p?.key||node?.type;\n  const delta=Number(node?.p?.delta??1);\n  const cap=Number(node?.p?.cap??5);\n  state.memory=state.memory||{};\n  const before=Number(state.memory[key]||0);\n  const after=Math.max(0,Math.min(cap,before+delta));\n  state.memory[key]=after;\n  return {key,before,after,semantics:MEMORY_SEMANTICS[node.type]||null};\n}", "export function applyMemoryNode(node,state){\n  const key=node?.p?.key||node?.type;\n  const delta=Number(node?.p?.delta??1);\n  const cap=Number(node?.p?.cap??5);\n  state.memory=state.memory||{};\n  const before=Number(state.memory[key]||0);\n  const after=Math.max(0,Math.min(cap,before+delta));\n  state.memory[key]=after;\n  let counter=null;\n  const opposing=key==='resentment'?'trust':key==='trust'?'resentment':null;\n  if(opposing&&delta>0){\n    const counterBefore=Number(state.memory[opposing]||0);\n    const counterAfter=Math.max(0,counterBefore-Math.abs(delta));\n    state.memory[opposing]=counterAfter;\n    if(counterAfter!==counterBefore)counter={key:opposing,before:counterBefore,after:counterAfter};\n  }\n  return {key,before,after,counter,semantics:MEMORY_SEMANTICS[node.type]||null};\n}")
s=s.replace("resentment:{family:'STATE',title:'ОБИДА',description:'запоминает обиду; накопленная обида сильнее тянет к этой ветке и повышает TENSION/BRAIN'", "resentment:{family:'STATE',title:'ОБИДА',description:'запоминает обиду; она тянет к этой ветке и постепенно вытесняет доверие'", 1)
s=s.replace("trust:{family:'STATE',title:'ДОВЕРИЕ',description:'запоминает доверие; накопленное доверие сильнее тянет к этой ветке и поддерживает CONTACT'", "trust:{family:'STATE',title:'ДОВЕРИЕ',description:'запоминает доверие; оно тянет к этой ветке и постепенно размывает обиду'", 1)
p.write_text(s)

p=root/'src/encounter/runtime.mjs'
s=p.read_text()
s=s.replace("if(fam==='STATE')score+=Number(character.state.memory?.[n.p?.key||n.type]||0)*1.35;", "if(fam==='STATE'){const key=n.p?.key||n.type,own=Number(character.state.memory?.[key]||0),opposing=key==='resentment'?'trust':key==='trust'?'resentment':null,other=opposing?Number(character.state.memory?.[opposing]||0):0;score+=(own-other)*1.8;}")
p.write_text(s)

p=root/'tests/gameplay-regression-selftest.mjs'
s=p.read_text()
insert="""

// Relationship memory is history, not two independent counters: trust and resentment compete and bias future routes.
const memoryChoiceGraph={id:'memory-choice',nodes:[
  {id:'t',type:'criticism',p:{}},
  {id:'resent',type:'resentment',p:{key:'resentment',delta:1,cap:5}},{id:'right',type:'beright',p:{weight:3}},{id:'press',type:'pressure',p:{}},
  {id:'trust',type:'trust',p:{key:'trust',delta:1,cap:5}},{id:'understand',type:'understand',p:{weight:3}},{id:'agree',type:'agree',p:{}}
],edges:[edge('m1','t','resent'),edge('m2','resent','right'),edge('m3','right','press'),edge('m4','t','trust'),edge('m5','trust','understand'),edge('m6','understand','agree')]};
assert.equal(predictTurn(encounterWithGraph(memoryChoiceGraph,{memory:{resentment:4,trust:0}})).chosen.reaction,'pressure','stored resentment pulls future criticism toward escalation');
assert.equal(predictTurn(encounterWithGraph(memoryChoiceGraph,{memory:{resentment:0,trust:4}})).chosen.reaction,'agree','stored trust pulls the same criticism toward contact repair');
const memoryActors=createCriticismActors();memoryActors.A.brainGraph={id:'memory-counter',nodes:[{id:'mt',type:'criticism',p:{}},{id:'ms',type:'trust',p:{key:'trust',delta:1,cap:5}},{id:'mr',type:'agree',p:{}}],edges:[edge('mc1','mt','ms'),edge('mc2','ms','mr')]};memoryActors.A.state.memory={resentment:3,trust:1};const memoryEncounter=createEncounter({scenario:CRITICISM_IDEA_SCENARIO,actorA:memoryActors.A,actorB:memoryActors.B,mode:'step'});const memoryOut=executeActorTurn(memoryEncounter);assert.equal(memoryActors.A.state.memory.trust,2);assert.equal(memoryActors.A.state.memory.resentment,2,'new trust erodes stored resentment');assert.deepEqual(memoryOut.trace.memoryChanges[0].counter,{key:'resentment',before:3,after:2});
"""
s=s.replace("// CONTACT objective evaluates the weaker side at turn limit.", insert+"\n// CONTACT objective evaluates the weaker side at turn limit.")
p.write_text(s)
