import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const html=await fs.readFile(new URL('../prototypes/portrait-flow-v0.8.html',import.meta.url),'utf8');
for(const required of [
  'createMvpSession',
  'recommendOneCausePatch',
  'counterfactualMutationFromRecommendation',
  'portraitEmotion',
  'applyPortraitEmotion',
  'buildRunDetail',
  'loadRunRecords',
  'playerName()'
])assert.ok(html.includes(required),`portrait flow must include ${required}`);

assert.ok(html.includes('id="name"'), 'name onboarding screen required');
assert.ok(html.includes('id="archiveDetail"'), 'archive detail screen required');
assert.ok(!html.includes("counterfactualRerun(session,{kind:'reduce-repeat',count:1})"),'rerun must not be hard-coded to REPEAT');
assert.ok(!html.includes("session.controller.patch({kind:'reduce-repeat'"),'HOT PATCH must use generalized recommendation');
assert.ok(html.includes('renderEmotions()'),'runtime emotion projection must be wired');

console.log('portrait-flow-v0.8 contract selftest: ok');
