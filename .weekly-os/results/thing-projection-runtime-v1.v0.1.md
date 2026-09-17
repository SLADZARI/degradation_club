---
artifactId: dementor-club.result.thing-projection-runtime-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.1
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
issue: 213
integrationBranch: result/thing-projection-runtime-v1
productionBaseCommit: 374defbe583fac0839a43611b151d1104b47a42b
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | ThingProjection Runtime v1 | Result v0.1

## Status

**ACTIVE / G5 BUILD / IMPLEMENTATION START AUTHORIZED**

This Result is the one current integration Result. Owner authorization on 2026-09-17 permits G5 runtime implementation inside the approved scope below. Production merge, production deploy, database mutation and semantic expansion beyond this Result remain unauthorized.

## Goal

Extract the smallest repeated runtime boundary already proven by released Current Program and DSO continuation:

`SOURCE OWNER → thin read adapter → ThingProjection → ProgrammingDecision / continuation choice → Surface VM`

without creating a universal Thing registry or moving authority away from existing source owners.

## Proven activation basis

The activation review established the minimum evidence target:

`2+ source kinds × 2+ surfaces × continuation context`.

Initial proven scope:

- `program:dengi-na-veter` — Program source kind; existing released Current Program projection plus DSO continuation context;
- `project:dementor-lab` — Project source kind; approved local identity authority in `projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md`;
- Home + Board — two released Current Program consumers;
- DSO continuation — separate continuation consumer for `program:dengi-na-veter`.

`event:fuengirola` remains outside the first extraction proof until its canonical source-owner boundary is independently proven. Its presence in Current Program does not by itself make Event eligible for a shared adapter.

## Source ownership

### Program

Existing Program/course authorities remain owners of Program identity and mutable facts. ThingProjection is a read contract only.

### DEMENTOR LAB

Approved local identity authority:

`projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md`

Approved identity tuple:

- `canonicalName: DEMENTOR LAB`
- `sourceKind: project`
- `slug: dementor-lab`
- `semanticRef / thingRef: project:dementor-lab`
- `canonicalPublicRoute: /projects/dementor-lab/`

Current Program, Catalog, route pages and runtime code may consume this identity but do not own it.

## Minimal contract direction

The only identity field currently proven cross-context is:

`thingRef`

The first reviewed projection may expose already-repeated consumer fields where source ownership is explicit:

- `thingRef`
- `title`
- `href`
- `premise`
- `currentTruth`
- `actionLabel`

These are projection fields, not a declaration that every field is part of canonical Thing identity.

Context-specific fields stay outside the universal projection core unless repeated evidence proves otherwise:

- Current Program: `sourceKind`, `stateLabel`, `analyticsId`;
- DSO continuation: `schemaVersion`, `version`, return/continuation state;
- telemetry: `target_type`, `target_id`.

Do not rename `href` to `entryRef` in this Result without a separate evidence-backed decision.

## Architecture invariants

1. Product semantics ≠ database shape ≠ UI component.
2. Existing source owners remain owners of facts.
3. A consumer may reference another Thing but must not become authority for that Thing's identity or mutable facts.
4. ThingProjection is a read contract, not a registry, database entity, programming decision or Surface VM.
5. Programming owns `why now / where / sequence`.
6. Surface VM owns presentation.
7. Unknown/unavailable values remain explicit; adapters must not invent values.
8. A new source kind enters only after `canonical source owner + real runtime consumer` are both proven.
9. Project absence from `dc_entities` must not invalidate Project identity or projection.

## P0 / source-conflict boundary

Issue #202 intersects this Result only as an ownership guardrail: Catalog remains a secondary registry/provenance utility and is not a source owner for ThingProjection. #202 Catalog/release-status repair is excluded from this Result.

Issue #214 remains a separate unresolved source conflict and is explicitly excluded. This Result must not resolve Contribution / first-Artifact activation semantics implicitly.

## Scope

G5 implementation may contain only:

- one minimal ThingProjection runtime/read contract;
- one existing Program adapter for the proven Dengi source;
- one Project adapter for the approved DEMENTOR LAB identity boundary;
- Current Program consumption through that projection where extraction is supported by existing evidence;
- DSO continuation consumption of the same projection boundary where appropriate;
- contextual Home / Board / continuation presentation preserved;
- static validation and sequential browser acceptance proving semantic, route and presentation regression safety.

## Explicit non-goals

- no `dc_things` table;
- no universal Project/Event registry;
- no broad DB/schema migration;
- no Catalog rewrite;
- no Artifact Board migration;
- no Contribution workflow;
- no issue #214 mutation;
- no Membership/auth lifecycle change;
- no History/Activity ontology;
- no recommendation engine;
- no AI/LLM command platform;
- no generic relation engine/repository/service layer;
- no Canvas/WebGL/performance rewrite;
- no commerce work;
- no production deploy during activation.

## Acceptance criteria

Before G6, the candidate must prove all of the following on the exact Result head:

1. Stable `thingRef` contract is preserved for `program:dengi-na-veter` and `project:dementor-lab`.
2. Program and Project adapters read from their existing canonical owners instead of creating duplicate product truth.
3. Home and Board continue to consume one reviewed Current Program composition without duplicate semantic lists.
4. DSO continuation consumes the shared projection boundary where justified without rebuilding the course engine.
5. Surface copy/state remains contextual rather than being collapsed into Thing identity.
6. No Project dependency on `dc_entities` is introduced.
7. No Event adapter is added unless an independent canonical Event source owner is proven first.
8. Existing canonical routes remain intact, including `/courses/dengi-na-veter/` and `/projects/dementor-lab/`.
9. Static/build validation passes.
10. Sequential browser validation covers Home, Board and DSO continuation on desktop/mobile as applicable.
11. No new semantic owner, parallel registry, compatibility runtime or hidden database mutation is introduced.

## Gate / release control

Current gate: **G5_BUILD**.

Result ownership, its one integration branch, and G5 runtime implementation are authorized. This implementation-start checkpoint does not authorize production merge, production deploy, database mutation, or scope expansion.

`commit ≠ merge ≠ deploy`.

Production merge and deploy remain separately unauthorized.
