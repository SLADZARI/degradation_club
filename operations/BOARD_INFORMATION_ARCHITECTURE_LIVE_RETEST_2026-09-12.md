---
artifactId: dementor-club.evidence.board-information-architecture-live-retest-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
productionReleaseRun: 57
correctiveReleaseRuns: [58, 59]
primaryProductionCommit: 75e074a431f18bd65506bf567ae21308057b24fe
correctiveProductionCommits:
  - fa9a0840b6a97d1718ae47500f89ec621cc76d93
  - 8adee2d8708393d7ba56de0bc53790152fb5c69c
---

# Board Information Architecture v1 — authenticated live retest — 2026-09-12

## Evidence source

Project owner supplied authenticated production-browser screenshots after the primary release and both corrective releases.

The screenshots are conversation evidence; this note records only directly observed facts and does not infer unobserved role states.

## Observed PASS

### `/workspace/board/` desktop

- authenticated Workspace shell is present;
- Community Board loads in production;
- historical Artifact cards remain spatially visible on the Board;
- multiple expired/historical cards render concurrently;
- pan/zoom spatial presentation remains active;
- canonical Workspace navigation remains above the Board;
- card media and titles render without an obvious desktop composition break.

### `/workspace/board/` mobile

Owner-provided mobile screenshot confirms:

- Board remains a spatial canvas rather than collapsing into a list;
- cards remain individually positioned;
- primary Board controls remain reachable;
- no obvious horizontal shell collapse or clipped primary control group was observed in the supplied viewport.

### `/community/artifact/:id/` authenticated detail

Artifact `378e1692-12e5-4db4-95ae-26d1c778153c` (`Нам не нужен AGI?`) was opened from the production Board.

Observed before corrective release #58:

- detail panel opened successfully;
- historical status rendered as `EXPIRED`;
- subtype rendered as `ОБЪЯВЛЕНИЕ`;
- author identity rendered;
- stored body content loaded;
- defect `QA-BOARD-LIVE-001`: stored minimal emphasis syntax `**Нам действительно нужен AGI?**` was displayed literally.

Corrective release #58:

- PR #147;
- production commit `fa9a0840b6a97d1718ae47500f89ec621cc76d93`;
- Deploy Dementor Production run #58;
- workflow conclusion `success`;
- Pages artifact `10300503818`;
- artifact digest `sha256:69178bd5fa796631206a5f3628def4958103743b4c01fa359149124829469d43`.

Observed after corrective release #58:

- the same Artifact detail opened successfully;
- literal `**` markers disappeared;
- `Нам действительно нужен AGI?` renders as emphasized text;
- surrounding body remains readable;
- no general Markdown renderer or raw stored HTML was introduced by the corrective diff.

`QA-BOARD-LIVE-001` = **PASS / CLOSED BY CORRECTIVE RELEASE #58 + OWNER LIVE SCREENSHOT**.

### `/workspace/artifacts/` authenticated personal history

Owner-provided production screenshots confirm:

- authenticated My Artifacts route loads successfully;
- canonical Workspace navigation remains present and `МОИ АРТЕФАКТЫ` is the active tab;
- personal Artifact history is populated from production data;
- expired and archived records coexist in the list;
- lifecycle labels (`EXPIRED`, `ARCHIVED`) are visible;
- Artifact subtype labels are visible;
- archived rows retain historical close metadata;
- `ОТКРЫТЬ` affordances remain available on historical rows;
- no duplicate history table/surface is visible in the rendered UI.

The first screenshot exposed `QA-BOARD-LIVE-002`: copy still said `Live Board показывает происходящее сейчас`, contradicting the approved persistent Board-history model.

Corrective release #59:

- PR #150;
- production commit `8adee2d8708393d7ba56de0bc53790152fb5c69c`;
- Deploy Dementor Production run #59;
- run id `34706259996`;
- workflow conclusion `success`;
- build logs confirm checkout of exact canonical branch `dementor-club-production` at `8adee2d8708393d7ba56de0bc53790152fb5c69c`;
- Pages artifact `10300789454`;
- artifact digest `sha256:ee235519d76f5030e557ba5c02045bce20fb865873dbcbceffbcce27b5a50aef`;
- no DB/RLS/worker/membership/lifecycle/spatial/route/Telegram behavior changed.

Observed after corrective release #59:

- `/workspace/artifacts/` still loads successfully;
- history rows and lifecycle labels remain present;
- corrected copy now states that Community Board preserves both what is happening now and club history;
- the obsolete live-only wording is absent.

`QA-BOARD-LIVE-002` = **PASS / CLOSED BY CORRECTIVE RELEASE #59 + OWNER LIVE SCREENSHOT**.

## Authenticated route retest conclusion

Target routes from the active Result now have direct authenticated production evidence:

- `/workspace/board/` — PASS desktop + mobile;
- `/community/artifact/:id/` — PASS after corrective release #58;
- `/workspace/artifacts/` — PASS after corrective release #59.

## Deferred operational evidence

The following are not claimed as live-validated because a legitimate production actor/event is not currently available:

- non-owner Dementor promotion support `0/2 → 1/2 → 2/2 → pending`;
- real external Telegram delivery by worker v10 from a legitimate pending row;
- every one of the eight Board user states in a real production browser session.

These are deferred operational evidence, not blockers to beginning G8 cleanup. No synthetic role mutation or fake Telegram delivery should be created merely to manufacture evidence.

## Gate implication

Authenticated live release validation for the three target routes is complete. Both defects discovered during live retest were corrected, redeployed, and rechecked in production.

The active Result may move from `G7_RELEASE` to `G8_CLEANUP`.

This evidence does **not** by itself claim final Result closure: G8 must still inventory and address stale branches, temporary/compatibility layers, superseded assets/routes, duplicate owners and stale QA status before `DONE / APPROVED` is asserted.
