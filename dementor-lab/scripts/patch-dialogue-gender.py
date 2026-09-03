from pathlib import Path

root=Path(__file__).resolve().parents[1]

p=root/'src/dialogue/phrase-bank.mjs'
s=p.read_text()
s=s.replace("    'Хорошо. Здесь я с тобой согласен.',", "    'Хорошо. Здесь я с тобой {{agree}}.',")
s=s.replace("    'Согласен. В этом месте твоя версия сильнее.',", "    '{{Agree}}. В этом месте твоя версия сильнее.',")
s=s.replace("    understand:'Подожди. Кажется, я понял, что именно тебе здесь не нравится.',", "    understand:'Подожди. Кажется, я {{understood}}, что именно тебе здесь не нравится.',")
s=s.replace("    overheat:'Да. Хорошо. Всё. Здесь согласен.',", "    overheat:'Да. Хорошо. Всё. Здесь {{agree}}.',")
s=s.replace("    lowContact:'Согласен. Дальше спорить об этом не буду.',", "    lowContact:'{{Agree}}. Дальше спорить об этом не буду.',")
needle="function memoryValue(memory,key){return Number(memory?.[key]||0)}"
insert="""function genderForm(gender,key){
  const female=gender==='female';
  const forms={agree:female?'согласна':'согласен',Agree:female?'Согласна':'Согласен',understood:female?'поняла':'понял'};
  return forms[key]||'';
}
function inflectPhrase(text,gender='male'){
  return String(text||'').replace(/\\{\\{(agree|Agree|understood)\\}\\}/g,(_,key)=>genderForm(gender,key));
}
"""
s=s.replace(needle,insert+needle)
s=s.replace("  if(contextual)return contextual;", "  if(contextual)return inflectPhrase(contextual,context.gender);")
s=s.replace("  return list[stableHash(contextKey({...context,reaction}))%list.length];", "  return inflectPhrase(list[stableHash(contextKey({...context,reaction}))%list.length],context.gender);")
p.write_text(s)

p=root/'src/app/vertical-slice-controller.mjs'
s=p.read_text()
s=s.replace("        turn:out.trace.turn\n", "        turn:out.trace.turn,\n        gender:actor.visual?.gender||'male'\n")
p.write_text(s)

p=root/'src/ui/app.mjs'
s=p.read_text()
s=s.replace("actors.A.visual={...(actors.A.visual||{}),characterId:currentCharacterId,appearance:playerAppearance()};actors.B.visual={...(actors.B.visual||{}),characterId:opponentProfile.baseCharacterId,appearance:opponentAppearance(),opponentPresetId:currentScenario.id==='direct-answer'?'DIRECT_ANSWER':opponentProfile.presetId}", "actors.A.visual={...(actors.A.visual||{}),characterId:currentCharacterId,gender:currentCharacterId==='character-02'?'female':'male',appearance:playerAppearance()};actors.B.visual={...(actors.B.visual||{}),characterId:opponentProfile.baseCharacterId,gender:opponentProfile.gender|| (opponentProfile.baseCharacterId==='character-02'?'female':'male'),appearance:opponentAppearance(),opponentPresetId:currentScenario.id==='direct-answer'?'DIRECT_ANSWER':opponentProfile.presetId}")
p.write_text(s)

p=root/'src/opponent/generator.mjs'
s=p.read_text()
s=s.replace("const OPPONENT_NAMES=Object.freeze(['Марта','Лев','Нина','Антон','Ира','Вадим']);", "const OPPONENT_NAMES=Object.freeze({female:['Марта','Нина','Ира'],male:['Лев','Антон','Вадим']});")
s=s.replace("  const presetId=pick(rng,OPPONENT_PRESET_IDS);", "  const gender=baseCharacterId==='character-02'?'female':'male';\n  const presetId=pick(rng,OPPONENT_PRESET_IDS);")
s=s.replace("    name:pick(rng,OPPONENT_NAMES),\n    baseCharacterId,", "    name:pick(rng,OPPONENT_NAMES[gender]),\n    gender,\n    baseCharacterId,")
p.write_text(s)

p=root/'src/scenarios/criticism-idea.mjs'
s=p.read_text()
s=s.replace("A:createCharacter({id:'A',name:safePlayerName,graph:PLAYER_GRAPH,state:{energy:72,brain:15,tension:10,contact:60,memory:{}}}),", "A:createCharacter({id:'A',name:safePlayerName,graph:PLAYER_GRAPH,state:{energy:72,brain:15,tension:10,contact:60,memory:{}},visual:{gender:'male'}}),")
s=s.replace("visual:{characterId:profile.baseCharacterId,appearance:", "visual:{characterId:profile.baseCharacterId,gender:profile.gender||(profile.baseCharacterId==='character-02'?'female':'male'),appearance:")
p.write_text(s)

p=root/'tests/dialogue-selftest.mjs'
s=p.read_text()
s=s.replace("assert.match(understand,/понял, что именно тебе здесь не нравится/i,'UNDERSTAND explanation has a deterministic contextual replacement');", "assert.match(understand,/понял, что именно тебе здесь не нравится/i,'UNDERSTAND explanation has a deterministic contextual replacement');\nconst femaleUnderstand=resolvePhrase({...base,impulse:'understand',gender:'female',state:{brain:30,tension:25,contact:70},memory:{}});\nassert.match(femaleUnderstand,/поняла, что именно тебе здесь не нравится/i,'female UNDERSTAND uses feminine agreement');\nconst femaleAgree=resolvePhrase({reaction:'agree',gender:'female',impulse:'beliked',scenario:{id:'criticism-idea'},state:{brain:30,tension:25,contact:70},memory:{},recentTranscript:[],turn:2});\nassert.doesNotMatch(femaleAgree,/согласен|я понял/i,'female dialogue never leaks known masculine agreement forms');\nassert.match(femaleAgree,/согласна|принять|спорить|замечание|пункт/i,'female AGREE stays grammatical and deterministic');")
p.write_text(s)

# Update stale browser expectation from pre-stabilization six-part PERSON UI.
p=root/'tests/browser-smoke.mjs'
s=p.read_text().replace("assert.equal(await page.locator('.appearance-panel [data-part]').count(),6,'appearance panel exposes six semantic parts');", "assert.equal(await page.locator('.appearance-panel button').count(),3,'appearance panel exposes three compact mobile categories');")
p.write_text(s)
