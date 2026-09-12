---
artifactId: dementor-club.evidence.board-information-architecture-live-retest-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
productionReleaseRun: 57
correctiveReleaseRun: 58
primaryProductionCommit: 75e074a431f18bd65506bf567ae21308057b24fe
correctiveProductionCommit: fa9a0840b6a97d1718ae47500f89ec621cc76d93
---

# Board Information Architecture v1 — authenticated live retest — 2026-09-12

## Evidence source

Project owner supplied authenticated production-browser screenshots after production release #57 and after corrective release #58.

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

Corrective release:

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

## Not yet evidenced by owner live screenshot

The following are not claimed as live-validated by this note:

- `/workspace/artifacts/` authenticated history route;
- legitimate non-owner Dementor promotion support `0/2 → 1/2 → 2/2 → pending`;
- real external Telegram delivery by worker v10 from a legitimate pending row;
- every one of the eight Board user states in a real production browser session.

No synthetic role mutation is authorized merely to manufacture those states.

## Gate implication

This evidence closes the production presentation defect discovered during the first authenticated live retest, but does not by itself justify `DONE` or full G8 closure.

The active Board Result may proceed toward G8 only with remaining live-validation limitations recorded explicitly and without treating unavailable synthetic actors as evidence.
