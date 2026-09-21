---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.2
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-05
  - BQA-21
integrationBranch: result/projects-public-media-fallback-v1
productionBaseCommit: 440ebce65efc46831a5736fc74a9bf798bf991d5
candidateCommit: 581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f
releaseCandidateCommit: 581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f
integrationPullRequest: 234
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Projects Public Media Fallback v1 | Result v0.2

## Status

**ACTIVE / G7_RELEASE — VALIDATED CANDIDATE / READY FOR RELEASE DECISION**

## Production baseline

`dementor-club-production@440ebce65efc46831a5736fc74a9bf798bf991d5`

Integration branch:

`result/projects-public-media-fallback-v1`

Validated candidate:

`581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

Draft PR:

`#234`

## Source verdict

The configured YouTube Shorts source `dWokndhJLKQ` is no longer playable.

Observed public browser state:

`Video unavailable`

No working play path exists at that source.

Therefore this Result uses the approved unavailable-source behavior: collapse the inert media promise instead of creating an embed/autoplay dependency.

## Corrective

Canonical Projects owners remain unchanged.

The public Projects hero now:

- has no large empty black 9:16 frame;
- has no broken external YouTube link;
- shows one compact explicit unavailable-fragment state;
- has no iframe/video runtime;
- creates no dead focusable media controls;
- remains stable on reload.

## Validation

Evidence:

`operations/PROJECTS_PUBLIC_MEDIA_FALLBACK_G6_2026-09-21.md`

Canonical CI:

```text
runNumber = 1232
runId = 35660069754
headSha = 581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f
conclusion = SUCCESS
```

Targeted built-browser coverage:

```text
1440 PASS
390 PASS
360 PASS
reload PASS
no overflow PASS
no legacy black frame PASS
no broken source link PASS
no iframe/video runtime PASS
no dead focusable media controls PASS
canonical shell/routes PASS
```

## Exact diff

Production → candidate:

```text
ahead = 5
behind = 0
changed files = 3
```

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

## Change control

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backendProductionDeployRequired = false
liveDatabaseMutationRequired = false
```

## Gate

`G7_RELEASE`

```text
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

PR #234 remains DRAFT / UNMERGED.

STOP at validated candidate.

STAB-06 is not started.
