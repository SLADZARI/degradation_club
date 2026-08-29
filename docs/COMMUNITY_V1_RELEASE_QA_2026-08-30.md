# Community v1 — release QA evidence

Date: 2026-08-30  
Branch: `release/community-v1-clean`  
PR: #46  
Scope: `/join/result/`, `/join/member/`, `/community/board/`, `/community/artifact/`

## Status

**PRODUCTION VALIDATORS: PASS**  
**RESPONSIVE ARTIFACT LAYOUT QA: PASS**  
**SERVER ARTIFACT LIFECYCLE TRANSACTION: PASS**  
**LIVE OAUTH / TWO-MEMBER BROWSER E2E: PENDING**

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

## 5. Remaining release blockers

The following cannot be claimed from the current evidence and remain mandatory before PR #46 leaves Draft:

1. real Google OAuth browser smoke on a reachable candidate host;
2. real user flow `9/9 → result → member entry → Board → first Artifact` using the deployed origin/callback;
3. second active Member reaction + response interaction in-browser;
4. stable `/community/artifact/<uuid>/` route smoke on the actual GitHub Pages runtime;
5. browser archive action → restored slot on the deployed candidate.

No fake OAuth session or invented second Member is used to mark these complete.

## Release rule

Do not merge PR #46 or run the manual production dispatcher until the remaining live-browser blockers above are completed or explicitly reclassified by project authority.
