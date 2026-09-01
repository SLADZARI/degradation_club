# DC-9 — Post-Q41 Course Routing v0.4

Status: **DRAFT BEHAVIOR ROUTING / BLIND PLAYTEST REQUIRED / NOT PRODUCTION**  
Date: 2026-09-01  
Branch: `draft/dc9-question-lab`

Related:
- `BANK_V0.6_FULL_54_IMMERSIVE.md`
- `operations/DC9_RESULT_SYSTEM_V0.1.md`
- `courses/dumai-s-opasnostyu-production-stage-1.md`
- `courses/dengi-na-veter.md`
- `courses/ne-komanda.md`
- `courses/slaboumie-i-otvaga.md`

## Decision

The v0.1 prototype heuristic based on average `(3 - answer score)` over broad sphere ranges is **deprecated**.

Course routing after Q41 must be based on **named behavioral signals from concrete DC-9 scenes**, not on a sphere deficit, overall level, psychotype or inferred personality.

Flow remains internally:

`Q41 answer stored → behavioral routing → one course OR no-ad → Q42`

Routing never changes DC-9 evidence, guards, sphere levels or final result.

---

## Core rule

> **Do not use susceptibility to courses as a reason to sell a course.**

Q41 is an anti-exploitation gate. It may only make the router more conservative.

- Q41 `0/1`: user accepted social/FOMO course pressure → require one extra independent signal and one extra routing-strength point.
- Q41 `2/3`: normal evidence gate.
- Q41 never adds affinity to any course.

---

## Public presentation rule

The public advertising sequence is deliberately simple and must not expose routing mechanics.

Do **not** show:
- MATCH percentage;
- routing score;
- question numbers, including `41`;
- internal sphere/question indexing;
- “recommended for you” language;
- explanation that the card was assembled from answers;
- diagnostic reason copy;
- `COMMERCIAL ROUTING` semantics as user-facing explanation.

Routing rationale remains available only in QA/debug data.

### Approved playtest choreography v0.4

When a course is selected:

`routing beat → standalone promo copy for 6 seconds → course card`

The **promo copy is not part of the course card**.

Promo screen:
- shows only the short Dementor/product proposition associated with the selected course;
- is visually dominant;
- remains on screen for **6 seconds**;
- then automatically transitions to the course card;
- does not show the internal question number or routing score.

Course card then shows:
- course title;
- course subtitle / format line;
- `ДЕМЕНТОР КУРСА` + Dementor name;
- primary CTA: `ЗАПИСАТЬСЯ НА КУРС →` for routes where that wording is compatible with the approved public product status;
- secondary action: `НЕ НАДО`.

The course proposition shown during the six-second promo must not be repeated as a large explanatory paragraph inside the course card.

### `НЕ НАДО` secondary path

Current playtest behavior:

`НЕ НАДО → Dementor Club product "НЕ НАДО" → ДАЛЕЕ → Q42`

The `НЕ НАДО` product transition is part of the interaction, not a dismiss/close button.

Until a canonical production URL for the `НЕ НАДО` product is fixed in the club source-of-truth, the playtest may use an internal product screen. Do not invent a production URL.

Clicking any ad/product action must never change DC-9 evidence or result scoring.

---

# Enabled course registry

## VALENTIN — `dumai-s-opasnostyu`

Status: **approved for public production**.  
Dementor: Валентин Лосев.  
Public route: `/courses/dumai-s-opasnostyu/`.

Product territory:
- assumptions;
- facts vs promises;
- weak signals;
- primary sources;
- confirmation bias;
- red lines;
- decisions under risk without turning caution into total inaction.

### Behavioral signals

| Signal | DC-9 scene | Match state | Strength |
|---|---|---:|---:|
| `confirmation_lock` | Q31 confirming headline | `0/1` | 2 |
| `source_distance` | Q33 “scientists proved” repost chain | `0/1` | 2 |
| `position_defense` | Q34 old public position vs new data | `0/1` | 2 |
| `verification_avoidance` | Q35 source check costs an hour | `0/1` | 1 |
| `risk_model_after_loss` | Q36 loss after incomplete-data decision | `0/1` | 1 |
| `reversible_clarity_lock` | Q26 reversible decision before deadline | `0/1` | 1 |

Minimum normal evidence: **3 independent signals / strength ≥ 5**.

Hard contradiction: Q33, Q34, Q35 and Q36 are all `2/3`.

---

## NIKITA — `dengi-na-veter`

Status: **approved concept / digital card-course MVP in development**.  
Dementor: Никита.  
Public route: `/courses/dengi-na-veter/`.

Product territory is **not impulsive spending**. It is the need to rationally justify every spend through necessity, value, optimization, comparison or post-hoc explanation.

### Behavioral signals

| Signal | DC-9 scene | Match state | Strength |
|---|---|---:|---:|
| `utility_cover` | Q14 bad-day purchase made “useful” | exactly `1` | 2 |
| `discount_rationalization` | Q17 rejected item becomes rational under discount | `0/1` | 2 |
| `austerity_over_function` | Q18 “not buying” kept despite household cost | `0/1` | 2 |
| `sunk_cost_defense` | Q16 unused expensive thing kept because of old price | `0/1` | 1 |
| `value_gate` | Q13 upgrade allowed only after utility/value justification | exactly `2` | 1 |

Minimum normal evidence: **2 independent signals / strength ≥ 3**.

Hard contradiction: Q14, Q16, Q17 and Q18 are all `2/3`.

Do not route Nikita merely because the user chose an impulsive purchase. The course is about the **need to make the purchase rational**, not about spending more.

---

## GABIL — `ne-komanda`

Status: **active recurring practice**.  
Dementor: Габиль.  
Public route: `/courses/ne-komanda/`.

