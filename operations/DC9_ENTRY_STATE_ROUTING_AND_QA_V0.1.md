# DC-9 Entry State, Routing & QA v0.1

Status: **DRAFT PRODUCT / QA MASTER — NOT PRODUCTION AUTHORIZATION**  
Date: 2026-09-02  
Source of truth: `dementor-club`

## 0. Purpose

This document is the working master for the DC-9 entry experience after the 2026-09-02 production release.

It consolidates:

- account-aware entry states;
- DC-9 progress states;
- result/map access;
- membership/community routing;
- responsive question-layout QA;
- browser/auth/sync test cases;
- acceptance criteria before the next production release.

It does **not** change the approved 54-scene DC-9 instrument, scoring v0.9 or result semantics.

Implementation belongs in `dementor-club-site`. Production changes belong only in `dementor-club-production` after QA and explicit release approval.

## 1. Authority chain

Read together with:

1. `operations/DC9_PRODUCTION_BASELINE_2026-09-02.md`
2. `operations/DC9_RESULT_SYSTEM_V0.1.md`
3. `operations/DC9_RESULT_QA_V0.1.md`
4. `operations/AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md`
5. `operations/IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md`
6. `operations/MEMBERSHIP_APPLICATION_AND_DC9_PUBLIC_FLOW_V0.1.md`
7. site QA contract: `dementor-club-site/docs/QA_RELEASE_CONTRACT_v1.md`
8. typography/mobile supplement: `dementor-club-site/docs/TYPOGRAPHY_MOBILE_ACCESSIBILITY_SPEC.md`

If these sources disagree, do not silently choose a convenient implementation. Record the conflict here and resolve it in `dementor-club` before changing production semantics.

## 2. Facts already approved

### 2.1 DC-9

- `/join/` is the public DC-9 entry route.
- `/join/result/` is the canonical map/result route.
- DC-9 contains 9 spheres × 6 scenes = 54 scenes.
- It produces nine independent sphere results and no aggregate personality score.
- Current browser state key remains `dementorClubOnboardingV3`.
- Current backend assessment family remains `dc9-v1`.
- Completed result history must not be silently discarded by UI-version changes.

### 2.2 Authentication

Google/Supabase authentication answers **who the person is**.

Approved account behavior already includes:

`Google OAuth → Supabase session → profile → assessment_runs → assessment_snapshots → cross-device restore`.

Authenticated users must be able to access their own DC-9 map across devices after synchronization.

Authentication alone does not mean club membership and never assigns the `DEMENTOR` role.

### 2.3 Membership boundary

Membership is an explicit scoped system state. It is not inferred from:

- Google login;
- DC-9 completion;
- DC-9 level 5;
- the 9×5 special result;
- email/name/personality.

## 3. Conflict discovered during live QA — BLOCKER TO RESOLVE

Current sources and current site implementation disagree about how a non-member becomes a `CLUB_MEMBER`.

### Approved/baseline side

`AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md` says the concrete mechanism for obtaining/confirming membership is **not yet fixed and must not be invented in code**.

`MEMBERSHIP_APPLICATION_AND_DC9_PUBLIC_FLOW_V0.1.md` defines:

`AUTHENTICATED GUEST → MEMBERSHIP APPLICATION → REVIEW → CLUB MEMBERSHIP`

and explicitly says an application must not automatically create system membership.

### Current implementation side

The current `/join/member/` runtime calls `dc_activate_membership_v1` after identity/contact/terms input and then exposes Community Board state as active membership.

### Rule for this work

Do **not** treat the current automatic activation as newly approved product semantics.

Until the membership mechanism is explicitly resolved in `dementor-club`:

- state-aware entry UX may distinguish `authenticated non-member` from `active member`;
- active existing members may be routed directly to their club world;
- authenticated non-members with a complete DC-9 map may be routed to a neutral **membership entry/application surface**;
- the exact transition from non-member to member remains a product blocker and must not be silently redesigned inside QA code.

## 4. Product principle: `/join/` becomes a state-aware entry resolver

The old mental model:

`JOIN → TEST → RESULT → MEMBER → COMMUNITY`

is insufficient once accounts and saved maps exist.

The intended model is:

`ACCOUNT STATE + DC-9 STATE + MEMBERSHIP STATE → CORRECT NEXT SURFACE`

