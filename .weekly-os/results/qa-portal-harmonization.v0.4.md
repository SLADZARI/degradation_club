---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.4
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.4

## Goal
Complete pre-advertising technical QA and live convergence without parallel owners, semantic mutation or blind site → production merges.

## Status
**ACTIVE / G7_RELEASE / FINAL TECHNICAL BATCH DEPLOYED / DEPLOY #35 SUCCESS / LIVE SEQUENTIAL RETEST REQUIRED**

Implementation branch: `result/qa-portal-harmonization`  
Release branch: `release/qa-portal-harmonization-v02-batch-final`  
Production branch: `dementor-club-production`  
Current production HEAD: `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`  
Current live deployed content HEAD: `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`

## Authority / protected boundaries
All protected boundaries and detailed implementation history are inherited unchanged from v0.3 and v0.2. In particular:
- `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`;
- first complete DC-9 baseline is immutable;
- Workspace remains the canonical authenticated shell;
- Artifact creation remains owned by the existing Board slot/composer flow;
- admin role does not silently grant unlimited publication;
- MP_DSL v0.1 remains DRAFT / REFERENCE.

## Validated production artifact
Final clean candidate `0855386b7e3dc8cf81447cee4e90ad51ce6cb9d2` was built directly on production baseline `96d16391a60f8e400ff07f90f3d6a864fb861776` and contained exactly 9 intended files, 1 commit ahead / 0 behind.

Production Release Readiness #769 passed completely. PR #114 merged the exact validated tree `ac8217ded93ecbdfe8aa630e764d99ce0435a7e5` into production as `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`.

## Pages deploy #35
The user explicitly authorized deployment with `деплой` and manually dispatched canonical `Deploy Dementor Production` from the workflow definition on `main` with `release_confirmation=APPROVED`.

Run #35 (`33975300949`) completed successfully on 2026-09-05:
- build job: PASS;
- deploy job: PASS;
- `Checkout canonical production branch`: PASS;
- checkout ref: `dementor-club-production`;
- `git log -1 --format=%H` inside the build resolved exactly to `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`;
- registry/routes/feature validation: PASS;
- content readiness: PASS;
- visual contract: PASS;
- production Pages build: PASS;
- analytics + consent guard: PASS;
- production release guard: PASS, 48 HTML routes covered;
- Pages artifact upload: PASS;
- artifact id: `9972127612`;
- artifact digest: `sha256:006a0441db6a8a30ad8218e6bdd142025865dbf5663417dd3ced387e4a06c388`;
- GitHub Pages deployment: PASS / reported success.

GitHub Pages deployment metadata carries the workflow-definition `main` SHA as its build-version identifier, but the build log independently proves that the artifact content was produced from the exact canonical production commit above. Therefore deployed content authority is `6a7c4d61...`, not the `main` workflow-definition SHA.

## What is now live
The combined live delta includes:
- Board Artifact-slot discoverability control using the existing canonical composer/entry owner;
- active Artifact detail destinations canonicalized to `/workspace/board/` and `/join/`;
- Safari-safe `prompt=select_account` convergence across all identified production-facing Google login owners;
- strengthened existing auth, shell, Board slot and mobile Join/Application regression contracts.

No new route family, auth architecture, membership state, DB entity, role bypass or second composer was introduced.

## Existing live evidence inherited from earlier deploys
Already evidenced before deploy #35:
- real Safari public Google login/callback: LIVE PASS;
- Workspace logout → repeated Google login: LIVE PASS;
- ordinary Member authenticated landing → Community Board: LIVE PASS for observed sessions;
- My Activity projection: LIVE PASS;
- My Artifacts active + archive history including archived `гусь`: LIVE PASS;
- Board drag/reposition persistence: LIVE PASS;
- live immutable DC-9 database migrations/functions/trigger: APPLIED + VERIFIED.

These remain historical evidence but the combined deploy still requires regression confirmation for affected flows.

## Required sequential live retest
Do not close G7 from deploy success alone. Retest in one sequence:
1. Board slot control and existing create/manage/archive flow;
2. Artifact detail canonical Board/Join destinations;
3. public Header guest/authenticated/member identity states;
4. Workspace guest boundary and ordinary Member default → Board;
5. Board root/child navigation including QA-MEM-033;
6. first Artifact spotlight without false activation;
7. owner-admin geometry and Review access, without unapproved unlimited publication;
8. Safari/public + private Google login entry points as needed to confirm combined auth convergence;
9. mobile Join/DC-9 and Application at phone widths;
10. immutable first-complete DC-9 baseline → repeat → Application snapshot behavior;
11. live route/canonical/SEO integrity;
12. regression confirmation for My Activity, My Artifacts and Board drag.

## Deferred / decision-required
Remain outside this technical batch unless explicitly decided:
- unlimited owner/admin/system-card publication;
- QA-MEM-004 historical course repeat-state product decision;
- final DC-9 onboarding/result/application copy and visual polish;
- compatibility-route deletion and old implicit/hash auth-preboot removal — G8 cleanup after live evidence.

## Closure path
`deploy #35 → sequential live QA → reconcile canonical QA ledger → close/reclassify remaining P0/P1 → G8 cleanup → only then close this Result and open the separate pre-advertising content/visual Result.`

## Gate
Current gate remains **G7_RELEASE**. The production artifact is deployed, but the Result is not yet `DONE`, `VALIDATED`, or closed until sequential live evidence is complete.