Product territory:
- group ≠ team ≠ product;
- meetings without result;
- one person repeatedly acting as the engine;
- process replacing result;
- rescue/hero mode becoming team architecture.

### Behavioral signals

| Signal | DC-9 scene | Match state | Strength |
|---|---|---:|---:|
| `driver_returns` | Q06 failed coordination → “without me impossible” | exactly `1` | 2 |
| `delegation_takeback` | Q08 delegated task is taken back / micromanaged | `0/1` | 1 |
| `process_without_result` | Q09 reports/statuses/meetings but no result | `0/1` | 2 |
| `repeated_heroics` | Q10 recurring rescue night | `0/1` | 2 |
| `rescue_loop` | Q21 repeated help with no execution | `0/1` | 1 |

Minimum normal evidence: **2 independent signals / strength ≥ 3**.

Hard contradiction: Q06, Q08, Q09 and Q10 are all `2/3`.

---

## EVGENIY — `slaboumie-i-otvaga`

Status: **planned / approved concept / public page allowed**.  
Dementor: Евгений.  
Public route: `/courses/slaboumie-i-otvaga/`.

Product territory:
- a decision is understood and analysed for too long;
- complete clarity becomes a condition for action;
- repeated checking preserves control but delays movement;
- the participant is ready to disturb the normal decision environment.

### Behavioral signals

| Signal | DC-9 scene | Match state | Strength |
|---|---|---:|---:|
| `wait_full_clarity` | Q26 reversible decision before deadline | `0/1` | 2 |
| `post_send_reanalysis` | Q27 message keeps being rewritten after sending | `0/1` | 1 |
| `manual_checking` | Q28 all-green system still manually checked | `0/1` | 1 |
| `control_for_calm` | Q29 1:27 of checking retained for calm | `0/1` | 2 |
| `global_control_after_failure` | Q30 one failure restores global control | `0/1` | 1 |

Minimum normal evidence: **2 independent signals / strength ≥ 3**.

Hard contradiction: Q26, Q27, Q28 and Q29 are all `2/3`.

Because the product is `planned`, the advertising card must preserve planned status and must not imply open registration, confirmed date, confirmed aeroclub or approved price. If `ЗАПИСАТЬСЯ НА КУРС` would imply an already-open registration flow, use the approved interest/status action instead until registration is actually opened.

---

# Selection algorithm

For each course:

1. evaluate named signals against stored canonical answers;
2. count independent hits;
3. sum internal routing strength;
4. calculate **behavioral proximity** only over questions mapped to this course;
5. apply hard contradiction;
6. apply the course-specific minimum evidence;
7. if Q41 is `0/1`, add `+1` required hit and `+1` required strength;
8. discard ineligible courses;
9. if one or more courses remain eligible, **always show the closest eligible course**.

## Behavioral proximity

Proximity is a routing-only value in `0..1`.

For ordinary `0/1` need-signals:
- answer `0` = `1.00 × signal strength`;
- answer `1` = `0.68 × signal strength`;
- answer `2` = `0.18 × signal strength` as a weak near-miss;
- answer `3` = `0`.

For exact-state signals such as Nikita `utility_cover = 1` or `value_gate = 2`, proximity is awarded only for the exact matching state.

Normalize the weighted sum by the maximum possible signal strength for that course.

Eligible candidates are ranked:

`proximity → routing strength → independent hits → strong/core hits → stable registry order`

The registry-order fallback is only a deterministic last resort for mathematically identical QA profiles; it is not a product priority.

### Changed from v0.2

**Do not cancel advertising merely because two eligible courses are close.**

If two or more products pass their evidence gates, show the one whose mapped behavioral signals are closest to the actual answer pattern.

`no-ad` remains valid only when **no course is eligible after evidence, contradiction and Q41 conservative gates**.

This infrastructure is not a diagnostic score and must never be shown publicly or stored as part of DC-9 results.

---

# No-ad behavior

No-ad remains expected, but only when no product legitimately passes its evidence gate.

Use it when:
- no course reaches minimum evidence;
- contradictory evidence blocks all candidate courses;
- Q41 conservative gate removes otherwise weak matches.

Do **not** use no-ad merely to avoid choosing between two eligible products.

Public state:

**РЕКЛАМА ОТМЕНЕНА.**  
Подходящего курса не найдено.  
**На этот раз вам ничего не продают.**

Then continue to Q42.

---

# QA/debug payload

The playtest implementation may expose a non-public debug object containing:
- selected route or `null`;
- Q41 conservative state;
- candidate hit counts;
- candidate strengths;
- candidate proximity values;
- strong/core hit counts;
- matched signal IDs;
- contradiction flags;
- no-match reason.

Do not render this object in the public card.

---

# QA gate before production

1. Run blind users through the full 41-screen prefix.
2. Record route / no-route without showing debug logic to the user.
3. Review false positives manually by scene history.
4. Confirm Nikita is not triggered by simple impulsive spending alone.
5. Confirm Gabil requires a repeated group/team pattern, not one boundary answer.
6. Confirm Valentin requires an evidence/risk cluster, not generic uncertainty.
7. Confirm Evgeniy requires repeated action-delay/control behavior, not ordinary caution.
8. Verify Q41 `0/1` reduces ad frequency.
9. For cross-course profiles, verify the selected product has the highest behavioral proximity.
10. Verify selected-course promo copy remains visible for six seconds and is not repeated inside the course card.
11. Verify no public question number or routing score appears in the ad sequence.
12. Verify `НЕ НАДО` enters the product path and `ДАЛЕЕ` returns to Q42 without changing evidence.
13. Only after blind-playtest approval promote the router to `dementor-club-site` production runtime.
