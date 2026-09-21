---
artifactId: dementor-club.operations.public-activity-truth-boundary-release-tooling-blocker-2026-09-21
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
---

# Public Activity Truth Boundary v1 — release execution checkpoint

Owner explicitly authorized STAB-01 production release on 2026-09-21.

Validated RC:

`40ba7ecea44206ded37ceb714d2becb6f2698c12`

PR #230 was marked ready and merged with expected-head protection.

Production merge commit:

`0852d2602df5593deead797b20c50daa36fe1c1c`

Production baseline → merged production contains exactly the five STAB-01 files:

- `public-activity-v1.js`
- `scripts/validate-board-public-activity-browser.mjs`
- `scripts/validate-board-public-activity-contract.mjs`
- `scripts/validate-evidence-hygiene-browser.mjs`
- `supabase/migrations/20260921134959_public_activity_truth_boundary_v1.sql`

No unrelated staging/reconciliation delta entered production.

## Backend release execution

Canonical workflow:

`Deploy Dementor Supabase Production`

Required dispatch inputs:

`release_confirmation = APPROVED`

`deploy_telegram_worker = false`

The connected GitHub tool does not expose workflow_dispatch. Browser automation reached the GitHub Actions page but had no authenticated GitHub session; the Run workflow control was unavailable.

Therefore:

```text
production merge = COMPLETE
backend workflow = NOT TRIGGERED
live database mutation = NOT EXECUTED
Pages workflow = NOT TRIGGERED
live retest = NOT STARTED
release execution = BLOCKED_TOOLING_AUTH
```

This is a tooling/authentication blocker only. It does not invalidate the validated RC or owner release authorization.

Release must resume from the canonical backend workflow; do not apply the migration ad hoc. Telegram worker must remain untouched.
