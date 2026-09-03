from pathlib import Path
p=Path('dementor-lab/src/ui/app.mjs')
s=p.read_text()
old="function triggerHubHtml(){const triggers=brainTriggerNodes(),active=activeBrainTriggerId&&triggers.some(n=>n.id===activeBrainTriggerId)?activeBrainTriggerId:null;const chips=triggers.map(n=>`<button type=\"button\" class=\"brain-trigger-chip ${n.id===active?'active':''}\" data-trigger-select=\"${n.id}\">${title(n.type)}</button>`).join('');"
new="function triggerHubHtml(){const triggers=brainTriggerNodes(),active=activeBrainTriggerId&&triggers.some(n=>n.id===activeBrainTriggerId)?activeBrainTriggerId:null,configured=triggers.filter(n=>outgoing(currentBrainGraph,n.id).length>0).length;const chips=triggers.map(n=>{const wired=outgoing(currentBrainGraph,n.id).length>0;return `<button type=\"button\" class=\"brain-trigger-chip ${wired?'wired':'unwired'} ${n.id===active?'active':''}\" data-trigger-select=\"${n.id}\">${title(n.type)}</button>`}).join('');"
if old not in s: raise SystemExit('triggerHub prefix not found')
s=s.replace(old,new,1)
old2="<b>${triggers.length}</b><i>${brainTriggerHubOpen?'−':'+'}</i>"
new2="<b>${configured}/${triggers.length}</b><i>${brainTriggerHubOpen?'−':'+'}</i>"
if old2 not in s: raise SystemExit('triggerHub count not found')
s=s.replace(old2,new2,1)
p.write_text(s)
