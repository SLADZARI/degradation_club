# DEMENTOR LAB — Semantic Wiring Audit v0.1

**Status:** ACTIVE QA / implementation registry  
**Date:** 2026-09-02  
**Implementation branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product source:** `dementor-club` architecture/specs  

## 1. Audit rule

Every visible control, label, value and gameplay attribute must have a complete chain:

`UI → semantic field → storage/owner → runtime meaning → observable output/result`

If one link is missing, the item is not considered finished.

Statuses:

- `WIRED` — complete chain exists.
- `PARTIAL` — field exists and is used, but semantic chain is incomplete.
- `UNWIRED` — shown or declared, but no real owner/effect.
- `DORMANT` — model capability exists but is intentionally not exposed in this slice.
- `DECISION_GAP` — implementation cannot be completed without an explicit product rule.

## 2. P0 cross-check findings

| Area | Finding | Status | Required action |
| --- | --- | --- | --- |
| Player identity | `Character.name` exists, but player A is hardcoded as `Геннадий Львович / ГЕНА`; PERSON has no input. | UNWIRED | Add player name input, keep value in session/local state, pass into `Character.name`, preserve through replay. |
| Scenario copy | Setup and TALK duplicate title/premise/objective/turn limit as hardcoded HTML instead of reading `Scenario`. | PARTIAL | Render all scenario-facing copy from `CRITICISM_IDEA_SCENARIO`. |
| Objective | `objective='contact'` currently only changes CONTACT=0 breakdown. There is no `OBJECTIVE_COMPLETE`, success threshold or explicit win evaluation. | DECISION_GAP | Define success semantics in product SOT before inventing a threshold. |
| Two-graph collision | Every actor turn receives the same `openingTrigger='criticism'`. Previous Reaction does not emit the next Trigger. | PARTIAL / P0 | Define reaction→event/trigger propagation for the slice. Current system is two graphs taking turns, not yet full causal collision. |
| Dialogue Layer | Product contract says dialogue depends on reaction + impulse + scenario + BRAIN/TENSION/CONTACT + memory + recent transcript. Runtime currently passes only `reaction` and `turn`. | PARTIAL / P0 | Wire full deterministic dialogue context and author phrase rules. Do not replace graph causality with text randomness. |
| REPEAT | Runtime multiplies metric cost using `count`, but there is no concept of “answer accepted/not accepted”; visible repeat phrase is therefore only partially true. | PARTIAL / P0 | Define acceptance signal or rename/control semantics to exactly match current runtime. |
| Conditional branch | `BRAIN >` is now a real gate. If every available path fails its condition, runtime has no executable reaction and throws. | PARTIAL / P0 | Define no-path behavior/fallback instead of allowing an uncaught gameplay failure. |
| Replay | Counterfactual target is now exact `nodeId`, not every node of the same type. | WIRED | Keep regression test. |
| Manual edges | User-created edge now survives stack reorder and is marked manual. | WIRED | Keep browser regression test. |
| HOT PATCH | reduce impulse, reduce repeat, insert PAUSE and safe rewire exist in runtime/UI. | WIRED | Keep same-encounter/no-reset tests. |

## 3. UI field registry

### PERSON

| UI item | Field / owner | Storage | Runtime/output | Status |
| --- | --- | --- | --- | --- |
| Character 01 / 02 | `currentCharacterId`, `Character.visual.characterId` | in-memory run config | Renderer selects exact body/rig | WIRED |
| Player name | `Character.name` | currently hardcoded; target: local/session + `Character.name` | TALK actor label, transcript, RESULT loser name | UNWIRED → fix in this audit |
| Hat | `hatVariant` / legacy `hat` | appearance state + firstRunConfig | CharacterRenderer | WIRED |
| Glasses | `glassesVariant` / legacy `glasses` | appearance state + firstRunConfig | CharacterRenderer | WIRED |
| Facial hair | `facialHairVariant` / legacy `beard` | appearance state + firstRunConfig | CharacterRenderer | WIRED for supported body; intentional asymmetry on character-02 |
| Accessory | `accessoryVariant` | appearance state + firstRunConfig | CharacterRenderer | WIRED |
| Outfit | `outfitVariant` | character-owned appearance | CharacterRenderer | WIRED where manifest supports it |
| Shoes | `shoesVariant` | character-owned appearance | CharacterRenderer | WIRED |
| Appearance colors | `colors.outfitPrimary/outfitSecondary/shoesPrimary` | model state | Renderer supports targets, but PERSON has no color controls | DORMANT |
| “СКЕЛЕТ” ownership copy | no editable field in PERSON | none | body switch selects rig, but user cannot edit skeleton | MISLEADING COPY → remove/rewrite |
| Reset appearance | shared/owned appearance + colors | in-memory | Renderer reset | WIRED |

