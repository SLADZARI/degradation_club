---
artifactId: dementor-club.result.pre-ad-qa
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G6_VALIDATION
status: DRAFT
version: 0.1
updated: 2026-08-31
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
---

# Dementor Club — Pre-ad QA

## Goal

Reach an evidenced, usable and promotion-safe Dementor Club baseline before paid/public advertising. The target is not feature completeness; the target is that the promoted path and core member path can be used without embarrassing breakage, hidden state contradictions or release-critical regressions.

## Branch

`dementor-club-qa`

This Result extends the existing QA branch and contracts. It does not create a parallel QA convention.

## Governing existing artifacts

- `docs/QA_RELEASE_CONTRACT_v1.md`
- `docs/PRODUCTION_QA_v1.md`
- `docs/DEMENTOR_DESIGN_CANON_CURRENT.md`
- `qa/QA_ENVIRONMENT_POLICY_v1.md`
- `qa/QA_PREVIEW_DEPLOYMENT_v1.md`

## Scope

### Promotion path

- landing/home entry
- About / positioning surfaces materially used by promotion
- Join / CTA path
- social/OG preview for URLs used in advertising

### Core product path

- authentication callback/session restoration
- Community
- Profile/account surface where active
- Workspace/member surface where active
- first Artifact / member activation path where current runtime supports it
- Telegram/outbox behavior relevant to the current member flow

### Quality dimensions

- functional behavior
- state/logic consistency
- responsive/visual regressions
- Supabase/session/data persistence
- navigation and routes
- console/runtime errors
- external integration safety
- privacy/indexation/analytics safety

## Out of scope unless a finding makes it a blocker

- speculative new features
- redesign unrelated to the promoted/core path
- broad refactors without evidence of root-cause necessity
- deferred local Supabase infrastructure implementation
- semantic changes to approved club/domain meaning without Change Proposal

## Manual QA capture contract

Each finding receives `DCQA-###` and records:

- route
- surface
- block
- application/member state if known
- viewport/device
- action performed
- actual behavior
- expected behavior
- screenshot/evidence reference

Human reviewers do not need to classify root cause while walking the product. Classification, deduplication and dependency grouping happen after capture.

## Finding classification

Operational labels only; they do not replace domain vocabulary:

- BUG
- LOGIC
- UX
- VISUAL
- CONTENT
- MISSING_STATE
- MISSING_SURFACE
- DATA
- INTEGRATION
- TECH_DEBT

Any finding that requires new/redefined approved entity/state/role/flow semantics becomes a `CHANGE_PROPOSAL` candidate before implementation.

## Severity

- P0 — promotion/release blocker, data/security/privacy failure, broken auth/session/core path
- P1 — major usability or logic defect on promoted/core path
- P2 — material defect with workaround or secondary-path impact
- P3 — polish/non-blocking cleanup

## Acceptance criteria

1. QA preview exposes deterministic screenshot context through the QA HUD without changing production source markup.
2. Nikita/Zhenya can traverse the product and capture findings using route/surface/block/state context.
3. All captured findings are normalized into one QA register and deduplicated by root cause.
4. P0 findings are zero before advertising.
5. P1 findings on the exact advertised entry → CTA/join → auth/member path are zero or explicitly accepted as documented release warnings.
6. Critical responsive checks pass at 360, 390, 768, 1024 and 1440 widths on promoted public surfaces.
7. Auth/session callback and relevant Supabase persistence smoke tests pass.
8. Community/member critical path is evidenced against current implemented states; no silent state invention is used to make the test pass.
9. Telegram/outbox integration has no known regression caused by QA fixes.
10. Promotion URLs have usable canonical/OG/social preview and no internal/test contamination.
11. Automated validators remain green for the production candidate.
12. Final status is explicitly `READY_FOR_ADVERTISING` or `BLOCKED` with blockers listed.

## Evidence plan

- QA build commit / preview deployment
- screenshots named/referenced by `DCQA-###`
- QA register
- console/runtime notes
- responsive matrix result
- critical-path smoke result
- production diff / PR and validator evidence when fixes are integrated
- post-release live smoke before advertising traffic is sent

## Current status

QA instrumentation prepared. Manual traversal and finding capture remain OPEN.

## Weekly OS projection

This Result is also a live operating case for Weekly OS: a project can expose a concrete Result, current Gate, evidence stream, blockers and readiness outcome without Weekly OS becoming the semantic source of truth for Dementor Club.
