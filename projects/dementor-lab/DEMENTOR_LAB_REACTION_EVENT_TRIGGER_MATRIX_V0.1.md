# DEMENTOR LAB — Reaction → Event → Trigger Matrix v0.1

**STATUS:** GAME-DESIGN PROPOSAL / NOT YET PRODUCTION-APPROVED  
**DATE:** 2026-09-02  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**DEPENDS ON:** `DEMENTOR_LAB_RUNTIME_SEMANTIC_DECISIONS_V0.1.md`

Purpose: make the central mechanic **Two graphs collide** real without making dialogue text causal.

Invariant:

> `REACTION → WORLD EVENT → RECEIVER TRIGGER → RECEIVER GRAPH`

Dialogue is rendered after the causal step and never decides the event.

---

## 1. Why Event exists between Reaction and Trigger

Directly mapping `EXPLAIN → CRITICISM` is semantically false. A Character may explain something, but the other Character can receive that as a counter-position/pushback rather than literal criticism.

The three concepts therefore remain separate:

- **Reaction** — what the acting Character does;
- **World Event** — what objectively happened in the exchange;
- **Trigger** — the graph entry signal available to the receiving Character.

For the first slice, mapping can be deterministic and mostly one-to-one. Keeping Event separate prevents the game from later coupling text copy to behavior logic.

---

## 2. Proposed first-slice event alphabet

Scenario opening event:

- `CRITICISM` — the scenario/opponent criticizes the idea.

Reaction-generated events:

- `COUNTERPOINT` — an explanation/counter-position was put forward;
- `ACCEPTANCE` — the previous position was explicitly accepted;
- `DEFLECTION` — tension/topic was redirected through a joke;
- `NO_RESPONSE` — no substantive answer was given;
- `PRESSURE` — the actor directly pushed/demanded an answer.

This is intentionally small. It is not a content pack.

---

## 3. Proposed matrix

| Acting Reaction | Emits World Event | Receiver Trigger | Meaning to receiver | REPEAT acceptance |
| --- | --- | --- | --- | --- |
| `EXPLAIN` | `COUNTERPOINT` | `PUSHBACK` | «Мне ответили своей версией / возразили» | NOT ACCEPTED |
| `AGREE` | `ACCEPTANCE` | `ACCEPTANCE` | «Мою позицию приняли» | **ACCEPTED** |
| `JOKE` | `DEFLECTION` | `DEFLECTION` | «От темы ушли в шутку / разрядили» | NOT ACCEPTED |
| `SILENT` | `NO_RESPONSE` | `IGNORE` | «Мне не ответили» | NOT ACCEPTED |
| `PRESSURE` | `PRESSURE` | `PRESSURE` | «На меня давят / требуют ответа» | NOT ACCEPTED |

Opening Scenario:

| Source | World Event | Receiver Trigger |
| --- | --- | --- |
| `КРИТИКА ИДЕИ` opening | `CRITICISM` | `CRITICISM` |

### Why only AGREE accepts

For v0.1, acceptance must be **observable and deterministic**. Silence, a joke, a counter-explanation or pressure do not prove that the previous reaction was accepted. Therefore only `AGREE → ACCEPTANCE` cancels a pending REPEAT.

This may later expand to explicit scenario-specific acceptance events, but dialogue wording never counts as acceptance.

---

## 4. Proposed REPEAT execution rule

`REPEAT ×N` means **maximum total attempts including the first execution**.

Example:

`EXPLAIN → REPEAT ×3`

means:

1. EXPLAIN executes once and emits `COUNTERPOINT`.
2. Runtime stores a pending repeat intent with `remaining = 2`.
3. The other Character reacts to the event through their own graph.
4. If that response emits `ACCEPTANCE`, pending repeat is cancelled.
5. Otherwise, on the original Character's next activation, the stored Reaction executes again before normal trigger traversal.
6. Repeat ends when accepted or the count is exhausted.

Important consequence:

A repeating Character may ignore a new incoming event and continue the same Reaction. That is intentional and makes REPEAT a visible behavioral cause rather than a hidden damage multiplier.

The incoming event is still recorded in trace/history even when pending REPEAT takes precedence.

---

## 5. Proposed CONTACT objective contract

### 5.1 Relationship health

Do not average two CONTACT values. A relationship is compromised when either participant no longer remains in contact.

Derived objective value:

