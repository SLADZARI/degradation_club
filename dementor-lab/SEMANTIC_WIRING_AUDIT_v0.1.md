# DEMENTOR LAB — Semantic Wiring Audit v0.1

**Status:** ACTIVE QA / implementation registry  
**Date:** 2026-09-02  
**Implementation branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product source:** `dementor-club` (`PRODUCT_FLOW_INTERACTION_SPEC_v0.3` + `GAME_ARCHITECTURE_V0.1`)

## Audit invariant

Every visible control, label, value and gameplay attribute must have a complete chain:

`UI → semantic field → storage/owner → runtime meaning → observable output/result`

Statuses: `WIRED`, `PARTIAL`, `UNWIRED`, `DORMANT`, `DECISION_GAP`, `SOT_CONFLICT`.

## P0 cross-check

| Area | Current state | Status | Next rule/action |
| --- | --- | --- | --- |
| Player identity | PERSON now has required `player-name`; value is stored locally, reaches `Character.name`, TALK and replay. | WIRED | Keep browser regression. |
| Scenario copy | title/premise/objective/turnLimit now render from `CRITICISM_IDEA_SCENARIO`; hardcoded “Гена” removed. | WIRED | Result wording must later use same objective contract. |
| Objective CONTACT | `objective='contact'` currently makes CONTACT=0 terminal, but there is no `OBJECTIVE_COMPLETE` or explicit success threshold. | DECISION_GAP / P0 | SOT says KEEP CONTACT = complete encounter with Contact above threshold. Threshold/result wording must be approved before coding. |
| Objective scope | Approved flow v0.3 requires at least two objective contracts; implementation has only CONTACT. | SOT_CONFLICT / P0 | Add second approved objective only after current semantic hardening. |
| Two-graph collision | Both actors have real graphs, but every turn still receives `openingTrigger='criticism'`. Previous reaction does not emit next Trigger. | PARTIAL / P0 | Define deterministic reaction/event → next-trigger mapping in SOT. |
| Dialogue | Phrase resolver still receives only `reaction + turn`; architecture requires impulse/scenario/metrics/memory/recent transcript context. | PARTIAL / P0 | Wire full deterministic dialogue context; graph remains cause. |
| REPEAT | `count` increases repeat cost/effects, but runtime has no “answer accepted/not accepted” signal. | PARTIAL / P0 | Either define acceptance event or keep copy strictly as multiplier/cost semantics. |
| BRAIN > | Real gate now works; if every path is closed, runtime throws no-executable-reaction. | PARTIAL / P0 | Define deterministic no-path outcome/fallback. |
| Breakpoint CONTACT | Current detector checks predicted **self** CONTACT while many hostile actions damage **target** CONTACT. | PARTIAL / P0 | Test/decide whether contact-risk breakpoint tracks actor, target, or shared scenario contact. |
| HOT PATCH ownership | Patch is applied to `bp.actorId`; a breakpoint caused by opponent B can therefore expose edits to the opponent graph. | DECISION_GAP / P0 | Decide whether first-slice player may patch opponent or only player A. |
| Breakdown acting | cause-specific renderer existed but controller did not invoke it. Controller now calls `renderer.breakdown()` for the losing actor. | WIRED | Add regression proving cause-specific terminal render. |
| Speaking animation | Renderer reacts to metrics, but not current speaking/reaction intent. | PARTIAL | SOT requires speaking/state-driven animation. |
| BRAIN interaction model | Approved v0.3 says free canvas + pan/pinch/ports + bottom-sheet inspector. Current implementation is vertical stack/reorder/bracket edges. | SOT_CONFLICT / P0 | Do not silently revert. Product SOT must be updated if stack BRAIN is now the approved mechanism. |
| SETUP interaction model | Approved v0.3 says transient overlay/bottom sheet over TALK; implementation is separate SETUP workspace. | SOT_CONFLICT | Confirm/update SOT after UX decision. |

## UI field registry

### PERSON

