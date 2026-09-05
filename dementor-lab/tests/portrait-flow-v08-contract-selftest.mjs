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
  'playerName()',
  'id="name"',
  'id="vs"',
  'id="whyToggle"',
  'id="whyPanel"',
  'id="archiveDetail"',
  'prefers-reduced-motion',
  'ТЫ СДЕЛАЛ',
  'СОБЕСЕДНИК ВОСПРИНЯЛ',
  'ПОЭТОМУ ДАЛЬШЕ'
])assert.ok(html.includes(required),`portrait flow must include ${required}`);

assert.ok(!html.includes("counterfactualRerun(session,{kind:'reduce-repeat',count:1})"),'rerun must not be hard-coded to REPEAT');
assert.ok(!html.includes("session.controller.patch({kind:'reduce-repeat'"),'HOT PATCH must use generalized recommendation');
assert.ok(html.includes('renderEmotions()'),'runtime emotion projection must be wired');
for(const forbidden of ['INTEGRATED MVP · v0.8','Runtime остановился','COUNTERFACTUAL','TRACE →','INTENT →'])assert.ok(!html.includes(forbidden),`primary portrait UI must not leak debug language: ${forbidden}`);
const nav=html.match(/<nav class="nav">([\s\S]*?)<\/nav>/)?.[1]||'';
assert.ok(!nav.includes('data-go="setup"'),'persistent nav must not bypass identity onboarding');
assert.ok(!html.includes('d.innerHTML=`<small>${entry.actorId'),'dialogue must not inject player-controlled strings through innerHTML');
assert.ok(!html.includes('b.innerHTML=`<strong>${r.scenarioTitle}'),'archive cards must not inject stored strings through innerHTML');

console.log('portrait-flow-v0.8 contract selftest: ok — human-first preflight/WHY and safe string rendering locked');
