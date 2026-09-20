---
artifactId: dementor-club.operations.stabilization-bqa-triage-2026-09-20
project: dementor-club
documentType: QA_PLAN
projectStage: RELEASE
gate: G8_CLEANUP
status: ACTIVE
version: 1.0
updated: 2026-09-20
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# Dementor Club — BQA-01…22 stabilization triage

## Purpose

Turn the existing behavioral/live QA ledger into one stable-release movement plan without widening Product scope.

Canonical QA source:

`operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`

Parent stabilization issue:

`#228 STABILIZATION · BQA-01–22 → stable production baseline`

Current production:

`dementor-club-production@2b17d54faaf3eb3eafb287cef1211554b28871b2`

Current project gate:

`G8_CLEANUP / LIVE QA`

---

# 1. Classification rule

BQA-01…10 are **behavioral acceptance scenarios**, not ten implementation bugs.

BQA-11…22 are **live findings / proposals / product gaps**.

Do not convert every QA line into a code task.

Use:

`OBSERVATION → REPRODUCE → AUTHORITY CHECK → OWNER INVENTORY → GROUP BY ROOT OWNER → FIX / DECISION / BACKLOG`

---

# 2. BQA-01…10 — stable acceptance matrix

| BQA | Scenario | Stable-release treatment |
|---|---|---|
| 01 | share/Telegram → received Artifact | **MANDATORY LIVE ACCEPTANCE** |
| 02 | received Artifact → Board context | **MANDATORY LIVE ACCEPTANCE** |
| 03 | detail → close/minimize/back | **MANDATORY LIVE ACCEPTANCE** |
| 04 | relation create discoverability | **MANDATORY VERDICT**; UX defect if assisted only |
| 05 | relation consequence | **MANDATORY LIVE ACCEPTANCE** |
| 06 | another person's Thing | **MANDATORY LIVE ACCEPTANCE** |
| 07 | “I have an idea/material” | **KNOWN PRODUCT GAP** until Contribution runtime; do not fake closure with Artifact |
| 08 | Guest / Applicant Board | **MANDATORY ROLE/ACCESS ACCEPTANCE** |
| 09 | return after 1–3 days | **MANDATORY BEHAVIORAL VERDICT**; do not invent feed if weak |
| 10 | Home / public Program → Thing | **MANDATORY LIVE ACCEPTANCE** |

Stable baseline requires an explicit verdict for every row.

An `ASSISTED PASS` is not closure for discoverability/comprehension.

---

# 3. Live findings priority

## STAB-01 — Public Activity truth boundary

BQA:
- 11 — public projection loses Board media;
- 12 — ordinary Board publication reaches anonymous public Activity;
- 13 — community/public visibility meaning is collapsed.

Issue:

`#229 STAB-01 · Public Activity truth boundary · BQA-11/12/13`

Priority:

**FIRST / PRIVACY + PRODUCT TRUTH**

Verified root cause:
`dc_public_activity_read_v1` uses active `visibility='community'` Board publication as anonymous public feed eligibility without Programming/editorial gate.

No new generic visibility model is authorized.

---

## STAB-02 — Artifact detail loading recoverability

BQA:
- 19 — Artifact detail can remain indefinitely in `LOADING`.

Priority:

**SECOND / CORE FUNCTIONAL ACCESS**

Required:
- exact reproduction;
- bounded loading/error path;
- clean close/back recovery;
- no relation/detail success implication when primary Artifact resolution failed.

Do not bundle unrelated media or relation ontology work here.

---

## STAB-03 — Relations presentation correctness

BQA:
- 16 — hide-relations control fails to hide lines.

Priority:

**THIRD / EXISTING FEATURE CONTRACT**

Must close before stable baseline because the control already promises a function that does not work.

After BQA-16 is closed, assess:
- BQA-15 selector scalability;
- BQA-17 hidden-by-default proposal.

BQA-15/17 are not allowed to expand relation ontology.

---

## STAB-04 — Share transport preview

BQA:
- 14 — shared Artifact social preview image is broken/cropped.

Priority:

**FOURTH / ENTRY + DISTRIBUTION**

