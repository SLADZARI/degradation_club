import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const person=await readFile(new URL('src/ui/person-editor.mjs',root),'utf8');
const registry=await readFile(new URL('src/render/character-registry.mjs',root),'utf8');
const renderer=await readFile(new URL('src/render/character-renderer.mjs',root),'utf8');

assert.match(html,/Playtest v1\.0/,'current experimental UI identifies v1.0');
assert.match(html,/id=["']person-editor["']/,'PERSON mounts the manifest-driven editor');
for(const screen of ['person','situation','trigger','goal','action','fallback','reveal','opponent','talk','result','change','replay','compare'])assert.match(html,new RegExp(`data-screen=["']${screen}["']`),`v1.0 exposes ${screen} step`);
for(const id of ['scenario-list','scene-title','scene-copy','scene-goal','reveal-joke','r-trigger','r-goal','r-action','r-fallback','opponent-preview','opponent-preset','opponent-name','opponent-description','start-talk','talk-a','talk-b','meters','talk-log','why-btn','trace','result-title','result-facts','repair-choices','start-replay','replay-log','compare-title','before-summary','after-summary','compare-story'])assert.match(html,new RegExp(`id=["']${id}["']`),`v1.0 exposes #${id}`);
assert.match(html,/KEEP_PEACE/,'situation set includes a peace-keeping opponent brain');
assert.match(html,/RIGHT_BACK/,'situation set includes a right-back opponent brain');
assert.match(html,/DIRECT_ANSWER_OPPONENT_GRAPH/,'situation set includes a materially different direct-answer graph');
assert.match(html,/createEncounter/,'playtest executes the real encounter runtime');
assert.match(html,/executeActorTurn/,'playtest advances through real actor turns');
assert.match(html,/resolvePhrase/,'dialogue is projected from runtime context');
assert.match(html,/ONE CHANGE/,'counterfactual repair is explicit');
assert.match(html,/ТО ЖЕ МЕСТО\. ОДНА ПРАВКА/,'replay keeps the counterfactual experiment framing');

assert.match(person,/class PersonEditor/,'PERSON behavior is isolated in its own editor module');
assert.match(person,/ensureCharacterContracts/,'PERSON loads validated character contracts');
assert.match(person,/CharacterRenderer/,'PERSON uses the production SVG renderer');
assert.match(person,/variantOptions/,'PERSON reads real authored variants from manifests');
assert.match(person,/id:'hat',label:'ГОЛОВА'/,'PERSON exposes head as a product-facing category');
assert.match(person,/id:'accessories',label:'АКСЕССУАРЫ'/,'PERSON merges glasses and small accessories');
assert.match(person,/id:'facialHair',label:'УСЫ'/,'PERSON keeps facial hair under the moustache category');
assert.match(person,/id:'outfit',label:'ОДЕЖДА'/,'PERSON exposes clothing');
assert.doesNotMatch(person,/id:'shoes',label:/,'shoes are not a player-facing top-level category');
assert.match(person,/data-reset/,'PERSON has an explicit reset control');
assert.doesNotMatch(person,/data-face/,'face QA is not exposed in player-facing PERSON');
assert.match(person,/data-base="character-01"/,'PERSON exposes character-01');
assert.match(person,/data-base="character-02"/,'PERSON exposes character-02');
assert.match(registry,/SHARED_APPEARANCE_CATEGORIES/,'shared appearance ownership remains registry-defined');
assert.match(registry,/CHARACTER_OWNED_CATEGORIES/,'owned appearance remains registry-defined');
assert.match(renderer,/el\.style\.display=on\?'inline':'none'/,'face-state renderer overrides authored display:none when a face variant becomes active');

console.log('DEMENTOR LAB v1.1 UI contract selftest: PASS — compact PERSON + distinct worlds + replay flow are wired');
