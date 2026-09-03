from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/ui/app.mjs'
s=p.read_text()
old="function syncPlayerName(){const input=$('#player-name');if(input&&input.value!==playerName)input.value=playerName;const next=$('#to-brain');if(next)next.disabled=!playerName.trim()}"
new="function syncPlayerName(){const input=$('#player-name');if(input&&input.value!==playerName)input.value=playerName;const ready=Boolean(playerName.trim()),next=$('#to-brain'),brainNav=$('.bottom-nav [data-nav=\"brain\"]');if(next)next.disabled=!ready;if(brainNav){brainNav.classList.toggle('needs-name',!ready);brainNav.setAttribute('aria-disabled',String(!ready))}if(ready)input?.classList.remove('field-error')}\nfunction requestPlayerName(){show('person');const input=$('#player-name');input?.classList.add('field-error');input?.focus();input?.scrollIntoView({behavior:'smooth',block:'center'})}"
if old not in s: raise SystemExit('syncPlayerName target not found')
s=s.replace(old,new)
old2="$$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='talk'&&!controller?.encounter)return;show(b.dataset.nav)}));"
new2="$$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='brain'&&!playerName.trim()){requestPlayerName();return}if(b.dataset.nav==='talk'&&!controller?.encounter)return;show(b.dataset.nav)}));"
if old2 not in s: raise SystemExit('bottom nav target not found')
s=s.replace(old2,new2)
p.write_text(s)

# Styles: clear but non-modal required-name feedback.
p=root/'styles.css'
s=p.read_text()
s += """
/* Player-flow gate: required identity is resolved on PERSON, not bypassed by bottom navigation. */
.person-name-field input.field-error{outline:3px solid var(--danger);outline-offset:-3px}
.bottom-nav [data-nav='brain'].needs-name{opacity:.55}
"""
p.write_text(s)

# Smoke follows the same rule as a new player.
p=root/'tests/browser-smoke.mjs'
s=p.read_text()
old3="assert.equal(await page.locator('#to-brain').isDisabled(),true,'player name is a required Character field');await page.locator('#player-name').fill('Женя');assert.equal(await page.locator('#to-brain').isDisabled(),false,'name input wires the Character before BRAIN');"
new3="assert.equal(await page.locator('#to-brain').isDisabled(),true,'player name is a required Character field');await page.locator('.bottom-nav [data-nav=\"brain\"]').click();assert.equal(await page.locator('#top-status').textContent(),'PERSON','BRAIN navigation cannot bypass the required Character name');assert.equal(await page.locator('#player-name').getAttribute('class').then(x=>String(x||'').includes('field-error')),true,'blocked BRAIN navigation points back to the missing name');await page.locator('#player-name').fill('Женя');assert.equal(await page.locator('#to-brain').isDisabled(),false,'name input wires the Character before BRAIN');"
if old3 not in s: raise SystemExit('smoke name target not found')
s=s.replace(old3,new3)
p.write_text(s)