### BRAIN

| UI item | Field / owner | Storage | Runtime/output | Status |
| --- | --- | --- | --- | --- |
| Preset | `activeBrainPresetId` + graph clone | currentBrainGraph / firstRunConfig | executable graph | WIRED |
| Add node | `NODE_SPECS[type]` | currentBrainGraph.nodes | runtime path | WIRED only for slice-supported/current-scenario nodes |
| Delete node | node id | graph | removes related edges | WIRED |
| Drag/reorder | node order + `ui` | graph | stack sequence rebuild | WIRED; manual edges preserved after fix |
| Connect | Edge `{id,from,to}` | graph | path traversal | WIRED; family/cycle validation |
| Impulse weight | `p.weight` 1..5 | node | path score + impulse metric effect | WIRED |
| Memory delta | `p.delta` 1..5 | node | memory value + memory semantic metric effects | PARTIAL: only positive change exposed |
| Repeat count | `p.count` 1..5 | node | extra ENERGY/BRAIN/TENSION/CONTACT effects | PARTIAL: no answer-acceptance condition |
| BRAIN threshold | `p.threshold` 20..100 | node | path gate (`brain > threshold`) | WIRED; no-path fallback still missing |
| STOP | node type | graph | stops traversal downstream | WIRED |
| PAUSE | node type | graph | BRAIN/TENSION reduction + CONTACT support | WIRED |
| INTERRUPT / ПЕРЕХВАТ | node exists in model | none meaningful | no approved special runtime semantics | DORMANT; must not be shown as available |
| IGNORE trigger | valid global trigger type | graph | runtime supports exact trigger matching | DORMANT in current `CRITICISM` scenario unless another event can emit IGNORE |
| `brain-inspector` empty DOM | none | none | none | UNWIRED → remove |
| `brain-editor` empty DOM | none | none | none | UNWIRED → remove |

### SETUP / SITUATION

| UI item | Field / owner | Storage | Runtime/output | Status |
| --- | --- | --- | --- | --- |
| Scenario title | `Scenario.title` | scenario constant | display/run | PARTIAL: duplicated in HTML → render from model |
| Premise | `Scenario.premise` | scenario constant | display | PARTIAL: duplicated/hardcoded player name |
| Objective | `Scenario.objective` + `objectiveLabel` | scenario | CONTACT breakdown condition + label | PARTIAL / decision gap for success |
| Turn limit | `Scenario.turnLimit` | scenario | terminal check | PARTIAL: runtime wired, UI duplicated |
| Opponent name | generated `opponentProfile.name` | seed-derived profile + firstRunConfig | Character.name / TALK | WIRED |
| Opponent preset label | preset metadata | opponent profile | setup display | WIRED |
| Opponent description | preset metadata | opponent profile | setup display | WIRED |
| Opponent seed | `opponentSeed` | URL seed or generated seed + firstRunConfig | deterministic opponent | WIRED; copy `ОПЫТ` is semantically opaque → label as seed/variant |
| Reroll | new seed/profile | current setup | new opponent | WIRED; frozen after baseline/replay |
| AUTO / STEP | `mode` | current run + firstRunConfig | autoplay vs manual turns | WIRED |

### TALK

