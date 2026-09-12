---
artifactId: dementor-club.decision.board-telegram-promotion-v1
project: dementor-club
documentType: ARCHITECTURE_DECISION
projectStage: CLARITY
status: APPROVED
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
extends:
  - operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
result: dementor-club.result.board-information-architecture-v1
integrationBranch: agent/board-information-architecture-v1
---

# Dementor Club — Board Telegram Promotion v1

**STATUS: APPROVED / PROJECT-LOCAL SOURCE OF TRUTH**  
**VERSION: 1.0**  
**DATE: 2026-09-12**  
**SCOPE:** Artifact activity datetime, Dementor promotion support, Telegram promotion gate, outbox state machine, worker delivery safety, Owner/Admin moderation and minimal Board-hide before the first Board IA release.

This Decision extends the existing Board Result and uses the existing integration branch:

`agent/board-information-architecture-v1`

No parallel Result or second Telegram delivery subsystem is authorized.

## 1. Context and invariant

The old flow coupled Artifact publication directly to Telegram distribution.

Target flow:

`Canonical Artifact → Board presentation → Dementor promotion decision → existing distribution outbox → Telegram`

Canonical owners remain:

- Member publication → `dc_artifacts`;
- Event / Program / Project → their existing canonical Entity owners;
- Telegram delivery → `dc_distribution_outbox`;
- Board → presentation / interaction surface;
- Telegram → distribution surface.

## 2. Scope

Included in the new pre-release batch after Batch B:

- optional Artifact activity datetime;
- Dementor promotion support;
- canonical threshold `2`;
- existing outbox gating;
- backend enqueue bypass closure;
- Owner/Admin manual promotion;
- Owner/Admin suppression;
- minimal Board-hide;
- explicit outbox state machine;
- worker claim/retry contract;
- ambiguous-delivery handling;
- authorization, concurrency and regression validation.

Excluded:

- generic relation graph;
- Artifact↔Artifact / Artifact↔Entity relations;
- participation UI;
- support withdrawal;
- ranking/recommendation;
- new Activity entity;
- Event creation workflow;
- Calendar/List mode;
- Board v3 rewrite;
- spatial coordinate redesign;
- speculative multi-destination architecture.

## 3. Activity datetime

Do not reuse `starts_at`.

Introduce:

`dc_artifacts.activity_at timestamptz null`

`starts_at` retains its current visibility-start meaning. `activity_at` means the human/event-like datetime described by the publication.

Composer field:

`КОГДА?`

Rules:

- nullable;
- may be past or future;
- does not affect Board visibility;
- does not create a canonical Event;
- does not change Artifact subtype;
- if present, appears on Board card and Artifact detail.

Canonical Artifact subtypes remain:

- `announcement`;
- `post`;
- `idea`;
- `request`.

## 4. Promotion support ledger

Introduce dedicated immutable ledger:

`dc_artifact_promotion_support`

It is not the later generic Board relation model.

Minimum fields:

- `artifact_id`;
- `profile_id`;
- `created_at`.

Constraint:

`unique(artifact_id, profile_id)`

No support withdrawal in v1. A support valid at action time remains recorded even if the actor's later role changes.

## 5. Who may support

Support may be created only when the actor:

- is authenticated;
- currently has canonical Dementor authority;
- is not the Artifact author;
- is not Owner/Admin.

Owner/Admin may not cast promotion support in v1 even if the same account also has Dementor authority. Owner/Admin uses explicit administrative override instead.

## 6. Promotion threshold

Automatic promotion requires support from `2` distinct valid Dementors.

Canonical flow:

`0/2 → 1/2 → 2/2`

The threshold has one backend owner/config source. Independent frontend hardcoding is not authoritative.

## 7. Existing outbox remains canonical

Do not create a second Telegram delivery owner.

Use existing:

`dc_distribution_outbox`

Existing uniqueness remains:

`unique(artifact_id, channel)`

This guarantees one canonical delivery record per Artifact/channel, not true exactly-once external Telegram delivery.

## 8. Canonical outbox states

The v1 state vocabulary is exactly:

- `held`;
- `pending`;
- `processing`;
- `sent`;
- `failed`;
- `suppressed`;
- `delivery_unknown`;
- `cancelled`.

Meanings:

- `held` — publication exists, but Telegram promotion is not released; worker ignores it;
- `pending` — approved for worker claim;
- `processing` — atomically claimed; external delivery may be occurring;
- `sent` — Telegram success confirmed and persisted;
- `failed` — known non-delivery; controlled retry may be allowed;
- `delivery_unknown` — external outcome ambiguous; automatic retry forbidden;
- `suppressed` — Owner/Admin explicitly blocked Telegram delivery;
- `cancelled` — operational cancellation distinct from moderation suppression.

UI label for `delivery_unknown` is `ТРЕБУЕТ ПРОВЕРКИ`.

