# DC-9 Question Record Schema

Status: **DRAFT**

Every question in the lab should be stored with the same fields so content, scoring and UX can be reviewed separately.

## Record

```yaml
id: DC9-PER-001
sphere: personality
sphere_order: 1
status: baseline | rewrite | candidate | playtest | approved-draft | rejected | promoted
version: 1

kind: thematic | intentionality_guard | responsibility_guard
canonical_tag: self_irony | role_refusal | boundaries | imperfection

scene:
  title: "Short recognizable situation"
  detail: "One dry Dementor Club / administrative line"
  stakes: "What can actually be gained, lost or exposed"

answers:
  - text: "..."
    score: 0
    rationale_internal: "Why this serves successful-success"
  - text: "..."
    score: 1
    rationale_internal: "..."
  - text: "..."
    score: 2
    rationale_internal: "..."
  - text: "..."
    score: 3
    rationale_internal: "Why the construction loses power"

impact:
  band: I1 | I2 | I3 | I4 | I5 | I6 | I7
  coefficient: 0.70 | 0.80 | 0.90 | 1.00 | 1.15 | 1.30 | 1.50
  reason: "Why this situation deserves this diagnostic weight"

presentation:
  pattern: PATTERN_ID
  optional_microcopy: "..."
  interaction_note: "No illustration required"

qa:
  recognizability: 1-5
  real_conflict: 1-5
  non_obviousness: 1-5
  dementor_specificity: 1-5
  answer_balance: 1-5
  brevity: 1-5
  emotional_tension: 1-5
  replay_resistance: 1-5
  notes: "..."
```

## Seven impact bands

Impact is about the **weight of the situation**, not the moral quality of the answer.

| Band | Meaning | Typical situation | Draft coefficient |
|---|---|---|---:|
| I1 | trivial / almost costless | small preference, minor embarrassment | 0.70 |
| I2 | low | mild social friction or small inconvenience | 0.80 |
| I3 | noticeable | real time/money/reputation tradeoff | 0.90 |
| I4 | meaningful | choice has a visible consequence | 1.00 |
| I5 | high | relationship/work/status cost is plausible | 1.15 |
| I6 | very high | substantial loss, responsibility or identity pressure | 1.30 |
| I7 | critical | strong consequence where the declared principle is genuinely tested | 1.50 |

These coefficients are intentionally compressed. `I7` must not count seven times more than `I1`; otherwise one dramatic scene can overwhelm the whole sphere.

## Question count

There is no fixed rule that every sphere must contain exactly the same number of thematic scenes in the draft lab.

Working target:

- **minimum:** 4 thematic evidence scenes + 2 guards;
- **normal:** 5–6 thematic scenes + 2 guards;
- **maximum before strong justification:** 7 thematic scenes + 2 guards.

A sphere may stop earlier when all canonical tags are adequately evidenced and additional questions become repetitive.

A sphere may use more scenes when a tag is broad or one high-impact question needs a lower-stakes counterexample to distinguish stable behavior from heroic self-image.

## Coverage rule

Each canonical tag needs either:

- one strong `I4–I7` scene; or
- two complementary `I1–I3` scenes.

No tag should be represented only by an abstract opinion question.

## Answer rules

- Exactly four behavioral answers by default.
- Hidden score range remains `0–3`.
- Scores are semantic, not positional.
- Public order must be randomized.
- Answer lengths should be close enough that the “smartest” answer is not visually obvious.
- `2` should often represent competent/adult behavior.
- `3` must go beyond competence and remove the relevant successful-success obligation from the decision.

## Guard rules

Guards are still scenes, not explanations of motivation.

Intentionality asks through behavior: did the person choose the refusal, or merely fail / tire / lose capacity?

Responsibility asks through behavior: after refusing a construction, does the person still own consequences and prior commitments?

## Versioning

Never overwrite a useful candidate without history.

Use stable IDs and increment `version`. Rejected versions may remain as learning evidence with a short rejection reason.
