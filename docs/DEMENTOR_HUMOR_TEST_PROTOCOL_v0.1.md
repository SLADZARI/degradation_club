# Dementor Club — Humor Test Protocol v0.1

Status: TEST PROTOCOL · CANDIDATE
Updated: 2026-09-01
Related: `docs/DEMENTOR_HUMOR_SYSTEM_v0.1.md`

## Goal

Test whether the proposed humor mechanics produce recognisable, concise, Dementor-specific material across the club's real surfaces instead of merely generating technically valid jokes.

## 1. Test unit

Each test case contains:

- surface;
- DC9 sphere;
- audience/context;
- raw reality/observation;
- social script;
- anomaly;
- dominant mechanism;
- output format;
- candidate copy;
- internal score;
- reviewer ranking;
- perceived mechanism / interpretation;
- notes.

## 2. First test batch

Minimum first batch: **36 cases**.

Coverage:
- 9 DC9 spheres × 2 short-form cases = 18;
- Home/About = 4;
- Social/meme = 4;
- Community/persona = 2;
- Logic & Awareness = 2;
- Course = 2;
- Merch/object = 2;
- Event/onboarding = 2.

For each case generate 5 candidates using at least 3 different mechanisms.

Do not test five paraphrases of the same joke.

## 3. Control condition

For at least half the cases include one non-humorous control line that communicates the same underlying meaning.

Purpose: distinguish `funny` from `actually improves the surface`.

A humorous line loses if it is more amusing but makes the page/action less clear.

## 4. Blind review

Where possible remove mechanism labels and source/model identity before review.

Reviewer questions:

1. Что здесь смешного — сформулируйте своими словами?
2. Что именно высмеивается?
3. Насколько это похоже на Dementor Club, а не на случайный мем? `0–5`
4. Насколько фраза естественна по-русски? `0–5`
5. Хотелось бы переслать/процитировать? `0–5`
6. Понятна ли она без объяснения? `0–5`
7. Для продуктовой поверхности: стало ли понятнее/хуже, что делать дальше?

The reviewer should not be shown the intended punchline explanation until after scoring.

## 5. Intended vs perceived humor

Record separately:

- `INTENDED_CONTRADICTION`
- `PERCEIVED_CONTRADICTION`
- `INTENDED_TARGET`
- `PERCEIVED_TARGET`

If reviewers laugh for a different reason than intended, that is evidence, not automatically failure. But if the perceived target is a person/group the club did not intend to attack, treat as a risk signal.

## 6. Internal quality score

Use the 20-point gate from `DEMENTOR_HUMOR_SYSTEM_v0.1.md` before human review.

The internal score is not success evidence. It is a filtering mechanism.

Recommended flow:

`5 variants -> internal gate -> top 2–3 -> blind review -> revise -> surface test`

## 7. Surface-specific pass criteria

### Home/About
Pass if:
- philosophy remains clear;
- joke strengthens the inversion;
- user does not need club lore;
- CTA/action remains unambiguous.

### Social/meme
Pass if:
- observation is understandable quickly;
- output is shareable without explanation;
- not dependent solely on a stale template;
- Dementor angle survives when the template is removed.

### Community
Pass if:
- creates a reusable shared expression or response pattern;
- does not reward cruelty/escalation for its own sake.

### Project / Logic & Awareness
Pass if:
- humor reveals a reasoning/social contradiction;
- satire does not replace the factual/analytical layer.

### Course
Pass if:
- user still knows what to do next;
- correct/incorrect state remains explicit where required;
- humor improves recall or lowers resistance.

### Merch/object
Pass if:
- phrase/concept works without explanatory caption;
- remains readable/repeatable after multiple exposures;
- behaves as identity signal rather than disposable post copy.

### Event/onboarding
Pass if:
- social tone improves participation;
- factual logistics/state remain literal and clear.

### Support/legal/payment
Default control: no humor. Any humorous microcopy must prove it does not alter interpretation or trust.

## 8. Failure taxonomy

Tag failures with one or more codes:

- `F01_GENERIC` — could belong to any brand;
- `F02_AI_CADENCE` — recognizable generic LLM construction;
- `F03_NO_OBSERVATION` — punch without social truth;
- `F04_OVEREXPLAINED`;
- `F05_DECODE_COST` — too much context required;
- `F06_WRONG_TARGET`;
- `F07_TOO_CRUEL`;
- `F08_STALE_REFERENCE`;
- `F09_FORMAT_DEPENDENT` — template does all the work;
- `F10_PRODUCT_CLARITY` — harms interface/task;
- `F11_REGISTER_OVERUSE` — same bureaucracy/fake-office trick again;
- `F12_TRANSLATED` — unnatural Russian rhythm;
- `F13_NOT_QUOTABLE`;
- `F14_CANON_CONFLICT` — contradicts approved project meaning/fact;
- `F15_PERSONA_FLATTENING` — makes every Dementor sound the same.

## 9. Evidence levels

- `INTERNAL_PASS` — passed rubric only.
- `REVIEW_PASS` — human reviewers prefer candidate over alternatives/control.
- `SURFACE_PASS` — works in actual page/post prototype without clarity loss.
- `AUDIENCE_SIGNAL` — real audience response data available.
- `CANON_CANDIDATE` — repeated evidence supports promotion.

Do not call an untested generated line `validated`.

## 10. What is not tested yet

This v0.1 protocol does not establish:
- which mechanism performs best by demographic;
- optimal posting frequency;
- causal uplift in reach/conversion;
- final individual persona voices;
- universal offensiveness thresholds;
- durability of current meme/trend references.

Those require observed audience data and/or separate research.

## 11. Promotion checkpoint

After the first 36-case batch produce a short report:

- strongest mechanisms;
- weakest/repetitive mechanisms;
- mechanisms by surface;
- Russian-language failure patterns;
- examples approved as reference, not templates to copy;
- changes proposed for v0.2;
- decision: `REVISE | EXTEND TEST | PROPOSE CANON`.
