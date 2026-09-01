import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CRITICISM_IDEA_SCENARIO } from '../src/scenarios/criticism-idea.mjs';
import { resolvePhrase } from '../src/dialogue/phrase-bank.mjs';

const html=fs.readFileSync(new URL('../editorial.html',import.meta.url),'utf8');

assert.equal(CRITICISM_IDEA_SCENARIO.id,'criticism-idea','machine id stays stable');
assert.equal(CRITICISM_IDEA_SCENARIO.title,'ТРЕТЬЕ ОБЪЯСНЕНИЕ');
assert.match(CRITICISM_IDEA_SCENARIO.premise,/третий раз объясняете идею/i);
assert.match(CRITICISM_IDEA_SCENARIO.detail,/уже сказал «я понял»/i);
assert.doesNotMatch(CRITICISM_IDEA_SCENARIO.objectiveLabel,/контакт/i,'public objective should describe behavior, not psychology');

const player=resolvePhrase({actorId:'A',reaction:'explain',impulse:'beright',turn:1});
const listener=resolvePhrase({actorId:'B',reaction:'explain',impulse:'understand',turn:1});
assert.match(player,/объясню|момент|короче/i);
assert.match(listener,/понял/i,'listener copy should acknowledge understanding instead of mirroring player explanation');

assert.match(html,/ТРЕТЬЕ ОБЪЯСНЕНИЕ/);
assert.match(html,/ОСТАНОВИТЬСЯ ВОВРЕМЯ/);
assert.match(html,/КАК МЫ СЮДА ДОШЛИ\?/);
assert.doesNotMatch(html,/СОХРАНИТЬ КОНТАКТ/);

console.log('DEMENTOR LAB editorial copy selftest: PASS');
