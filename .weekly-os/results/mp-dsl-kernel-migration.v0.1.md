---
artifactId: dementor-club.result.mp-dsl-kernel-migration
project: dementor-club
documentType: RESULT
projectStage: CLARITY
gate: G1_PRODUCT_LOCK
status: DRAFT
version: 0.1
updated: 2026-09-03
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: —
---

# MP | Dementor Club | CLARITY | MP_DSL Kernel Migration | v0.1

## Goal
Migrate the existing legacy WeeklyOS harmonizer on the `dementor-club` semantic source branch to the minimum current MP_DSL Project Kernel without changing Dementor Club semantics, runtime, site implementation or release behavior.

## Base / Branch
Base semantic branch: `dementor-club`.
Integration branch: `result/mp-dsl-kernel-migration`.

## Existing Before New
Existing `.weekly-os/PROJECT.json` already establishes:
- project identity `dementor-club`;
- repository `SLADZARI/degradation_club`;
- semantic working branch `dementor-club`;
- product-document pointers;
- cross-system `doNotInfer` rules.

Repository `ARCHITECTURE.md` establishes the branch boundary:
- `main` = shared infrastructure;
- `dementor-club` = club semantic source-of-truth;
- `dementor-club-site` = implementation/staging;
- `dementor-club-production` = protected production candidate.

This Result extends that system; it does not replace it.

## Acceptance Criteria
- preserve `dementor-club` as semantic source branch;
- replace the legacy PROJECT router with current MP_DSL metadata while preserving existing authority pointers and `doNotInfer` rules;
- add `ARTIFACT_INDEX.json` and `APPROVED_STATE.json`;
- keep project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN unresolved unless explicit approval evidence exists;
- classify current operational/architecture/design docs according to their own statuses rather than promoting them;
- expose this Result and active branch in PROJECT.json;
- no edits to product/content/site/runtime files outside `.weekly-os/**`;
- no Supabase changes;
- no merge into `dementor-club-production`;
- no production deploy;
- runtime WeeklyOS `source_ref` correction is outside this Result.

## Existing Evidence Preserved
- `operations/IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md`: ARCHITECTURAL BOUNDARY / NOT IMPLEMENTED.
- `operations/DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md`: ARCHITECTURAL / PRODUCT DESIGN DRAFT; factual map and design implications are explicitly separated.
- `operations/UNIVERSAL_WORKSPACE_WIREFRAME_SPEC_V0.1.md`: PRODUCT / IA DRAFT / NOT IMPLEMENTED.

## Semantic Guardrails
- Dementor Club membership is not Modern Pilgrims membership.
- Dementor roles are not Modern Pilgrims roles.
- Shared identity does not imply shared project/system membership.
- Person attribution is not inferred from shared Git identity.
- Implementation/staging does not override club semantic source-of-truth.
- Merge does not imply production deployment.

## Affected Systems
`.weekly-os/**` governance only on the Dementor Club semantic branch lineage.

## Gate
Current: G1_PRODUCT_LOCK / kernel migration review.
The Result itself can reach G6 validation without resolving G1 PRODUCT authority; unresolved authority is an explicit outcome, not a reason to invent approval.

## Production Impact
NONE.
