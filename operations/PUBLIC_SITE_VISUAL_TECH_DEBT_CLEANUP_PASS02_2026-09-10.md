---
artifactId: dementor-club.evidence.public-site-visual-tech-debt-cleanup-pass02-2026-09-10
project: dementor-club
documentType: QA_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: DRAFT
updated: 2026-09-10
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
---

# Public Site Visual Tech-Debt Cleanup — Pass 02

Baseline: exact production `fe7a86a024f1c316c93b800ba66e70933082e927` / Deploy #56 / run `34477429235` / live smoke PASS.

## Scope
Remove only Fuengirola selectors that are provably unreachable after Pass 01 route scoping. No redesign and no product/state/auth/database mutation.

## Classification
- `ink-layout-v2.css` Fuengirola entity rules: **DEAD**. The legacy ink-layout loader no longer runs on `/events/fuengirola/`.
- `ink-layout-v2-tuning.css` Fuengirola entity rules: **DEAD** for the same reason.
- Home Fuengirola compatibility declarations: **COMPATIBILITY**, retained.
- `visual-standard-v2.css` suppressed Home Fuengirola pseudo-owner: **DEFERRED** to a later guarded pass.

## Candidate diff
Only:
- `ink-layout-v2.css`;
- `ink-layout-v2-tuning.css`;
- `scripts/validate-visual-contract.mjs`.

The visual validator now prevents retired Fuengirola ink-layout owner selectors from returning.

## Acceptance
- accepted public visuals remain unchanged;
- Fuengirola detail remains owned by its static canonical hero;
- Home Fuengirola ownership remains unchanged;
- full Site Integrity / Release Readiness G6 passes before release proposal.

`Commit ≠ merge ≠ deploy`.
