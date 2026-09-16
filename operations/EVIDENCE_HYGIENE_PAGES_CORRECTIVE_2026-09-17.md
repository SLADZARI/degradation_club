# Evidence Hygiene v1 — Pages corrective evidence

Date: 2026-09-17
Issue: #201
Result: `dementor-club.result.evidence-hygiene-v1`
Gate: `G7_RELEASE`

## Trigger
Canonical Pages workflow run `35157794556` checked out exact production `b68cd84bd284e599f3adcce46659e4654e23d05d` and passed registry/routes, content readiness, visual contract, build, shell contract and built-JS syntax. It was blocked before deploy by `scripts/validate-browser-shell.mjs` with:

`/workspace/board/: activity fixture card did not render; errors=none`

No Pages artifact was uploaded by that run and deploy was skipped.

## Root cause
The production Board read path filters visible Artifact rows with `.is('board_hidden_at', null)`. The browser smoke Supabase fixture rows `qa-target-artifact` and `qa-own-artifact` omitted `board_hidden_at`. The fixture query stub applies `.is(k,v)` with strict equality, therefore `undefined !== null` filtered both fixture rows before render.

This is a stale QA fixture, not a runtime Evidence Hygiene regression.

## Corrective
The existing integration branch `result/evidence-hygiene-v1` was fast-forwarded to current production `b68cd84bd284e599f3adcce46659e4654e23d05d`.

Corrective commit:

`234ee1f67a9b579a1c50caec5a701f54d01d3774`

Scope relative to production: exactly one file, `scripts/validate-browser-shell.mjs`.

Change: add `board_hidden_at:null` to the two existing Activity fixture Artifact rows. No Board runtime, database, RLS, Membership, DC-9, Telegram, Current Program, analytics or product semantics changed.

Draft corrective PR: `#217`, base `dementor-club-production@b68cd84bd284e599f3adcce46659e4654e23d05d`, head `234ee1f67a9b579a1c50caec5a701f54d01d3774`.

## Corrective validation
Canonical `Site Integrity / Release Readiness`:

- run number: `#1198`
- run id: `35159581757`
- exact head: `234ee1f67a9b579a1c50caec5a701f54d01d3774`
- conclusion: `SUCCESS`
- job: `validate` / `SUCCESS`
- `Validate Evidence Hygiene browser acceptance`: PASS
- `Validate browser shell and Workspace recovery`: PASS
- `Validate production route manifest`: PASS
- `Validate production artifact release gate`: PASS
- all validation steps completed successfully.

This validates the corrective against the exact production-based head. Production itself remains unchanged at `b68cd84bd284e599f3adcce46659e4654e23d05d`.

## Release boundary
Corrective implementation and validation are complete. PR #217 remains Draft and unmerged.

No new canonical Pages deploy has been executed after this corrective validation. Live browser retest and G8 remain open. Issue #201 remains open.

A separate explicit merge authorization is required before PR #217 may be merged.

`CORRECTIVE VALIDATED ≠ MERGE ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
