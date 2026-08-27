import fs from 'node:fs';

const htmlPath='events/fuengirola/index.html';
const cssPath='visual-standard-v2.css';
const eventCssPath='event-system.css';

let html=fs.readFileSync(htmlPath,'utf8');
const heroStart=html.indexOf('  <section class="dc-entity-hero"');
if(heroStart<0) throw new Error('Fuengirola hero start not found');
const heroEnd=html.indexOf('\n  </section>',heroStart);
if(heroEnd<0) throw new Error('Fuengirola hero end not found');
const heroClose=heroEnd+'\n  </section>'.length;

const hero=`  <section class="dc-entity-hero" aria-labelledby="fuengirola-title">
    <figure class="dc-event-hero__media" aria-hidden="true"><img src="/assets/ink/event-fuengirola-03.webp" alt="" decoding="async" fetchpriority="high"></figure>
    <div class="dc-entity-hero__meta dc-meta"><span>EVENT-001 / PLANNED / OFFLINE</span></div>
    <h1 class="dc-entity-hero__title dc-display-xl" id="fuengirola-title">ФУЭНХИРОЛА</h1>
    <p class="dc-event-hero__subtitle">Лаборатория несовместимых<br>очевидностей</p>
    <a class="dc-event-hero__relation" href="/community/gabil/" aria-label="Открыть профиль Габиля">
      <span class="dc-event-hero__relation-portrait"><img src="/assets/people/dementors/gabil/dementor_gabil.webp" alt="Габиль — дементор Dementor Club" decoding="async"></span>
      <span class="dc-event-hero__relation-copy"><small>DEMENTOR</small><strong>ГАБИЛЬ</strong><span>Организатор / participant relation from entity record</span></span>
      <span class="dc-event-hero__relation-arrow" aria-hidden="true">→</span>
    </a>
  </section>`;
html=html.slice(0,heroStart)+hero+html.slice(heroClose);
fs.writeFileSync(htmlPath,html);

