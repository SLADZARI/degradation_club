import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const css=await readFile(new URL('mobile-readability.css',root),'utf8');

assert.match(html,/mobile-readability\.css/,'mobile readability layer is loaded');
assert.match(css,/max-width:430px/,'small-phone contract exists');
assert.match(css,/\.bubble\{[^}]*font-size:16px/,'dialogue remains readable at 16px on phones');
assert.match(css,/\.dialogue\{[^}]*height:300px[^}]*overflow|\.dialogue\{[^}]*height:300px/,'dialogue receives a substantial phone viewport');
assert.match(css,/\.bubble small\{display:block/,'speaker identity remains available while reading chat history');
assert.match(css,/\.talk-record span\{display:none\}/,'duplicate TALK objective microcopy is hidden on small phones');
assert.match(css,/\.turn span\{display:none\}/,'TURN micro-label is removed before shrinking essential content');
assert.match(css,/\.metric label\{font-size:9px/,'supporting metric labels are compact while bars remain visible');
assert.match(css,/\.delta-feedback small\{display:none!important\}/,'exact metric deltas leave the primary phone layer');
assert.match(html,/id="trace-btn"/,'TRACE keeps exact evidence available on demand');
assert.match(css,/\.patch-grid button\{font-size:12px/,'HOT PATCH controls remain legible');
assert.match(css,/max-width:360px/,'narrow-phone fallback exists');

console.log('DEMENTOR LAB mobile readability selftest: PASS — chat owns the phone viewport and evidence remains available on demand');
