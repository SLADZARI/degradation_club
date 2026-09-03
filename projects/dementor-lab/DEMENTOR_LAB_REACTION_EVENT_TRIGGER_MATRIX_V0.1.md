# DEMENTOR LAB — Reaction → Event → Trigger Matrix v0.1

**STATUS:** APPROVED FOR VERTICAL-SLICE IMPLEMENTATION  
**DATE:** 2026-09-03  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**DEPENDS ON:** `DEMENTOR_LAB_RUNTIME_SEMANTIC_DECISIONS_V0.1.md`

Purpose: make the central mechanic **Two graphs collide** real without making dialogue text causal.

Invariant:

> `REACTION → WORLD EVENT → RECEIVER TRIGGER → RECEIVER GRAPH`

Dialogue is rendered after the causal step and never decides the event.

---

## 1. Event layer

Reaction, Event and Trigger are separate semantic layers:

- **Reaction** — what the acting Character does;
- **World Event** — what objectively happened in the exchange;
- **Trigger** — the graph entry signal available to the receiving Character.

Do not map visible dialogue wording directly to gameplay state.

---

## 2. First-slice event alphabet

Scenario opening event:

- `CRITICISM` — the scenario/opponent criticizes the idea.

Reaction-generated events:

- `COUNTERPOINT` — an explanation/counter-position was put forward;
- `ACCEPTANCE` — the previous position was explicitly accepted;
- `DEFLECTION` — tension/topic was redirected through a joke;
- `NO_RESPONSE` — no substantive answer was given;
- `PRESSURE` — the actor directly pushed/demanded an answer.

This is intentionally small. It is semantic infrastructure, not a content pack.

---

## 3. Approved matrix

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

For v0.1 only `AGREE → ACCEPTANCE` cancels a pending REPEAT. Silence, joke, counter-explanation and pressure do not prove acceptance. Dialogue wording never counts as acceptance.

---

## 4. Approved REPEAT rule

`REPEAT ×N` means **maximum total attempts including the first execution**.

Example `EXPLAIN → REPEAT ×3`:

1. EXPLAIN executes once and emits `COUNTERPOINT`.
2. Runtime stores pending repeat with `remaining = 2`.
3. The other Character reacts through their own graph.
4. If that response emits `ACCEPTANCE`, pending repeat is cancelled.
5. Otherwise, on the original Character's next activation, the stored Reaction executes again before normal trigger traversal.
6. Repeat ends when accepted or the count is exhausted.

The incoming event is still recorded in trace/history even when pending REPEAT takes precedence.

---

## 5. Approved CONTACT objective contract

Relationship health is derived from existing Character states:

`RELATIONSHIP_CONTACT = min(A.contact, B.contact)`

This is not a new persistent metric.

Semantic bands for the first tuning pass:

- `50–100` — contact comfortably present;
- `25–49` — strained but maintained;
- `1–24` — technical contact remains, but objective is not successfully maintained;
- `0` — CONTACT breakdown.

For `CONTACT / СОХРАНИТЬ КОНТАКТ`:

- Encounter reaches configured turn limit;
- neither Character has broken down;
- `min(A.contact, B.contact) >= 25` at completion;
- terminal result is `OBJECTIVE_COMPLETE`.

If the limit is reached with relationship contact `1–24`, the Encounter ends without breakdown but the objective fails.

The threshold 25 is balance-tunable after playtest, but it is the explicit first-slice contract because current visual semantics already mark CONTACT around this boundary as closed/tense.

---

## 6. Approved closed-condition (`BRAIN >`) rule

Use authoring safety plus runtime safety.

### 6.1 Authoring rule

A reachable conditional route must have at least one executable unconditional fallback route for the same trigger.

Human diagnosis:

> **ЕСЛИ УСЛОВИЕ НЕ СРАБОТАЕТ, ОН ЗАВИСНЕТ. ДОБАВЬ ЗАПАСНУЮ РЕАКЦИЮ.**

START remains disabled until a fallback exists.

### 6.2 Runtime safety

If malformed/legacy/hot-patched content still produces no executable Reaction:

- do not throw an uncaught gameplay error;
- record `NO_ACTION / CONDITION_BLOCKED` in ExecutionTrace;
- consume the actor turn with no hidden metric changes;
- emit World Event `NO_RESPONSE`;
- receiver gets Trigger `IGNORE`;
- dialogue may render `…`, but SILENT is not inserted as a hidden graph node.

---

## 7. Approved collision loop

First turn:

`Scenario CRITICISM → A.Trigger(CRITICISM) → A.Graph → A.Reaction → Event`

Next turn:

`Event → B.Trigger → B.Graph → B.Reaction → Event`

Then:

`Event → A.Trigger → A.Graph ...`

Exception: an active pending REPEAT takes precedence on the original Character's next activation unless the intervening response emitted `ACCEPTANCE`.

---

## 8. Trigger additions required

Add four first-slice triggers:

- `PUSHBACK`;
- `ACCEPTANCE`;
- `DEFLECTION`;
- `PRESSURE`.

`IGNORE` remains the receiver Trigger for `NO_RESPONSE`; `CRITICISM` remains the opening trigger.

All new Trigger nodes require concise descriptions and real authored paths in graphs that are expected to handle those events.

---

## 9. HOT PATCH ownership

Existing approved rule remains: the player may patch only Character A. Opponent-side breakpoints may be shown as information but never grant direct editing of generated opponent B.

---

## 10. Implementation gate

Before balance tuning:

1. event propagation works deterministically;
2. both actors receive previous Reaction-derived triggers;
3. REPEAT persists across turns and cancels only on ACCEPTANCE;
4. CONTACT objective emits objective complete/fail at the turn limit;
5. conditional fallback is validated;
6. malformed no-path produces transparent NO_ACTION rather than an exception;
7. player HOT PATCH never edits generated opponent B;
8. deterministic/runtime/browser regression tests cover all of the above.
