import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const css=await readFile(new URL('mobile-readability.css',root),'utf8');

assert.match(html,/mobile-readability\.css/,'mobile readability layer is loaded');
assert.match(css,/max-width:430px/,'small-phone contract exists');
assert.match(css,/\.bubble\{font-size:16px/,'dialogue remains readable');
assert.match(css,/\.talk-record span\{display:none\}/,'duplicate TALK objective microcopy is hidden on small phones');
assert.match(css,/\.turn span\{display:none\}/,'TURN micro-label is removed before shrinking essential content');
assert.match(css,/\.bubble small\{display:none\}/,'speaker micro-label is removed on small phones');
assert.match(css,/\.metric label\{font-size:11px/,'metric labels are not reduced below the approved readable support layer');
assert.match(css,/\.patch-grid button\{font-size:12px/,'HOT PATCH controls remain legible');
assert.match(css,/max-width:360px/,'narrow-phone fallback exists');

console.log('DEMENTOR LAB mobile readability selftest: PASS');