| UI | Semantic owner | Storage/runtime | Status |
| --- | --- | --- | --- |
| Player name | `Character.name` | localStorage → actors A → transcript/TALK/replay | WIRED |
| Character 01/02 | `visual.characterId` | current run + replay config → renderer/body rig | WIRED |
| Headgear | `hatVariant` | appearance state → renderer | WIRED |
| Glasses | `glassesVariant` | appearance state → renderer | WIRED |
| Moustache/beard | `facialHairVariant` | appearance state → renderer; character-02 authored asymmetry | WIRED |
| Accessory | `accessoryVariant` | appearance state → renderer | WIRED |
| Outfit | `outfitVariant` | body-owned appearance → renderer | WIRED where manifest supports |
| Shoes | `shoesVariant` | body-owned appearance → renderer | WIRED |
| Appearance colors | `colors.*` | model + renderer support, no user controls | DORMANT |
| Reset appearance | appearance buckets | resets real appearance state | WIRED |
| Fake “СКЕЛЕТ” editor copy | no field | removed | FIXED |

### BRAIN

`NODE_SPECS` is now the single owner of node `family`, `title`, `description`, defaults and slice availability. The old duplicate subtitle map is removed.

| Type | Family | Parameter | Real runtime meaning | Status |
| --- | --- | --- | --- | --- |
| criticism | TRIGGER | — | exact entry trigger for current scenario | WIRED |
| ignore | TRIGGER | — | valid global trigger but current scenario never emits it; hidden from current picker | DORMANT here |
| resentment | STATE | delta/cap | persistent memory; TENSION/BRAIN↑, target CONTACT↓ | WIRED |
| trust | STATE | delta/cap | persistent memory; CONTACT↑, BRAIN↓ | WIRED |
| beright | IMPULSE | weight 1–5 | path score + BRAIN/TENSION↑ + target CONTACT↓ | WIRED |
| beliked | IMPULSE | weight 1–5 | path score + CONTACT support | WIRED |
| understand | IMPULSE | weight 1–5 | path score + CONTACT support + small BRAIN cost | WIRED |
| explain | REACTION | — | ENERGY↓, BRAIN/TENSION↑, target CONTACT↓ | WIRED |
| agree | REACTION | — | TENSION↓, CONTACT↑ | WIRED |
| joke | REACTION | — | TENSION↓, CONTACT↑, ENERGY cost | WIRED |
| silent | REACTION | — | small ENERGY/BRAIN/TENSION cost, target CONTACT↓ | WIRED |
| pressure | REACTION | — | strong TENSION↑ and target CONTACT↓ | WIRED |
| repeat | CONTROL | count 1–5 | additional repeat cost/effects | PARTIAL semantic contract |
| stop | CONTROL | — | terminates downstream traversal | WIRED |
| ifbrain | CONTROL | threshold | branch allowed only when BRAIN > threshold | WIRED; no-path gap |
| pause | ABILITY | — | BRAIN/TENSION↓, target CONTACT↑ | WIRED |
| interrupt | ABILITY | — | no approved special runtime semantics; explicitly unavailable in slice | DORMANT |

BRAIN editor controls:
- add/delete/connect/reorder mutate the real `currentBrainGraph`;
- user-created edges are tagged `uiManual` and survive reorder;
- invalid family links, duplicates, self-links and explicit cycles are rejected;
- current-scenario picker does not offer triggers that cannot fire;
- empty `brain-inspector` / `brain-editor` placeholders were removed;
- replay locks every node except one exact `replayTargetNodeId`.

### SETUP

| UI | Owner | Status |
| --- | --- | --- |
| Scenario title | `Scenario.title` | WIRED |
| Premise | `Scenario.premise` | WIRED |
| Objective label | `Scenario.objectiveLabel` | WIRED display / PARTIAL rules |
| End text | `Scenario.turnLimit` + breakdown | WIRED display |
| Opponent name | seeded `opponentProfile.name` | WIRED |
| Opponent behavior label/description | opponent preset metadata | WIRED |
| Opponent seed | deterministic internal seed, currently displayed as `SEED` | WIRED technically; questionable player value |
| Reroll | new seed/profile | WIRED; frozen after baseline |
| AUTO / STEP | Encounter mode | WIRED |

### TALK

