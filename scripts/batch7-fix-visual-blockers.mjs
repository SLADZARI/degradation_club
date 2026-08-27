import fs from 'node:fs';

function appendOnce(file, marker, css){
  let s=fs.readFileSync(file,'utf8');
  if(!s.includes(marker)){
    s += `\n\n/* ${marker} */\n${css.trim()}\n`;
    fs.writeFileSync(file,s);
  }
}

appendOnce('home-v1.css','BATCH7 / MOBILE HERO TEXT CONTAINMENT',`
@media(max-width:700px){
  .dc-home .dc-hero__title{font-size:clamp(48px,14vw,58px);line-height:.82;letter-spacing:-.07em}
}
`);

appendOnce('visual-standard-v2.css','BATCH7 / FUENGIROLA MOBILE TITLE CONTAINMENT',`
@media(max-width:560px){
  body.dc-fuengirola-page .dc-entity-hero__title{font-size:clamp(48px,14.7vw,58px);line-height:.82;letter-spacing:-.065em}
}
`);

let audit=fs.readFileSync('scripts/batch7-responsive-visual.mjs','utf8');
if(!audit.includes('const textOverflow = [];')){
  audit=audit.replace('      const clippedText = [];','      const clippedText = [];\n      const textOverflow = [];');
  audit=audit.replace(
    "        const srOnly = /(^|\\s)(dc-global-sr|sr-only|visually-hidden)(\\s|$)/.test(el.className || '');\n        if (!srOnly && text.length > 2 && ['hidden','clip'].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 3) {",
    "        const srOnly = /(^|\\s)(dc-global-sr|sr-only|visually-hidden)(\\s|$)/.test(el.className || '');\n        const intentionalText = el.closest('.dc-notice__track,.ticker,.dc-course-strip,[class*=\\\"ticker\\\"],[class*=\\\"strip\\\"]');\n        if (!srOnly && !intentionalText && text.length > 2 && el.scrollWidth > el.clientWidth + 3) {\n          textOverflow.push({ selector: selectorOf(el), text: text.slice(0, 80), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth });\n        }\n        if (!srOnly && text.length > 2 && ['hidden','clip'].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 3) {"
  );
  audit=audit.replace('        horizontalOverflow: scrollWidth > width + 4,','        horizontalOverflow: scrollWidth > width + 4 && (protrusions.length > 0 || textOverflow.length > 0),');
  audit=audit.replace('        protrusions: protrusions.slice(0, 30),\n        clippedText:', '        protrusions: protrusions.slice(0, 30),\n        textOverflow: textOverflow.slice(0, 30),\n        clippedText:');
  audit=audit.replace("  if (r.metrics?.horizontalOverflow) md += `- horizontal overflow: scrollWidth ${r.metrics.scrollWidth}\\n`;", "  if (r.metrics?.horizontalOverflow) md += `- horizontal overflow: scrollWidth ${r.metrics.scrollWidth}; text-overflow ${r.metrics.textOverflow?.slice(0,5).map(x=>x.selector).join(', ') || 'none'}\\n`;");
  fs.writeFileSync('scripts/batch7-responsive-visual.mjs',audit);
}

console.log('Batch 7 visual blockers patched.');
