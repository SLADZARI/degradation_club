---
artifactId: dementor-club.evidence.board-navigation-adaptive-cards-g8-2026-09-13
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED_EVIDENCE
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-navigation-adaptive-cards-v1
---

# Board Navigation + Adaptive Cards v1 — G8 closure evidence

## Release evidence

Validated candidate: `faf57aa7a949f27d506ef9a969896e8653c32d2b`.

Full Site Integrity / Release Readiness #1031 / run `34722775463` — PASS.

PR #158 was squash-merged with expected-head protection to production commit:

`d7451d1d7023edf4ff85abb17fa6235ddc53bb35`

The candidate and production merge commit resolve to the same tree `9adfa8fa800c221e27b80e767864efa206acc3d9` for the released scope.

Deploy Dementor Production #65 / run `34723798930` — SUCCESS.

Build logs confirm checkout of `dementor-club-production` and `git log -1` = `d7451d1d7023edf4ff85abb17fa6235ddc53bb35` before validation/build.

Pages artifact: `10307500383`.

Artifact digest: `sha256:cc65101ed21f1f102a1772b328abd9eb48439285efd9731fc1363130a03e5c9b`.

GitHub Pages deployment reported SUCCESS and environment URL `http://dementor.club/`.

Project-owner live smoke after deploy: PASS for `/workspace/board/`, including the released mobile/desktop Board behavior. This is owner-provided live evidence, not a separate automated browser run performed after deployment.

## G8 inventory

### PR / branch state

- PR #158 is merged and closed; no open release PR remains for this Result.
- `agent/board-navigation-adaptive-cards-v1` still physically exists at candidate `faf57aa7a949f27d506ef9a969896e8653c32d2b` and is now historical integration state only.
- the branch must no longer be treated as active integration ownership after Result closure.
- physical ref retention is acceptable for traceability; semantic/current ownership is retired.

### Runtime / compatibility / temporary layers

PR #158 changed exactly three files:

- `.github/workflows/site-integrity.yml` — adds durable regression acceptance;
- `community/board/board-mobile-air-v2-1.css` — extends the existing canonical responsive Board composition owner;
- `scripts/validate-board-navigation-adaptive-cards-browser.mjs` — durable browser regression coverage.

The Result introduced no second Board navigator, second card component, new state owner, compatibility runtime, temporary feature flag, DB/RLS/migration, Membership/DC-9, Telegram, Artifact lifecycle, entity ownership, Workspace shell, auth owner or coordinate-persistence mechanism.

The browser acceptance file is retained intentionally as regression coverage; it is not a temporary production runtime.

### Deployment workflow ownership observation

G8 found a pre-existing cross-branch workflow ownership inconsistency that was not introduced by PR #158:

- default branch `main` exposes `.github/workflows/deploy-production.yml` with workflow name `Deploy Dementor Production` and explicitly checks out `dementor-club-production`;
- `dementor-club-production` contains `.github/workflows/deploy-pages.yml`, also named `Deploy Dementor Production`;
- run #65 is registered against the default-branch `deploy-production.yml`, while its build correctly checked out and built exact production commit `d7451d1d...`.

This did not invalidate release #65 because exact checkout/build evidence is present. It is nevertheless duplicate deployment-workflow ownership and should be handled only by a separately scoped workflow/CI cleanup Result. It is not changed opportunistically inside this Board presentation Result.

### Scope/authority cleanup

`operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md` remains DRAFT / REFERENCE. Closing this Result does not promote it to project-wide DESIGN authority.

`operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md` remains DRAFT / REFERENCE and was explicitly excluded from this Result.

Board Information Architecture v1 remains a separate WAITING / G8 Result; its deferred legitimate-actor/Telegram/all-eight-state evidence is neither closed nor altered here.

No production merge/deploy authorization from PR #158 carries forward to future Results.

## G8 conclusion

This Result has sufficient evidence for closure:

- exact candidate validated;
- exact production merge commit identified;
- exact production commit built in deploy #65;
- Pages artifact and digest recorded;
- Pages deploy succeeded;
- project-owner live smoke PASS;
- merged branch retired from active semantic ownership;
- no temporary runtime or duplicate Board owner introduced by this Result;
- regression acceptance retained intentionally;
- unrelated deployment-workflow duplication classified rather than mutated in-scope.

`dementor-club.result.board-navigation-adaptive-cards-v1` may move to APPROVED / completed history at G8.