---
artifactId: dementor-club.result.board-share-receive-ritual-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.1
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
decision: operations/BOARD_SHARE_RECEIVE_RITUAL_V1.md
integrationBranch: agent/board-share-receive-ritual-v1
productionBaseCommit: 90c0de26a9d070fdff74fe1491c8992c3c90b855
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Board Share → Receive Ritual v1 | Result v0.1

## Status

**ACTIVE / PRODUCT ACCEPTANCE REOPENED / G5 BUILD**

The Share → Receive flow was previously implemented and released through PRs #163 and #164. Production live smoke after deploy run `34761634673` exposed a semantic acceptance failure: shared arrivals automatically open the Artifact instead of stopping at a deliberate incoming postcard.

This Result canonicalizes the work inside the Dementor Club semantic source and owns the narrow roll-forward corrective. The earlier `weekly-os.result.board-share-receive-ritual-v1` tracking artifact in `SLADZARI/WeeklyOS` is non-authoritative for Dementor Club product semantics and remains history/reference only.

## Goal

Preserve the released Sender Share mechanics while changing Receive into an explicit recipient ritual:

`shared URL → auth if needed → resolve readable target → persistent incoming postcard → explicit accept OR stay on Board`

No role-specific automatic opening remains for `from=share` arrivals.

## Canonical owners

- Share/Auth/Return orchestrator: `community/board/board-deeplink-auth-return-v1.js`.
- Board user-state authority: `community/board/board-user-state-v2.js`.
- Artifact detail/fullscreen owner: existing Board fullscreen + `/community/artifact/<uuid>/` detail surface.
- Workspace auth identity owner: `workspace/workspace-shell-v1.js`.
- External transport surface: `/share/artifact/?id=<uuid>`.

No parallel owner is authorized.

## Production baseline

Current released corrective baseline:

`90c0de26a9d070fdff74fe1491c8992c3c90b855`

Deploy Dementor Production run:

`34761634673` — SUCCESS.

This Result must start from that exact production baseline.

## Scope

1. Remove Guest/Applicant 600 ms shared-arrival auto-open.
2. Remove Member/Dementor/Owner shared-arrival direct-open.
3. For every authenticated readable shared target, show one persistent incoming postcard.
4. Add explicit `ПОСМОТРЕТЬ АРТЕФАКТ →` acceptance.
5. Add `ОСТАТЬСЯ НА ДОСКЕ` and canonical close behavior.
6. Accept consumes only `from=share`, preserves `focus`, then opens exact Artifact.
7. Stay/close consumes both `from=share` and `focus`, remains on Board and must not trigger resolver reopen.
8. Preserve unauth generic incoming postcard and exact OAuth return; post-auth still stops at the persistent incoming postcard.
9. Preserve generic missing/inaccessible state.
10. Update contract/browser/full-stack acceptance for Chromium + WebKit desktop/mobile.

## Non-goals

- sender-side Share redesign beyond preserving the released #164 behavior;
- new roles, membership states, DB tables, RPCs or RLS policies;
- pre-auth Artifact existence lookup;
- share attribution / opaque `share_id`;
- sender identity in public URLs;
- dynamic social metadata;
- Community `/community/` metadata cleanup;
- a new Board, router, auth callback or fullscreen owner;
- production merge or deploy without separate owner authorization.

## Acceptance Criteria

### Unauthenticated

- `focus=artifact:<uuid>&from=share` without session shows `ВАМ ПЕРЕДАЛИ АРТЕФАКТ` with `ВОЙТИ И ПОСМОТРЕТЬ →`.
- No pre-auth existence/access distinction is exposed.
- Google login receives exact validated returnTo containing the same `focus` and `from=share`.

### Authenticated shared arrival

- Guest, Applicant, Member, Dementor and Owner Admin all use the same persistent incoming postcard after the readable target resolves.
- No shared-arrival timer exists.
- No Member/Dementor/Owner direct-open exists.
- Target does not open until explicit accept.

### Accept

- `ПОСМОТРЕТЬ АРТЕФАКТ →` removes only `from=share` with replacement semantics.
- `focus=artifact:<uuid>` remains canonical in URL.
- Exact resolved Artifact opens through the existing detail owner.

### Stay / close

- `ОСТАТЬСЯ НА ДОСКЕ`, `×`, backdrop and `Escape` consume both `from=share` and `focus`.
- Board remains open without Artifact detail.
- Focus resolver cannot subsequently reopen the declined Artifact.

### Missing target

- Missing/hidden/denied target remains generic for the recipient: `ЭТОГО ЗДЕСЬ БОЛЬШЕ НЕТ.`.
- No new permission oracle is introduced.

### Regression

- Ordinary non-share `focus=artifact:<uuid>` continues direct canonical focus/open behavior.
- Sender postcard, sender identity, Artifact action-row Share placement and generic transport URL remain intact.
- Entity Share behavior remains intact.
- Back/Forward remains coherent.
- Mobile 390 and desktop remain usable.
- Chromium + WebKit acceptance passes.
- production manifest/release gate passes.

## Evidence history

Released before acceptance reopen:

- PR #163 → production `fad02eea30287ae6cab69301438b73ee11b337e7`.
- Deploy run #71 / `34757939416` — SUCCESS.
- PR #164 validated head `f9746012acba696377803aa28b0d4d82d9ce2ea2` — Site Integrity #1063 / `34760818239` PASS.
- PR #164 → production `90c0de26a9d070fdff74fe1491c8992c3c90b855`.
- Deploy run #72 / `34761634673` — SUCCESS.
- Live product acceptance: **FAIL / REOPENED** because receive auto-open/direct-open violates the approved ritual intent.

These releases remain valid historical evidence; the corrective is roll-forward, not history rewriting.

## Gate

- G4 decision: APPROVED in `operations/BOARD_SHARE_RECEIVE_RITUAL_V1.md`.
- G5 BUILD: ACTIVE.
- G6 VALIDATION: pending fresh full CI on a new corrective candidate SHA.
- G7 RELEASE: blocked until fresh G6 PASS and explicit merge authorization.
- Deploy: separately blocked until explicit deploy authorization.
- G8 CLEANUP: blocked until corrected production live smoke passes.
