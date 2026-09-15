---
artifactId: dementor-club.evidence.board-mobile-harmonization-g8-2026-09-15
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED_EVIDENCE
updated: 2026-09-15
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-mobile-harmonization-v1
---

# Board Mobile Harmonization v1 — G8 closure evidence

## Release evidence

Validated candidate: `13e1454c6172ddf7a43f6da7316f15061ad037b4`.

Full Site Integrity / Release Readiness #1188 / Actions run `35012939298` — PASS.

PR #210 was merged with expected-head protection into `dementor-club-production` as:

`48a18b5567804d29219efcea217b846f1ebdd675`

Deploy Dementor Production #85 / Actions run `35020704474` — SUCCESS.

Build logs confirm checkout of `dementor-club-production` and `git log -1` = `48a18b5567804d29219efcea217b846f1ebdd675` before validation/build.

Pages artifact: `10417765961`.

Artifact digest: `sha256:627cb5797efb4fc9587b2a0c27bf53a1ec55caa5ad376f796e557e57a759cae5`.

GitHub Pages deploy reported SUCCESS and environment URL `http://dementor.club/`.

Focused Chromium acceptance on the released candidate covered 390 / 360 px and passed with screenshots. It proves:

- primary Workspace chrome fits the mobile viewport;
- canonical nav clears Board utilities;
- filters and the existing publish action share one compact row;
- all three Current Program cards are visible without horizontal scrolling;
- pager and spatial controls remain inside the viewport without overlap;
- canonical fullscreen spatial viewport ownership is preserved.

Project-owner live smoke after deploy: PASS on `/workspace/board/` on 2026-09-15. Owner explicitly confirmed: `вижу, всё нормально`.

This is owner-provided live evidence after the successful production deploy, not an inferred result from CI alone.

## G8 inventory

### PR / branch state

- PR #210 is merged and closed.
- `result/board-mobile-harmonization-v1` is historical integration state only and no longer owns active integration.
- physical branch retention is acceptable for traceability; semantic ownership is retired.

### Runtime / ownership

The corrective introduced one presentation-only composition stylesheet, `community/board/board-mobile-harmonization-v1.css`, loaded after the existing canonical Board component styles.

It does not create a second Workspace nav, Board runtime, Artifact owner, Program renderer, state owner, database mechanism, auth owner, Membership flow or persistence layer.

Existing canonical owners remain:

- Workspace nav/state → `workspace/workspace-shell-v1.js`;
- fullscreen/pager/primary action → `community/board/board-fullscreen-v2-1.js`;
- spatial controls/camera → `community/board/board-spatial-v1.js`;
- Current Program renderer → `community/board/board-program-v1.js`.

The browser acceptance script is retained intentionally as regression coverage; it is not temporary runtime.

### Scope boundaries preserved

No Board IA lifecycle semantics, Artifact semantics, Membership/DC-9/Application state, Supabase schema/RLS/migrations, Current Program truth/composition, Telegram promotion or payment/commerce behavior changed.

Unrelated WAITING Board Results remain open and are not closed by this presentation corrective.

### Deployment workflow observation

A failed rerun attempt of deploy #84 produced two artifacts with the same `github-pages` name and was rejected by `actions/deploy-pages`. No production release was inferred from that failed attempt.

The owner then started a fresh manual deploy #85 with `release_confirmation=APPROVED`; that clean run produced exactly one Pages artifact and deployed successfully. This evidence records #85 as the release authority for the corrective.

## G8 conclusion

This Result has sufficient evidence for closure:

- exact candidate full CI PASS;
- exact production merge commit identified;
- clean manual production deploy SUCCESS;
- exact production checkout proven in deploy logs;
- Pages artifact and digest recorded;
- 390/360 focused browser acceptance PASS;
- project-owner post-deploy live smoke PASS;
- no duplicate runtime/state/semantic owner introduced;
- no temporary compatibility layer remains;
- integration ownership is retired.

`dementor-club.result.board-mobile-harmonization-v1` may move to APPROVED / completed history at G8.
