import assert from 'node:assert/strict';
import { PHRASE_BANK, resolvePhrase } from '../src/dialogue/phrase-bank.mjs';

for(const reaction of ['explain','agree','joke','silent','pressure']){
  assert.ok(PHRASE_BANK[reaction]?.length>=5&&PHRASE_BANK[reaction].length<=8,`${reaction} keeps approved 5–8 base phrases`);
}

const base={reaction:'explain',impulse:'beright',scenario:{id:'criticism-idea'},state:{brain:42,tension:36,contact:61},memory:{resentment:1},recentTranscript:[{actorId:'B',reaction:'explain',impulse:'understand'}],turn:3};
const first=resolvePhrase(base),second=resolvePhrase(structuredClone(base));
assert.equal(first,second,'same DialogueContext must resolve to the same phrase');

const understand=resolvePhrase({...base,impulse:'understand',state:{brain:30,tension:25,contact:70},memory:{}});
assert.match(understand,/понял, что именно тебе здесь не нравится/i,'UNDERSTAND explanation has a deterministic contextual replacement');

const overheated=resolvePhrase({...base,state:{brain:91,tension:84,contact:45},memory:{resentment:4}});
assert.match(overheated,/ещё раз объясню/i,'extreme BRAIN/TENSION uses the overheat replacement before resentment');

const resentful=resolvePhrase({...base,state:{brain:55,tension:50,contact:50},memory:{resentment:4}});
assert.match(resentful,/не первый раз/i,'high resentment is audible in deterministic dialogue');

const lowContact=resolvePhrase({reaction:'pressure',impulse:'beright',scenario:{id:'criticism-idea'},state:{brain:50,tension:55,contact:18},memory:{},recentTranscript:[],turn:5});
assert.match(lowContact,/на этом закончим/i,'low CONTACT changes wording without changing gameplay');

const differentContext=resolvePhrase({...base,turn:4});
assert.equal(typeof differentContext,'string');
assert.ok(differentContext.length>0);
assert.doesNotMatch(resolvePhrase.toString(),/Math\.random/,'dialogue resolver must not randomize phrase choice');

console.log('DEMENTOR LAB dialogue selftest: PASS — contextual phrase rendering is deterministic');
