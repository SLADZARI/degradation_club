---
artifactId: dementor-club.operations.artifact-share-social-preview-g6-2026-09-21
project: dementor-club
documentType: QA_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-04 · Artifact Share Social Preview · G6 validation

## Result

`artifact-share-social-preview-v1`

Scope:

`STAB-04 / BQA-14`

## Exact identity

Production baseline:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

Integration branch:

`result/artifact-share-social-preview-v1`

Validated candidate:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

Draft PR:

`#233`

Canonical CI:

`Site Integrity / Release Readiness #1230`

Run id:

`35648978456`

Conclusion:

`SUCCESS`

## Corrective

Effective social owner remains:

`scripts/social-head-v1.mjs`

Dedicated public-safe Artifact share raster:

`assets/social/dementor-artifact-share-v1-20260921.png`

Contract:

- exact binary dimensions: 1200×630;
- complete PNG container;
- public HTTPS URL;
- `og:image:type = image/png`;
- declared OG width/height match binary width/height;
- `twitter:image == og:image`;
- no private Artifact media, Storage path, signed URL or token in social head;
- human `/share/artifact/?id=<uuid>` transport still routes exact Artifact identity into canonical Board receive flow.

Raw source metadata in `share/artifact/index.html` is aligned with the same dedicated asset; build-time authority remains `social-head-v1.mjs`.

## Existing validation extended

No second social/share validation system was introduced.

Extended existing owners:

- `scripts/social-head-v1.mjs` binary-aware social validation;
- `scripts/validate-board-deeplink-auth-return-contract.mjs`;
- `scripts/validate-board-deeplink-auth-return-browser.mjs`.

The first CI attempt exposed an old validator assertion requiring `community-hero-01.webp`. That assertion was updated in the existing canonical share validator rather than bypassed.

## Build-output evidence

CI log confirms:

```text
Canonical social metadata: 34 indexable HTML routes covered; favicon + OG/Twitter raw-head contract PASS.
GitHub Pages production candidate ready for https://dementor.club at .../_site
BOARD DEEPLINK AUTH-RETURN BROWSER PASS
✓ fresh built share URL exposes dedicated public-safe 1200x630 PNG head + fetchable raster without private media
Production route manifest passed: 34 indexable routes · 17 private/compat routes · 1 disabled routes
```

Therefore the corrective is proven on the built production artifact, not only on source text.

## Boundary

No changes to:

- `dc_artifact_media`;
- private bucket `dc-community-artifacts`;
- `signedMediaUrl()`;
- Storage RLS;
- Artifact schema;
- Board Relations;
- Artifact detail;
- Public Activity;
- Membership;
- Contribution.

No schema mutation.
No semantic mutation.
No Change Proposal required.

## G6 verdict

`PASS`

Candidate is eligible for G7 release-candidate precheck.