| UI item | Field / owner | Storage | Runtime/output | Status |
| --- | --- | --- | --- | --- |
| Actor names | `Character.name` | actor objects | arena/transcript | Player side currently hardcoded upstream; fix required |
| Turn | `Encounter.turn` | encounter | terminal limit and UI | WIRED |
| ENERGY | `state.energy` | Character state | reaction/repeat/pause effects + terminal at 0 | WIRED |
| BRAIN | `state.brain` | Character state | effects + `BRAIN >` + hot patch/breakdown | WIRED |
| TENSION | `state.tension` | Character state | effects + renderer state | WIRED |
| CONTACT | `state.contact` | Character state | effects + contact breakdown | WIRED; objective success unresolved |
| Dialogue text | transcript phrase | encounter.transcript | visible conversation | PARTIAL: phrase only uses reaction+turn |
| Delta line | last trace self delta + first memory change | trace | transient feedback | PARTIAL: only first memory change is shown |
| TRACE | ExecutionTrace | encounter.traces | causal debug overlay | WIRED but raw IDs/types should later get human labels |
| NEXT / AUTO pause | mode + timer | UI runtime | controls progression | WIRED |

### RESULT / REPLAY

| UI item | Field / owner | Storage | Runtime/output | Status |
| --- | --- | --- | --- | --- |
| Result title | terminal result | encounter.result | RESULT | WIRED |
| Cause | player A last trace ordered node path | trace | human causal chain | WIRED |
| Suspicious node | exact player nodeId | result.stageC | replay target | WIRED |
| Before/after metrics | compareRuns | baseline + replay encounter | comparison | WIRED |
| Same scenario | scenario.id | baseline/replay | comparison label | WIRED |
| Frozen opponent | firstRunConfig opponentSeed/profile | replay config | same B actor/profile | WIRED |
| One-node edit | replayTargetNodeId | replay state | locks every other node | WIRED |

## 4. BRAIN node semantic registry

`NODE_SPECS` must be the single semantic owner of title, family, description, defaults and slice availability. UI must not maintain a second hand-written subtitle map.

| Type | Family | Parameter | Runtime meaning | Current slice |
| --- | --- | --- | --- | --- |
| `criticism` | TRIGGER | — | exact entry event for current scenario | ACTIVE |
| `ignore` | TRIGGER | — | exact entry event when IGNORE is emitted | NOT EMITTED in current scenario |
| `resentment` | STATE | delta, cap | memory + TENSION/BRAIN/target CONTACT semantics | ACTIVE |
| `trust` | STATE | delta, cap | memory + CONTACT/BRAIN/target CONTACT semantics | ACTIVE |
| `beright` | IMPULSE | weight | path selection + BRAIN/TENSION/target CONTACT | ACTIVE |
| `beliked` | IMPULSE | weight | path selection + CONTACT/TENSION | ACTIVE |
| `understand` | IMPULSE | weight | path selection + BRAIN/CONTACT | ACTIVE |
| `explain` | REACTION | — | ENERGY↓ BRAIN↑ TENSION↑ target CONTACT↓ | ACTIVE |
| `agree` | REACTION | — | BRAIN/TENSION↓ CONTACT↑ | ACTIVE |
| `joke` | REACTION | — | ENERGY↓ BRAIN/TENSION↓ CONTACT↑ | ACTIVE |
| `silent` | REACTION | — | ENERGY↓ BRAIN/TENSION↑ target CONTACT↓ | ACTIVE |
| `pressure` | REACTION | — | ENERGY↓ BRAIN/TENSION↑ target TENSION↑ CONTACT↓ | ACTIVE |
| `repeat` | CONTROL | count | adds repeat cost/effects | PARTIAL semantics |
| `stop` | CONTROL | — | terminates current path downstream | ACTIVE |
| `ifbrain` | CONTROL | threshold | path valid only when BRAIN > threshold | ACTIVE; fallback gap |
| `pause` | ABILITY | — | BRAIN/TENSION↓ CONTACT↑ | ACTIVE |
| `interrupt` | ABILITY | — | no approved special effect | HIDDEN / DORMANT |

## 5. Balance / combat cross-check

### What is deterministic and currently real

Reaction effects:

