# DEMENTOR LAB — Semantic Wiring Audit v0.1

**Status:** ACTIVE QA / implementation registry  
**Updated:** 2026-09-03  
**Implementation branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product source:** `dementor-club`

## Audit invariant

Every visible control, label, value and gameplay attribute must complete:

`UI → semantic field → storage/owner → runtime meaning → observable output/result`

Statuses: `WIRED`, `PARTIAL`, `DORMANT`, `DECISION_GAP`, `PHYSICAL_QA_PENDING`.

## Current semantic closure

| Area | Current state | Status |
| --- | --- | --- |
| Player identity | Required PERSON name → local state → `Character.name` → TALK/replay | WIRED |
| Visual character | exact body + appearance state → CharacterRenderer | WIRED |
| BRAIN interaction | approved vertical stack/metro editor, real nodes/edges, manual branches survive reorder | WIRED |
| Scenario copy | title/premise/objective/turn limit all come from Scenario | WIRED |
| SETUP | approved separate mobile screen | WIRED |
| Reaction collision | Reaction → World Event → next actor Trigger | WIRED |
| REPEAT | pending cross-turn repeat, cancelled only by ACCEPTANCE, count includes first attempt | WIRED |
| CONTACT objective | relationship contact = `min(A,B)`; Scenario owns threshold 25; objective complete/fail at limit | WIRED / balance-tunable |
| BRAIN > | real condition + required unconditional fallback; malformed runtime becomes NO_ACTION/NO_RESPONSE | WIRED |
| HOT PATCH ownership | only Character A editable; generated opponent B never patchable | WIRED |
| Dialogue | deterministic phrase renderer, 5–8-budget contract, contextual state/impulse/memory/recent transcript, no random | WIRED |
| Cause-specific breakdown | terminal reason → renderer.breakdown | WIRED |
| Result/replay | actual trace → exact A node → one-node counterfactual → before/after | WIRED |
| TRACE presentation | causal data exists; remaining UI should use human labels everywhere | PARTIAL |
| Speaking/reaction animation | metric-driven acting exists, explicit current-speaking/reaction gesture layer incomplete | PARTIAL |
| Second objective | not selected yet; defer until core collision loop physical QA | DECISION_GAP |
| Physical devices | browser-sized automation is not physical Safari/Chrome evidence | PHYSICAL_QA_PENDING |

## Approved first-slice causal alphabet

### Triggers
- `criticism` — КРИТИКА
- `pushback` — ВОЗРАЖЕНИЕ
- `acceptance` — ПРИНЯТО
- `deflection` — УШЛИ В СТОРОНУ
- `ignore` — ИГНОР / НЕТ ОТВЕТА
- `underpressure` — ДАВЛЕНИЕ

`underpressure` is the implementation node id for semantic Trigger PRESSURE because Reaction `pressure` already owns that machine key.

### Reaction → Event → Trigger

| Reaction | Event | Receiver Trigger | Accepts pending REPEAT |
| --- | --- | --- | --- |
| EXPLAIN | COUNTERPOINT | PUSHBACK | no |
| AGREE | ACCEPTANCE | ACCEPTANCE | yes |
| JOKE | DEFLECTION | DEFLECTION | no |
| SILENT | NO_RESPONSE | IGNORE | no |
| PRESSURE | PRESSURE | PRESSURE (`underpressure`) | no |

Dialogue renders this causal result; dialogue never changes it.

## BRAIN node registry

`NODE_SPECS` is the single semantic owner of title, family, description, defaults and slice availability.

| Type | Family | Runtime meaning | Status |
| --- | --- | --- | --- |
| criticism | TRIGGER | scenario opening criticism | WIRED |
| pushback | TRIGGER | previous actor counter-position | WIRED |
| acceptance | TRIGGER | explicit agreement/acceptance | WIRED |
| deflection | TRIGGER | joke/deflection response | WIRED |
| ignore | TRIGGER | no substantive response | WIRED |
| underpressure | TRIGGER | receiver is being pressured | WIRED |
| resentment | STATE | persistent resentment memory + state effects | WIRED |
| trust | STATE | persistent trust memory + state effects | WIRED |
| beright | IMPULSE | weighted BE RIGHT branch + metric effects | WIRED |
| beliked | IMPULSE | weighted BE LIKED branch + contact support | WIRED |
| understand | IMPULSE | weighted UNDERSTAND branch + contact support | WIRED |
| explain | REACTION | EXPLAIN effects + COUNTERPOINT event | WIRED |
| agree | REACTION | AGREE effects + ACCEPTANCE event | WIRED |
| joke | REACTION | JOKE effects + DEFLECTION event | WIRED |
| silent | REACTION | SILENT effects + NO_RESPONSE event | WIRED |
| pressure | REACTION | PRESSURE effects + PRESSURE event | WIRED |
| repeat | CONTROL | repeat same Reaction on later own activations until accepted/exhausted | WIRED |
| stop | CONTROL | stop downstream branch traversal | WIRED |
| ifbrain | CONTROL | route only when BRAIN exceeds threshold | WIRED |
| pause | ABILITY | BRAIN/TENSION relief + CONTACT support | WIRED |
| interrupt | ABILITY | no approved first-slice semantics | DORMANT / hidden |

