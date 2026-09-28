---
artifactId: dementor-club.operations.artifact-collaboration-production-deploy-2026-09-28
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_DEPLOYED
version: 1.0
updated: 2026-09-28
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionCommit: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
backendRun: 8
backendRunId: 36432607713
pagesRun: 135
pagesRunId: 36432865028
---

# Artifact Collaboration v1 — production deploy evidence

## Verdict

```text
PRODUCTION MERGE  PASS
BACKEND DEPLOY    PASS
PAGES DEPLOY      PASS
LIVE DB MIGRATION APPLIED
LIVE RETEST       PENDING
G8                NOT AUTHORIZED
```

## Exact production

`260c5fe911fb0cad9902ad2db5d76060f47c18cc`

The production branch still points to this SHA.

## Supabase production release

Canonical workflow:

`Deploy Dementor Supabase Production`

Run:

```text
#8 / 36432607713
head = 260c5fe911fb0cad9902ad2db5d76060f47c18cc
conclusion = SUCCESS
```

Release gate, exact production checkout, production-project validation, migration ledger preflight and dry-run all passed.

Exactly one tracked migration was pending:

`20260924002500_artifact_collaboration_v1.sql`

The workflow applied it successfully and the post-apply ledger is clean:

```text
remote max = 20260924002500
pending    = none
live migration count = 59
```

Telegram worker deployment was explicitly skipped.

## Pages production release

Canonical workflow:

`Deploy Dementor Production`

Run:

```text
#135 / 36432865028
head = 260c5fe911fb0cad9902ad2db5d76060f47c18cc
conclusion = SUCCESS
```

Build validation passed:

- registry/routes/feature state;
- content readiness;
- visual contract;
- canonical shell;
- built JavaScript syntax;
- browser shell/Workspace recovery;
- production route manifest;
- production artifact release gate.

GitHub Pages deployment was created for exact production SHA `260c5fe911fb0cad9902ad2db5d76060f47c18cc` and reported success.

## Remaining gate

Deployment evidence alone does not close the Result.

Required next step:

**live authenticated acceptance on the deployed production surface**, including the Artifact Collaboration flow and the S2 regression path.

Until that evidence exists:

```text
Result = ACTIVE
Gate = G7_RELEASE
gateReadiness = LIVE_ACCEPTANCE_PENDING
G8 = NOT AUTHORIZED
```
