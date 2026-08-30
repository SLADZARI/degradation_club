# Community v1 — release QA evidence

Date: 2026-08-30  
Branch: `release/community-v1-clean`  
PR: #46  
Scope: `/join/result/`, `/join/member/`, `/community/board/`, `/community/artifact/`

## Status

**PRODUCTION VALIDATORS: PASS**  
**RESPONSIVE ARTIFACT LAYOUT QA: PASS**  
**SERVER ARTIFACT LIFECYCLE TRANSACTION: PASS**  
**LIVE OAUTH / TWO-MEMBER BROWSER E2E: PARTIAL / POST-DEPLOY VERIFICATION**

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

## 6. Post-deploy verification items

The following checks are **not claimed complete** by this document and must be verified immediately after production publication:

1. full real browser path `9/9 → /join/result/ → Google OAuth → /join/member/ → Board` on `dementor.club`;
2. first Artifact creation in the production browser;
3. second active Member reaction + response authorization in-browser;
4. stable `/community/artifact/<uuid>/` route on the actual GitHub Pages runtime;
5. browser archive action → restored Artifact slot;
6. anonymous/incognito access does not reveal Board, Community Artifact detail, or private media.

## Release decision

On 2026-08-30 project authority explicitly approved publication after the Join → Community discoverability fix. The remaining live-browser checks above are therefore reclassified from pre-merge blockers to immediate post-deploy verification items; they are not being marked as passed without evidence.

## 7. Live production non-member flow — 2026-08-30

Source: real production browser walkthrough on `dementor.club` with a previously authenticated non-member account; screenshots supplied during the QA session. This section is evidence + review proposals only. **No runtime/product changes are authorized by this section.**

### Verified PASS

The following path was completed successfully in production:

1. DC-9 result page resolved all nine canonical spheres and showed `КАРТА СОБРАНА`;
2. `/join/member/` loaded for the ordinary non-member account instead of returning to diagnostics;
3. display name, nickname/contact identity and legal acknowledgements could be submitted;
4. membership activated successfully and the UI showed `ДОПУСК ПОЛУЧЕН`;
5. Community Board opened as `MEMBER / ACTIVE` with `SLOTS 1`;
6. first-Artifact composer opened successfully.

This closes the earlier production blocker around `self-development` vs `self_development` for the tested account path.

### FAILED / REVIEW REQUIRED — first Artifact publication

The first browser publication attempt did **not** create an Artifact.

Observed input included a bare external URL similar to:

```text
linkedin.com/in/...
```

The UI accepted the value, but the database correctly rejected it because `dc_artifacts_external_url_check` requires an explicit `http://` or `https://` scheme. The raw PostgreSQL message was then rendered to the Member:

```text
new row for relation "dc_artifacts" violates check constraint "dc_artifacts_external_url_check"
```

#### QA-ART-01 — P1: URL validation exists only at the server boundary

Current behavior:

- composer field is plain text with `inputmode=url`;
- bare domains are accepted by the browser UI;
- draft creation fails in the RPC/database constraint;
- the Member receives a raw implementation error instead of actionable copy.

**Proposal for review:**

- validate before calling `dc_create_artifact_draft_v1` / `dc_update_artifact_draft_v1`;
- either normalize an unambiguous bare domain to `https://…` or require explicit HTTPS and show an inline message;
- prefer HTTPS for new links;
- map server constraint failures to a user-facing message such as `Добавьте полный адрес, начиная с https://`;
- do not remove the database constraint; it remains the final security boundary.

#### QA-ART-02 — P1: failed publication destroys the composer state

Current `boardError()` replaces the whole `entryHost`. Therefore the failed draft attempt removes the composer and the Member loses all unsaved form values from the visible UI.

**Proposal for review:**

- keep validation/server errors inside the composer (`composerState` or field-level error);
- preserve title/body/link/date/file selection wherever the browser permits;
- only replace the full entry surface for fatal Board/session errors.

#### QA-ART-03 — P1/P2: past expiry is accepted by the client

The production walkthrough entered `20.08.2026 11:45` on 30.08.2026. The browser accepted it. The URL constraint failed first, so the expiry error was not reached, but server publication rules would reject an already expired Artifact.

**Proposal for review:**

- set the datetime input minimum to the current local time;
- validate again before draft/publication RPC;
- show a direct message: `Срок действия должен быть в будущем`;
- keep the server-side `ARTIFACT_ALREADY_EXPIRED` guard as the final authority.

### Identity validation gap observed before membership activation