let css=fs.readFileSync(cssPath,'utf8');
const start=css.indexOf('/* EVENT HERO —');
const end=css.indexOf('/* Any remaining event media uses',start);
if(start<0||end<0) throw new Error('EVENT HERO CSS block markers not found');
const replacement=`/* EVENT HERO — approved UI Redesign composition. One DOM image, one text stack, one relation card. */
body.dc-fuengirola-page .dc-entity-hero{
  position:relative!important;
  min-height:630px!important;
  padding:0!important;
  overflow:hidden!important;
  isolation:isolate;
  background:var(--dc-ink-bg-fuengirola);
}
body.dc-fuengirola-page .dc-entity-hero::after{content:none!important}
body.dc-fuengirola-page .dc-event-hero__media{position:absolute;inset:18px 20px 18px;z-index:0;margin:0;overflow:hidden;background:var(--dc-ink-bg-fuengirola)}
body.dc-fuengirola-page .dc-event-hero__media img{display:block;width:100%;height:100%;object-fit:cover;object-position:right top;mix-blend-mode:multiply}
body.dc-fuengirola-page .dc-entity-hero__meta{position:absolute;z-index:2;top:66px;left:40px;font-size:15px;letter-spacing:0;color:var(--dc-ink);opacity:1}
body.dc-fuengirola-page .dc-entity-hero__title{position:absolute;z-index:2;top:124px;left:40px;margin:0;max-width:none!important;font-size:clamp(96px,9.2vw,146px);line-height:.78;letter-spacing:-.075em;color:var(--dc-ink)}
body.dc-fuengirola-page .dc-event-hero__subtitle{position:absolute;z-index:2;top:244px;left:40px;margin:0;font-size:16px;line-height:1.2;font-weight:500;color:var(--dc-ink)}
body.dc-fuengirola-page .dc-event-hero__relation{position:absolute;z-index:3;left:40px;bottom:40px;width:min(770px,64vw);min-height:174px;padding:18px;display:grid;grid-template-columns:118px minmax(0,1fr) 40px;gap:18px;align-items:center;background:var(--dc-paper);border:1px solid var(--dc-line);color:var(--dc-ink)}
body.dc-fuengirola-page .dc-event-hero__relation-portrait{width:118px;aspect-ratio:4/5;overflow:hidden;background:var(--dc-dementor-gabil-bg)}
body.dc-fuengirola-page .dc-event-hero__relation-portrait img{display:block!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:cover!important;object-position:center!important;mix-blend-mode:multiply}
body.dc-fuengirola-page .dc-event-hero__relation-copy{display:grid;align-content:center;gap:10px;min-width:0}
body.dc-fuengirola-page .dc-event-hero__relation-copy small{font-size:10px;letter-spacing:.08em;text-transform:uppercase}
body.dc-fuengirola-page .dc-event-hero__relation-copy strong{font-size:clamp(44px,4vw,58px);line-height:.85;letter-spacing:-.055em}
body.dc-fuengirola-page .dc-event-hero__relation-copy span{font-size:12px;line-height:1.25}
body.dc-fuengirola-page .dc-event-hero__relation-arrow{justify-self:end;align-self:end;font-size:34px;line-height:1}
body.dc-fuengirola-page .dc-ink-slot--event.dc-media-break{display:none!important}

@media(max-width:900px) and (min-width:561px){
  body.dc-fuengirola-page .dc-entity-hero{min-height:590px!important}
  body.dc-fuengirola-page .dc-event-hero__media{inset:16px}
  body.dc-fuengirola-page .dc-entity-hero__meta{top:72px;left:34px;font-size:15px}
  body.dc-fuengirola-page .dc-entity-hero__title{top:130px;left:34px;font-size:clamp(92px,13.6vw,108px)}
  body.dc-fuengirola-page .dc-event-hero__subtitle{top:238px;left:34px;font-size:15px}
  body.dc-fuengirola-page .dc-event-hero__relation{left:34px;right:32px;bottom:39px;width:auto;min-height:168px;grid-template-columns:108px minmax(0,1fr) 32px;padding:16px;gap:16px}
  body.dc-fuengirola-page .dc-event-hero__relation-portrait{width:108px}
  body.dc-fuengirola-page .dc-event-hero__relation-copy strong{font-size:48px}
}

@media(max-width:560px){
  body.dc-fuengirola-page .dc-entity-hero{min-height:0!important;padding:0 15px 15px!important;display:flex;flex-direction:column;overflow:visible!important}
  body.dc-fuengirola-page .dc-event-hero__media{position:relative;inset:auto;order:1;width:100%;height:auto;aspect-ratio:360/270;margin:15px 0 0}
  body.dc-fuengirola-page .dc-event-hero__media img{object-position:right top}
  body.dc-fuengirola-page .dc-entity-hero__meta{position:relative;order:2;top:auto;left:auto;margin:24px 0 0;font-size:15px}
  body.dc-fuengirola-page .dc-entity-hero__title{position:relative;order:3;top:auto;left:auto;margin:18px 0 0;font-size:clamp(58px,17.2vw,70px);line-height:.8}
  body.dc-fuengirola-page .dc-event-hero__subtitle{position:relative;order:4;top:auto;left:auto;margin:16px 0 0;font-size:16px;line-height:1.2}
  body.dc-fuengirola-page .dc-event-hero__relation{position:relative;order:5;left:auto;right:auto;bottom:auto;width:100%;min-height:134px;margin:18px 0 0;padding:12px;grid-template-columns:86px minmax(0,1fr);gap:18px;border-color:var(--dc-line)}
  body.dc-fuengirola-page .dc-event-hero__relation-portrait{width:86px}
  body.dc-fuengirola-page .dc-event-hero__relation-copy{gap:8px}
  body.dc-fuengirola-page .dc-event-hero__relation-copy strong{font-size:34px}
  body.dc-fuengirola-page .dc-event-hero__relation-copy span{display:none}
  body.dc-fuengirola-page .dc-event-hero__relation-arrow{display:none}
}
`;
css=css.slice(0,start)+replacement+'\n'+css.slice(end);
fs.writeFileSync(cssPath,css);

let eventCss=fs.readFileSync(eventCssPath,'utf8');
eventCss=eventCss.replace(/\n\s*\/\* Gabil remains a compact event marker on mobile, not a second hero image\. \*\/\n\s*\.dc-fuengirola-page a\[href="\\\/community\\\/gabil\\\/"\] img\{[^}]+\}\n/,'\n');
fs.writeFileSync(eventCssPath,eventCss);

console.log('Batch 2 Event hero migrated to approved WEB/TABLET/MOBILE structure');
