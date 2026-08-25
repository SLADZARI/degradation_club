# ДУМАЙ С ОПАСНОСТЬЮ — Test 02 / Day 1 feedback

Date: 2026-08-25
Tester: **Yauhen**
Prototype: `prototype/dumai-s-opasnostyu-v0-2`
Route: `/prototypes/dumai-s-opasnostyu-v02/`
Status: **partial second test — Day 1 reviewed, corrections applied**

This record is internal product/weekly-report documentation. It does not change `courses/dumai-s-opasnostyu.md`, production registry or current public course route.

## What Yauhen tested

Second manual test reached and reviewed the first day flow, including:
- decision formulation;
- expected success/result;
- assumptions;
- assumption classification;
- control question;
- Day 1 confidence result.

The previous v0.2 screen-by-screen pacing is better than v0.1, but open free-text fields still create unnecessary blank-page friction and allow low-information answers too easily.

## Approved UX correction: option-first + editable answer

For questions with predictable answer space, use this pattern:

`curated options → choose one / choose several → selected text becomes answer → user may edit it → own variant remains available`

Rules:
- single-answer screens: **6 curated options + 1 Own variant**;
- only one curated single-answer option may be active;
- selected option is copied into an editable answer field;
- user may rewrite the selected text before continuing;
- multi-answer screens use a curated pool plus repeatable Own variant;
- curated options are contextual to `decisionDomain` where the domain materially changes the answer space.

This pattern is not a quiz and does not imply a correct answer. Its purpose is to reduce blank-page friction while preserving user authorship.

## Day 1 corrections

### Decision

Replace free-text-only entry with 6 contextual decision/action options + Own variant. Selected option becomes editable.

### Expected result / “Как выглядит успех?”

Replace blank textarea with 6 contextual expected-result options + Own variant. Selected text is editable.

### Assumptions / “Что должно оказаться правдой?”

Provide 8 contextual assumption suggestions + Own variant. Multiple selection. Selected assumptions become editable rows. Minimum remains 7.

### Control question / “На основании чего вы решили, что всё будет нормально?”

Provide 6 basis/evidence options + Own variant. Selected answer remains editable.

## Confidence correction

Only **initial confidence** is set manually by the user.

From Day 1 onward confidence is calculated automatically from the structure of answers, without AI. It is an internal prototype heuristic, not a psychological score or recommendation.

Day 1 prototype calculation uses:
- number classified as `ЗНАЮ`;
- number classified as `ПРЕДПОЛАГАЮ`;
- number classified as `МНЕ СКАЗАЛИ`;
- type of stated basis/evidence.

The value may decrease, stay close to the previous value, or increase. Lower confidence is not treated as success.

Every result screen must state that the percentage is structurally calculated and AI is not used.

## Pattern propagated to later days

Where a later question has a predictable answer space, the same option-first pattern is applied:
- Day 2: promise source, promise type, inference, known fact, verification method, response if sincere promise cannot be fulfilled;
- Day 3: failure modes and uncomfortable failure;
- Day 4: signals, rationalized signal, recheck trigger;
- Day 5: green/yellow/red states, irreversible costs, final red line;
- Day 6: argument for, argument against, falsification fact;
- Day 7: error cost, inaction cost, Plan B.

Free text remains available through Own variant and post-selection editing.

## Day-to-day continuity

Starting with Day 2, every new day opens with a visible summary of the previous day:
- previous confidence → resulting confidence;
- previous day topic;
- one-sentence explanation of what structurally affected the result.

This creates continuity between days and prepares the later production e-mail cadence.

## Valentin

Preserve Valentin as a distinct authorial intervention layer.

He appears:
- before the course begins;
- in day opening/transition moments;
- when a characteristic trap appears;
- on day result screens;
- at final verdict.

Black editorial intervention remains, but site accent color is used for the Valentin marker. Valentin is not a chatbot and should not comment on every click.

## Brand harmonization

Prototype colors are harmonized with `dementor-club-site` tokens:
- paper: `#f2f0e8`;
- ink: `#111`;
- acid: `#d8ff3e`;
- line: `rgba(17,17,17,.20)`;
- acid surfaces always use dark text.

Red is retained only as a semantic danger/error/stamp color, not as the primary site accent.

## Implementation status

Applied to isolated prototype branch only. Production course route, registry and canonical course remain untouched.

The next required test is a fresh walkthrough from onboarding through at least Day 2, specifically checking:
1. whether curated choices reduce friction without feeling like a quiz;
2. whether editing a selected option feels natural;
3. whether automatic confidence feels understandable rather than arbitrary;
4. whether previous-day carryover makes Day 2 feel like continuation;
5. whether Valentin feels like the author, not decoration.

Do not mark Test 02 as full end-to-end completed until Yauhen reaches the final course state again.
