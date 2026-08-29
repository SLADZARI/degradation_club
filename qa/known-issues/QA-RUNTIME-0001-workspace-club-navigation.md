# QA-RUNTIME-0001 — Workspace / MY CLUB navigation hang

Status: FIXED_IN_QA_PENDING_BROWSER
Severity: P1
Type: RUNTIME / NAVIGATION
Environment: production reproduction, fix work only in `dementor-club-qa`
Reported: 2026-08-29
Route: `/workspace/`

## Symptom

Authenticated workspace loads HOME correctly. Clicking `MY CLUB` / the `КЛУБ` dashboard action can leave the transition hanging and the browser in a continuing loading state.

## QA fix applied

The render-time `bind()` model has been removed from active workspace runtime and replaced by one delegated click listener. The legacy `workspace-listener-guard-v1.js` global `EventTarget.prototype.addEventListener` monkey-patch has been deleted from the QA branch.

The club route remains synchronous. Dementor portraits now use `loading="lazy"` + `decoding="async"`.

Related hardening in the same QA fix-pack:
- logged-out `/workspace/` now has a real HTML shell before Supabase resolves;
- auth/session bootstrap is bounded and exposes retry/error state instead of an infinite spinner;
- core identity/profile loading is separated from optional membership/tests/courses/orders/join data;
- optional data-source failures no longer intentionally abort the whole workspace;
- production Account navigation no longer exposes disabled Cart;
- production internal System Tools links are disabled by environment policy.

## Regression acceptance still required

- HOME → MY CLUB renders once and remains responsive.
- MY CLUB → HOME → MY CLUB works for at least 20 repeated transitions without duplicated handlers or increasing latency.
- Dashboard `КЛУБ` action and sidebar `MY CLUB` produce the same state.
- `MY ACTIVITY`, `MY PROFILE`, `MY WORK` continue to work.
- no unexpected document reload;
- no new console errors;
- no persistent network request required for internal route rendering;
- auth/session remains intact;
- production is not changed until browser QA passes and a protected production PR is approved.

## Automated evidence

`Production Candidate Integrity` now runs on `dementor-club-qa` and includes a production navigation-boundary guard. Run #381 passed all static/build gates for QA head `93e4f879b308993c38b04dd0057a59e6acf57418`.

## Evidence still required

Authenticated and anonymous browser-level regression evidence. Static/build CI passing is not sufficient to close this P1 issue.
