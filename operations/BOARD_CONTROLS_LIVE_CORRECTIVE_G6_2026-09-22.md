---
artifactId: dementor-club.operations.board-controls-live-corrective-g6-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6_VALIDATION
status: APPROVED
version: 1.1
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
supersedes: 1.0
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board controls live corrective · G6 validation

Production baseline:

`bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`

Owner live-QA baseline:

`Deploy Dementor Production #131 / 35781834222 · SUCCESS`

Final validated corrective candidate:

`a067ff50cab5b45177d163ec086f116b177f89b3`

PR:

`#240 · OPEN / DRAFT / UNMERGED`

Canonical validation:

```text
Site Integrity / Release Readiness #1250
run id = 35787057332
attempt = 2
conclusion = SUCCESS
```

Attempt 1 failed only because Playwright WebKit returned an internal browser error during an existing Board Share `page.goto`. No code was changed for that infrastructure failure. Attempt 2 on the exact same candidate passed the full suite.

## Validated corrective

Desktop View drawer:
- Current Program and Board View controls share the existing fullscreen viewport composition;
- Current Program is composed before the controls;
- View controls own a higher stacking level;
- open drawer owns a higher stacking level than Current Program;
- wide-desktop 2560×1080 regression verifies the paint-order contract.

Stale Artifact focus:
- explicit View/pager navigation emits the existing Board user-navigation signal before reflow/focus;
- deep-link owner consumes stale `focus=artifact:<uuid>`;
- queued focus resolvers are invalidated by generation;
- stale Artifact overlay is closed;
- later Board mutations cannot resurrect the consumed focus;
- shared-arrival postcard semantics remain preserved.

PASS:
- Board live corrective browser acceptance;
- Board navigation/adaptive cards acceptance;
- Board mobile harmonization;
- wide-desktop drawer-over-Program guard;
- Board Relations browser acceptance;
- Board deep-link auth-return contract;
- Board deep-link auth-return browser acceptance;
- queued deep-link resolver race;
- Board Share on movable own card;
- Board v2.1 state matrix;
- Current Program browser acceptance;
- built JavaScript syntax;
- production route manifest;
- production artifact release gate.

Exact production → candidate:

```text
ahead = 11
behind = 0
changed files = 6
```

Files:

1. `community/board/board-deeplink-auth-return-v1.js`
2. `community/board/board-fullscreen-v2-1.css`
3. `community/board/board-fullscreen-v2-1.js`
4. `community/board/board-integrations-v1.js`
5. `scripts/validate-board-deeplink-auth-return-browser.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

`current-program-v1.js` remains unchanged.

Schema/RPC/RLS mutation = NO.
Semantic domain mutation = NO.
Change Proposal = NO.
Supabase = NOT REQUIRED.

G6 verdict: APPROVED.