No alternative canonical name such as `needs_review` is introduced.

## 9. Outbox creation is part of canonical publication

Publishing a new Artifact must create or ensure the configured Telegram outbox row in `held`, not `pending`.

This creation belongs to the canonical backend publication transaction/path, not to frontend follow-up code.

The system must not allow a successfully published Artifact to exist merely because the browser/network failed before a second enqueue call.

Implementation must preserve the existing single outbox row invariant via `unique(artifact_id, channel)` and idempotent create/ensure semantics.

## 10. Backend bypass closure

Current direct enqueue authority must no longer allow Member author, Dementor author, ordinary Dementor or frontend code to independently bypass promotion.

`held → pending` is allowed only through:

1. successful atomic threshold transition; or
2. explicit Owner/Admin manual promotion.

Removing a frontend JS call alone is insufficient. Unauthorized direct backend/RPC attempts must fail server-side.

## 11. Atomic support + promotion

There must be one canonical backend support command, conceptually:

`dc_support_artifact_promotion_v1(artifact_id)`

It must atomically:

1. authenticate actor;
2. resolve current canonical role;
3. reject Owner/Admin;
4. reject non-Dementor;
5. reject self-support;
6. verify current Artifact eligibility;
7. insert support idempotently;
8. calculate support count;
9. when threshold is reached, transition existing outbox `held → pending`;
10. commit all changes together.

Concurrency must use transaction locking and/or conditional update semantics so valid `support_count >= 2` cannot leave an otherwise eligible delivery stuck in `held` because of a race.

Concurrent second/third votes must not create duplicate support or duplicate outbox rows.

## 12. Threshold transition idempotency

Automatic release behaves conceptually as:

`UPDATE ... SET status='pending' WHERE status='held'`

Only one transaction may successfully release the delivery.

If the outbox is already `pending`, `processing` or `sent`, later valid support must not reset or duplicate delivery state.

Suppressed/hidden/historical Artifacts must not be reactivated automatically.

## 13. Worker contract

Worker may claim only `pending`.

It must never process `held`, `suppressed`, `delivery_unknown`, `sent` or `cancelled`.

Claim:

`pending → processing`

must be atomic, and multiple workers must not claim the same row concurrently.

Worker invocation is an operational authority boundary: normal Guest/Applicant/Member/Dementor sessions must not be able to initiate queue processing directly. Worker execution must be restricted to the trusted scheduler/service path approved for distribution processing.

## 14. Retry and ambiguous delivery

`failed` means delivery is known not to have occurred. Only this state may participate in controlled automatic retry, subject to bounded retry policy.

`delivery_unknown` means Telegram may have accepted the external request, but canonical confirmation was not safely persisted. Examples include timeout/connection loss after request dispatch or worker crash between external success and DB confirmation.

Automatic retry from `delivery_unknown` is forbidden.

The system prefers manual intervention over automatic duplicate risk.

## 15. Manual resolution of `delivery_unknown`

Only Owner/Admin may resolve `delivery_unknown`, through explicit backend commands.

Allowed resolutions:

- `delivery_unknown → sent` — Admin has independently confirmed that Telegram delivery occurred;
- `delivery_unknown → pending` — explicit controlled retry with acknowledged duplicate risk;
- `delivery_unknown → cancelled` — do not retry.

No automatic transition out of `delivery_unknown` is allowed.

## 16. No exactly-once claim

The system guarantees:

- one canonical outbox row per Artifact/channel;
- idempotent internal promotion;
- atomic worker claim.

It does not claim true exactly-once Telegram API semantics.

## 17. Owner/Admin manual promotion

Action:

`ОПУБЛИКОВАТЬ В TELEGRAM`

Uses the existing canonical outbox and may perform:

`held → pending`

without `2/2`.

It does not create a second delivery path and does not count as promotion support.

## 18. Owner/Admin suppression

Action:

`НЕ ПУБЛИКОВАТЬ В TELEGRAM`

Transitions:

- `held → suppressed` — allowed;
- `pending → suppressed` — allowed only through conditional backend transition before worker claim;
- `processing` — cancellation cannot be guaranteed; final outcome becomes `sent`, `failed` or `delivery_unknown` according to actual delivery result;
- `sent` — remains `sent`; v1 does not delete/retract Telegram posts.

## 19. Board-hide

Owner/Admin action:

`СКРЫТЬ С ДОСКИ`

Board-hide is distinct from Telegram suppression and must:

- preserve canonical Artifact data/history;
- remove the object from ordinary Board presentation;
- block future automatic promotion when delivery has not begun;
- retain moderation/audit visibility for Owner/Admin.

Delivery interaction:

- `held` → block/suppress promotion;
- `pending` → conditionally suppress before worker claim;
- `processing` → cannot guarantee cancellation;
- `sent` → remains sent;
- `delivery_unknown` → remains manual-review only.

