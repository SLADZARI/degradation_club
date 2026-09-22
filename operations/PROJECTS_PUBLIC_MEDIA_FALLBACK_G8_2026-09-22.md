---
artifactId: dementor-club.report.projects-public-media-fallback-g8-2026-09-22
project: dementor-club
documentType: REPORT
projectStage: BUILD
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
supersedes: null
---

# MP | Dementor Club | REPORT | Projects Public Media Fallback G8 | v1.0

## Result

`dementor-club.result.projects-public-media-fallback-v1@1.0`

## Goal

Remove the broken public-media promise on `/projects/` and provide a meaningful, accessible, stable media path without creating a new generic media system.

## Validation evidence

Candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Site Integrity / Release Readiness:

`#1233 / 35671603405 · SUCCESS`

Exact candidate-owned files:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

## Release evidence

PR:

`#236 · MERGED`

Production:

`287b485293d68098dfd3c9302785369a735d42e2`

Pages:

`Deploy Dementor Production #129 / 35708869679 · SUCCESS`

Exact production SHA verified: `PASS`.

## Live acceptance

Owner human-browser acceptance on `/projects/`:

- real YouTube player renders — PASS;
- playback works — PASS;
- 9:16 media surface — PASS;
- rejected unavailable-state copy absent — PASS;
- empty black media absent — PASS.

Original live evidence:

`operations/PROJECTS_PUBLIC_MEDIA_FALLBACK_LIVE_ACCEPTANCE_2026-09-22.md`

## Backend boundary

Supabase / schema / Storage / RLS mutation:

`NOT REQUIRED / NOT RUN`

## G8 conclusion

All STAB-05 acceptance criteria are evidenced.

- integration ownership cleared;
- Result closed as APPROVED;
- current Result slot released;
- no STAB-06 implementation is activated by this closure.

## Governance note

Historical STAB-05 evidence used temporary project-local `RELEASE / ACTIVE / WAITING` metadata. Current machine pointers follow:

`operations/MP_DSL_LIFECYCLE_FIELD_MAPPING_DECISION_V1.md`

Historical evidence remains historical; it is not rewritten.
