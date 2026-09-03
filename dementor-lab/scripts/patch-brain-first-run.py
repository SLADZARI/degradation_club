from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/ui/app.mjs'
s=p.read_text()
s=s.replace("const PLAYER_NAME_KEY='dementor-lab.playerName';", "const PLAYER_NAME_KEY='dementor-lab.playerName';\nconst BRAIN_HELP_KEY='dementor-lab.brainHelpSeen.v1';")
s=s.replace("if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode}", "if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode;if(!replayMode&&!localStorage.getItem(BRAIN_HELP_KEY))requestAnimationFrame(showBrainIntro)}")
needle="function playerDisplayName(){return playerName.trim()||'Гена'}"
insert="""function showBrainIntro(){
  if(!overlay?.hidden||localStorage.getItem(BRAIN_HELP_KEY))return;
  overlay.innerHTML=`<div class="overlay-card brain-first-run"><p class="kicker">BRAIN</p><h3>ТРИ ВЕЩИ.</h3><div class="brain-first-run__steps"><div><b>ВХОДЫ</b><span>что тебя задевает</span></div><div><b>ЦЕПОЧКА</b><span>что происходит внутри</span></div><div><b>РЕЗУЛЬТАТ</b><span>как ты в итоге ведёшь себя</span></div></div><p class="brain-first-run__rule">ЛИНИИ ЗАДАЮТ ПРИЧИННОСТЬ. ПЕРЕТАСКИВАНИЕ МЕНЯЕТ ТОЛЬКО ПОРЯДОК КАРТОЧЕК.</p><button type="button" class="primary" id="brain-help-ok">ПОНЯЛ</button></div>`;
  overlay.hidden=false;
  $('#brain-help-ok').onclick=()=>{localStorage.setItem(BRAIN_HELP_KEY,'1');hideOverlay()};
}
"""
if needle not in s: raise SystemExit('playerDisplayName needle not found')
s=s.replace(needle,insert+needle)
p.write_text(s)

p=root/'styles.css'
s=p.read_text()+'''\n/* BRAIN first-run explanation exists once, outside the permanent editor chrome. */
.brain-first-run__steps{display:grid;gap:7px;margin:14px 0}.brain-first-run__steps div{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;border-top:1px solid var(--ink);padding:9px 0}.brain-first-run__steps b{font:900 11px/1 monospace}.brain-first-run__steps span{font-size:15px;line-height:1.2}.brain-first-run__rule{margin:14px 0;font:900 10px/1.4 monospace;border:2px solid var(--ink);padding:10px;background:var(--acid)}\n'''
p.write_text(s)

p=root/'tests/browser-smoke.mjs'
s=p.read_text()
old="await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.ok(await page.locator('#brain-presets [data-brain-preset]').count()>=7,'behavioral preset rail remains available');"
new="await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.equal(await page.locator('#brain-help-ok').count(),1,'first BRAIN visit explains the mental model outside permanent editor chrome');assert.match(await page.locator('.brain-first-run').textContent(),/ВХОДЫ/);assert.match(await page.locator('.brain-first-run').textContent(),/ЛИНИИ ЗАДАЮТ ПРИЧИННОСТЬ/);await page.locator('#brain-help-ok').click();assert.equal(await page.locator('#overlay').isHidden(),true,'first-run guide dismisses into normal editing');assert.ok(await page.locator('#brain-presets [data-brain-preset]').count()>=7,'behavioral preset rail remains available');"
if old not in s: raise SystemExit('browser BRAIN entry needle not found')
s=s.replace(old,new)
p.write_text(s)
