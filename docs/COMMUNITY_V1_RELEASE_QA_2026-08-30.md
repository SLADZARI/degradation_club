# Community v1 — release QA evidence

Date: 2026-08-30  
Branch: `release/community-v1-clean`  
PR: #46  
Scope: `/join/result/`, `/join/member/`, `/community/board/`, `/community/artifact/`

## Status

**PRODUCTION VALIDATORS: PASS**  
**RESPONSIVE ARTIFACT LAYOUT QA: PASS**  
**SERVER ARTIFACT LIFECYCLE TRANSACTION: PASS**  
**LIVE MEMBER ENTRY: PASS**  
**FIRST ARTIFACT PRODUCTION PATH: FAILED ON VALIDATION UX / FIX CANDIDATE VERIFIED, NOT YET DEPLOYED**  
**TWO-MEMBER BROWSER E2E: PENDING**

This document records release evidence only. It does not change Community product semantics.

## 1. Production candidate integrity

GitHub Actions `Production Candidate Integrity` passed on the Community v1 release candidate after the readiness overlay and responsive corrections.

Validated steps:

- registry, routes and feature state;
- page content readiness registry;
- visual contract;
- production `_site` build;
- production analytics and consent;
- final production artifact/release guard.

The release candidate is built directly from `dementor-club-production`; it does not carry unrelated staging About/Merch changes.

## 2. Responsive artifact QA

The exact `_site` output produced by CI was downloaded as a QA artifact and rendered in headless Chromium with representative authenticated UI states injected from the real Community component grammar.

Widths checked for each of the four routes:

- 1440;
- 1024;
- 768;
- 390;
- 360;
- 320.

### Initial failures found

The first pass detected horizontal overflow in production output:

- `/join/result/`: ~17–18 px at narrow mobile;
- `/join/member/`: large overflow from the long entry display word, including at tablet width;
- `/community/board/`: overflow below approximately 380 px;
- `/community/artifact/`: overflow at narrow mobile.

These were treated as release defects, not accepted as visual variation.

### Corrections

A scoped `community-v1-responsive-fix.css` was added only to the four Community v1 authenticated surfaces. Long Russian display lines were resized for narrow widths instead of being hidden or clipped.

Final matrix result:

| Route | 1440 | 1024 | 768 | 390 | 360 | 320 |
|---|---:|---:|---:|---:|---:|---:|
| `/join/result/` | 0 px | 0 px | 0 px | 0 px | 0 px | 0 px |
| `/join/member/` | 0 px | 0 px | 0 px | 0 px | 0 px | 0 px |
| `/community/board/` | 0 px | 0 px | 0 px | 0 px | 0 px | 0 px |
| `/community/artifact/` | 0 px | 0 px | 0 px | 0 px | 0 px | 0 px |

`0 px` means `max(documentElement.scrollWidth, body.scrollWidth) - documentElement.clientWidth = 0` for the tested representative state.

Visual inspection was additionally performed on 1440 / 390 / 320 screenshots. The final narrow layouts keep content inside the viewport and avoid breaking the major display words inside a word.

## 3. Server-side Artifact lifecycle smoke

A rollback-only transaction was executed against the live Supabase runtime under an existing active Member context.

Observed transition:

```text
artifact_slots_available = 1
→ create draft
→ publish
status = active
artifact_slots_available = 0
community_activation_state = MEMBER_ACTIVATED
→ archive
status = archived
artifact_slots_available = 1
→ ROLLBACK
```

Post-check confirmed that zero QA Artifact rows remained in the database.

This verifies the basic one-slot publish/archive state machine without leaving test content on the real Community Board.

## 4. Security/runtime checks already completed

Before this QA pass the following were also verified:

- Community Storage bucket is private;
- Storage upload path is scoped to the authenticated Member;
- Board reads use active membership rather than entity assignment ACL;
- external identity/legal acknowledgement data is not exposed as Board directory data;
- membership activation checks the nine canonical sphere IDs server-side;
- Artifact publication checks available slot server-side under lock;
- persisted Artifact/external identity URLs are restricted to `http://` / `https://`;
- old `join_applications` data is preserved as legacy history and not reused by the new Member-entry flow.

## 5. Join → Community discoverability fix

Live product testing exposed a UX blocker after completing a sphere: the result screen did not make the route toward the 9/9 gate and Community sufficiently visible.

The release candidate now injects a high-contrast DC-9 progress panel on every sphere result:

- shows `N / 9` completed spheres;
- lists completed sphere names;
- for `N < 9`, provides `ПРОДОЛЖИТЬ ДИАГНОСТИКУ →`;
- for `9 / 9`, provides `ПОЛУЧИТЬ ИТОГОВОЕ ЗАКЛЮЧЕНИЕ →` leading to `/join/result/` and the Community entry flow.

The bridge cache key was bumped to `20260830-03` so the corrected transition is not hidden by an older cached script.

## 6. Original post-deploy verification items

The initial release left these live-browser checks open:

1. full real browser path `9/9 → /join/result/ → Google OAuth → /join/member/ → Board` on `dementor.club`;
2. first Artifact creation in the production browser;
3. second active Member reaction + response authorization in-browser;
4. stable `/community/artifact/<uuid>/` route on the actual GitHub Pages runtime;
5. browser archive action → restored Artifact slot;
6. anonymous/incognito access does not reveal Board, Community Artifact detail, or private media.

## 7. Live production non-member flow — 2026-08-30

A real non-member account completed the production path after the `self-development → self_development` data/runtime correction.

Verified PASS:

