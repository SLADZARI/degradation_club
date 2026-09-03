from pathlib import Path
root=Path(__file__).resolve().parents[1]

p=root/'index.html'
s=p.read_text()
old='<button type="button" id="talk-tech-toggle" class="talk-tech-toggle" aria-expanded="false">ПОЧЕМУ ТАК? +</button><div id="talk-tech" class="talk-tech" hidden><div id="talk-cause" class="talk-cause empty" aria-live="polite"><span>ПОСЛЕ РЕПЛИКИ ЗДЕСЬ БУДЕТ ВИДНО, ЧТО ОНА ЗАПУСТИЛА.</span></div><div id="delta" class="delta" aria-live="polite"></div></div><div class="talk-actions"><button id="next-turn" class="primary">NEXT TURN →</button><button id="trace-btn">TRACE</button></div>'
new='<button type="button" id="talk-tech-toggle" class="talk-tech-toggle" aria-expanded="false">ПОЧЕМУ ТАК? +</button><div id="talk-tech" class="talk-tech" hidden><div id="talk-cause" class="talk-cause empty" aria-live="polite"><span>ПОСЛЕ РЕПЛИКИ ЗДЕСЬ БУДЕТ ВИДНО, ЧТО ОНА ЗАПУСТИЛА.</span></div><div id="delta" class="delta" aria-live="polite"></div><button id="trace-btn" class="trace-inside">ТЕХНИЧЕСКИЙ TRACE →</button></div><div class="talk-actions"><button id="next-turn" class="primary">NEXT TURN →</button></div>'
if old not in s: raise SystemExit('talk action markup not found')
p.write_text(s.replace(old,new))

p=root/'styles.css'
s=p.read_text()
s += '''\n/* TALK reading pass: conversation owns the mobile viewport; diagnostics stay opt-in. */
.talk .talk-actions{display:block}
.talk .talk-actions .primary{width:100%}
.talk-tech .trace-inside{width:100%;min-height:44px;border-left:2px solid var(--ink);border-right:2px solid var(--ink);border-bottom:0;background:var(--ink);color:var(--paper);text-align:left;font:900 9px/1 monospace}
@media(max-width:430px){
  .talk .arena{height:150px}
  .talk .character-slot.small{height:142px;width:112px}
  .talk .metrics-head{margin-bottom:3px}
  .talk .metric{margin:3px 0}
  .talk .dialogue{height:300px;min-height:300px;max-height:300px;padding:10px}
  .talk .bubble{max-width:92%;font-size:16px;line-height:1.28;padding:10px 11px}
  .talk .bubble small{font-size:8px;margin-bottom:5px}
  .talk-tech-toggle{font-size:9px;min-height:44px}
}
@media(max-width:360px){
  .talk .arena{height:142px}
  .talk .dialogue{height:286px;min-height:286px;max-height:286px}
}
'''
p.write_text(s)

p=root/'tests/browser-smoke.mjs'
s=p.read_text()
s=s.replace("assert.equal(await page.locator('.appearance-panel button').count(),3,'appearance panel exposes three compact mobile categories');","assert.equal(await page.locator('.appearance-panel button').count(),4,'appearance panel exposes four compact mobile categories');")
# Add reading hierarchy assertions near existing dialogue checks if absent.
needle="assert.ok(await page.locator('#dialogue').evaluate(el=>el.scrollHeight>=el.clientHeight),'dialogue keeps a scrollable history surface');"
if needle in s and 'TRACE lives inside technical details' not in s:
    s=s.replace(needle,needle+"\nassert.equal(await page.locator('.talk-actions #trace-btn').count(),0,'TRACE does not compete with the primary talk action');\nassert.equal(await page.locator('#talk-tech #trace-btn').count(),1,'TRACE lives inside technical details');\nassert.ok(await page.locator('#dialogue').evaluate(el=>parseFloat(getComputedStyle(el).height)>=280),'mobile dialogue owns a substantial reading viewport');")
p.write_text(s)