A returning active member must not be treated as a first-time quiz visitor.

A completed DC-9 map is a persistent account object, not a transient end screen.

## 5. State dimensions

### Authentication

- `GUEST`
- `AUTHENTICATED`

### DC-9

- `NONE`
- `PARTIAL`
- `COMPLETE`

### Membership

- `NOT_MEMBER`
- `MEMBER_ACTIVE`

### Community activation

Where current runtime exposes it:

- `FIRST_ARTIFACT_REQUIRED`
- `MEMBER_ACTIVATED`

These are presentation/routing states only. They must never grant permissions without the authoritative server-side membership/access state.

## 6. Entry-state matrix

| State | Primary surface | Primary action | Secondary action | Must not happen |
|---|---|---|---|---|
| Guest + DC-9 NONE | DC-9 intro | `НАЧАТЬ DC-9 →` | `ВОЙТИ ЧЕРЕЗ GOOGLE` | imply membership |
| Guest + DC-9 PARTIAL | Resume | `ПРОДОЛЖИТЬ DC-9 →` | `ВОЙТИ И СОХРАНИТЬ ПРОГРЕСС` | discard local draft |
| Guest + DC-9 COMPLETE | Map/result | `ПОСМОТРЕТЬ КАРТУ →` | `ВОЙТИ И СОХРАНИТЬ КАРТУ` | force repeat test |
| Auth + DC-9 NONE | Account-aware DC-9 intro | `НАЧАТЬ DC-9 →` | account/profile | show guest login CTA as primary |
| Auth + DC-9 PARTIAL | Resume | `ПРОДОЛЖИТЬ DC-9 →` | map/progress/account | restart silently |
| Auth + DC-9 COMPLETE + NOT_MEMBER | Map/result | membership entry/application CTA | `МОЯ КАРТА DC-9` | infer membership from test |
| Auth + MEMBER_ACTIVE + FIRST_ARTIFACT_REQUIRED | Club return state | `ОТКРЫТЬ COMMUNITY BOARD →` | `МОЯ КАРТА DC-9` | show quiz as primary |
| Auth + MEMBER_ACTIVE + MEMBER_ACTIVATED | Club home/Community | `ВОЙТИ В COMMUNITY →` | `МОЯ КАРТА DC-9`, account | force `/join/` test intro |

### Returning-member copy direction

Preferred hierarchy for an authenticated active member:

**ДОБРО ПОЖАЛОВАТЬ В КЛУБ.**

Primary:

`ВОЙТИ В COMMUNITY →`

Secondary:

`МОЯ КАРТА DC-9`

Tertiary if offered:

`ПРОЙТИ DC-9 ЗАНОВО`

The exact wording remains subject to normal editorial approval, but the action priority is part of this QA proposal.

## 7. State-resolution precedence

### Guest

Before authentication, local DC-9 state is usable and must remain usable.

### After authentication

1. restore Supabase session;
2. synchronize eligible local assessment runs;
3. resolve current account-bound DC-9 result/history;
4. resolve authoritative membership/access state server-side;
5. render the correct entry surface.

Server membership state takes precedence over local presentation assumptions.

### Merge/sync safety

- never replace a newer remote completed result with an older local result;
- never delete a completed map because the UI version changed;
- legacy `self-development` remains normalized to `self_development`;
- partial legacy UI runs may be archived instead of mapped screen-for-screen into the 54-scene UI;
- a sync error must not fabricate membership or a completed map.

## 8. Map as persistent account artifact

For an authenticated account with completed DC-9:

- `МОЯ КАРТА DC-9` must remain addressable from the account/club experience;
- the map may be viewed without repeating the test;
- repeat assessment is a separate explicit action;
- share/export uses the same nine factual results as the on-screen map;
- sharing a map does not expose raw answers or private account data;
- map visibility does not imply membership or `DEMENTOR` role.

## 9. Question-layout QA baseline — approved direction from live review

The 2026-09-02 live review found:

- unexpected black strip/header layering above `/join/`;
- question typography too large on desktop;
- mobile question layout too poster-like/dense;
- answer choices enter the viewport too late;
- `К СФЕРАМ` beside `ДАЛЬШЕ` competes with the primary progression action.

### Agreed visual direction

Use the reviewed **LONG** typography mode as the single baseline for all 54 scenes.

