---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g5-local-stack-blocker-2026-09-24
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKED
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
candidateBranch: result/artifact-collaboration-v1
candidateCommit: 3522993d6796fe9dae81a0c7dbde1ddcc1aa350a
liveDatabaseMutationAuthorized: false
supersedesEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_NONPROD_BLOCKER_2026-09-24.md
---

# Artifact Collaboration v1 — Backend G5 local Supabase stack blocker

## Owner cost boundary

Current owner instruction:

- do not create Supabase Development Branch / Preview Branch;
- do not add paid services, plans or infrastructure cost inside this Result;
- G5 SQL validation must use free local Supabase stack:
  `Supabase CLI + Docker`;
- live Supabase must not be used as a validation target;
- if a production-compatible local schema cannot be reproduced correctly, STOP and record the exact blocker.

This evidence supersedes the previous development-branch validation path as the current execution route.

## Exact candidate

Production baseline:

`df8a24eca2bcca25339f128c7da93982515cf442`

Backend candidate:

`result/artifact-collaboration-v1@3522993d6796fe9dae81a0c7dbde1ddcc1aa350a`

Production migration head was re-read after this validation attempt and remains:

`20260921134959_public_activity_truth_boundary_v1`

No live migration was applied.

## Corrections included in exact candidate

Before local execution, the current Result branch contains the approved corrections for:

1. CIRCLE hidden-Artifact no-oracle mutation boundary;
2. relation delete no-oracle boundary;
3. Owner Admin relation-delete authority preservation.

Static validator was rerun against the exact candidate after these corrections and passed.

## Required local validation

Owner requested local non-production validation for:

- migration execution;
- rollback/reset;
- repeatability;
- RPC positive/negative cases;
- RLS;
- CIRCLE no-oracle;
- Storage ACL where locally reproducible.

## Local runner inventory

The available execution runner was checked before attempting any paid or live alternative.

Observed:

```text
supabase binary: MISSING
docker binary: MISSING
docker socket: MISSING
podman: MISSING
psql: MISSING
postgres: MISSING
pg_ctl: MISSING
npm cached supabase entries: NONE
```

Ordinary outbound DNS from the runner is unavailable:

- github.com resolution: unavailable;
- registry.npmjs.org resolution: unavailable;
- Debian package index resolution: unavailable.

Consequences:

- `git clone` cannot reach GitHub;
- `apt-get update` cannot resolve Debian mirrors;
- npm cannot download Supabase CLI;
- standalone Docker binary download from the runner is unavailable;
- there is no pre-existing Docker-compatible daemon/socket to reuse.

Therefore the required local Supabase stack cannot be started in this runner.

## What was deliberately not substituted

To preserve the approved validation boundary, DEV1 did NOT substitute:

- live production Supabase;
- a paid Supabase Branch/Preview;
- another unrelated existing Supabase project;
- plain PostgreSQL without the requested Supabase CLI + Docker stack;
- a second infrastructure owner;
- production merge/deploy.

## Validation truth

```text
G4 owner contract                  PASS
G5 branch migration                READY
G5 static validator                PASS
G5 local Supabase stack start      BLOCKED
G5 PostgreSQL migration execution  NOT RUN
G5 rollback/reset                  NOT RUN
G5 repeatability                   NOT RUN
G5 RPC positive/negative           NOT RUN
G5 RLS matrix                      NOT RUN
G5 CIRCLE runtime no-oracle        NOT RUN
G5 Storage local ACL               NOT RUN
G6                                  NOT ENTERED
```

This is a local execution-environment blocker, not evidence that the migration itself fails.

## Exact unblock requirement

Provide any execution runner that has, at no additional paid infrastructure cost:

- Docker-compatible daemon;
- Supabase CLI;
- outbound access required to pull the standard local Supabase images, OR those images already cached;
- enough access to the exact repository/migrations to reproduce the production migration chain.

Then rerun the exact candidate without changing the approved semantics.

## STOP boundary

```text
LIVE SUPABASE APPLY = NO
PAID SUPABASE BRANCH = NO
NEW PAID INFRASTRUCTURE = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

DEV1 stops here until the free local Supabase stack is actually available.
