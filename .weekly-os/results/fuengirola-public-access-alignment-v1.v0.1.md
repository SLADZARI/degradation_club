---
artifactId: dementor-club.result.fuengirola-public-access-alignment-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: REVIEW
workStatus: ACTIVE
version: 0.1
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
sourceDecisionIssue: 204
scope:
  - BQA-10
  - Fuengirola public access alignment
integrationBranch: result/fuengirola-public-access-alignment-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: 7827a4d5e8bee21c142390a9e9ea78e4542e1ee9
productionBaseCommit: 7827a4d5e8bee21c142390a9e9ea78e4542e1ee9
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Fuengirola Public Access Alignment v1 | Result v0.1

## Goal

Align the Fuengirola public Event presentation with approved local authority:

`operations/FUENGIROLA_ACCESS_POLICY_DECISION_V1.md`

Approved invariant:

```text
MEMBERSHIP / ONBOARDING
≠
FUENGIROLA ELIGIBILITY
```

Confirmed Event information is public directly. Join Club is not the Event CTA. Registration remains disabled. Unknown date, venue, price, payment and availability remain unknown.

## Exact production base

`7827a4d5e8bee21c142390a9e9ea78e4542e1ee9`

## Bounded implementation corridor

Expected runtime/content owners:

- `events/index.html`
- `events/fuengirola/index.html`
- `content/events/fuengirola.json`

Existing validators to extend:

- `scripts/validate-site.mjs`
- `scripts/validate-visual-contract.mjs`
- `scripts/validate-public-harmonization-browser.mjs`

No CSS owner is expected to change.

Protected owners:

- `current-program-v1.js`
- `home-current-program-v1.js`
- `community/board/board-program-v1.js`
- `thing-projection-v1.js`
- Membership / DC-9 / Auth
- Supabase schema / RPC / RLS
- registration backend

## Acceptance

- anonymous `/events/` does not expose `DETAILS AFTER JOIN` for Fuengirola;
- `/events/fuengirola/` shows confirmed facts directly;
- no Event-owned Join CTA;
- no fake registration/booking/waitlist/payment CTA;
- status remains PLANNED;
- registration remains disabled;
- unknown facts remain unknown;
- Current Program and Board composition remain unchanged;
- desktop + 390 + 360 pass;
- route/canonical/OG/indexability remain intact.

## Gate

`G5_BUILD`

Stop at validated candidate before production release.
