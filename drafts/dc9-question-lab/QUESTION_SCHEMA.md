# DC-9 Question Record Schema

Status: **DRAFT v0.3**

Every question in the lab should be stored with the same fields so content, scoring, diagnostic meaning and UX can be reviewed separately.

This schema does **not** replace the current production contract.

## Record

```yaml
id: DC9-PER-001
sphere: personality
sphere_order: 1
status: baseline | rewrite | workbench | candidate | playtest | approved-draft | rejected | promoted
version: 1

kind: thematic | intentionality_guard | responsibility_guard
canonical_tag: self_irony | role_refusal | boundaries | imperfection
pattern_target: role_maintenance

scene:
  title: "Short recognizable situation"
  detail: "Optional factual/social constraint; not necessarily a joke"
  stakes: "What can actually be gained, lost or exposed"

answers:
  - text: "..."
    pattern_id: role_released
    pattern_stage: 0
    canonical_evidence: 1.00
    rationale_internal: "Direct reaction; role no longer controls decision"
  - text: "..."
    pattern_id: adaptive_role_contact
    pattern_stage: 1
    canonical_evidence: 0.67
    rationale_internal: "Ordinary adaptation / light preservation"
  - text: "..."
    pattern_id: structured_role_maintenance
    pattern_stage: 2
    canonical_evidence: 0.33
    rationale_internal: "Repeatable protective mechanism"
  - text: "..."
    pattern_id: role_as_principle
    pattern_stage: 3
    canonical_evidence: 0.00
    rationale_internal: "Mechanism defended as principle/worldview"

impact:
  band: I1 | I2 | I3 | I4 | I5 | I6 | I7
  coefficient: 0.70 | 0.80 | 0.90 | 1.00 | 1.15 | 1.30 | 1.50
  cost_of_error: "..."
  personal_stake: "money/status/identity/relationship/obligation/reversibility/etc"
  reason: "Why this deserves this evidence weight"

presentation:
  pattern: P01 | P02 | P03 | P04 | P05 | P06 | P07 | P08 | P09 | P10 | P11 | P12
  diagnostic_function: "What ambiguity/bias this wrapper removes"
  satirical_function: "Where the Club humor/payoff comes from"
  optional_microcopy: "..."
  interaction_note: "No unique illustration required"

payoff:
  transition_candidate: "Optional short system line after a block"
  result_language_candidates:
    - "..."

qa:
  recognizability: 1-5
  real_conflict: 1-5
  non_obviousness: 1-5
  pattern_clarity: 1-5
  boundary_01_23: 1-5
  answer_realism_balance: 1-5
  brevity: 1-5
  diagnostic_stake: 1-5
  replay_resistance: 1-5
  satirical_payoff: 1-5
  total: 10-50
  fatal_issue: null
  notes: "..."
```

## Critical semantics

### `pattern_stage`

Editorial hypothesis describing how formed/entrenched a strategy is:

- `0` — direct reaction without protective construction;
- `1` — ordinary adaptation / explanation;
- `2` — structured repeatable mechanism;
- `3` — mechanism becomes principle / worldview / identity.

It is **descriptive**, not a goodness or Dementor scale.

### `canonical_evidence`

Compatibility hypothesis describing how strongly the chosen behavior supports the current canonical sphere direction:

- `0.00` — strongly serves the relevant successful-success construction;
- `0.33` — weak refusal / small violation;
- `0.67` — meaningful refusal;
- `1.00` — construction clearly loses power over the decision.

This field is experimental and must not be promoted until mapping reliability is validated.

### Important

There is no rule that higher `pattern_stage` means higher `canonical_evidence`.

They may correlate positively, negatively or non-monotonically depending on the pattern being tested.

This separation is required to avoid turning the answer list into `0 = stupid / 3 = correct Club ideology`.

## Seven impact bands

Impact is about **cost of error + personal stake**, not theatrical drama and not the quality of the answer.

| Band | Meaning | Typical situation | Draft coefficient |
|---|---|---|---:|
| I1 | negligible | tiny preference, almost no consequence | 0.70 |
| I2 | low | mild inconvenience / easily reversible | 0.80 |
| I3 | noticeable | real time/social/comfort tradeoff | 0.90 |
| I4 | meaningful | recurring cost or real obligation | 1.00 |
| I5 | high | money, relationship, reputation or identity stake | 1.15 |
| I6 | very high | major opportunity/status/identity cost; difficult reversal | 1.30 |
| I7 | critical | very high personal consequence or strongly irreversible commitment | 1.50 |

These coefficients are intentionally compressed. `I7` must not count seven times more than `I1`.

## Question count

There is no fixed rule that every sphere contains the same number of scenes.

Working shape:

- minimum evidence shape: 4 distinct thematic scenes + 2 guards;
- add optional scenes only when a construct lacks independent evidence;
- stop when new questions become repetitions rather than new evidence.

The active Personality gold-standard hypothesis is six scored scenes total: four thematic + two behavioral guards.

## Coverage rule

Every thematic scene must add evidence not already provided by another scene.

A broad tag may use more than one scene, but question count does not determine importance. Aggregation must normalize within the canonical tag/evidence model.

No tag should be represented only by an abstract opinion question.

## Answer rules

- Exactly four behavioral answers by default.
- All four should be plausible for intelligent real people.
- No straw-man answer exists only to lose.
- Public order must be randomized.
- Hidden semantics are not positional.
- Similar length/tone/sophistication should prevent writing-quality leakage.
- Humor should not depend on choosing a funny option.
- `pattern_stage 2` should represent a repeatable mechanism.
- `pattern_stage 3` should represent a principle/worldview, but is not automatically high canonical evidence.

## Mandatory workbench before answer freeze

For every question answer explicitly:

1. What exactly do we measure?
2. What separates 0 from 1?
3. What separates 2 from 3?
4. What is the real price of the choice?
5. Can the user guess the Club-preferred answer?
6. Do all answers sound like real people?
7. Is there a later satirical payoff?
8. Does the question add new information?

## Strong scene methods

Prefer some questions that reduce aspirational self-report:

- `P07 Already happened / Ты уже сделал`;
- `P08 Profitable exception`;
- `P11 Nobody will know`;
- `P04 Witness`;
- `P05 Receipt/evidence`;
- `P12 Forced allocation`.

## Guard rules

Guards are behavioral scenes, not direct motivation questions.

Intentionality: test whether the chosen refusal survives when returning to the old rule is easy/profitable.

Responsibility: test what happens after a prior commitment or consequence already exists.

Reputation-removal may be used when public image contaminates the construct.

## Versioning

Never overwrite a useful candidate without history.

Use stable IDs and increment `version`. Rejected versions may remain as learning evidence with a short rejection reason.

Only `promoted` content can be copied into the canonical branch after explicit approval.
