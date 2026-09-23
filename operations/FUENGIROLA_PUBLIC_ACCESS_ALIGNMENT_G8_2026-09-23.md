---
artifactId: dementor-club.report.fuengirola-public-access-alignment-g8-2026-09-23
project: dementor-club
documentType: REPORT
projectStage: BUILD
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
parentIssue: 228
scope:
  - BQA-10
  - Fuengirola public access alignment
---

# Fuengirola Public Access Alignment · G8

## Result

`dementor-club.result.fuengirola-public-access-alignment-v1@1.0`

## Authority

`operations/FUENGIROLA_ACCESS_POLICY_DECISION_V1.md`

## Validation

Validated candidate:

`a63768c391eabd102c1dac1e9c123fc5c7b5b260`

Site Integrity / Release Readiness:

`#1258 / 35882072137 · SUCCESS`

Exact candidate diff:

1. `content/events/fuengirola.json`
2. `events/fuengirola/index.html`
3. `events/index.html`
4. `scripts/validate-public-harmonization-browser.mjs`
5. `scripts/validate-site.mjs`
6. `scripts/validate-visual-contract.mjs`

## Release

PR:

`#242 · MERGED`

Production:

`df8a24eca2bcca25339f128c7da93982515cf442`

Candidate → production content diff:

`0 files`

Pages:

`Deploy Dementor Production #134 / 35885907613 · SUCCESS`

Exact production SHA verified.

## Live acceptance

Owner live evidence:

`operations/FUENGIROLA_PUBLIC_ACCESS_ALIGNMENT_LIVE_ACCEPTANCE_2026-09-23.md`

Verdict:

`PASS`

## Product truth after closure

- Membership/onboarding is not Fuengirola eligibility;
- confirmed Event information is directly public;
- Join Club is not Fuengirola Event continuation;
- status remains PLANNED;
- registration remains disabled;
- unconfirmed date / venue / price / payment / availability remain unconfirmed;
- no new Event access vocabulary was created;
- Current Program, Board Program and ThingProjection ownership remain unchanged.

## Cleanup

- active integration ownership cleared;
- Result closed as APPROVED;
- branch no longer owns active work;
- no backend mutation;
- BQA-10 is closed as PASS.

Parent stabilization #228 remains open only for the remaining behavioral acceptance/product-gap ledger; this Result does not close those rows.
