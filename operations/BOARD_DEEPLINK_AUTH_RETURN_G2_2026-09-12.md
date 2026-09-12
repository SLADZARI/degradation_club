---
artifactId: dementor-club.evidence.board-deeplink-auth-return-g2-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: IMPLEMENTATION
gate: G2_ROOT_CAUSE
status: PASS
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
---

# Board Deep-Link Auth Return v1 — G2

## Baseline

Exact production baseline:

`43b6dcaa11292f49564c989add219e0b095fbf8d`

Branch:

`agent/board-deeplink-auth-return-v1`

## Result grammar

Canonical Board focus URLs:

- `/workspace/board/?focus=artifact:<uuid>`
- `/workspace/board/?focus=entity:<uuid>`

The address-bar URL is the mechanism. Share is only a convenience action that copies the same canonical URL.

## Ownership

### Auth return

Shared owner: `auth/callback/index.html` + `community-runtime-v1.js`.

The current callback validates `next` as a raw string before URL normalization. That is insufficient because slash/backslash normalization can transform an apparently internal string into a cross-origin URL.

Required contract:

1. Parse with WHATWG `URL` against `location.origin`.
2. Accept only `target.origin === location.origin`.
3. Reject callback recursion (`/auth/callback/`).
4. Preserve accepted path, query and hash exactly after URL parsing.
5. Invalid input falls back to `/workspace/`.

This is a generic auth-return hardening, not a Board-only redirect exception.

### Unauthenticated Board deep-link

Owner: `community/board/board-entry-v2.js`.

For a valid `focus` URL and no session, Board must not fall through to the generic old Board login that drops query state. It renders the approved deep-link auth gate and calls `loginWithGoogle()` with the current same-origin Board path/query/hash.

Authentication changes only:

`UNAUTHENTICATED -> AUTHENTICATED_GUEST`

It does not create membership, application, DC-9 completion or any new role.

### Artifact focus / overlay / camera

Existing owner remains `community/board/board-fullscreen-v2-1.js`.

Deep-link code must reuse the existing Artifact card, `focusCard()` camera behavior and canonical Artifact iframe overlay. No second Artifact renderer or second camera implementation is allowed.

### Entity focus

Existing entity projection owner remains `community/board/board-integrations-v1.js`.

Deep-link resolution may only focus an already loaded lawful projection with matching `data-source-id`. Entity detail remains the existing canonical `ОТКРЫТЬ ->` public route. No Board Entity detail overlay in v1.

## Permission boundary

`focus` is presentation state only.

- no direct privileged lookup by focus ID;
- no share token;
- no DB row for sharing;
- no permission escalation;
- no hidden/deleted/inaccessible reason disclosure;
- resolution only against Board data already returned by existing lawful reads.

Permission visibility wins over presentation filters. Focus may reveal a target hidden only by a presentation filter, but may never reveal a permission-hidden target.

## Async readiness

Artifact Guest reads complete on `dc:board-guest-read-ready`.
Entity projections complete on `dc:board-projections-updated`.

A missing-target state must not be declared before the relevant lifecycle has had a chance to complete.

## History contract

- normal Artifact open pushes `focus=artifact:<id>`;
- Back closes the overlay without pushing;
- Forward reopens/focuses;
- refresh reproduces focus;
- `popstate` never pushes;
- closing a direct deep-link replaces the URL with base Board instead of navigating an external referrer;
- unrelated allowed query parameters are preserved.

## Missing target

Copy:

`ЭТОГО ЗДЕСЬ БОЛЬШЕ НЕТ.`

`Возможно, всё закончилось хорошо.`

`Возможно, наоборот.`

`[ ОТКРЫТЬ BOARD ]`

The same state is used for nonexistent, deleted, hidden and inaccessible targets.

## Share

All lawful authenticated Board viewers, including Guest and Applicant, may copy canonical focus URLs for visible Artifacts and Entity projections.

Clipboard API is preferred with a DOM fallback.

`Commit != merge != deploy`.
