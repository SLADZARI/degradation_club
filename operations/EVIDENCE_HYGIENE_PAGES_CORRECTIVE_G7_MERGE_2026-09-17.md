# Evidence Hygiene v1 — Pages corrective G7 merge evidence

Date: 2026-09-17
Issue: #201
Result: `dementor-club.result.evidence-hygiene-v1`
Gate: `G7_RELEASE`

## Authorization
Owner explicitly authorized **merge PR #217 only**.

This authorization does not include Pages deploy, live browser retest, G8 closure, or issue closure.

## Pre-merge lock
- production head before merge: `b68cd84bd284e599f3adcce46659e4654e23d05d`
- PR: `#217`
- PR base: `dementor-club-production@b68cd84bd284e599f3adcce46659e4654e23d05d`
- exact corrective head: `234ee1f67a9b579a1c50caec5a701f54d01d3774`
- changed files: exactly one (`scripts/validate-browser-shell.mjs`)
- Site Integrity / Release Readiness: `#1198 / run 35159581757 / SUCCESS`
- PR mergeable: `true`
- PR Draft before authorization: `true`

## Merge
PR #217 was moved Draft → Ready and merged with merge method `merge` using expected head SHA:

`234ee1f67a9b579a1c50caec5a701f54d01d3774`

Production merge commit:

`e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Exact parents:
1. `b68cd84bd284e599f3adcce46659e4654e23d05d` — prior production head
2. `234ee1f67a9b579a1c50caec5a701f54d01d3774` — exact validated corrective candidate

The merge commit is GitHub verified.

Production head after merge:

`dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`

PR #217 final state:
- state: `closed`
- merged: `true`
- draft: `false`
- merge commit: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`

## Scope proof
The corrective changes only the browser-smoke fixture so that the two existing Activity fixture Artifact rows explicitly carry `board_hidden_at:null` and therefore match the canonical Board read filter used by runtime.

No runtime Board code, database migration, RLS, Membership, DC-9, Telegram, Current Program, analytics semantics, or public product semantics changed in this corrective.

## Release boundary after merge
- backend migration remains already applied and verified from the prior backend release;
- no new backend deploy was required or executed by this merge;
- `pagesDeployAuthorized=false` remains the canonical kernel lock;
- canonical Pages deploy has **not** been executed from corrective production head `e8c8a1e3...`;
- live browser retest has not been performed;
- G8 remains open;
- issue #201 remains open.

`CORRECTIVE MERGE ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