## Objective CONTACT

Source: `Scenario.objectiveRules.minRelationshipContact`.

Derived objective value:

`RELATIONSHIP_CONTACT = min(A.contact, B.contact)`

First tuning contract:
- 50–100: contact present;
- 25–49: strained but maintained;
- 1–24: conversation technically continues but objective failed;
- 0: CONTACT breakdown.

At turn limit:
- relationship contact >= configured threshold → `OBJECTIVE_COMPLETE`;
- relationship contact below threshold but >0 → `OBJECTIVE_FAILED`;
- breakdown conditions remain terminal earlier.

Threshold is a Scenario field, not a UI/runtime magic number.

## REPEAT

`REPEAT ×N` means maximum total attempts including the first Reaction.

Runtime owns `pendingRepeats.A/B`.
- first execution schedules `N-1` remaining attempts;
- other Character receives emitted Event/Trigger and takes a real graph turn;
- ACCEPTANCE cancels the original Character's pending repeat;
- otherwise the original Character repeats the stored Reaction on its next activation before normal trigger traversal;
- incoming trigger remains visible in trace even when repeat takes precedence;
- repeated attempt does not silently re-run memory/impulse path as though a new cause had been traversed.

## Conditional safety

Authoring:
- conditional route requires an unconditional fallback route from the same trigger;
- otherwise validation: `NO_CONDITION_FALLBACK`;
- message: `ЕСЛИ УСЛОВИЕ НЕ СРАБОТАЕТ, ОН ЗАВИСНЕТ. ДОБАВЬ ЗАПАСНУЮ РЕАКЦИЮ.`

Runtime safety for malformed/legacy content:
- no uncaught error;
- `NO_ACTION` trace;
- no hidden metric effects;
- emits `NO_RESPONSE` → receiver Trigger `IGNORE`;
- never inserts a fake SILENT node.

## HOT PATCH

Allowed classes remain:
- reduce impulse weight;
- reduce repeat count;
- insert PAUSE;
- rewire one compatible edge.

Ownership:
- only Character A may be mutated;
- opponent B breakpoint/risk may be informative but never grants graph editing;
- patch preserves turn, metrics, memory and transcript.

## Dialogue contract

Active Reactions: EXPLAIN / AGREE / JOKE / SILENT / PRESSURE.

- roughly 5–8 authored base phrases per Reaction;
- small contextual replacement set for meaningful extremes;
- resolver may use reaction, impulse, scenario, BRAIN, TENSION, CONTACT, memory, recent transcript and deterministic turn/run context;
- no `Math.random()` phrase choice;
- same meaningful input context reproduces the same phrase;
- text never changes metrics, memory, events, triggers or objectives.

## Remaining real gaps

1. **TRACE UI polish** — eliminate remaining raw IDs/types in player-facing explanation.
2. **Speaking/reaction animation** — distinguish active speaker/reaction intent from metric-only acting without creating hidden gameplay logic.
3. **Mobile density of collision inputs** — presets now contain six real Trigger entries. Mechanics are correct; physical-phone QA must decide whether entry triggers need a collapsed/grouped visual presentation while remaining real nodes.
4. **Second objective** — choose only after the CONTACT collision loop proves fun/readable; avoid adding a new gameplay subsystem just to satisfy a count.
5. **Physical QA** — iPhone Safari and Android Chrome remain separate from automated phone-sized Chromium.

## Automated acceptance gate

Required green checks:
- deterministic collision events;
- next actor consumes prior Event-derived Trigger;
- pending REPEAT persists across turns;
- ACCEPTANCE cancels REPEAT;
- BRAIN conditional fallback validation;
- malformed no-path → transparent NO_ACTION;
- target-side CONTACT risk detection;
- Scenario-owned CONTACT threshold and objective complete/fail;
- generated opponent cannot be HOT PATCHed;
- deterministic dialogue;
- exact replay node identity;
- manual BRAIN edges survive reorder;
- phone-sized browser flow has no page-level horizontal overflow.

Physical device QA remains a separate gate even when automation is green.
