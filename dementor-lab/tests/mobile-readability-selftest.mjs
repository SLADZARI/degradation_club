import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');

assert.match(html,/width=device-width,initial-scale=1,viewport-fit=cover/,'safe-area mobile viewport contract present');
assert.match(html,/max-width:560px/,'playtest remains a narrow mobile-first surface on desktop');
assert.match(html,/@media\(max-width:390px\)/,'small-phone fallback exists');
assert.match(html,/\.choice button\{[^}]*font-size:17px/,'human choice copy stays readable');
assert.match(html,/\.bubble\{[^}]*font-size:17px/,'dialogue stays readable');
assert.match(html,/\.primary[^}]*min-height:54px|\.primary,.secondary[^\n]*min-height:54px/,'primary interaction targets are at least 54px high');
assert.match(html,/\.person-tools button\{[^}]*width:44px[^}]*height:44px/,'compact PERSON tools keep 44px touch targets');
assert.match(html,/\.person-cats button\{[^}]*min-height:48px/,'PERSON category targets remain phone-safe');
assert.match(html,/\.person-variants button\{[^}]*min-height:44px/,'variant targets remain phone-safe');
assert.match(html,/overflow-x:auto/,'variant rack scrolls horizontally rather than shrinking controls');
assert.match(html,/\.actor \.character-slot\{width:135px;height:180px/,'TALK reserves meaningful portrait area');
assert.match(html,/\.actor \.character-slot\{width:115px;height:155px/,'narrow-phone TALK has an explicit portrait fallback');
assert.match(html,/\.comparebox\{grid-template-columns:1fr\}/,'before/after collapses to one column on narrow phones');

console.log('DEMENTOR LAB v1.0 mobile readability selftest: PASS — touch targets and reading sizes remain phone-first');