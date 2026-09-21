---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
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
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Projects Public Media Fallback v1 | Result v0.1

## Goal

Remove the broken public-media promise on `/projects/`: the `LIVE FRAGMENT / VIDEO` area must render a meaningful, stable media state or an explicit working open/play path instead of a large inert black block.

Parent: #228 — STABILIZATION.

Scope: STAB-05 / BQA-21 only.

## Production baseline

`dementor-club-production@440ebce65efc46831a5736fc74a9bf798bf991d5`

Implementation must start from this exact production baseline.

## Existing truth / owner inventory

Canonical page owner:

- `projects/index.html`

Presentation owner:

- `projects-hub-v2.css`

Current production markup contains:

```text
dc-projects-v2__hero-reel-frame
→ static LIVE FRAGMENT fallback
→ no iframe/video runtime in the frame
→ external VIDEO ↗ link to YouTube Shorts
```

Current external source reference:

`https://www.youtube.com/shorts/dWokndhJLKQ`

Existing browser regression owner:

- `scripts/validate-projects-v2-browser.mjs`

Reusable existing user-initiated media pattern exists in the Course surface:

- `courses/slaboumie-i-otvaga/hero-video.js`

Reuse the interaction principle only. Do not create a second generic project-media system.

## Corrective boundary

First verify the current public source is still reachable/usable.

If the source is valid, the narrow corrective may use:

- a stable public-safe poster/fallback;
- an explicit `PLAY` / `ОТКРЫТЬ ВИДЕО` affordance;
- optionally a user-initiated privacy-respecting embed using the existing page owner;
- the existing external-link path as reliable fallback.

If the source is unavailable, remove/hide the inert video promise rather than leaving a full-height black rectangle.

Do not depend on autoplay.

Do not invent new Project semantics, Project state, storage, CMS or media pipeline.

## Acceptance criteria

1. `/projects/` does not show an empty/inert black media block.
2. A valid video source either:
   - renders behind explicit user action; or
   - has a stable public-safe poster/fallback with a working external open path.
3. No autoplay is required for the experience to make sense.
4. Aspect ratio remains stable.
5. External action has clear accessible text.
6. Keyboard focus and activation work.
7. Mobile 390 works without overflow or unusable dead media.
8. Mobile 360 works without overflow or unusable dead media.
9. Desktop Chromium works.
10. Direct reload with the section visible remains stable.
11. Existing Projects route/content/SEO/Header/Footer remain unchanged except for the owned media presentation.
12. No schema/RLS/auth/Membership/Board/Contribution changes.
13. Production→candidate diff contains only STAB-05-owned files.
14. Extend `scripts/validate-projects-v2-browser.mjs` rather than creating a parallel Projects validator.
15. Stop at validated candidate; no production merge/deploy without owner release decision.

## Expected owner boundary

Likely runtime/presentation:

- `projects/index.html`
- `projects-hub-v2.css`

Validation:

- `scripts/validate-projects-v2-browser.mjs`

Add a small page-specific JS owner only if a user-initiated embed is actually necessary; prefer extending the current page rather than creating a generic media framework.

## Must not touch

- Project entity semantics
- Board Project projections
- Current Program
- Project creation / BQA-22
- Contribution
- Membership / DC-9
- auth
- storage / RLS
- generic media pipeline / BQA-20
- other Project routes by analogy

## Gate

`G5_BUILD`

```text
schemaMutationAuthorized = false
semanticMutationRequired = false
changeProposalRequired = false
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = G5_BUILD_IN_PROGRESS
```

STAB-06 remains queued; do not start it in parallel.
