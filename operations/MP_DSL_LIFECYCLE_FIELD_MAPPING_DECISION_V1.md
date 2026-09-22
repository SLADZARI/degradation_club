---
artifactId: dementor-club.decision.mp-dsl-lifecycle-field-mapping-v1
project: dementor-club
documentType: DECISION
projectStage: BUILD
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
supersedes: null
---

# MP | Dementor Club | DECISION | MP_DSL Lifecycle Field Mapping | v1.0

## Decision

Dementor Club adopts the canonical MP_DSL **machine-field semantics** below for its project kernel, Result metadata and cross-project reporting.

This is a narrow local governance decision. It does **not** promote all MP_DSL v0.1 Product, Domain, Architecture or Design material into Dementor Club authority.

## Canonical mapping

### projectStage

Allowed project lifecycle values:

`SIGNAL / CLARITY / DECISION / BUILD / HANDOVER / ARCHIVE`

Engineering release state is not a projectStage.

For an actively evolving Dementor Club product, release work remains under projectStage `BUILD` unless an explicit project-lifecycle Decision changes the project stage.

### gate

Engineering gates remain:

`G0_SIGNAL / G1_PRODUCT_LOCK / G2_DOMAIN_LOCK / G3_ARCHITECTURE_LOCK / G4_DESIGN_LOCK / G5_BUILD / G6_VALIDATION / G7_RELEASE / G8_CLEANUP`

Therefore `RELEASE` belongs in `gate = G7_RELEASE`, not in `projectStage`.

### Artifact lifecycle status

Durable Artifact lifecycle:

`DRAFT / REVIEW / APPROVED / SUPERSEDED / ARCHIVED`

Operational states such as `ACTIVE`, `WAITING`, `BLOCKED`, `READY_FOR_RELEASE_DECISION` or `PASS` are not Artifact lifecycle values.

### workStatus

Operational Result/work state may be represented separately, for example:

`ACTIVE / WAITING / BLOCKED`

This field does not replace Artifact lifecycle status.

## Release evidence separation

The following remain distinct:

`validation → merge → deploy → live acceptance → G8 cleanup`

No earlier event implies a later one.

## Conflict resolution

This Decision supersedes the **field-semantics portion only** of the temporary “project-local RELEASE / ACTIVE lifecycle” convention used during STAB-05.

Historical artifacts are not silently rewritten. New/superseding artifacts and current kernel pointers must use this Decision.

## Automation / AI guard

Any future automation, developer or AI update that proposes:

- `projectStage = RELEASE` or `projectStage = VALIDATION`;
- Artifact `status = ACTIVE / WAITING / PASS`;

must stop and map those meanings to `gate`, `workStatus`, or Evidence instead.

Changing this Decision requires a new DECISION or CHANGE_PROPOSAL. It must not be silently reverted by a release-progress update.

## Owner approval

Approved by the project owner during portfolio/MP_DSL harmonization on 2026-09-22.
