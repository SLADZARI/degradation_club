import fs from 'node:fs';

const homePath='index.html';
const eventPath='events/fuengirola/index.html';
const cssPath='visual-standard-v2.css';

let home=fs.readFileSync(homePath,'utf8');
let event=fs.readFileSync(eventPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');

const oldHome=`<section class="dc-event dc-section" id="events" aria-labelledby="course-title"><div class="dc-shell"><div class="dc-event__top"><div class="dc-event__label dc-kicker">ONLINE COURSE / APPROVED DRAFT</div><h2 class="dc-event__title dc-display-l" id="course-title">ДУМАЙ С<br>ОПАСНОСТЬЮ</h2><div class="dc-event__status dc-meta">ONLINE<br>VALENTIN LOSEV</div></div><div class="dc-event__body"><p class="dc-event__desc dc-lead">Курс последовательной деградации уверенности.</p><div class="dc-event__meta dc-body"><p>После курса вы сможете посмотреть на абсолютно нормальную ситуацию и обнаружить в ней минимум семь причин пока ничего не делать.</p><p>Дементор: Валентин Лосев</p></div><a class="dc-event__action dc-action dc-action--primary" href="/courses/dumai-s-opasnostyu/">Открыть курс</a></div></div></section>`;
const newHome=`<section class="dc-dementor-feature dc-dementor-feature--valentin" id="events" aria-labelledby="course-title"><figure class="dc-dementor-feature__portrait"><img src="/assets/people/dementors/valentin/dementor_valentin.webp" alt="Валентин — дементор Dementor Club" loading="lazy" decoding="async"></figure><div class="dc-dementor-feature__copy"><p class="dc-kicker">ONLINE COURSE / APPROVED DRAFT</p><h2 class="dc-display-l" id="course-title">ДУМАЙ С<br>ОПАСНОСТЬЮ</h2><p class="dc-lead">Курс последовательной деградации уверенности.</p><div class="dc-body"><p>После курса вы сможете посмотреть на абсолютно нормальную ситуацию и обнаружить в ней минимум семь причин пока ничего не делать.</p><p>Дементор: Валентин Лосев</p></div><a class="dc-action dc-action--primary" href="/courses/dumai-s-opasnostyu/">Открыть курс</a></div></section>`;
if(!home.includes(oldHome)) throw new Error('Home Valentin feature source block not found');
home=home.replace(oldHome,newHome);

const oldGabil=`<section class="dc-section">\n    <div class="dc-shell dc-event-lock__grid">\n      <p class="dc-event-lock__label dc-kicker">ДЕМЕНТОР / ГАБИЛЬ</p>\n      <div class="dc-event-dementor-portrait">\n        <a href="/community/gabil/" aria-label="Открыть профиль Габиля"><img src="/assets/people/dementors/gabil/dementor_gabil.webp" alt="Габиль — дементор Dementor Club" loading="lazy" decoding="async" style="max-width:320px;width:100%;height:auto;display:block;mix-blend-mode:multiply"></a>\n      </div>\n      <div class="dc-event-lock__copy dc-body">\n        <h2 class="dc-display-l">КОЛЛЕКТИВНАЯ<br><span class="dc-acid">РАСТЕРЯННОСТЬ.</span></h2>\n        <p>Работает с ситуациями, в которых стороны уже достаточно убедительно доказали собственную правоту.</p>\n        <p>Габиль не помогает сторонам договориться быстрее. Он помогает понять, почему они до сих пор считали, что спорят об одном и том же.</p>\n        <p><strong>Скрытые предположения. Разные модели реальности. Несовместимые очевидности. Решения, которые все поняли одинаково по-разному.</strong></p>\n        <a class="dc-action" href="/community/gabil/">Профиль Габиля →</a>\n      </div>\n    </div>\n  </section>`;
const newGabil=`<section class="dc-section">\n    <div class="dc-shell">\n      <article class="dc-dementor-feature dc-dementor-feature--gabil">\n        <a class="dc-dementor-feature__portrait" href="/community/gabil/" aria-label="Открыть профиль Габиля"><img src="/assets/people/dementors/gabil/dementor_gabil.webp" alt="Габиль — дементор Dementor Club" loading="lazy" decoding="async"></a>\n        <div class="dc-dementor-feature__copy dc-body">\n          <p class="dc-kicker">ДЕМЕНТОР / ГАБИЛЬ</p>\n          <h2 class="dc-display-l">КОЛЛЕКТИВНАЯ<br><span class="dc-acid">РАСТЕРЯННОСТЬ.</span></h2>\n          <p>Работает с ситуациями, в которых стороны уже достаточно убедительно доказали собственную правоту.</p>\n          <p>Габиль не помогает сторонам договориться быстрее. Он помогает понять, почему они до сих пор считали, что спорят об одном и том же.</p>\n          <p><strong>Скрытые предположения. Разные модели реальности. Несовместимые очевидности. Решения, которые все поняли одинаково по-разному.</strong></p>\n          <a class="dc-action" href="/community/gabil/">Профиль Габиля →</a>\n        </div>\n      </article>\n    </div>\n  </section>`;
if(!event.includes(oldGabil)) throw new Error('Fuengirola Gabil feature source block not found');
event=event.replace(oldGabil,newGabil);

// Give Event hero relation the canonical relation semantics without changing its positioned variant.
event=event
 .replace('class="dc-event-hero__relation"','class="dc-event-hero__relation dc-dementor-relation dc-dementor-relation--event"')
 .replace('class="dc-event-hero__relation-portrait"','class="dc-event-hero__relation-portrait dc-dementor-relation__portrait"')
 .replace('class="dc-event-hero__relation-copy"','class="dc-event-hero__relation-copy dc-dementor-relation__copy"')
 .replace('class="dc-event-hero__relation-arrow"','class="dc-event-hero__relation-arrow dc-dementor-relation__arrow"');

const replacement=`/* RELATION — approved compact entity relation card. */
.dc-dementor-relation{box-sizing:border-box;display:grid;grid-template-columns:118px minmax(0,1fr) 40px;gap:18px;align-items:center;min-height:174px;padding:18px;background:var(--dc-paper);border:1px solid var(--dc-line);color:var(--dc-ink);text-decoration:none}
.dc-dementor-relation__portrait{width:118px;aspect-ratio:4/5;overflow:hidden;background:var(--dementor-bg,var(--dc-paper))}
.dc-dementor-relation__portrait img{display:block;width:100%;height:100%;object-fit:cover!important;object-position:center!important;mix-blend-mode:multiply}
.dc-dementor-relation__copy{display:grid;align-content:center;gap:8px;min-width:0}
.dc-dementor-relation__copy small{font-size:10px;letter-spacing:.08em;text-transform:uppercase}
.dc-dementor-relation__copy strong{font-size:clamp(42px,4vw,58px);line-height:.86;letter-spacing:-.055em}
.dc-dementor-relation__copy span{font-size:12px;line-height:1.25}
.dc-dementor-relation__arrow{justify-self:end;align-self:end;font-size:34px;line-height:1}

/* FEATURE — approved two-surface component: image left, copy right, one acid divider. */
.dc-dementor-feature{display:grid;grid-template-columns:minmax(0,7fr) minmax(320px,5fr);min-height:620px;border-top:1px solid var(--dc-line);border-bottom:1px solid var(--dc-line);background:var(--dc-paper);overflow:hidden}
.dc-dementor-feature__portrait{display:block;min-height:100%;overflow:hidden;background:var(--dementor-bg,var(--dc-paper))}
.dc-dementor-feature__portrait img{display:block;width:100%;height:100%;object-fit:contain!important;object-position:center bottom!important;mix-blend-mode:multiply}
.dc-dementor-feature__copy{position:relative;padding:clamp(34px,5vw,74px);display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,3vw,42px);border-left:6px solid var(--dc-acid)}
.dc-dementor-feature__copy .dc-kicker,.dc-dementor-feature__copy .dc-display-l,.dc-dementor-feature__copy .dc-lead,.dc-dementor-feature__copy .dc-body,.dc-dementor-feature__copy p{margin-top:0;margin-bottom:0}
.dc-dementor-feature__copy .dc-action{align-self:flex-start}
.dc-dementor-feature--valentin{--dementor-bg:var(--dc-dementor-valentin-bg)}
.dc-dementor-feature--gabil{--dementor-bg:var(--dc-dementor-gabil-bg)}

@media(max-width:1024px) and (min-width:701px){
  .dc-dementor-feature{grid-template-columns:minmax(0,1fr) minmax(300px,.9fr);min-height:560px}
  .dc-dementor-feature__copy{padding:clamp(30px,4vw,54px)}
  .dc-dementor-relation{grid-template-columns:108px minmax(0,1fr) 32px;min-height:168px;padding:16px;gap:16px}
  .dc-dementor-relation__portrait{width:108px}
}
@media(max-width:700px){
  .dc-dementor-feature{grid-template-columns:1fr;min-height:0}
  .dc-dementor-feature__portrait{min-height:0;aspect-ratio:4/5;order:1}
  .dc-dementor-feature__copy{order:2;border-left:0;border-top:6px solid var(--dc-acid);padding:30px 18px 38px}
  .dc-dementor-relation{grid-template-columns:86px minmax(0,1fr);min-height:134px;padding:12px;gap:18px}
  .dc-dementor-relation__portrait{width:86px}
  .dc-dementor-relation__copy strong{font-size:34px}
  .dc-dementor-relation__copy span{display:none}
  .dc-dementor-relation__arrow{display:none}
}

/* HOME / COURSE FEATURE now uses real DOM FEATURE markup; no portrait pseudo-layer. */`;

const blockRx=/\/\* RELATION \*\/[\s\S]*?\/\* HOME \/ COURSE FEATURE — existing content, approved Valentin portrait identity\. \*\/[\s\S]*?(?=\/\* HOME \/ EVENT FEATURE)/;
if(!blockRx.test(css)) throw new Error('Legacy RELATION/FEATURE/Home course CSS block not found');
css=css.replace(blockRx,replacement+'\n\n');

// Remove obsolete lower Fuengirola :has() normalization; FEATURE owns that section now.
css=css.replace(/\/\* Existing Fuengirola Dementor section is normalized as a Relation without changing copy\. \*\/[\s\S]*?(?=@media\(max-width:1024px\))/,'');
// Remove old responsive feature rules that are now owned by canonical FEATURE block.
css=css.replace(/\n\s*\.dc-dementor-feature\{grid-template-columns:minmax\(0,4fr\) minmax\(260px,4fr\)\}/g,'');
css=css.replace(/\n\s*\.dc-dementor-feature\{grid-template-columns:1fr\}\.dc-dementor-feature__portrait\{min-height:0;aspect-ratio:4\/5\}\.dc-dementor-feature__copy\{order:1\}\.dc-dementor-feature__portrait\{order:2\}/g,'');

fs.writeFileSync(homePath,home);
fs.writeFileSync(eventPath,event);
fs.writeFileSync(cssPath,css);
console.log('Batch 2 FEATURE + RELATION migration applied');