Do not ship a public `SHORT / MEDIUM / LONG` selector. It is QA-only.

Desktop target:

- scene text approximately `31–38px` depending viewport height/width;
- reading width approximately `850–900px`;
- weight closer to `700–760`, not display-black density;
- compact vertical rhythm;
- 2×2 answer grid where width permits;
- scene + beginning of answers should normally be visible as one decision unit on laptop/desktop.

Mobile target:

- scene text approximately `22–24px`;
- answers in one column;
- comfortable touch targets;
- compact gaps without making controls microscopic;
- primary progression action remains easy to reach;
- mobile is recomposed, not a scaled desktop.

Navigation:

- `← К СФЕРАМ` belongs in the upper service line;
- bottom response area contains progression (`ДАЛЬШЕ →`) and reaction/status only;
- one canonical site header only;
- no unexplained black strip or duplicate header layer.

Typography:

- current production fallback remains Inter while licensed production typography is unresolved;
- do not commit commercial font binaries;
- preserve the intended reading/display roles from the active typography spec.

## 10. QA test surface

Implementation QA route:

`dementor-club-site/design-system/dc9-entry-state-test/index.html`

Purpose:

- visual review of all entry states without mutating real account state;
- responsive review of the agreed LONG question layout;
- action-priority review;
- copy review;
- noindex / internal design-system surface;
- no production auth writes;
- no membership writes;
- no assessment writes.

The test surface must visibly label simulated state so nobody mistakes it for real account authority.

## 11. Required QA matrix

### Viewports

Minimum:

- 1920×1080 — wide desktop;
- 1440×900 — standard desktop;
- 1366×768 — laptop / low-height desktop;
- 1024 — compact desktop/tablet;
- 768 — tablet;
- 430×932 — large mobile;
- 390×844 — standard mobile;
- 320 — narrow fallback.

### State checks

For every applicable viewport:

- [ ] Guest / NONE
- [ ] Guest / PARTIAL
- [ ] Guest / COMPLETE
- [ ] Auth / NONE
- [ ] Auth / PARTIAL
- [ ] Auth / COMPLETE / NOT_MEMBER
- [ ] Auth / MEMBER_ACTIVE / FIRST_ARTIFACT_REQUIRED
- [ ] Auth / MEMBER_ACTIVE / MEMBER_ACTIVATED
- [ ] Question screen / LONG typography
- [ ] Result/map screen

### Functional checks

- [ ] correct primary CTA for each state;
- [ ] no state exposes a stronger permission than server membership grants;
- [ ] completed account never loses access to map;
- [ ] active member is not forced through DC-9;
- [ ] partial local progress survives guest navigation;
- [ ] auth sync preserves newest completed results;
- [ ] auth redirect returns to intended surface;
- [ ] repeat DC-9 is explicit;
- [ ] no raw answers/PII sent to analytics;
- [ ] keyboard focus visible;
- [ ] reduced-motion safe;
- [ ] no horizontal overflow;
- [ ] no clipped primary CTA;
- [ ] no duplicate header/black strip;
- [ ] `К СФЕРАМ` is upper navigation, not a peer of `ДАЛЬШЕ`.

## 12. Release gate for this work

This work may move toward production only after:

1. membership-mechanism conflict in section 3 is explicitly resolved in `dementor-club`;
2. state matrix is human-approved;
3. design-system QA screen is human-approved on desktop and mobile;
4. browser/provider auth round-trip is tested;
5. Supabase sync/access checks pass;
6. existing `DC9_RESULT_QA_V0.1.md` remains green or is updated with truthful deltas;
7. site QA/release contract is passed;
8. dedicated production candidate PR is green;
9. explicit human deploy approval is given.

No deploy is authorized by this document.

## 13. Current status — 2026-09-02

- DC-9 54-scene production instrument: **approved and live baseline**.
- LONG question-layout direction: **human-approved direction / implementation pending**.
- state-aware `/join/` resolver: **proposed / QA design pending**.
- persistent account-map priority: **supported by existing auth/sync baseline; entry UX pending**.
- active-member direct Community entry: **proposed UX using existing authoritative membership state**.
- non-member → member transition semantics: **BLOCKED pending resolution of conflicting source/implementation behavior**.
- next artifact: `design-system/dc9-entry-state-test/index.html`.
