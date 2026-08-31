# DC-9 Scoring + Question Weight Model v0.2

Status: **DRAFT / EXPERIMENTAL / NOT CANON**

## Why this exists

Current production scoring assumes one thematic answer per tag. That makes every thematic question equally influential and effectively requires a fixed shape.

The lab needs a model where:

- a sphere may contain a variable number of scenes;
- a consequential scene can matter more than a trivial one;
- adding an extra question does not automatically inflate or deflate the result;
- current intentionality/responsibility guard logic can be preserved while content is tested.

## Current approved baseline

Production currently uses:

1. thematic answer score `0–3`;
2. tag level = `round((score / 3) * 5)`;
3. base = rounded mean of four tag levels;
4. guard = `min(intent, responsibility)`;
5. guard cap: `0→1`, `1→2`, `2→4`, `3→5`;
6. final sphere level = `min(base, guard_cap)`.

This document does not alter that production contract until separately approved.

## Draft v0.2 model

Each thematic question has:

- semantic answer score `a ∈ {0,1,2,3}`;
- impact band `I1–I7`;
- derived coefficient `w`.

Draft coefficients:

`I1=.70, I2=.80, I3=.90, I4=1.00, I5=1.15, I6=1.30, I7=1.50`

The coefficients are deliberately compressed. Impact is not a drama multiplier.

## Per-tag score

For each canonical tag `t`:

`tag_raw(t) = Σ(w_q × a_q/3) / Σ(w_q)`

Then:

`tag_level(t) = round(tag_raw(t) × 5)`

This keeps every tag on the existing `0–5` result scale while allowing one or more questions per tag.

## Sphere thematic base

Default draft:

`base = round(mean(tag_level[4]))`

This preserves equal importance of the four canonical tags even when one tag needs more questions to establish evidence.

Do NOT average all questions directly across the whole sphere. Otherwise tags with more questions silently become more important.

## Guards

Until separately redesigned and approved, preserve the current guard contract:

- intentionality guard `0–3`;
- responsibility guard `0–3`;
- `guard = min(intent, responsibility)`;
- cap `0→1`, `1→2`, `2→4`, `3→5`;
- `final = min(base, guard_cap)`.

The lab may test multiple guard scenes, but it must define an explicit aggregation method before any production change.

### Candidate multi-guard aggregation for playtest only

If a guard has two scenes, use weighted normalized score and round back to `0–3`:

`guard_axis = round( Σ(w_q × a_q) / Σ(w_q) )`

This is only a candidate for testing.

## Evidence completeness

Question quantity is not itself the target.

A tag is considered sufficiently evidenced when at least one of these is true:

- one strong `I4–I7` scene passes QA;
- two complementary `I1–I3` scenes pass QA;
- playtest evidence shows one scene reliably separates score meanings without being obvious.

A sphere should stop adding questions once all four tags and both guard dimensions are sufficiently evidenced.

## Why not literal weight 1–7

A literal 7x multiplier would make one critical question capable of overpowering several ordinary but useful behavioral scenes.

The seven bands therefore classify the real-life stakes while the numerical influence remains bounded.

This distinction should be tested during playtests. Coefficients may change; the `I1–I7` semantic classification should remain stable if useful.

## Scoring QA checks

Before promotion, simulate at minimum:

1. all-zero answers;
2. all-three answers;
3. mostly mature `2` with one `3`;
4. one I7 extreme answer against several I1–I4 answers;
5. contradictory answers on the same tag;
6. high thematic + low intentionality;
7. high thematic + low responsibility;
8. unequal question counts between tags;
9. unequal question counts between spheres.

Pass condition: results remain interpretable and no single scene produces a surprising sphere jump without strong reason.

## Open decisions

- final coefficient curve for `I1–I7`;
- whether some tags need minimum total evidence weight;
- whether guard axes should remain one scene each or use two-scene evidence;
- whether sphere completion is based on fixed question count or evidence completeness;
- exact UX target for total full DC-9 duration.
