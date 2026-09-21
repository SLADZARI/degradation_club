---
artifactId: dementor-club.result.artifact-share-social-preview-v1
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
  - STAB-04
  - BQA-14
integrationBranch: result/artifact-share-social-preview-v1
productionBaseCommit: 692c87da4a15a986861c18d41fc9861aa1cb08f6
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Artifact Share Social Preview v1 | Result v0.1

## Goal

Make Artifact share transport produce a stable public-safe social preview with correct raster integrity/aspect and no broken/cropped gray region, without exposing private Artifact media or body content.

Parent: #228 — STABILIZATION.

Scope: STAB-04 / BQA-14 only.

## Production baseline

`dementor-club-production@692c87da4a15a986861c18d41fc9861aa1cb08f6`

Implementation must start from this exact production baseline. Do not use diverged `dementor-club-site` as a merge base.

## Existing owners

Share transport:

- `community/board/board-deeplink-auth-return-v1.js`
- `/share/artifact/`

Effective deployed OG/social head owner:

- `scripts/build-pages.mjs`
- `scripts/social-head-v1.mjs`

Current effective social raster:

- `assets/social/dementor-social-default.jpg`
- 1200×630
- public-safe generic club media

Raw `share/artifact/index.html` contains older source metadata, but production build normalizes `/share/artifact/` through `social-head-v1.mjs`.

## Confirmed forensic

Historical share generations used:

1. `dementor-artifact-share-postcard.webp` — physically truncated/corrupt;
2. `community-hero-01.webp` — valid portrait 1210×1402 and crop-prone;
3. current generic `dementor-social-default.jpg` — valid 1200×630 JPEG.

Current production contract does not directly expose private Artifact media to crawlers.

Old Telegram preview state may remain cached and cannot be proven from repository state alone.

## Required corrective boundary

Keep:

```text
Artifact-specific private media/body
≠ automatic OpenGraph content
```

A narrow stabilization corrective may:

- use a dedicated public-safe Artifact transport raster;
- use an exact valid 1200×630 raster;
- prefer a fresh/versioned public asset URL so downstream caches are not pointed at historical broken sources;
- strengthen canonical social validation to assert binary dimensions/integrity and MIME consistency;
- align raw source metadata for clarity if useful, while preserving `social-head-v1.mjs` as the effective deployed owner.

Do not create a new social/share system.

## Acceptance criteria

1. Built `/share/artifact/` exposes one stable public-safe HTTPS image.
2. Raster is complete and decodable.
3. Actual pixel dimensions are exactly 1200×630.
4. Declared OG dimensions match binary dimensions.
5. MIME/type matches raster.
6. `twitter:image == og:image`.
7. No private Artifact media, storage path or signed URL appears in social metadata.
8. Share human transport continues routing exact Artifact identity into the canonical Board receive flow.
9. Fresh social URL renders a non-broken large-card preview.
10. A previously cached Telegram URL may remain stale; that must be recorded as downstream cache if a fresh URL passes.
11. No schema/RLS/access/membership changes.
12. Production→candidate diff contains only STAB-04-owned files.
13. Stop at validated candidate; no production merge/deploy without owner release decision.

## Expected owner boundary

Primary:

- `scripts/social-head-v1.mjs`

Static public-safe raster:

- `assets/social/`

Potential source-alignment file:

- `share/artifact/index.html`

Validation owner:

- existing canonical social-head / share validation; extend existing validator before creating a parallel test.

## Must not touch

- `dc_artifact_media`
- `dc-community-artifacts`
- Storage RLS
- `signedMediaUrl()`
- Artifact schema
- Board Relations
- Artifact detail
- Public Activity
- Membership
- Contribution

Do not make private storage public.
Do not put temporary signed URLs into OG metadata.
Do not introduce Artifact-specific public preview fields in this stabilization Result.

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

STAB-05 remains queued; do not start it in parallel.
