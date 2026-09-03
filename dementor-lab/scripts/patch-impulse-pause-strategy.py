from pathlib import Path

root=Path('dementor-lab')

p=root/'src/encounter/runtime.mjs'
s=p.read_text()
s=s.replace("const IMPULSE_EFFECTS=Object.freeze({\n  beright:{self:{brain:2,tension:2},target:{contact:-1}},\n  beliked:{self:{contact:2,tension:-1},target:{contact:1}},\n  understand:{self:{brain:1,contact:3},target:{tension:-1,contact:2}}\n});", "export const IMPULSE_EFFECTS=Object.freeze({\n  beright:{self:{brain:3,tension:3},target:{contact:-2}},\n  beliked:{self:{contact:2,tension:-3},target:{contact:1}},\n  understand:{self:{brain:2,contact:2},target:{tension:-2,contact:3}}\n});\nexport const PAUSE_EFFECTS=Object.freeze({self:{brain:-5,tension:-7,energy:-4},target:{tension:-3,contact:2}});")
s=s.replace("if(chosen.path.some(n=>n.type==='pause')){addDelta(selfDelta,{brain:-5,tension:-7,energy:-1});addDelta(targetDelta,{tension:-3,contact:3})}", "if(chosen.path.some(n=>n.type==='pause')){addDelta(selfDelta,PAUSE_EFFECTS.self);addDelta(targetDelta,PAUSE_EFFECTS.target)}")
p.write_text(s)

p=root/'src/core/model.mjs'
s=p.read_text()
s=s.replace("beright:{family:'IMPULSE',title:'БЫТЬ ПРАВЫМ',description:'сильнее тянет к этой ветке; добавляет BRAIN и TENSION',defaults:{weight:3}},", "beright:{family:'IMPULSE',title:'БЫТЬ ПРАВЫМ',description:'сильнее тянет к этой ветке; разгоняет BRAIN/TENSION и ухудшает CONTACT',defaults:{weight:3}},")
s=s.replace("beliked:{family:'IMPULSE',title:'НРАВИТЬСЯ',description:'сильнее тянет к этой ветке; поддерживает CONTACT',defaults:{weight:2}},", "beliked:{family:'IMPULSE',title:'НРАВИТЬСЯ',description:'сильнее тянет к этой ветке; успокаивает себя и мягко поддерживает CONTACT без BRAIN-цены',defaults:{weight:2}},")
s=s.replace("understand:{family:'IMPULSE',title:'ПОНЯТЬ',description:'сильнее тянет к этой ветке; поддерживает CONTACT и немного нагружает BRAIN',defaults:{weight:2}},", "understand:{family:'IMPULSE',title:'ПОНЯТЬ',description:'сильнее тянет к этой ветке; лучше поддерживает контакт с другим, но заметнее нагружает BRAIN',defaults:{weight:2}},")
s=s.replace("pause:{family:'ABILITY',title:'ПАУЗА',description:'встраивается в путь перед реакцией: снижает BRAIN/TENSION и поддерживает CONTACT',defaults:{}},", "pause:{family:'ABILITY',title:'ПАУЗА',description:'тратит заметную ENERGY, чтобы снизить BRAIN/TENSION и поддержать CONTACT перед реакцией',defaults:{}},")
p.write_text(s)

p=root/'tests/gameplay-regression-selftest.mjs'
s=p.read_text()
s=s.replace("checkTerminal, REACTION_EFFECTS }", "checkTerminal, REACTION_EFFECTS, IMPULSE_EFFECTS, PAUSE_EFFECTS }")
marker="assert.ok(REACTION_EFFECTS.pressure.target.contact<REACTION_EFFECTS.explain.target.contact,'PRESSURE is relationally more destructive than EXPLAIN');\n\n"
addition="""assert.ok(IMPULSE_EFFECTS.beright.self.brain>0&&IMPULSE_EFFECTS.beright.target.contact<0,'BE RIGHT trades contact for internal drive');
assert.ok(IMPULSE_EFFECTS.beliked.self.tension<0&&!IMPULSE_EFFECTS.beliked.self.brain,'BE LIKED regulates self without a brain surcharge');
assert.ok(IMPULSE_EFFECTS.understand.target.contact>IMPULSE_EFFECTS.beliked.target.contact,'UNDERSTAND invests more strongly in the other side of contact');
assert.ok(IMPULSE_EFFECTS.understand.self.brain>0,'UNDERSTAND has a cognitive cost');
assert.ok(PAUSE_EFFECTS.self.energy<=-4,'PAUSE pays a meaningful energy cost for regulation');
assert.ok(PAUSE_EFFECTS.self.brain<0&&PAUSE_EFFECTS.self.tension<0&&PAUSE_EFFECTS.target.contact>0,'PAUSE remains a strong regulation trade rather than a dead node');

"""
s=s.replace(marker,marker+addition)
p.write_text(s)
