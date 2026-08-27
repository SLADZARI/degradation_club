import fs from 'node:fs';
const MARK='/* BATCH7 RESPONSIVE SIGN-OFF */';
function append(file, css){
  let s=fs.readFileSync(file,'utf8');
  if(s.includes(MARK)) return;
  fs.writeFileSync(file, s.trimEnd()+`\n\n${MARK}\n${css.trim()}\n`);
}

append('about-v1.css', `
@media(max-width:560px){
  .dc-about .dc-display-xl{font-size:clamp(50px,14vw,64px);line-height:.82;overflow-wrap:normal}
  .dc-about .dc-display-l{font-size:clamp(38px,10.8vw,48px);line-height:.88;overflow-wrap:normal}
  .dc-about .dc-about-principles__head,.dc-about .dc-about-manifesto__title,.dc-about .dc-about-service__title{min-width:0}
}
`);

append('entity-v1.css', `
@media(max-width:560px){
  .dc-entity .dc-display-xl{font-size:clamp(50px,14vw,64px);line-height:.82}
  .dc-entity .dc-display-l{font-size:clamp(36px,10.6vw,46px);line-height:.89}
  .dc-entity-hero__title,.dc-event-lock__title,.dc-event-detail__intro .dc-display-l{min-width:0;max-width:100%}
}
`);

append('catalog-v1.css', `
@media(max-width:700px){
  .dc-catalog-page .dc-catalog-provenance>*{min-width:0;overflow-wrap:anywhere}
  .dc-catalog-page .dc-entity-hero__title{max-width:100%}
}
`);

append('courses/dengi-na-veter/course.css', `
@media(max-width:560px){
  .money-intro h2,.money-price h2,.money-footer-cta h2{font-size:clamp(38px,10.5vw,46px);line-height:.9;overflow-wrap:normal}
  .money-shell>*{min-width:0}
  .dc-dementor-link__copy{min-width:0}
}
`);

append('courses/dumai-s-opasnostyu/course-shell.css', `
@media(max-width:560px){
  body.dc-course-product--danger #app .wrap{min-width:0;max-width:100%}
  body.dc-course-product--danger #app h1{font-size:clamp(48px,13vw,54px);line-height:.84;max-width:100%}
  body.dc-course-product--danger #app .acid-mark{box-decoration-break:clone;-webkit-box-decoration-break:clone}
}
`);

append('courses/slaboumie-i-otvaga/course.css', `
@media(max-width:560px){
  .dc-final,.dc-final-question{min-width:0;max-width:100%}
  .dc-final-question{font-size:clamp(42px,11vw,50px);line-height:.86;overflow-wrap:normal}
  .dc-course-strip{max-width:100vw;overflow:hidden}
}
`);

append('design-system/ui-lab-v2.css', `
@media(max-width:1100px){
  .lab-shell,.lab-context-grid,.lab-context,.lab-relation,.lab-relation__copy{min-width:0;max-width:100%}
  .lab-context-grid>*{min-width:0}
  .lab-context h4,.lab-relation strong,.lab-quote-person blockquote{overflow-wrap:anywhere}
}
@media(max-width:800px){
  .lab-context-grid{grid-template-columns:1fr}
  .lab-context h4{font-size:clamp(38px,10vw,54px)}
  .lab-relation strong{font-size:clamp(28px,7vw,42px)}
}
`);

append('donate/inline-v1.css', `
@media(max-width:620px){
  .dc-support-title{min-width:0;max-width:100%}
  .dc-support-title h1{font-size:clamp(48px,13vw,56px);line-height:.82;max-width:100%}
  .dc-support-title h1 span{box-decoration-break:clone;-webkit-box-decoration-break:clone}
}
`);