`RELATIONSHIP_CONTACT = min(A.contact, B.contact)`

This does **not** create a new persistent metric. It is an objective calculation from two existing Character states.

### 5.2 Proposed semantic bands

Use existing renderer/runtime boundaries as the first tuning anchor:

- `50–100` — contact is comfortably present;
- `25–49` — contact is strained but maintained;
- `1–24` — technical contact remains, but the objective is not successfully maintained;
- `0` — CONTACT breakdown.

### 5.3 Proposed win rule

For `CONTACT / СОХРАНИТЬ КОНТАКТ`:

- Encounter must reach its configured turn limit;
- neither Character may have broken down;
- `min(A.contact, B.contact) >= 25` at completion.

Then terminal result is `OBJECTIVE_COMPLETE`.

If the run reaches the limit with relationship contact `1–24`, the experiment ends without breakdown but **objective is failed**.

Why 25 is proposed rather than invented from nowhere: current visual semantics already treat `CONTACT <= 25` as a visibly closed/tense state. The exact threshold remains balance-tunable after playtest, but the contract should use one explicit boundary.

---

## 6. Proposed closed-condition (`BRAIN >`) rule

Use two layers: authoring safety + runtime safety.

### 6.1 Authoring rule

A graph containing a conditional route must have at least one executable fallback route for the same reachable trigger.

Human diagnosis:

> **ЕСЛИ УСЛОВИЕ НЕ СРАБОТАЕТ, ОН ЗАВИСНЕТ. ДОБАВЬ ЗАПАСНУЮ РЕАКЦИЮ.**

START stays disabled until a fallback exists.

This makes `BRAIN >` behave like real logic rather than a gamble that can crash the simulation.

### 6.2 Runtime safety

If a malformed/legacy/hot-patched graph still reaches a state with no executable Reaction:

- do not throw an uncaught game error;
- record `NO_ACTION / CONDITION_BLOCKED` in ExecutionTrace;
- consume the actor turn with **no hidden metric changes**;
- emit World Event `NO_RESPONSE` to the other Character;
- dialogue may render `…`, but `SILENT` is not silently inserted as a fake graph node.

This preserves causality: the cause was a blocked condition, not an invisible reaction.

---

## 7. Proposed collision loop

First turn:

`Scenario CRITICISM → A.Trigger(CRITICISM) → A.Graph → A.Reaction → Event`

Next turn:

`Event → B.Trigger → B.Graph → B.Reaction → Event`

Then:

`Event → A.Trigger → A.Graph ...`

Exception:

If A has an active pending REPEAT and the last B event did not accept it, A executes the pending repeated Reaction before normal trigger traversal.

This is the minimal system that makes two real BehaviorGraphs causally interact.

---

## 8. Minimal trigger additions required if approved

Current implementation only exposes `CRITICISM` and `IGNORE`. This proposal requires adding four small first-slice triggers:

- `PUSHBACK`;
- `ACCEPTANCE`;
- `DEFLECTION`;
- `PRESSURE`.

`IGNORE` remains the receiver Trigger for `NO_RESPONSE`.

These triggers require concise node descriptions and authored fallback entries in player/opponent graphs. They are semantic infrastructure for collision, not a new scenario/content pack.

---

## 9. Game-design consequences

If approved, this single matrix resolves four previously separate problems:

1. **Two graphs collide** — next Trigger comes from the previous Reaction's Event.
2. **REPEAT becomes real** — `ACCEPTANCE` cancels it; other events do not.
3. **CONTACT objective becomes measurable** — both actors matter via minimum CONTACT.
4. **Closed BRAIN conditions become understandable** — fallback is required, with transparent NO_ACTION safety only for malformed cases.

It also gives deterministic Dialogue Layer a clean input: dialogue may describe the Reaction/Event/state, but cannot change them.

---

## 10. Approval questions

Before production implementation, approve or modify:

1. Event/Trigger names and the five-row matrix.
2. Only `AGREE → ACCEPTANCE` cancels REPEAT in v0.1.
3. REPEAT count means total attempts including first.
4. CONTACT uses `min(A.contact,B.contact)`.
5. CONTACT success baseline is `>=25` at turn limit.
6. Every conditional graph requires an unconditional fallback route.
7. Runtime malformed no-path becomes transparent `NO_ACTION → NO_RESPONSE`, with no hidden metric effects.
