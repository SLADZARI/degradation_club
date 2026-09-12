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
productionCommit: 75e074a431f18bd65506bf567ae21308057b24fe
productionDeployRun: 57
productionDeployRunId: 34702060603
---

# Board Information Architecture v1 — production live retest

## User-supplied authenticated evidence

The project owner supplied three production screenshots after Deploy Dementor Production #57:

1. Desktop `/workspace/board/`.
2. Desktop Artifact detail opened from Board.
3. Mobile `/workspace/board/`.

## Confirmed from screenshots

- Workspace Board loads authenticated production state after release.
- Historical Artifact cards remain visible on the spatial Board.
- Board pagination/history indicator exposes `1 / 8`, consistent with the eight production Artifact rows.
- An expired Artifact opens from Board in the canonical detail surface.
- Detail correctly exposes `ARTIFACT / EXPIRED`, subtype `ОБЪЯВЛЕНИЕ`, expiry metadata and author identity.
- Mobile Board loads the same spatial content and keeps Board controls available.
- No release-blocking blank/error surface is visible in the supplied desktop or mobile screenshots.

## Defect found during live retest

`QA-BOARD-LIVE-001 — Artifact body exposes stored minimal Markdown syntax as literal text.`

Observed on `Нам не нужен AGI?`: the stored emphasis line `**Нам действительно нужен AGI?**` is displayed with literal `**` in the production detail view.

Root cause inventory confirms the canonical detail owner directly escaped `artifact.body` into `.dc-artifact-body`. This is safe against HTML injection, but it does not render the already-stored minimal emphasis syntax.

## Corrective implementation boundary

A Result-local, non-semantic bugfix is prepared on `agent/board-information-architecture-v1`:

- keep `esc(...)` as the first transformation;
- support only the existing `**bold**` emphasis form;
- preserve current `white-space: pre-wrap` behavior and all other text literally;
- do not introduce a general Markdown engine or second content renderer.

The corrective patch requires CI validation and a separate production corrective release before this defect can be marked closed.

## Remaining live validation gaps

- mobile Artifact detail has not yet been supplied/retested;
- real non-owner Dementor `0/2 → 1/2 → 2/2` support threshold remains unavailable without a legitimate actor;
- external Telegram delivery through worker v10 remains observationally pending until a legitimate Artifact reaches `pending`.

Result must remain ACTIVE. No G8/DONE claim is authorized by this evidence alone.
