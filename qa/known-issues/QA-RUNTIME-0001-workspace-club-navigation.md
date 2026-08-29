# QA-RUNTIME-0001 — Workspace / MY CLUB navigation hang

Status: OPEN
Severity: P1
Type: RUNTIME / NAVIGATION
Environment: production reproduction, fix work only in `dementor-club-qa`
Reported: 2026-08-29
Route: `/workspace/`

## Symptom

Authenticated workspace loads HOME correctly. Clicking `MY CLUB` / the `КЛУБ` dashboard action can leave the transition hanging and the browser in a continuing loading state.

## Current production evidence

The workspace router currently re-runs `bind()` after every render and scans all `[data-route]` nodes to attach new click listeners. A separate `workspace-listener-guard-v1.js` globally monkey-patches `EventTarget.prototype.addEventListener` to suppress repeat bindings on persistent sidebar navigation.

This combination is a brittle legacy navigation contract and is the first suspect for repeated, blocked or inconsistent route clicks. The club route itself is synchronous and should not require a fresh Supabase request.

## QA classification

This is a P1 blocker under `docs/QA_RELEASE_CONTRACT_v1.md` because an authenticated primary workspace route is not reliably navigable.

## Required fix direction

1. Replace render-time listener rebinding with one stable delegated navigation listener.
2. Remove the global EventTarget monkey-patch once delegation is active.
3. Keep route rendering synchronous; no full-page reload for internal workspace tabs.
4. Lazy/decode secondary club portrait media so image loading cannot block perceived navigation.
5. Preserve Supabase auth/session/RLS behavior unchanged.

## Regression acceptance

- HOME → MY CLUB renders once and remains responsive.
- MY CLUB → HOME → MY CLUB works for at least 20 repeated transitions without duplicated handlers or increasing latency.
- Dashboard `КЛУБ` action and sidebar `MY CLUB` produce the same state.
- `MY ACTIVITY`, `MY PROFILE`, `MY WORK` continue to work.
- no unexpected document reload;
- no new console errors;
- no persistent network request required for internal route rendering;
- auth/session remains intact;
- production is not changed until QA passes and a protected production PR is approved.

## Evidence still required

Authenticated browser console + Network evidence should be captured during QA to confirm whether any additional request/asset failure contributes to the visible loading indicator.
