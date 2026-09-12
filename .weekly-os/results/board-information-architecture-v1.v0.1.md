---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G1_DEFINITION
status: DRAFT
version: 0.1
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
plannedIntegrationBranch: agent/board-information-architecture-v1
integrationBranch: null
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.1

## Goal
Implement the approved `operations/BOARD_INFORMATION_ARCHITECTURE_V1.md` as one coherent Community Board program without creating duplicate Board/entity/history/relation owners.

The Result must transform the current live-only / Member-Artifact-focused Board into the approved persistent spatial map of club life while preserving Membership v2 semantics and existing canonical ownership boundaries.

## Status
**DRAFT / QUEUED FOR IMPLEMENTATION / NOT ACTIVE**

This Result is prepared but **must not open an integration branch yet** because the project already has one active integration branch:

`agent/public-site-visual-tech-debt-cleanup-v1`

Activation condition:

- current active Result is closed/handed off or explicitly re-prioritized by the project owner;
- then create exactly one Board integration branch:
  `agent/board-information-architecture-v1`.

`One Result → one active integration branch.`

## Approved authority
Primary semantic authority:

- `operations/BOARD_INFORMATION_ARCHITECTURE_V1.md` — APPROVED project-local source of truth.

Compatible authority retained except where explicitly superseded:

- `operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md`;
- Membership v2 lifecycle and DC-9/application boundaries;
- canonical Event / Program / Project owners;
- existing Workspace shell / auth identity ownership.

## Hard boundaries

This Result must not:

- create a second Board;
- create duplicate Event / Project / Course owners;
- create a second archive/history entity for Artifacts;
- repurpose `promoted_entity_id/type` as a universal relation system;
- infer membership, role or permissions from Board links;
- create a new generic CMS;
- add Board tasks / Membership Application publication types;
- hard-delete historical objects as part of normal cleanup;
- deploy or mutate live Supabase without separate explicit authorization.

## Existing owners to extend before creating new ones

Inventory/implementation must start from current owners, including:

- `public.dc_artifacts`;
- `dc_artifact_board_positions`;
- current Board user-state resolver;
- current Board spatial/fullscreen/composer/guest-action runtimes;
- existing Artifact reaction/response paths;
- canonical Event / Program / Project entity layer;
- existing Board entity projection model/integration layer;
- existing RLS/RPC authorization paths.

A new relation owner is permitted only because the approved architecture requires typed relations and current inventory found no canonical Artifact↔Artifact/object relation owner.

## Affected domain / screens

Primary:

- `/workspace/board/`;
- `/community/artifact/:id/` detail flow;
- `/workspace/artifacts/` where history/state consistency is affected;
- Community Board RPC/RLS/schema;
- canonical entity projections used by Board.

Secondary validation surfaces:

- Join/DC-9/application conversion CTA from Board;
- Member first-Artifact state;
- Owner Admin moderation controls;
- mobile Board behavior.

## Implementation program

### Batch A — lifecycle/history + canonical entity projections

Objective: make Board truth match approved persistent-history semantics before adding relation complexity.

Required work:

1. Normalize lifecycle deterministically:
   - `active + expires_at < now()` must no longer remain semantically active;
   - expired and archived remain historical, not invisible.
2. Board default query/render includes current + historical Community objects.
3. Authenticated Guest and Applicant can read all Community history.
4. Historical cards remain readable and reactable.
5. New responses are blocked on expired/archived cards; existing response/reaction history remains visible.
6. Fix Guest Artifact detail authorization so a Board-readable object can actually be opened under the approved access model.
7. Render canonical Event / Course / Practice / Project / Product projections by default without duplicating source ownership.
8. Allow a separate Artifact wrapper only for an independently authored publication/announcement.
9. Preserve existing Artifact spatial position owner; inventory historical cards missing positions and define a deterministic backfill/placement rule.
10. Define a canonical spatial-position strategy for non-Artifact projections by extending the existing Board layout responsibility rather than creating a parallel Board system.

### Batch B — filter harmonization + Artifact subtypes

Objective: make the visible Board taxonomy match the approved information architecture.