| UI/data | Owner/effect | Status |
| --- | --- | --- |
| Actor names | `Character.name` | WIRED |
| Turn | `Encounter.turn` | WIRED |
| ENERGY | Character state; reaction/repeat/pause; terminal at 0 | WIRED |
| BRAIN | Character state; gates, breakpoint, breakdown | WIRED |
| TENSION | Character state + renderer mapping | WIRED |
| CONTACT | Character state + contact breakdown | WIRED / objective success unresolved |
| Dialogue | `transcript.phrase` | PARTIAL: context underwired |
| Delta | trace metric deltas + memory | PARTIAL: UI currently shows only first memory change |
| TRACE | `ExecutionTrace` | PARTIAL: current overlay exposes raw internal IDs/types |
| Character acting | metric→face/body | PARTIAL: speaking/reaction animation missing |
| Cause-specific collapse | terminal reason → renderer.breakdown | WIRED after audit fix |

### HOT PATCH

Approved four classes are implemented:
- reduce impulse weight;
- reduce repeat count;
- insert PAUSE;
- change one compatible connection.

Patch preserves turn, metrics, memory and transcript. `hotPatchUsed` is Encounter-global, so only one patch opportunity exists for both actors combined. This matches the “one patch opportunity” wording, but actor ownership still needs a product decision.

### RESULT / REPLAY

- Result cause uses actual player A trace in causal order — WIRED.
- suspicious node is exact A `nodeId` — WIRED.
- same scenario/opponent/appearance/graph baseline is frozen — WIRED.
- one-node counterfactual lock — WIRED.
- BEFORE/AFTER compares A metrics — WIRED.
- objective-specific success language — UNWIRED / decision gap.
- discovery output — DORMANT.

## Balance / “combat” snapshot

Current deterministic reaction deltas:
- EXPLAIN: self `ENERGY -4, BRAIN +8, TENSION +5`; target `TENSION +4, CONTACT -5`.
- AGREE: self `ENERGY -2, BRAIN -2, TENSION -4, CONTACT +4`; target `TENSION -3, CONTACT +5`.
- JOKE: self `ENERGY -3, BRAIN -1, TENSION -5, CONTACT +5`; target `TENSION -4, CONTACT +4`.
- SILENT: self `ENERGY -1, BRAIN +2, TENSION +2`; target `CONTACT -3`.
- PRESSURE: self `ENERGY -5, BRAIN +6, TENSION +8`; target `TENSION +9, CONTACT -8`.

Impulses:
- BE RIGHT: self `BRAIN +2, TENSION +2`; target `CONTACT -1`.
- BE LIKED: self `CONTACT +2, TENSION -1`; target `CONTACT +1`.
- UNDERSTAND: self `BRAIN +1, CONTACT +3`; target `TENSION -1, CONTACT +2`.

Extra REPEAT: self `ENERGY -2, BRAIN +5, TENSION +2`; target `CONTACT -2, TENSION +2` per extra repeat.  
PAUSE: self `BRAIN -5, TENSION -7, ENERGY -1`; target `TENSION -3, CONTACT +3`.

Balance is **not final** while objective success, repeat acceptance and graph-to-graph event propagation are unresolved. Current numbers make AGREE/JOKE structurally safer for CONTACT than EXPLAIN/PRESSURE; that is a valid consequence system but needs FUN/playtest evidence before tuning.

## Declared model fields not operational in current slice

- `Character.discoveries[]` — never written/read.
- `Character.history[]` — never written/read.
- authored `Character.face` persistence — renderer derives face from state.
- `BehaviorGraph.entryRules[]` — not first-class runtime data.
- `BehaviorGraph.runtimeState` — not first-class runtime data.
- `Scenario.resultRules` — absent; likely required for objective completion.
- broader triggers/reactions/abilities from architecture — intentionally not all implemented.

These are not bugs unless exposed as working UI.

## Acceptance gate

Semantic layer is not “clean” until:
1. every visible value has a real owner;
2. objective rules and result wording agree;
3. at least the required objective contracts exist;
4. previous reaction/event propagation is resolved or SOT explicitly narrows “two graphs collide”;
5. dialogue receives the deterministic context promised by architecture;
6. REPEAT copy and engine mean the same thing;
7. BRAIN > cannot crash on no-path;
8. HOT PATCH actor ownership is explicit;
9. TRACE is human-readable, not internal IDs;
10. speaking/reaction and terminal acting are wired;
11. stack-vs-free-canvas and SETUP-screen-vs-overlay conflicts are resolved in `dementor-club` SOT;
12. deterministic QA + phone-sized browser smoke are green;
13. physical iPhone Safari + Android Chrome remain a separate gate.
