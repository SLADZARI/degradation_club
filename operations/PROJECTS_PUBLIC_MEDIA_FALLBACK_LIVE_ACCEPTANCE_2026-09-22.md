---
artifactId: dementor-club.operations.projects-public-media-fallback-live-acceptance-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-05 · Projects Public Media Fallback · Live acceptance

## Exact release identity

Validated corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Production:

`287b485293d68098dfd3c9302785369a735d42e2`

PR:

`#236 · MERGED`

Validation:

```text
Site Integrity / Release Readiness #1233
run id = 35671603405
conclusion = SUCCESS
```

## Pages deployment

Canonical workflow:

`Deploy Dementor Production`

Exact deployment:

```text
run number = 129
run id = 35708869679
head SHA = 287b485293d68098dfd3c9302785369a735d42e2
status = COMPLETED
conclusion = SUCCESS
build = SUCCESS
deploy = SUCCESS
```

Therefore Pages deployment is proven against the exact production commit.

## Owner human-browser live retest

Owner completed live acceptance on:

`/projects/`

Observed:

```text
real YouTube player renders     PASS
video playback works            PASS
9:16 media surface              PASS
unavailable-state copy absent   PASS
empty black media absent        PASS
```

This owner human-browser playback evidence resolves the automated-browser anti-bot limitation recorded during candidate validation.

## Exact runtime boundary

Old production `4a8e95cb669dab660a7afe381e580278d4575a2a` → production `287b485293d68098dfd3c9302785369a735d42e2`:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

Candidate → production content diff:

`0 files`

## Backend boundary

`Supabase = NOT REQUIRED / NOT RUN`

No schema, DB, Storage or RLS mutation belongs to STAB-05.

## Gate consequence

```text
STAB-05 status          = WAITING
gate                    = G8_CLEANUP
integrationBranch       = null
liveRetestStatus        = PASS
Pages exact SHA         = PASS
owner human playback    = PASS
Supabase                = NOT REQUIRED / NOT RUN
```

G8 cleanup is now the only remaining lifecycle work for STAB-05.

This evidence does not activate STAB-06.