Required work:

1. Add/normalize Artifact semantic subtypes:
   - `announcement`;
   - `post`;
   - `idea`;
   - `request`.
2. Preserve current slot/authoring/moderation semantics unless separately required.
3. Canonical object-type filters:
   - Объявления / публикации;
   - События;
   - Курсы / программы;
   - Практики;
   - Проекты / продукты;
   - Статьи / контент.
4. Default source view = `ВСЁ`.
5. Remove/retire ambiguous `ФОРМИРУЕТСЯ` as a global Board filter unless a canonical cross-object lifecycle owner is proven.
6. Do not introduce a lifecycle filter in v1.
7. `ОТ ЛЮДЕЙ / ОТ КЛУБА` may survive only if inventory proves they add a non-duplicative source dimension.

### Batch C — relation model + permissions + UI

Objective: add the approved manually authored relation graph as a canonical layer.

Required meanings:

- `RELATED_TO` — СВЯЗАНО С;
- `RESULT_OF` — ПОЯВИЛОСЬ ИЗ / РЕЗУЛЬТАТ;
- `CONTINUES` — ПРОДОЛЖЕНИЕ / ОБНОВЛЕНИЕ;
- `ABOUT` — ОТНОСИТСЯ К;
- `PARTICIPATES_IN` — УЧАСТВУЕТ В;
- `REPORT_OF` — ОТЧЁТ / ИТОГ.

Permission boundary:

- Member manages relations originating from own Artifact;
- canonical entity owner / assigned Dementor manages relations originating from their scoped entity;
- Owner Admin manages all Board relations.

Person ↔ Project/Event participation must use canonical assignment/participation semantics. Board only projects it; a line never grants membership, role or ownership.

Presentation:

- relations visible in detail;
- meaningful relations may render as canvas lines;
- line layer below cards;
- stable card anchors/centers;
- semi-transparent lines;
- `SHOW RELATIONS / HIDE RELATIONS` toggle.

No automatic relation inference in v1.

### Batch D — board-hide + visual aging + regression hardening

Objective: finish the approved presentation/moderation semantics after the structural model is stable.

Required work:

1. User hide/filter remains presentation-only.
2. Owner/Admin board-hide removes an object from general Board presentation while retaining canonical object/history and auditability.
3. No normal hard-delete flow.
4. Historical cards age continuously over time.
5. Define an accessibility/readability floor for visual fading.
6. One canonical card system across projections, differentiated by label/accent/icon.
7. Responsive density/card field collapse validated on desktop/mobile.
8. Remove obsolete compatibility/filter/history code made redundant by the new canonical owners.

## Acceptance Criteria

### Semantic / lifecycle

1. Board default view contains current plus historical Community objects; expired/archived no longer disappear by default.
2. Stored state and visible state cannot disagree through stale `active + expires_at < now()` records.
3. `expired` and `archived` remain semantically distinct.
4. No normal archive/expiry operation destroys the canonical object.
5. Historical Artifact detail remains open/readable to authorized Guest/Applicant/Member/Dementor/Owner Admin states.

### Access / authorization

6. Authenticated Guest and Applicant can read all Community history.
7. Guest/Applicant still cannot create/publish, move, archive or moderate.
8. Historical cards allow reactions but reject new responses.
9. Existing responses/reactions remain visible on historical cards.
10. Member/Dementor ordinary permissions remain own-scope unless another canonical entity assignment grants scoped management.
11. Owner Admin retains global Board moderation authority.
12. All write authorization is enforced in RPC/RLS/server paths, not only UI.
13. `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP` remains true.

### Entity ownership / projections

14. Event / Course / Practice / Project / Product Board cards are projections of canonical objects by default.
15. Board does not become a second semantic owner of those entities.
16. Independent Artifact wrappers are possible only as distinct authored publications with their own lifecycle.
17. Long-form/public article content in v1 is referenced by Artifact unless another separately approved canonical Content owner already exists.
18. Membership Application and operational Tasks do not appear as Community Board publication types.

### Filters / cards

