from pathlib import Path
root=Path('dementor-lab')

p=root/'src/ui/app.mjs'; s=p.read_text()
old="function brainNodeLocked(n){return Boolean(replayMode&&replayTargetNodeId&&n.id!==replayTargetNodeId)}"
if old not in s: raise SystemExit('brainNodeLocked missing')
s=s.replace(old,"function brainNodeLocked(n){return false}")
old="b.classList.toggle('active',on);b.classList.toggle('has-variants',usesVariants);"
if old not in s: raise SystemExit('appearance active pattern missing')
s=s.replace(old,"b.classList.toggle('active',activeAppearanceCategory===category);b.classList.toggle('equipped',on);b.classList.toggle('has-variants',usesVariants);")
p.write_text(s)

p=root/'index.html'; s=p.read_text()
s=s.replace('ИЗМЕНИТЬ ОДНУ ВЕЩЬ →','ПОЧИНИТЬ МОЗГ →')
p.write_text(s)

p=root/'character.css'; s=p.read_text(); s += '''\n/* Selected category is the only strong tab; equipped state stays secondary. */\n.appearance-panel button.equipped:not(.active){opacity:.72}\n.person-next{display:none!important}\n'''; p.write_text(s)
print('follow-up patch applied')