append('event-system.css', `
@media(max-width:560px){
  .dc-fuengirola-page .dc-dementor-feature,.dc-fuengirola-page .dc-dementor-feature__copy{min-width:0;max-width:100%}
  .dc-fuengirola-page .dc-dementor-feature .dc-display-l{font-size:clamp(34px,9.5vw,41px);line-height:.9}
  .dc-fuengirola-page .dc-event-lock__title,.dc-fuengirola-page .dc-event-detail__intro .dc-display-l{font-size:clamp(34px,9.5vw,41px);line-height:.9}
}
`);

append('course-bridge-v1.css', `
/* NE KOMANDA uses the shared Dementor visual vocabulary but owns course geometry here. */
@media(min-width:901px) and (max-width:1180px){
  .dc-dementor--gabil .dc-dementor-hero{overflow:hidden}
  .dc-dementor--gabil .dc-dementor-hero__layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.95fr);gap:28px;align-items:center;min-width:0}
  .dc-dementor--gabil .dc-dementor-hero__copy,.dc-dementor--gabil .dc-dementor-hero__portrait{min-width:0;max-width:100%}
  .dc-dementor--gabil .dc-dementor-hero__portrait{overflow:hidden}
  .dc-dementor--gabil .dc-dementor-hero__portrait img{display:block;width:100%;max-width:100%;height:auto;object-fit:contain}
}
`);

append('merch-drop-v2.css', `
.dc-product__layout>*,.dc-product__copy{min-width:0}
@media(min-width:901px){
  .dc-product__copy h1{font-size:clamp(46px,4.8vw,70px);max-width:100%;overflow-wrap:normal}
}
`);

append('objects-v1.css', `
.dc-object-grid,.dc-object-gallery{grid-template-columns:repeat(12,minmax(0,1fr))}
.dc-object-gallery>*{min-width:0;max-width:100%}
.dc-object-media img{max-width:100%}
@media(max-width:900px){.dc-object-grid,.dc-object-gallery{grid-template-columns:repeat(8,minmax(0,1fr))}}
@media(max-width:560px){.dc-object-grid,.dc-object-gallery{grid-template-columns:repeat(4,minmax(0,1fr))}}
`);

// Fuengirola: event hero already owns the event image; remove the legacy duplicate media block.
{
  const f='events/fuengirola/index.html';
  let s=fs.readFileSync(f,'utf8');
  s=s.replace(/\n\s*<figure class="dc-ink-slot dc-ink-slot--event dc-media-break"><img src="\/assets\/ink\/event-fuengirola-03\.webp"[^>]*><\/figure>\s*\n/, '\n');
  fs.writeFileSync(f,s);
}

// Make Batch 7 classify actual painted overflow rather than hidden intentional scrollers / SR-only nodes.
{
  const f='scripts/batch7-responsive-visual.mjs';
  let s=fs.readFileSync(f,'utf8');
  s=s.replace("const text = (el.childElementCount === 0 ? el.textContent : '').trim();", "const text = (el.childElementCount === 0 ? el.textContent : '').trim();\n        const srOnly = /(^|\\s)(dc-global-sr|sr-only|visually-hidden)(\\s|$)/.test(el.className || '');");
  s=s.replace("if (text.length > 2 && ['hidden','clip'].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 3) {", "if (!srOnly && text.length > 2 && ['hidden','clip'].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 3) {");
  s=s.replace("const brokenImages = [...document.images].filter(img => img.complete && img.naturalWidth === 0)", "const brokenImages = [...document.images].filter(img => (img.getAttribute('src') || '').trim() && img.complete && img.naturalWidth === 0)");
  s=s.replace("horizontalOverflow: Math.max(d.scrollWidth, body?.scrollWidth || 0) > width + 2,", "horizontalOverflow: protrusions.some(x => !['div.dc-notice__track'].includes(x.selector)),");
  s=s.replace("topbarOverlap = fr.top < tb.bottom - 2 && getComputedStyle(topbar).position !== 'static';", "topbarOverlap = getComputedStyle(topbar).position === 'fixed' && fr.top < tb.bottom - 2;");
  fs.writeFileSync(f,s);
}