19. Canonical object-type filter set matches Board Information Architecture v1.
20. No ambiguous global `ФОРМИРУЕТСЯ` filter remains.
21. No lifecycle filter is required to see historical cards.
22. Artifact subtypes are available as `announcement/post/idea/request` without changing Membership/slot semantics by accident.
23. All Board object families use one canonical card system; type differences are presentation variants, not duplicate components.

### Relations

24. A canonical typed relation owner exists; `promoted_entity_id/type` is not reused as universal relations.
25. All six approved relation meanings are representable.
26. Relation CRUD obeys scoped ownership and Owner Admin authority.
27. Relations can be inspected in detail.
28. Relation lines can be toggled on/off and do not block pan/zoom/card interaction.
29. Person participation links do not synthesize membership/global roles.
30. Relation removal does not delete either endpoint object.

### Spatial / history integrity

31. Existing current Artifact positions survive migration/refactor.
32. Historical cards with existing positions retain them.
33. Historical records missing positions receive deterministic safe placement/backfill without corrupting current layout.
34. Canonical entity projections have stable layout behavior owned by the Board spatial system, not a parallel canvas.
35. Position/relation state survives reload where persistence is intended.

### Browser / responsive / regression

36. Sequential browser flow passes for Guest, Applicant, Member first-Artifact, Member activated, Dementor and Owner Admin.
37. Desktop and mobile pan/zoom/open/filter/history behavior passes.
38. Guest `+ ПРИКОЛОТЬ / + СОЗДАТЬ` remains the existing DC-9/application conversion gate.
39. First Artifact remains the only Member activation transition.
40. Public Header remains the canonical Header above Workspace; no Board-owned duplicate shell is introduced.

## Evidence required before G6 PASS

At minimum:

- schema/RPC/RLS inventory before mutation;
- migration diff and rollback notes for any schema changes;
- automated contract tests for lifecycle/access/relation permissions;
- browser evidence for each canonical user state;
- desktop/mobile spatial regression evidence;
- old vs new Board-content inventory proving no accidental data loss;
- archived/expired sample records visibly retained;
- Guest live/history/open/react/respond-negative-on-history evidence;
- Owner Admin move/archive/board-hide/relation evidence;
- relation graph reload/persistence evidence;
- filter taxonomy screenshots/DOM assertions;
- proof no duplicate Board/entity/history/layout owner was introduced.

## Gate plan

Current: **G1_DEFINITION — PREPARED, NOT ACTIVE**.

When activated:

`G1 Definition → G2 Inventory → G3 Build Batch A → G6A Validation → G3 Batch B → G6B → G3 Batch C → G6C → G3 Batch D → full G6 Validation → G7 Release → live retest → G8 Cleanup`

Batch-level G6 checks are required because later relation/filter work must not conceal lifecycle/access regressions introduced earlier.

## Release strategy

Because `dementor-club-site ↔ dementor-club-production` historically diverge, do not perform a blind site→production merge.

Release candidate must be built from the then-current `dementor-club-production` baseline and receive only the validated Board Result diff.

`Commit ≠ merge ≠ deploy.`

Production merge and deployment remain separately authorized gates.

## Branch plan

Planned branch after activation:

`agent/board-information-architecture-v1`

Do **not** create/activate it while `agent/public-site-visual-tech-debt-cleanup-v1` remains the project's active integration branch unless the owner explicitly re-prioritizes the project kernel.

## Current blockers / prerequisites

1. Current active Result owns the only active integration branch.
2. `dementor-club.result.board-access-control-v2` is still WAITING with residual role-state retests; relevant open evidence should be absorbed/retested by this Result rather than silently discarded.
3. Production baseline must be re-read immediately before implementation starts.
4. Existing schema/runtime owners must be inventoried again immediately before any migration because the approved architecture was defined against the 2026-09-12 state.

## Authorization state

- implementation start authorized: **false until Result activation / branch handoff**;
- production merge authorized: **false**;
- production deploy authorized: **false**;
- live database mutation authorized: **false**.

This Result preparation does not itself authorize code, schema, production or deployment changes.