1. `/join/result/` resolved all nine canonical spheres and showed `КАРТА СОБРАНА`;
2. `/join/member/` loaded instead of returning the user to diagnostics;
3. display identity and legal acknowledgements were accepted;
4. membership activation succeeded and showed `ДОПУСК ПОЛУЧЕН`;
5. Community Board opened as `MEMBER / ACTIVE` with one Artifact slot;
6. first-Artifact composer opened.

This closes the original member-entry browser blocker for the tested account.

### First Artifact publication failure

The first real publication attempt used a bare LinkedIn URL without an explicit scheme. The frontend accepted it, while the existing database constraint correctly rejected it because `dc_artifacts.external_url` allows only `http://` / `https://`.

Observed raw error:

```text
new row for relation "dc_artifacts" violates check constraint "dc_artifacts_external_url_check"
```

Because draft creation failed before upload, post-test inspection confirmed:

```text
new Artifact rows: 0
new Artifact media rows: 0
new Community Storage objects: 0
```

The selected image therefore never left the browser.

Additional gaps observed in the same walkthrough:

- the composer was replaced by the error surface, losing entered values from view;
- a past expiry date could be entered client-side;
- the Member identity form could combine `Telegram` with a LinkedIn URL;
- first-release attachment policy was still 8 MiB and included PDF/TXT;
- the first-Artifact prompt lacked an in-place explanation of `Member ≠ Dementor`;
- Board empty state was truthful but culturally sparse.

## 8. QA fix candidate — PR #54

The approved fix batch is implemented on `fix/community-v1-qa-batch` and remains undeployed at the time of this record.

Implemented:

- bare hostname-like Artifact URLs normalize to HTTPS before RPC;
- malformed and non-web schemes are rejected client-side;
- raw PostgreSQL errors are not exposed as normal Member feedback;
- composer remains mounted and retains entered fields after validation/server errors;
- past expiry is rejected client-side while server authority remains unchanged;
- LinkedIn / Instagram / Telegram URLs infer the matching contact provider;
- first stable attachment policy becomes one JPG/PNG/WebP image, max 4 MiB;
- first-Artifact prompt has an inline explainer explicitly preserving `Member ≠ Dementor`;
- source-backed Club records from already existing approved production routes are shown separately from Member Artifact count;
- Telegram is prepared as a non-blocking distribution outbox after successful Artifact publication;
- CI now parses the changed JS modules and asserts these runtime contracts.

### Candidate CI

`Production Candidate Integrity` passed on the latest tested fix-candidate head, including:

- registry/routes;
- content readiness;
- visual contract;
- interactive runtime safety;
- JavaScript syntax parsing for Board and Member runtimes;
- production build;
- analytics/consent;
- production release gate.

### URL/provider simulation

Verified expected behavior:

| Input | Result |
|---|---|
| `linkedin.com/in/...` | normalized to `https://linkedin.com/in/...`, provider LinkedIn |
| explicit LinkedIn HTTPS URL | accepted, provider LinkedIn |
| `t.me/...` | normalized to HTTPS, provider Telegram |
| Instagram URL | provider Instagram |
| normal bare domain | normalized to HTTPS, provider Website |
| `javascript:` | rejected |
| `ftp:` | rejected |
| malformed free text | rejected |
| `@handle` | provider remains manual because service cannot be inferred safely |

### Responsive QA for changed surfaces

Representative authenticated Board/composer/source-record/error states were rendered at:

- 1440;
- 768;
- 390;
- 320.

All four widths measured `0 px` horizontal overflow.

The new modal explainer was additionally opened with `showModal()` at 390 and 320 px and remained fully inside the viewport with `0 px` overflow.

The changed Member identity form, including a long LinkedIn URL and inferred-provider hint, also measured `0 px` overflow at 1440 / 768 / 390 / 320.

### Supabase migration rollback QA

The proposed migration was executed against the live schema inside rollback-only transactions.

Verified:

- bucket can be changed from 8 MiB + JPG/PNG/WebP/PDF/TXT to 4 MiB + JPG/PNG/WebP;
- `dc_distribution_outbox` and `dc_enqueue_artifact_distribution_v1` create successfully;
- authenticated author enqueue works for an active Community Artifact;
- repeated enqueue of the same Artifact/channel returns the same outbox id;
- exactly one outbox row exists after two enqueue calls;
- deployment-race backfill queues an active Artifact that existed before the migration with source `community_board_v1_backfill`;
- rollback leaves no outbox table/function/test Artifact or bucket change in live production.

## 9. Current post-deploy matrix

| Check | Status |
|---|---|
| 9/9 → result → member entry | PASS in production |
| membership activation | PASS in production |
| Board access as new Member | PASS in production |
| first Artifact composer opens | PASS in production |
| first Artifact publication | FAILED on current production validation UX; fix candidate VERIFIED / NOT DEPLOYED |
| file upload on failed attempt | NOT REACHED; verified no object created |
| fix-candidate responsive QA | PASS |
| fix-candidate migration rollback QA | PASS |
| second Member reaction/response | NOT TESTED |
| stable Artifact pretty URL | NOT TESTED because no live Artifact published |
| archive → slot restore in browser | NOT TESTED |
| anonymous/incognito privacy | NOT TESTED |

## Release decision

The Community entry flow itself is now proven in production. PR #54 must not be described as production-verified until it is deployed and the first real Artifact is successfully published through the corrected composer. Two-Member interaction, stable pretty URL, archive restoration and anonymous privacy remain explicit live follow-up checks.