Current transport owner:

`/share/artifact/`

Do not expose private Artifact media to social crawlers by accident.

Stable requirement:
- correct generic/public-safe preview;
- exact route;
- no gray/broken crop;
- permission boundary unchanged.

---

## STAB-05 — Public Project media fallback

BQA:
- 21 — Project `LIVE FRAGMENT / VIDEO` renders as empty black media block.

Priority:

**FIFTH / PUBLIC PROMISE FAILURE**

Stable public route must:
- render valid media;
- or provide a stable poster/fallback + explicit open-video path.

No second project media system.

---

## STAB-06 — Mobile information hierarchy

BQA:
- 18 — official Course / Project / Event projections dominate first Board viewport.

Priority:

**UX HARDENING AFTER FUNCTIONAL BLOCKERS**

Valid problem.

Exact interaction remains open:
- collapse;
- compact rail;
- context-triggered presentation;
- mobile density.

Do not remove canonical projections or create parallel navigation without owner/design review.

---

# 4. UX / scale findings that do not block first corrective

## BQA-15 — relation selector scale

Valid usability problem.

Do not ship unbounded `relation type × target` cross-product as the only long-term selector.

However:
- relation meanings remain unchanged;
- search/two-step interaction is presentation work;
- does not precede BQA-16 correctness.

## BQA-17 — relations opt-in by default

Valid owner UX proposal.

Not approved behavior yet.

Evaluate only after BQA-16 works reliably and first-screen Board comprehension is measured.

---

# 5. Backlog / separate decisions

## BQA-20 — client-side WebP normalization

**BACKLOG / MEDIA PIPELINE HARDENING**

Useful for:
- storage;
- egress;
- predictable media dimensions;
- faster Board.

Not required to solve BQA-11 or BQA-14.

Do not use it to hide projection/permission defects.

## BQA-22 — Course / Project creation discoverability

**PRODUCT / AUTHORITY DECISION, NOT STABILIZATION BUG**

Do not solve by:
- adding Course / Project Artifact subtype;
- automatic promotion;
- silent new Dementor authority.

Captured owner hypothesis:

`2 independent Dementor supports`

currently conflicts with approved Contribution review semantics:

`OWNER_ADMIN ONLY review authority`

and:

`GLOBAL DEMENTOR ≠ CONTRIBUTION REVIEWER`.

Requires explicit Change Proposal / Decision before runtime implementation.

## BQA-07 — raw idea / material

Known Product gap.

Correct future owner is the approved narrow Contribution inbound workflow.

Do not fake it with public Artifact creation.

---

# 6. Scope freeze

Until stable production baseline is recorded, do not start:

- Contribution runtime;
- auto archive from relations/interest;
- 50-card idea mechanics;
- recommendation/routing;
- new generic visibility roles;
- Gabil digital course runtime;
- server/Hetzner migration without capacity evidence;
- subscription/pricing;
- GPT connector.

---

# 7. Stable release sequence

```text
CURRENT LIVE
↓
STAB-01 public truth / privacy
↓
STAB-02 detail recoverability
↓
STAB-03 relation correctness
↓
STAB-04 share preview
↓
STAB-05 public project media
↓
STAB-06 mobile hierarchy if still necessary
↓
BQA-01…10 external-to-core acceptance
↓
exact candidate CI
↓
production deploy
↓
owner/live retest
↓
G8 stable baseline SHA
```

Behavioral acceptance may be run continuously during corrective work; final stable verdict comes after the exact deployed candidate.

---

# 8. After stable baseline

Next candidate:

`Contribution Receipt Runtime`

using the already approved semantic path:

`BRING → RECEIVED → ACKNOWLEDGEMENT → EDITORIAL LOOK → DISPOSITION → CLOSURE / CONSEQUENCE`

Then resume:

`#227 Idea / Thing → Board → Share → Invite evidence loop`

with one real external person.

---

# 9. Current movement

Active stabilization parent:

`#228`

First clean batch:

`#229 STAB-01 · Public Activity truth boundary · BQA-11/12/13`

No other Product expansion should pre-empt this sequence.
