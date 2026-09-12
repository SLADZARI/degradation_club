---
artifactId: dementor-club.evidence.board-information-architecture-production-release-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE_EVIDENCE
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
productionCommit: 75e074a431f18bd65506bf567ae21308057b24fe
productionDeployRun: 57
productionDeployRunId: 34702060603
pagesArtifactId: 10300324172
---

# Board Information Architecture v1 — production release evidence — 2026-09-12

## Release authorization

The project owner explicitly authorized the Board frontend production merge/deploy on 2026-09-12 after the Telegram worker deployment was completed.

## Production merge

Validated PR #145 was squash-merged into `dementor-club-production`.

Production commit:

`75e074a431f18bd65506bf567ae21308057b24fe`

The release candidate had previously passed Site Integrity / Release Readiness #974 (run id `34701054386`).

## Production Pages deployment

The owner manually launched the canonical production workflow after merge.

Workflow:

`Deploy Dementor Production`

Canonical controller:

`main:.github/workflows/deploy-production.yml`

The workflow intentionally runs from `main`, but its build job explicitly checks out `dementor-club-production` before validation/build.

Run:

- run number: `57`;
- run id: `34702060603`;
- event: `workflow_dispatch`;
- conclusion: `success`.

Build logs confirmed the checked-out production SHA was exactly:

`75e074a431f18bd65506bf567ae21308057b24fe`

Release guards passed before artifact upload:

- site registry/routes/feature state;
- content readiness;
- visual contract;
- production Pages build;
- analytics/consent;
- production artifact/release gate.

Pages artifact:

- id: `10300324172`;
- name: `github-pages`;
- size: `14748300` bytes;
- digest: `sha256:99eb66b0ad5124e3402b7474a4093bd9462b8c4e9ab2c162df8b9b49a359ffea`.

Deploy job concluded `success` and GitHub Pages reported successful publication to the Dementor Club environment.

## Post-deploy backend safety check

A read-only production DB check after site deployment confirmed:

- `dc_artifacts`: 8 total;
- Artifact statuses: `5 expired + 3 archived`;
- outbox: `6 sent + 1 failed`;
- `pending`: 0;
- `processing`: 0;
- `delivery_unknown`: 0.

Therefore the frontend deployment itself did not create or claim Telegram delivery work and did not mutate Artifact lifecycle state.

## What this evidence proves

This evidence proves:

- the validated production commit was the source actually built;
- production Pages workflow completed successfully;
- production artifact/deployment guards passed;
- backend state remained stable immediately after site deploy.

It does **not** by itself prove authenticated live-browser behavior for every Board user state.

## Remaining live validation

Still open:

1. Real authenticated production route regression for `/workspace/board/`, `/community/artifact/:id/`, `/workspace/artifacts/` after deploy.
2. Real non-owner Dementor path `0/2 → 1/2 → 2/2 → held → pending` remains unavailable because production has no legitimate active non-owner Dementor actor.
3. External Telegram delivery through worker v10 remains to be observed when a legitimate eligible row reaches `pending`.

No synthetic role or delivery row is created solely to manufacture validation evidence.

## Status boundary

- production DB migrations — DONE;
- Telegram worker v10 — DEPLOYED;
- production frontend merge — DONE;
- production Pages deploy — DONE / workflow #57 SUCCESS;
- authenticated live retest — PENDING;
- full Result DONE / G8 — NOT CLAIMED.

`Evidence before done.`