#### QA-MEMBER-01 — P2: provider and contact can contradict each other

The walkthrough selected `Telegram` while entering a LinkedIn URL. Current `member.js` validates only that a contact exists and whether it syntactically begins with `http://` / `https://`; it does not verify that the selected provider matches the URL/handle.

**Proposal for review:** choose one of two product directions:

A. remove the provider selector and infer `Telegram / Instagram / LinkedIn / website / other` from the entered value when possible; or  
B. keep the selector but validate obvious mismatches before activation.

Recommended for v1: **infer when possible, ask only when ambiguous.**

### File / image behavior verified

The composer currently permits one attachment with MIME types:

- JPG;
- PNG;
- WebP;
- PDF;
- TXT.

Both the client and the private `dc-community-artifacts` Storage bucket currently use an 8 MiB limit.

Important runtime order:

```text
create/update draft
→ upload file to private Supabase Storage
→ attach media row
→ publish Artifact
```

Because the tested attempt failed during `create draft` on the URL constraint, the selected screenshot was **never uploaded**. Post-test database/storage inspection showed:

```text
recent artifacts: 0
recent artifact media: 0
recent Community storage objects: 0
```

Telegram is not part of this upload path. Current source of truth is the private Supabase bucket.

#### QA-MEDIA-01 — proposal for review: reduce first-release attachment surface

Product suggestion from live QA: reduce the attachment ceiling from 8 MiB to **4 MiB**.

Recommended v1 review option:

- 4 MiB maximum;
- images first: JPG / PNG / WebP;
- decide separately whether PDF / TXT should remain before Telegram forwarding is introduced;
- if arbitrary documents remain supported later, add a malware/scanning policy before redistributing them outside the private Community surface.

No limit or MIME change has been applied by this QA report.

### External-link safety — product proposal

A strict allowlist of meeting providers would be safe but too restrictive for a generic Artifact, because an Artifact can be a meeting, thought, practice, invitation or experiment.

Recommended review direction:

1. generic Artifact link: HTTPS only + client validation + `noopener/noreferrer` + clear external-link treatment;
2. if/when an Artifact is explicitly classified as a meeting/event, offer a dedicated meeting-link field with an approved-provider allowlist (for example Google Meet / Zoom / Microsoft Teams / Calendly or another approved set);
3. unknown generic domains may receive a warning/interstitial rather than being silently trusted;
4. do not treat a URL allowlist as malware scanning.

### Prompt comprehension proposal

The first-Artifact question works conceptually, but the phrase `Если бы вы были дементором…` assumes the Member already understands the role/cultural construct.

**Proposal for review:** add a small `? / ЧТО ЭТО ЗНАЧИТ?` affordance next to the prompt. It should open an inline popover/modal rather than navigating away from the composer. Suggested content structure:

- 1–2 sentences defining the thought experiment;
- three concrete examples: `встреча / практика / предложение`;
- optional internal link to the canonical Dementor explanation/profile layer;
- explicit note: answering this does **not** make the Member a Dementor.

### Board state

`ДОСКА ПОКА ПОДОЗРИТЕЛЬНО ЧИСТАЯ` is currently **expected**, not a functional error: no fabricated seed Artifacts were inserted. Historical/club material should only be seeded from confirmed source-backed records.

Product review remains open on whether the first production Board should be pre-seeded with a small source-backed club archive so a newly activated Member does not arrive into an empty cultural surface.

### Telegram — next integration boundary, not current behavior

No Artifact/file is currently forwarded to Telegram.

Recommended future integration contract for review:

```text
Artifact successfully published in Supabase
→ create distribution/outbox event
→ Telegram worker renders a Telegram-specific version
→ optional image is read server-side from private Storage
→ Telegram message/topic identifiers are stored as downstream distribution metadata
```

Telegram should remain downstream distribution/discussion infrastructure, not semantic authority or primary file storage.

### Updated post-deploy matrix

| Check | Status |
|---|---|
| 9/9 → result → member entry | PASS |
| membership activation | PASS |
| Board access as new Member | PASS |
| first Artifact composer opens | PASS |
| first Artifact publication | FAIL — QA-ART-01 / QA-ART-02 |
| file upload on tested attempt | NOT REACHED — correctly no object created |
| second Member reaction/response | NOT TESTED |
| stable Artifact pretty URL | NOT TESTED because no Artifact published |
| archive → slot restore in browser | NOT TESTED |
| anonymous/incognito privacy | NOT TESTED |

The first Artifact browser path therefore remains **PARTIAL**, not PASS.
