import fs from 'node:fs';

const uiPath='ui-v2.css';
const surfPath='illustration-surfaces.css';
const commPath='community-v2.css';
const visualPath='visual-standard-v2.css';

let ui=fs.readFileSync(uiPath,'utf8');
let surf=fs.readFileSync(surfPath,'utf8');
let comm=fs.readFileSync(commPath,'utf8');
let visual=fs.readFileSync(visualPath,'utf8');

// 1) Remove generic Ink-slot ownership from ui-v2. Component behavior moves to illustration-surfaces.css.
ui=ui.replace(/\/\* Dementor Ink raster integration — fixed editorial scenes\. \*\/[\s\S]*?\/\* MOUTHWASH/, '/* MOUTHWASH');
ui=ui.replace(/@media\(max-width:900px\)\{\.topbar \.nav\{gap:13px\}\.dc-ink-slot,\.dc-ink-slot--home,\.dc-ink-slot--about,\.dc-ink-slot--logic,\.dc-event-visual\{height:clamp\(480px,82vh,760px\)\}/, '@media(max-width:900px){.topbar .nav{gap:13px}');
ui=ui.replace(/\.dc-ink-slot,\.dc-ink-slot--home,\.dc-ink-slot--about,\.dc-ink-slot--logic\{height:clamp\(420px,118vw,580px\)\}\.dc-ink-slot>img,\.dc-ink-slot__image\{width:100%;height:100%;object-fit:cover\}\.dc-home \.dc-ink-slot>img\{object-position:42% center\}\.dc-about \.dc-ink-slot>img\{object-position:56% center\}\.dc-entity-page \.dc-ink-slot>img\{object-position:48% center\}\.dc-event-visual\{height:clamp\(420px,118vw,580px\)\}\.dc-event-visual img\{width:100%;height:100%;object-fit:cover;object-position:42% center\}/, '');

// 2) Make illustration-surfaces the single owner of generic raster surface geometry.
if(!surf.includes('/* GENERIC INK SLOT — canonical owner. */')){
  surf += `\n\n/* GENERIC INK SLOT — canonical owner. */\nfigure.dc-ink-slot{margin:0;width:100%;max-width:none}\n.dc-ink-slot{position:relative;height:clamp(560px,72vh,900px);border-top:1px solid currentColor;border-bottom:1px solid currentColor;overflow:hidden;background:var(--dc-paper)}\n.dc-ink-slot::before,.dc-ink-slot::after{content:none}\n.dc-ink-slot>img,.dc-ink-slot__image{display:block;width:100%;height:100%;max-width:none;object-fit:contain;object-position:center;mix-blend-mode:multiply}\n.dc-ink-slot--home{height:clamp(620px,76vh,940px)}\n.dc-ink-slot--about{height:clamp(560px,68vh,840px)}\n.dc-ink-slot--logic{height:clamp(600px,72vh,900px)}\n.dc-event-visual{margin:0;padding:0;height:clamp(560px,68vh,860px);background:var(--dc-paper);overflow:hidden;border-top:1px solid var(--dc-line);border-bottom:1px solid var(--dc-line)}\n.dc-event-visual img{display:block;width:100%;height:100%;max-width:none;object-fit:contain;object-position:center;mix-blend-mode:multiply}\n@media(max-width:900px){.dc-ink-slot,.dc-ink-slot--home,.dc-ink-slot--about,.dc-ink-slot--logic,.dc-event-visual{height:clamp(480px,82vh,760px)}}\n@media(max-width:700px){.dc-ink-slot,.dc-ink-slot--home,.dc-ink-slot--about,.dc-ink-slot--logic,.dc-event-visual{height:clamp(420px,118vw,580px)}.dc-ink-slot>img,.dc-ink-slot__image,.dc-event-visual img{width:100%;height:100%;object-fit:contain;object-position:center}}\n`;
}

// 3) Community owns opening geometry; illustration-surfaces owns image/surface behavior.
comm=comm.replace(/\.dc-community-opening__art img\{[^}]*\}/g,'');
comm=comm.replace(/\.dc-community-opening__veil\{[^}]*\}/g,'');
comm=comm.replace(/\.dc-community-opening__art img\{[^}]*\}/g,'');
comm=comm.replace(/\.dc-community-opening__veil\{[^}]*\}/g,'');

// Keep the veil as composition, but only in community-v2 (single owner).
if(!comm.includes('/* Community opening veil composition. */')){
  comm += `\n/* Community opening veil composition. */\n.dc-community-opening__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(to bottom,rgba(242,240,232,.92) 0,rgba(242,240,232,.12) 20%,rgba(242,240,232,0) 64%,rgba(242,240,232,.84) 88%,rgba(242,240,232,.97) 100%)}\n@media(max-width:560px){.dc-community-opening__veil{background:linear-gradient(to bottom,rgba(242,240,232,.92) 0,rgba(242,240,232,.08) 18%,rgba(242,240,232,0) 58%,rgba(242,240,232,.9) 82%,rgba(242,240,232,.98) 100%)}}\n`;
}
// Remove duplicate veil definitions from illustration-surfaces.
surf=surf.replace(/\.dc-community-page \.dc-community-opening__veil\{[^}]*\}\n?/g,'');
surf=surf.replace(/@media\(max-width:560px\)\{\s*\.dc-community-page \.dc-community-opening__veil\{[^}]*\}\s*\}\n?/g,'');

// 4) Event media fallback behavior belongs to illustration-surfaces, not visual-standard.
visual=visual.replace(/\/\* Any remaining event media uses the same upper-right crop rule\. \*\/[\s\S]*?\n\n\/\* Existing Fuengirola Dementor section/, '/* Existing Fuengirola Dementor section');

fs.writeFileSync(uiPath,ui);
fs.writeFileSync(surfPath,surf);
fs.writeFileSync(commPath,comm);
fs.writeFileSync(visualPath,visual);
console.log('Batch 3 Ink surfaces migration applied');
