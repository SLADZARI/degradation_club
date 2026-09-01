# DC-9 — Post-Sphere Course Routing v0.5

Status: **DRAFT BEHAVIOR ROUTING / FREE-SPHERE PLAYTEST / NOT PRODUCTION**  
Date: 2026-09-01  
Branch: `draft/dc9-question-lab`

> Legacy path note: filename still contains `POST_Q41` only for continuity. Q41 is no longer the trigger.

## Decision

DC-9 may be completed in any sphere order. Advertising routing is tied to **completed spheres**, not to a global question number.

Flow:

`choose sphere → complete 6 scenes → return to sphere picker`

Commercial check:

`after completed sphere → if completed spheres < 4: no check → picker`

`after completed sphere → if completed spheres >= 4 and adSeen=false: evaluate router`

- if no course is eligible: show nothing and return directly to sphere picker;
- if one or more courses are eligible: select the closest behavioral match and show exactly one advertising intervention;
- after the first advertising intervention set `adSeen=true` for the rest of the DC-9 run;
- after 9/9, if an ad is triggered for the first time, show it before the final result; otherwise go directly to result.

Routing never changes DC-9 evidence, guards, sphere results or final map.

## Public sphere-order rule

The nine spheres are independent and may be chosen in any order.

Inside one chosen sphere the six scenes remain sequential.

Public UI does not expose canonical sphere numbers `01–09`; those remain internal identifiers. Use sphere pictogram + sphere name. Question progress inside a sphere may use local `1/6 … 6/6`.

## Coverage gate

No commercial routing before **4 fully completed spheres**.

Only answers from fully completed spheres may contribute to routing. Answers from a partially completed sphere are ignored until that sphere reaches 6/6.

This replaces the former Q41 anti-exploitation gate.

The router must not use susceptibility to advertising, FOMO response or any single commercial-pressure question as affinity evidence.

## Frequency rule

Maximum: **one advertising intervention per complete DC-9 run**.

Once a course has been shown:

`adSeen = true`

No further course routing is performed during the remaining spheres.

## Public advertising sequence

If a course is selected:

1. show the course-specific editorial/promo line as a standalone screen for **6 seconds**;
2. then reveal the course card;
3. card shows course title, subtitle, Dementor badge/name and actions;
4. do not expose match percentage, routing score, question numbers or diagnostic reasons.

Actions:

- primary course action: `ЗАПИСАТЬСЯ НА КУРС →` where registration wording is factually allowed;
- planned concepts must use a non-registration CTA such as `УЗНАТЬ О КУРСЕ →`;
- `НЕ НАДО` opens the Dementor Club product/intervention `НЕ НАДО`;
- plain `ДАЛЕЕ →` skips both product actions and returns to the sphere picker, or to the final result after 9/9.

If no product is eligible, **do not show a public “РЕКЛАМА ОТМЕНЕНА” screen** during normal free-sphere flow. The absence of an ad is invisible.

## Enabled courses and behavioral signals

### Valentin — `dumai-s-opasnostyu`

Signals:
- Q31 `confirmation_lock` — `0/1`, strength 2;
- Q33 `source_distance` — `0/1`, strength 2;
- Q34 `position_defense` — `0/1`, strength 2;
- Q35 `verification_avoidance` — `0/1`, strength 1;
- Q36 `risk_model_after_loss` — `0/1`, strength 1;
- Q26 `reversible_clarity_lock` — `0/1`, strength 1.

Minimum: **3 independent hits / strength >= 5**.

Hard contradiction: Q33, Q34, Q35, Q36 all `2/3`.

### Nikita — `dengi-na-veter`

Signals:
- Q14 `utility_cover` — exactly `1`, strength 2;
- Q17 `discount_rationalization` — `0/1`, strength 2;
- Q18 `austerity_over_function` — `0/1`, strength 2;
- Q16 `sunk_cost_defense` — `0/1`, strength 1;
- Q13 `value_gate` — exactly `2`, strength 1.

Minimum: **2 independent hits / strength >= 3**.

Hard contradiction: Q14, Q16, Q17, Q18 all `2/3`.

Do not route Nikita merely because the user spends impulsively. The target pattern is the need to rationally justify spending through necessity, value, optimization or post-hoc explanation.

### Gabil — `ne-komanda`

Signals:
- Q06 `driver_returns` — exactly `1`, strength 2;
- Q08 `delegation_takeback` — `0/1`, strength 1;
- Q09 `process_without_result` — `0/1`, strength 2;
- Q10 `repeated_heroics` — `0/1`, strength 2;
- Q21 `rescue_loop` — `0/1`, strength 1.

Minimum: **2 independent hits / strength >= 3**.

Hard contradiction: Q06, Q08, Q09, Q10 all `2/3`.

### Evgeniy — `slaboumie-i-otvaga`

Signals:
- Q26 `wait_full_clarity` — `0/1`, strength 2;
- Q27 `post_send_reanalysis` — `0/1`, strength 1;
- Q28 `manual_checking` — `0/1`, strength 1;
- Q29 `control_for_calm` — `0/1`, strength 2;
- Q30 `global_control_after_failure` — `0/1`, strength 1.

Minimum: **2 independent hits / strength >= 3**.

Hard contradiction: Q26, Q27, Q28, Q29 all `2/3`.

Because this course is `planned`, the public card must not imply open registration, confirmed date, aeroclub or approved price.

## Behavioral proximity

If multiple courses pass their evidence gates, **always show the closest eligible course**.

For ordinary `0/1` need-signals:
- answer `0` = `1.00 × signal strength`;
- answer `1` = `0.68 × signal strength`;
- answer `2` = `0.18 × signal strength` as a weak near-miss;
- answer `3` = `0`.

Exact-state signals receive proximity only for their exact matching answer.

Normalize weighted affinity by the maximum possible signal strength for that course.

Eligible candidates rank by:

`proximity → routing strength → independent hits → strong/core hits → stable registry order`

The final fallback is deterministic only; it is not product priority.

## No-ad rule

No-ad is an internal routing result only.

It occurs when no course passes evidence and contradiction gates using completed-sphere data.

Public behavior: **nothing happens**. Return to sphere picker, or to final result after 9/9.

## QA/debug payload

The playtest may expose a private debug object containing:
- selected route or `null`;
- completed-sphere count;
- candidate hit counts;
- routing strengths;
- proximity values;
- matched signal IDs;
- contradiction flags;
- no-match reason.

Never render this data publicly.

## QA gate

Before production:

1. test different sphere orders, not only canonical order;
2. verify no ad can appear before four fully completed spheres;
3. verify partial-sphere answers do not influence routing;
4. verify the first eligible moment can occur after sphere 4, 5, 6, 7, 8 or 9;
5. verify at most one ad appears per DC-9 run;
6. verify no-match produces no visible interruption;
7. verify closest-wins for cross-course profiles;
8. verify promo screen lasts 6 seconds before the course card;
9. verify `НЕ НАДО` and plain `ДАЛЕЕ →` are separate actions;
10. verify after 9/9 the user reaches the final map whether or not an ad was shown.
