from pathlib import Path

root=Path('dementor-lab')

p=root/'src/encounter/runtime.mjs'
s=p.read_text()
s=s.replace("const REACTION_EFFECTS=Object.freeze({\n  explain:{self:{energy:-4,brain:8,tension:5},target:{tension:4,contact:-5}},\n  agree:{self:{energy:-2,brain:-2,tension:-4,contact:4},target:{tension:-3,contact:5}},\n  joke:{self:{energy:-3,brain:-1,tension:-5,contact:5},target:{tension:-4,contact:4}},\n  silent:{self:{energy:-1,brain:2,tension:2},target:{contact:-3}},\n  pressure:{self:{energy:-5,brain:6,tension:8},target:{tension:9,contact:-8}}\n});", "export const REACTION_EFFECTS=Object.freeze({\n  explain:{self:{energy:-4,brain:6,tension:3},target:{brain:3,tension:2,contact:-2}},\n  agree:{self:{energy:-2,brain:-3,tension:-5,contact:3},target:{tension:-4,contact:6}},\n  joke:{self:{energy:-3,brain:-1,tension:-7,contact:1},target:{tension:-6,contact:1}},\n  silent:{self:{energy:-1,brain:1,tension:1},target:{contact:-4}},\n  pressure:{self:{energy:-5,brain:7,tension:9},target:{energy:-6,brain:4,tension:10,contact:-9}}\n});")
p.write_text(s)

p=root/'src/core/model.mjs'
s=p.read_text()
s=s.replace("explain:{family:'REACTION',title:'ОБЪЯСНИТЬ',description:'объясняет; тратит ENERGY, повышает BRAIN/TENSION и снижает CONTACT',defaults:{}},", "explain:{family:'REACTION',title:'ОБЪЯСНИТЬ',description:'нагружает аргументами обоих; повышает BRAIN и немного портит CONTACT',defaults:{}},")
s=s.replace("agree:{family:'REACTION',title:'СОГЛАСИТЬСЯ',description:'соглашается; снижает TENSION, повышает CONTACT и может остановить чужой REPEAT',defaults:{}},", "agree:{family:'REACTION',title:'СОГЛАСИТЬСЯ',description:'лучше всего восстанавливает CONTACT, снижает TENSION и может остановить чужой REPEAT',defaults:{}},")
s=s.replace("joke:{family:'REACTION',title:'ПОШУТИТЬ',description:'шутит; снижает TENSION и поддерживает CONTACT, но не считается согласием',defaults:{}},", "joke:{family:'REACTION',title:'ПОШУТИТЬ',description:'лучше всего сбрасывает TENSION, но почти не чинит CONTACT и не считается согласием',defaults:{}},")
s=s.replace("silent:{family:'REACTION',title:'ПРОМОЛЧАТЬ',description:'молчит; экономит ENERGY, но немного повышает TENSION и снижает CONTACT',defaults:{}},", "silent:{family:'REACTION',title:'ПРОМОЛЧАТЬ',description:'самая дешёвая реакция по ENERGY; пережидает ход, но снижает CONTACT',defaults:{}},")
s=s.replace("pressure:{family:'REACTION',title:'ДАВИТЬ',description:'давит; сильно повышает TENSION и снижает CONTACT',defaults:{}},", "pressure:{family:'REACTION',title:'ДАВИТЬ',description:'выжигает ENERGY и нагружает BRAIN собеседника, но резко повышает TENSION и рушит CONTACT',defaults:{}},")
p.write_text(s)

p=root/'tests/gameplay-regression-selftest.mjs'
s=p.read_text()
s=s.replace("import { createEncounter, predictTurn, executeActorTurn, applyHotPatch, detectBreakpoint, checkTerminal } from '../src/encounter/runtime.mjs';", "import { createEncounter, predictTurn, executeActorTurn, applyHotPatch, detectBreakpoint, checkTerminal, REACTION_EFFECTS } from '../src/encounter/runtime.mjs';")
insert="""
// Reaction strategy identities remain mechanically distinct rather than cosmetic variants.
assert.ok(REACTION_EFFECTS.agree.target.contact>REACTION_EFFECTS.joke.target.contact,'AGREE is the strongest relationship repair');
assert.ok(Math.abs(REACTION_EFFECTS.joke.target.tension)>Math.abs(REACTION_EFFECTS.agree.target.tension),'JOKE is the stronger tension release');
assert.ok(Math.abs(REACTION_EFFECTS.silent.self.energy)<Math.abs(REACTION_EFFECTS.explain.self.energy),'SILENT is the cheapest energy survival response');
assert.ok(REACTION_EFFECTS.explain.target.brain>0,'EXPLAIN creates cognitive load on the listener');
assert.ok(REACTION_EFFECTS.pressure.target.energy<0&&REACTION_EFFECTS.pressure.target.brain>0,'PRESSURE trades relationship safety for direct opponent depletion');
assert.ok(REACTION_EFFECTS.pressure.target.contact<REACTION_EFFECTS.explain.target.contact,'PRESSURE is relationally more destructive than EXPLAIN');

"""
s=s.replace("// Missing current Trigger is transparent NO_ACTION, never silent trigger substitution.\n", insert+"// Missing current Trigger is transparent NO_ACTION, never silent trigger substitution.\n")
p.write_text(s)
