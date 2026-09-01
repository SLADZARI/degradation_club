# DC-9 — Post-Q41 Course Routing v0.2

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

Flow remains:

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

Latest playtest decision: the public advertising card is deliberately simple.

Do **not** show:
- MATCH percentage;
- routing score;
- question numbers;
- “recommended for you” language;
- explanation that the card was assembled from answers;
- diagnostic reason copy.

Public card may show only the approved product presentation, Dementor badge/name, course status and CTA.

Routing rationale is available only in QA/debug data.

Secondary action: `ПРОСТО НЕ НАДО` → continue to Q42.

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
| `confirmation_lock` | Q31 confirming headline | `0` | 2 |
| `source_distance` | Q33 “scientists proved” repost chain | `0/1` | 2 |
| `position_defense` | Q34 old public position vs new data | `0/1` | 2 |
| `verification_avoidance` | Q35 source check costs an hour | `0/1` | 1 |
| `risk_model_after_loss` | Q36 loss after incomplete-data decision | `0/1` | 1 |
| `reversible_clarity_lock` | Q26 reversible decision before deadline | `0/1` | 1 |

Minimum normal evidence: **3 independent signals / strength ≥ 5**.

Hard contradiction: Q33, Q34, Q35 and Q36 are all `2/3`.

Reason: this course should appear for a repeated evidence/risk pattern, not simply because one uncertain decision was uncomfortable.

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

Because the product is `planned`, the advertising card must preserve planned status and must not imply open registration, confirmed date, confirmed aeroclub or approved price.

---

# Selection algorithm

For each course:

1. evaluate its named signals against stored canonical answers;
2. count independent hits;
3. sum routing strength only as an internal tie-breaker;
4. apply hard contradiction;
5. apply the course-specific minimum evidence;
6. if Q41 is `0/1`, add `+1` required hit and `+1` required strength;
7. rank eligible candidates by strength, then hit count;
8. show a course only if the winner is clearly separated from the second candidate;
9. otherwise return `no-ad`.

Clear winner rule:
- strength lead ≥ 2; **or**
- hit-count lead ≥ 1 **and** strength lead ≥ 1.

If two eligible courses remain closer than this, show no course.

This score is **routing infrastructure only**. It is not a diagnostic score and must never be shown publicly or stored as part of DC-9 results.

---

# No-ad behavior

No-ad is expected and desirable.

Use it when:
- no course reaches minimum evidence;
- contradictory evidence blocks the course;
- top candidates are ambiguous;
- Q41 conservative gate removes an otherwise weak match.

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
- matched signal IDs;
- contradiction flags;
- ambiguity/no-match reason.

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
9. Verify ambiguous cross-course profiles produce no-ad.
10. Only after blind-playtest approval promote the router to `dementor-club-site` production runtime.
