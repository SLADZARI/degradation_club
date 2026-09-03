from pathlib import Path
p=Path('dementor-lab/src/ui/app.mjs')
s=p.read_text()
old="function familyLabel(type){return NODE_SPECS[type]?.family||'NODE'}\nfunction title(type){return NODE_SPECS[type]?.title||type}"
new="function familyLabel(type){return NODE_SPECS[type]?.family||'NODE'}\nfunction brainFamilyHuman(type){const family=familyLabel(type);if(family==='STATE')return 'ЧТО Я ЧУВСТВУ';if(family==='IMPULSE')return 'ЧЕГО Я ХОЧУ';if(family==='REACTION')return 'ЧТО Я ДЕЛАЮ';if(family==='CONTROL')return 'КАК ИДЁТ ДАЛЬШЕ';if(family==='ABILITY')return 'ЧТО Я УМЕЮ';return family}\nfunction title(type){return NODE_SPECS[type]?.title||type}"
if old not in s: raise SystemExit('family marker not found')
s=s.replace(old,new,1)
old2="<span class=\"brain-stack-family\">${familyLabel(n.type).toLowerCase()}</span>"
new2="<span class=\"brain-stack-family\">${brainFamilyHuman(n.type)}</span>"
if old2 not in s: raise SystemExit('card family marker not found')
s=s.replace(old2,new2,1)
old3="host.innerHTML=`${triggerHubHtml()}<svg class=\"brain-stack-links\" aria-hidden=\"true\"></svg><div class=\"brain-stack-list\">${body.map(n=>projectedBrainNodeHtml(n,route)).join('')}</div>`;"
new3="host.innerHTML=`${triggerHubHtml()}<section class=\"brain-behavior-block\" data-behavior-block><div class=\"brain-behavior-head\"><small>ВНУТРИ МОЗГА</small><strong>ЧТО Я ДЕЛАЮ, КОГДА ЭТО СЛУЧИЛОСЬ</strong><p>Читается сверху вниз: что я чувствую → чего хочу → что делаю → что происходит дальше.</p></div><svg class=\"brain-stack-links\" aria-hidden=\"true\"></svg><div class=\"brain-stack-list\">${body.map(n=>projectedBrainNodeHtml(n,route)).join('')}</div></section>`;"
if old3 not in s: raise SystemExit('render canvas marker not found')
s=s.replace(old3,new3,1)
p.write_text(s)
