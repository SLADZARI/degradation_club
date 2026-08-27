import fs from 'node:fs';

const path='visual-standard-v2.css';
let css=fs.readFileSync(path,'utf8');

// Person surfaces are canonical here; they no longer need to win by force.
css=css.replace(/background:var\((--dc-dementor-(?:valentin|nikita|gabil|evgeniy)-bg)\)!important/g,'background:var($1)');

// Canonical portrait contract: preserve the complete illustration on the personal surface.
css=css.replace(/object-fit:contain!important/g,'object-fit:contain');
css=css.replace(/object-position:center bottom!important/g,'object-position:center bottom');

// RELATION used to reintroduce a crop after the global portrait contract. Remove the contradiction.
css=css.replace(/\.dc-dementor-relation__portrait img\{display:block;width:100%;height:100%;object-fit:cover!important;object-position:center!important;mix-blend-mode:multiply\}/,
'.dc-dementor-relation__portrait img{display:block;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:multiply}');

// FEATURE is already a single-owner component.
css=css.replace(/\.dc-dementor-feature__portrait img\{display:block;width:100%;height:100%;object-fit:contain(?:!important)?;object-position:center bottom(?:!important)?;mix-blend-mode:multiply\}/,
'.dc-dementor-feature__portrait img{display:block;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:multiply}');

// Home Fuengirola feature: selectors are sufficiently specific after ownership cleanup.
css=css.replace(/(\.dc-home section\.dc-event:has\(a\[href="\/events\/fuengirola\/"\]\)\{[^}]+)\}/,m=>m.replace(/!important/g,''));
css=css.replace(/(\.dc-home section\.dc-event:has\(a\[href="\/events\/fuengirola\/"\]\)>\.dc-shell\{[^}]+)\}/,m=>m.replace(/!important/g,''));
for(const part of ['title','desc','meta','action']){
  const re=new RegExp(`(\\.dc-home section\\.dc-event:has\\(a\\[href="\\/events\\/fuengirola\\/"\\]\\) \\.dc-event__${part}\\{[^}]+)\\}`);
  css=css.replace(re,m=>m.replace(/!important/g,''));
}

// EVENT HERO is now a canonical single-owner DOM component. Remove force from the whole contract block only.
const start=css.indexOf('/* EVENT HERO — approved UI Redesign composition.');
if(start<0) throw new Error('EVENT HERO canonical block not found');
let end=css.indexOf('/* Existing Fuengirola Dementor section',start);
if(end<0) end=css.length;
const before=css.slice(0,start);
const block=css.slice(start,end).replace(/!important/g,'');
const after=css.slice(end);
css=before+block+after;

fs.writeFileSync(path,css);
console.log('Batch 4B cascade pressure cleanup applied');
