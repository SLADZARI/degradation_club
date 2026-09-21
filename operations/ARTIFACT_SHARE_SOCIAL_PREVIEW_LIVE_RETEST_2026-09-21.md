---
artifactId: dementor-club.operations.artifact-share-social-preview-live-retest-2026-09-21
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-04 · Artifact Share Social Preview · production/live retest

## Release identity

Validated candidate:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

Production merge commit:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

PR:

`#233 · MERGED`

Pages release:

```text
Deploy Dementor Production #126
run id = 35658317210
head SHA = 440ebce65efc46831a5736fc74a9bf798bf991d5
build = SUCCESS
deploy = SUCCESS
```

Supabase deployment:

`NOT REQUIRED / NOT RUN`

## Owner live acceptance

The owner manually exercised the requested fresh production share-preview flow after deploy and confirmed all requested checks working.

```text
fresh Telegram share produces preview                 PASS
preview image renders whole / no gray broken region   PASS
new Artifact share preview is used                    PASS
message/share click opens the intended Artifact flow  PASS
private Artifact media is not exposed before access   PASS
```

The check used a fresh share after the versioned public-safe social raster release. Previously cached Telegram previews remain a downstream-cache concern and are not treated as a production regression when a fresh share passes.

## Verdict

`PASS_LIVE_FRESH_ARTIFACT_SHARE_PREVIEW`

## Gate consequence

```text
candidate validation       PASS
production merge           PASS
Pages exact SHA            PASS
Pages deployment           PASS
live fresh-preview QA      PASS
STAB-04 → WAITING / G8     AUTHORIZED
STAB-05 activation         AUTHORIZED
```

Parent stabilization issue #228 remains open for remaining BQA work.