- EXPLAIN: self `ENERGY -4, BRAIN +8, TENSION +5`; target `TENSION +4, CONTACT -5`.
- AGREE: self `ENERGY -2, BRAIN -2, TENSION -4, CONTACT +4`; target `TENSION -3, CONTACT +5`.
- JOKE: self `ENERGY -3, BRAIN -1, TENSION -5, CONTACT +5`; target `TENSION -4, CONTACT +4`.
- SILENT: self `ENERGY -1, BRAIN +2, TENSION +2`; target `CONTACT -3`.
- PRESSURE: self `ENERGY -5, BRAIN +6, TENSION +8`; target `TENSION +9, CONTACT -8`.

Impulse effects:

- BE RIGHT: self `BRAIN +2, TENSION +2`; target `CONTACT -1`.
- BE LIKED: self `CONTACT +2, TENSION -1`; target `CONTACT +1`.
- UNDERSTAND: self `BRAIN +1, CONTACT +3`; target `TENSION -1, CONTACT +2`.

REPEAT additional cost per extra repeat:

- self `ENERGY -2, BRAIN +5, TENSION +2`;
- target `CONTACT -2, TENSION +2`.

PAUSE:

- self `BRAIN -5, TENSION -7, ENERGY -1`;
- target `TENSION -3, CONTACT +3`.

### Balance risks requiring product/playtest decision

1. **No explicit win state.** Without success semantics, “balance” can only be measured as survival/damage, not objective achievement.
2. **Path score is not objective-aware.** Branch selection is driven mainly by impulse weight/state score, not by whether a reaction helps the current objective. This may be correct for “character behaves according to its brain”, but it means there is no strategic AI optimizing CONTACT.
3. **AGREE/JOKE are structurally much safer for CONTACT than PRESSURE/EXPLAIN.** That is fine if the game is about consequences, but must be playtested so one obvious “good build” does not dominate discovery.
4. **REPEAT currently acts as a multiplier/cost, not a conditional replay event.** Balance numbers cannot be finalized until its semantic trigger is settled.
5. **STATE controls only add positive memory.** Product spec allows state increase/decrease/compare in the wider alphabet; current slice intentionally implements less.
6. **Opponent and player both process repeated CRITICISM.** Until reaction→trigger propagation exists, “combat” does not yet test full graph-to-graph causality.

## 6. Model fields declared but not yet operational

From the wider Character/BehaviorGraph contract, these are not currently complete in the vertical slice:

- `Character.discoveries[]` — created empty, never written/read.
- `Character.history[]` — created empty, never written/read.
- `Character.face` — object exists but visual face is currently derived by renderer/state rather than persisted as authored Character state.
- `BehaviorGraph.entryRules[]` — architecture field not represented in runtime graph object.
- `BehaviorGraph.runtimeState` — architecture field not represented as a first-class graph object.
- `Scenario.resultRules` — architecture field absent; likely related to missing objective success semantics.
- broader trigger alphabet (`QUESTION`, `INTERRUPTION`, etc.) — not implemented in current model.
- broader reaction alphabet (`LEAVE`, `ASK`, `ARGUE`) — not implemented in current model.
- broader ability alphabet (`ADMIT ERROR`, `CHANGE MIND`, `REFRAME`, `SEE OTHER PERSPECTIVE`) — not implemented in current model.

These are not automatically bugs: they are **outside the current vertical slice unless exposed by the UI**. They become bugs only if the interface claims they exist.

## 7. Acceptance gate for this audit

Before calling the semantic layer clean:

- every visible text/value is derived from a real field or intentionally static explanatory copy;
- player name is user-editable and reaches Character/TALK/RESULT/replay;
- scenario title/premise/objective/limit have one source;
- node title/description/default/availability have one source (`NODE_SPECS`);
- unsupported node types are not offered as functional choices;
- current-scenario trigger picker does not offer triggers that cannot fire;
- no empty/dead UI containers remain;
- objective success semantics are explicitly decided or visibly marked as unresolved internally;
- reaction→trigger collision semantics are explicitly decided or visibly marked as unresolved internally;
- dialogue receives the context promised by the architecture;
- REPEAT semantics match both copy and runtime;
- `BRAIN >` no-path behavior cannot crash a run;
- deterministic QA + phone-sized browser smoke cover the above invariants.
