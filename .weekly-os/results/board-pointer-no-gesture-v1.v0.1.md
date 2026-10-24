---
artifactId: dementor-club.result.board-pointer-no-gesture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_PASS
status: APPROVED
workStatus: WAITING
version: 0.1
updated: 2026-10-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssues: 126,38,42,237
ownerG4DecisionRelay: https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6377258855
ownerDecisionProvenance: OWNER_PROJECT_CHAT_EXPLICIT_LEAD_RELAY
g4Status: PASS_LIMITED_CODE_ONLY_TWO_BOARD_DRAG_FILES
riskClass: PROTECTED_CODE_ONLY
implementationOwner: F-01
independentQaOwner: Q-01
integrationOwner: Lead
integrationBaseRef: dementor-club-production
integrationBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
activeIntegrationBranch: null
existingActiveWebUiPullRequest: 308
sourceCandidatePreparationAuthorized: true
implementationStartAuthorized: true
activeIntegrationAuthorized: false
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
liveHostMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: true
---

# Board pointer no-gesture v1 — owner CODE-ONLY G4 PASS / WAITING serial integration

## Binding authority and exact meaning

The owner explicitly approved in the current project chat on 2026-10-24:

> «Утверждаю двухфайловый CODE-ONLY G4 Board по #126, без изменения базы, прав пользователей и production».

Lead recorded the verbatim owner statement in [Board #126](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6377258855). This is a **Lead relay of owner project-chat consent**, not a direct GitHub signature written by the owner. Scope is precisely the [F-01 two-handler protected Change Proposal](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6376053226), accepted as design by [Lead W77](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6376248753) and bounded by [Lead W78](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6376747576).

**G4 PASS is only permission to prepare the exact two-file source-code corrective in a clean, isolated F-01 candidate.** It grants no schema, Auth, rights, Cloud data, host, merge, deploy, live test-write or new product action. `workStatus: WAITING` means the implementation/release lane remains serialized behind active WebUI PR #308; preparing an isolated two-file candidate is allowed, making it the active integration PR is not yet authorized.

## Immutable source identity / exact file lease

- Production source base: `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e` (Git source, **not** proof of entire installed VM runtime).
- ACTIVE shipped Board route `workspace/board/index.html` loads both pointer writers:
  1. **ONLY approved path A:** `community/board/board-spatial-v1.js` / Git blob `9850fd535815ca8be505a3f3adad546d9339b327` — Owner/Admin spatial drag.
  2. **ONLY approved path B:** `community/board/board-own-drag-livefix-v2-2.js` / Git blob `6bcafc3d6ca77c3221be23775fd01bdb7c719a26` — Member own-card document-capture drag.
- File lease owner **F-01 only** for these paths in a separately isolated source candidate; Lead owns integration. Verify both starting blobs before editing. If source changes or another active writer is discovered, STOP and obtain an exact scope amendment. No changes to dormant v2-1, `board.js`, scripts, CSS, HTML or other paths under this Result.
- Current other authorized implementation lane: `pre-vm-webui-gate-correctives-v1.v0.3`, **OPEN DRAFT PR #308** HEAD `a71eb033643d2c26f25db5a41a202f5a30433c59`, eight distinct files, current ACTIVE WebUI G5; **do not enlarge or alter its whitelist**. Separate Workspace #38 two-file Result remains WAITING; neither its source nor its QA is absorbed here.

## Exact allowed correction / acceptance

1. For spatial Owner/Admin and captured Member own-card: store original visible x/y, pointer ID, initial version and drag style. Require the original drag-intent threshold and **meaningful clamped net world-coordinate change** to persist on completed `pointerup`. No-motion tap, jitter, move-away-then-back or boundary clamp with unchanged final coords yields **ZERO PATCH**, no `position_version` / `moved_at` bump.
2. `pointercancel` (stationary **or after movement**) must issue **ZERO PATCH** and restore original x/y, capture state, drag class/flags and normal click/focus behavior; do not set false `boardJustDragged`. Release capture safely and suppress stale/duplicate async callbacks.
3. A genuine completed drag of an authorized card issues **exactly ONE** existing `dc_artifact_board_positions` x/y UPDATE using existing `artifact_id` and `position_version` CAS plus current RLS. Member's document-capture writer and Owner/Admin spatial writer must not duplicate persistence or broaden role/actor rights.
4. On network error, 403, version conflict, or null/empty CAS response after a legitimate move, reconcile from authoritative existing positions or revert displayed x/y; never leave an optimistic position presented as saved. Retain card interactive elements, accessible keyboard navigation, mobile touch pan/pinch, original Board normalizer/publication semantics.
5. No mass position updates, data rewrite, new RPC/handler, Auth/role/RLS changes or backend repair.

## Gate plan, handoff and evidence

- **G5 author F-01:** one isolated code-only two-path diff with exact new immutable Git SHA or hash-pinned candidate and focused mock/network-intercept gesture proof. Current PR308 branch remains untouched and sole active WebUI integration. No second competing PR; Lead checkpoints existing WIP and decides serial integration after current PR308, respecting P0 priority vs waiting #38. No paid CI.
- **G6 independent Q-01, only on actual new candidate SHA:** Owner/Admin no-move `0`; any Owner/Admin pointercancel `0`; Member own-card no-move `0`; Member moved cancel `0`; move-return/clamp `0`; authorized genuine move `1` PATCH + correct CAS, no duplicate; guest/nonowner `0`; 403/409/null CAS gives truthful restored state. Chromium/WebKit native mouse/touch + keyboard/focus, double/late pointer events, capture loss, 360/390/430, browser back/reload and physical iPhone true 200%/safe-area **if actually available**. Real role and Storage/CIRCLE protections require separate approved QA fixtures, not invented PASS. Do not re-run unrelated accepted 562/562 suites without new SHA/risk reason.
- **G7:** fresh, source/build/runtime exact-SHA reconciliation, risk-based independent G6 and a **separate explicit human production GO**. Approval here is not merge or deploy.
- **G8:** independent live Board/Artifact behavior, roles/private negatives, mobile/accessibility, before/after rollback safety; current Stage1 remains **FAIL/OPEN** pending verification.

## Rollback / protected environment

Capture prior blob hashes and build manifest before any future G7. If correction fails, revert only the approved two-file source diff to a safe **no-persist/deferred** drag state pending review; do not restore known tap/cancel accidental PATCH or edit existing Board rows as rollback. Protect Cloud Auth/RPC/RLS/Storage and source data, `/data/*`, `db-dev`, MDAO, game ALPHA/BETA/CharacterId/saves, VM/Nginx/DNS/OAuth and private media.

**Checkpoint 2026-10-24:** `G4=PASS_CODE_ONLY`; `G5=NOT_RUN`; `G6=NOT_RUN`; `G7=NO_GO`; `STAGE1_G8=FAIL_OPEN`; `PRODUCTION_EFFECT=NONE`; `NEW_COST=0`. Next: F-01 isolated two-file candidate + Lead serial integration decision, then independent Q-01.
