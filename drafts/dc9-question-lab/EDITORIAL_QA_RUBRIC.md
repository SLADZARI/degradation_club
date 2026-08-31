# DC-9 Editorial QA Rubric

Status: **DRAFT WORKING STANDARD**

Every candidate question receives a compact editorial score before playtest.

## Core rule

> **Хороший вопрос Dementor Club не заставляет пользователя выбрать смешной ответ.**  
> **Он заставляет пользователя выбрать нормальный ответ, который впоследствии оказывается смешным диагнозом.**

If the humor is already carried by a caricature answer, the question is usually too easy to reverse-engineer.

## 1. Recognizability — 1–5

Can a person understand the situation immediately without knowing Dementor Club theory?

- 1 — abstract / theoretical;
- 3 — understandable but generic;
- 5 — concrete, familiar, easy to imagine oneself in.

## 2. Real conflict — 1–5

Does the question contain an actual tradeoff rather than four stylistic ways to say the same thing?

- 1 — no cost or conflict;
- 3 — mild tradeoff;
- 5 — two or more plausible values genuinely collide.

## 3. Non-obviousness — 1–5

Can the user easily spot the Club-preferred / socially approved / "correct" answer?

- 1 — obvious moral ladder;
- 3 — one answer still looks notably wiser;
- 5 — all four options are psychologically plausible and no option announces itself as the test winner.

## 4. Pattern clarity — 1–5

Does the question measure one specific behavioral or protective pattern rather than a vague trait?

- 1 — mixes several unrelated constructs;
- 3 — primary pattern is visible but alternatives are muddy;
- 5 — the scene isolates a clear mechanism while answers remain natural.

This criterion is evaluated separately from the approved production sphere scoring. In the v0.3 question-lab hypothesis, answers may additionally carry `pattern_stage 0–3`.

## 5. 0/1 and 2/3 separation — 1–5

Can an editor explain the internal boundaries without relying on "worse/better"?

Working v0.3 hypothesis:

- `0` — direct reaction;
- `1` — ordinary social adaptation / explanation;
- `2` — structured repeatable mechanism;
- `3` — mechanism has become a principle / worldview / identity.

- 1 — ladder is basically bad→good;
- 3 — some meaningful differentiation;
- 5 — both boundaries are behaviorally clear and psychologically plausible.

## 6. Answer realism and balance — 1–5

Do all four options sound like real people, with comparable tone, length and sophistication?

- 1 — one or more straw-man answers / score leaks through writing quality;
- 3 — mostly plausible but one option is conspicuously wiser or sillier;
- 5 — each answer has a credible internal logic and no answer is included only as a joke.

## 7. Brevity — 1–5

Does the scene create enough context with minimal reading?

- 1 — exhausting;
- 3 — acceptable;
- 5 — one screen, immediate comprehension, no lost diagnostic context.

The question may contain a compact message, fact row, witness line or stakes strip if it removes ambiguity rather than adding decoration.

## 8. Diagnostic stake — 1–5

Does the choice expose the pattern under a meaningful cost or constraint?

Impact should be judged through:

1. cost of being wrong;
2. personal stake — money, status, identity, relationship, obligation, irreversibility or opportunity cost.

- 1 — sterile / nothing changes regardless of answer;
- 3 — mild social, time or comfort cost;
- 5 — the tested mechanism is challenged by a real competing stake.

## 9. Replay resistance — 1–5

After several questions, can the user simply reverse-engineer "choose the most Dementor answer"?

- 1 — transparent ladder;
- 3 — partly gameable;
- 5 — meaning is contextual, options are mixed, presentation does not leak mechanics.

Strong anti-gaming patterns include:

- consequence already happened;
- profitable exception;
- nobody will know;
- external witness;
- hard factual constraint.

## 10. Satirical payoff — 1–5

Does the scene create material for a later Dementor diagnosis without needing joke answers?

- 1 — no payoff or humor is already exhausted in the answer choices;
- 3 — possible result line exists;
- 5 — a completely normal answer can later be classified in a dry, absurd, specific way.

## Editorial total

Maximum: `50`.

Working interpretation:

- `43–50` — strong candidate for playtest;
- `36–42` — usable after focused edit;
- `28–35` — rewrite required;
- `<28` — reject or rebuild from a new scene.

A high total does NOT override a fatal semantic issue.

## Fatal issues

Reject or rebuild a question if any of the following is true:

- one answer is obviously "the Club answer";
- one or more answers are caricatures written only to lose;
- the strongest answer is only generic maturity, therapy language or competent management;
- the question asks the user to self-describe an abstract trait instead of choosing behavior;
- public wording exposes score/tag/guard mechanics;
- answer position is statically tied to hidden scoring;
- the scene is harmful or irresponsible when taken literally;
- the question duplicates another scene without adding independent evidence;
- editors cannot state what distinguishes 0/1 and 2/3 without using "better/worse";
- the humor depends on the user choosing an intentionally funny answer.

## Per-question workbench — mandatory before rewrite approval

| Check | Required answer |
| --- | --- |
| What exactly are we measuring? | One concrete pattern/mechanism |
| What separates 0 from 1? | Direct reaction vs ordinary adaptation |
| What separates 2 from 3? | Mechanism vs principle/worldview |
| What is the price of the choice? | Explicit stake or reason why low-stake evidence is useful |
| Can the Club-preferred answer be guessed? | If yes, rewrite |
| Do answers sound like real people? | All four must |
| Is there a later satirical payoff? | Required |
| Does the question add new information? | If no, remove or replace |

The v0.3 `0–3` pattern-stage interpretation is a **draft editorial hypothesis** and does not silently replace the approved production scoring contract.

## Sphere-level QA

A sphere is ready for playtest when:

1. all four canonical tags have sufficient independent evidence;
2. thematic scenes measure genuinely different forms of behavior, not four restatements of one topic;
3. no tag is represented only by abstract self-report;
4. at least one lower-stakes and one higher-stakes scene are present overall;
5. intentionality is behaviorally tested, preferably through a profitable/easy exception;
6. responsibility is behaviorally tested after a consequence or prior commitment already exists;
7. at least one scene uses an anti-image condition where reputation cannot explain the answer when appropriate (`никто не узнает`);
8. answer order can be shuffled without changing meaning;
9. presentation patterns vary enough to avoid repetitive reading;
10. total question count is justified by evidence coverage, not symmetry;
11. the sphere produces result-language material without creating a personality typology;
12. any content-routing idea remains a separate product hypothesis until approved.

## Current baseline audit snapshot

Editorial/product estimate before rewrite:

- Personality — 6/10
- Work — 6/10
- Consumption — 7/10
- Relationships — 5/10
- Control — 4/10
- Information — 3/10
- Self-development — 6/10
- Meaning — 8/10
- Technology — 5/10

Priority order for deep rewrite:

1. Information
2. Control
3. Relationships / Technology
4. Work / Personality
5. Consumption / Self-development
6. Meaning as current reference quality

These ratings are editorial judgement, not canonical diagnostic values.