No automatic Telegram deletion is included.

## 20. Automatic promotion eligibility

Automatic promotion is forbidden for Artifact that is:

- expired;
- archived;
- removed;
- Board-hidden;
- Telegram-suppressed.

Historical support rows may remain recorded but never reactivate promotion.

## 21. Telegram destinations

v1 may continue using the single existing configured destination:

`TELEGRAM_COMMUNITY_CHAT_ID`

Do not introduce speculative multi-destination architecture in this batch.

## 22. UI contract

UI reflects canonical backend state, not inferred state from support count.

Examples:

- `ПОДДЕРЖАТЬ · 0/2`;
- `ПОДДЕРЖАТЬ · 1/2`;
- `✓ ПОДДЕРЖАНО · 1/2`;
- `2/2 · В ОЧЕРЕДИ` for `pending`;
- `2/2 · ОТПРАВЛЯЕТСЯ` for `processing`;
- `✓ TELEGRAM` only for `sent`;
- `TELEGRAM ОТКЛЮЧЁН` for `suppressed`;
- `ТРЕБУЕТ ПРОВЕРКИ` for `delivery_unknown`.

Support count and delivery state remain separate concepts.

## 23. Access contract

Guest / Applicant:

- cannot support;
- cannot release outbox;
- cannot manual publish;
- cannot suppress;
- cannot Board-hide.

Member:

- may see relevant promotion state;
- cannot support or release Telegram distribution.

Dementor:

- may add one immutable support to another user's eligible Artifact;
- cannot support own Artifact;
- cannot manual publish/suppress/Board-hide.

Owner/Admin:

- cannot cast support in v1;
- may manual publish;
- may suppress;
- may Board-hide;
- may resolve `delivery_unknown`.

## 24. Concurrency acceptance criteria

Validation must prove:

1. concurrent second/third Dementor support may persist as separate valid support rows;
2. exactly one `held → pending` release occurs;
3. only one outbox row exists;
4. eligible threshold cannot remain stuck in `held` because of race;
5. concurrent worker claims allow only one `pending → processing` success;
6. suppression racing claim is deterministic:
   - suppression wins first → `suppressed`;
   - worker claim wins first → `processing`;
7. no invalid intermediate state persists.

## 25. Bypass acceptance criteria

Backend/RPC tests must prove:

- Member author cannot enqueue/release directly;
- Member cannot release another Artifact;
- Dementor cannot bypass `2/2`;
- author-Dementor cannot enqueue own Artifact;
- Owner/Admin uses an explicit override path;
- removed frontend enqueue cannot remain as unrestricted backend authority.

## 26. Worker acceptance criteria

Validation must prove:

- worker selects only `pending`;
- claim is atomic;
- `held`, `suppressed`, `delivery_unknown`, `sent`, `cancelled` are ignored;
- known non-delivery may become `failed`;
- ambiguous external result becomes `delivery_unknown`;
- `delivery_unknown` is never automatically retried;
- ordinary authenticated user sessions cannot invoke trusted queue processing authority.

## 27. Migration boundary for existing outbox rows

Existing historical outbox records must not be reopened or re-promoted by this migration.

In particular:

- existing `sent` remains `sent`;
- existing `failed` remains historical `failed` unless explicitly handled by a separate controlled operational action;
- migration must not mass-convert historical rows to `held` or `pending`;
- new `held` default/creation semantics apply prospectively to new publication flow only.

Any existing historical row transition requires explicit evidence and a separate bounded decision/action.

## 28. Regression boundary

This change must not alter:

- Membership lifecycle;
- first Artifact activation;
- Artifact slot accounting;
- Batch A history semantics;
- Guest history/detail;
- historical reactions;
- historical response freeze;
- Batch B subtype taxonomy;
- object-type filters;
- canonical Entity ownership;
- existing Board positions;
- Workspace shell;
- mobile spatial interaction.

## 29. Process sequence

1. close factual Batch B state and evidence;
2. approve this Decision;
3. advance the existing Board Result;
4. implement in `agent/board-information-architecture-v1`;
5. validate DB/RLS, concurrency, bypass, worker state machine, ambiguous delivery, browser matrix and regressions;
6. produce a release candidate only after full PASS.

No parallel Result. No second integration branch.

## 30. Final ownership invariant

**Artifact content** → `dc_artifacts`  
**Activity datetime** → `dc_artifacts.activity_at`  
**Promotion support** → `dc_artifact_promotion_support`  
**Telegram delivery** → `dc_distribution_outbox`  
**Board** → presentation / interaction  
**Telegram** → distribution

The implementation must not create a second publication owner, second Telegram delivery subsystem, frontend-only promotion authority, duplicate support semantics or ambiguous canonical state names.

**Approval record:** project owner explicitly approved this Decision candidate together with the final corrections on 2026-09-12.