# Dementor Club — QA: DC-9 / Membership Semantic Integrity

Status: **OPEN / IMPLEMENTATION SPECIFICATION / PRE-RELEASE QA**  
Prepared: **2026-09-08**  
Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`  
Handoff entry: `operations/QA_EXTERNAL_DEVELOPER_PACKAGE_2026-09-08.md`

## 0. Goal

Remove semantic drift between local DC-9 state, account sync, sphere identity, immutable first-complete baseline, application admission, membership validity, Interest Map validation and Supabase auth-client ownership.

This is a **semantic-integrity / entropy-reduction Result**, not a feature redesign.

Protected boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Do not change approved lifecycle, role semantics, Board permissions, application review threshold, public header model or Workspace ownership as part of this Result.

## 1. Canonical target

After the fix, one rule must have one owner:

| Meaning | Canonical owner |
|---|---|
| DC-9 canonical sphere ID | shared `canonicalSphereId()` / equivalent single domain primitive |
| Assessment version | `dc9-v1` |
| Local incomplete progress | one canonical DC-9 local state + account snapshot |
| First complete 9/9 baseline | `public.dc_first_complete_baseline_v1(profile_id)` |
| Application 9/9 gate | same first-baseline primitive |
| Entry/Board DC-9-complete permission | same canonical server completion meaning |
| Active membership | `public.dc_membership_active(profile_id)` |
| Interest Map invariant | server-side application RPC validation |
| Supabase JS client | `community-runtime-v1.js → getClient()` |
| legacy/root path handling | shared `basePath()` / `route()` or equivalent canonical runtime-path normalization |
| repeat DC-9 attempts | history; never overwrite immutable first baseline |

No parallel baseline table, membership table, application flow, auth provider, profile state or DC-9 engine is authorized by this specification.

---

# 2. QA findings opened by this audit

## QA-MEM-035 — Account sync can destroy unfinished DC-9 progress

Severity: **P0 / DATA INTEGRITY**  
Status: **OPEN / CONFIRMED IN CURRENT PRODUCTION SOURCE**

### Fact

The active production configuration still loads `dementor-account-sync-v8.js` for canonical `/join/`.

Its `mergeStates()` returns only merged `results` and `active`.

Current DC-9 stores incomplete answers in `db.drafts`; `active` is only a navigation pointer.

Therefore a merge with a remote snapshot can delete fields such as:

- `drafts`;
- `quizVersion`;
- `legacyActive`;
- `firstBaseline`;
- `repeatRuns`;
- any unknown forward-compatible top-level state.

### Failure scenario

`answer 4/6 locally → login/sync → remote snapshot differs → mergeStates() → drafts disappear → sphere restarts`

### Required fix

Account sync must be non-destructive and field-preserving.

It must explicitly merge domain fields while preserving unknown fields instead of rebuilding state from a small whitelist.

Minimum state contract:

- `results`;
- `drafts`;
- `active`;
- `quizVersion`;
- `legacyActive`;
- `firstBaseline`;
- `repeatRuns`;
- unknown top-level keys.

### Draft merge rules

Draft identity:

`canonical sphere + quizVersion`

If only one side has a draft, keep it.

If both sides have a compatible draft, keep the newer valid one by `updatedAt` and preserve completed answers.

Do not activate a draft from an incompatible quiz version.

`active` is not the answers source. After merge, `active` may point only to an existing valid merged draft; otherwise clear it.

### First baseline rule

`firstBaseline` is immutable.

Never select a newer baseline by timestamp.

If local and remote immutable baselines conflict semantically, this is an integrity conflict: preserve safely, emit diagnostic evidence and do not silently overwrite either historical meaning.

### Repeat history

Merge as union, deduplicated by:

`assessmentVersion + canonical sphere + result date/run identity`

### Acceptance

- partial progress survives login/sync;
- remote partial progress restores on a clean device/context;
- baseline survives sync;
- repeat history survives sync;
- unknown test field survives sync;
- version-mismatched draft does not resume as current quiz.

---

## QA-MEM-036 — Legacy sphere alias can create duplicate semantic assessment runs

Severity: **P0/P1 / DATA SEMANTICS**  
Status: **OPEN / CONFIRMED**

### Fact

Historical ID:

`self-development`

Canonical ID:

`self_development`

The compatibility guard can currently keep both local result keys populated. The active v8 account sync persists raw keys and builds `source_key` from the raw sphere ID.

This permits two server identities for one logical sphere:

- `dc9-v1:self-development:<date>`
- `dc9-v1:self_development:<date>`

A historical DB canonicalization migration does not prevent new bad writes.

### Required invariant

Legacy aliases are accepted only at the input/read boundary.

Immediately normalize:

`self-development → self_development`

After that point the legacy ID must not participate in persistence, dedupe keys, permission checks or new snapshots.

### Canonicalization required before

- `results` merge;
- `drafts` merge;
- `active` merge;
- repeat-history merge;
- `assessment_runs` insert/upsert;
- `source_key` generation;
- snapshot write;
- baseline derivation;
- application gate;
- entry status;
- Board user-state derivation.

### Required server-write rule

New generated source keys must always use:

`dc9-v1:self_development:<date>`

Never create a new `dc9-v1:self-development:*` source key.

### Compatibility cleanup

Do not immediately delete legacy compatibility reading.

Phase 1: prevent any new server legacy writes and normalize local/runtime semantics.

Phase 2 / G8: after evidence/audit, remove the permanent dual-write / 1200 ms alias synchronization if no longer needed. Prefer one-shot/read-time normalization.

### Acceptance

- legacy local profile remains readable;
- only one canonical server run is created for a logical attempt;
- exact duplicate aliases do not create duplicate `assessment_runs` rows;
- distinct historical attempts are not deleted merely because the sphere slug was legacy.

---

## QA-MEM-037 — Application and Entry Status use a second, stale 9/9 model

Severity: **P0/P1 / ADMISSION AUTHORITY**  
Status: **OPEN / CONFIRMED IN LIVE DATABASE DEFINITIONS**

### Existing correct primitive

`public.dc_first_complete_baseline_v1(profile_id)` already implements the intended first-complete logic:

- `assessment_version = 'dc9-v1'`;
- canonicalizes `self-development` to `self_development`;
- derives first-complete 9/9;
- returns immutable snapshot/cutoff semantics.

### Current conflict A — application RPC

`public.dc_submit_membership_application_v2(...)` currently performs its own `latest per sphere` 9/9 query before INSERT.

Problems:

- no single canonical completion primitive;
- no required `assessment_version='dc9-v1'` in the old pre-check;
- legacy alias handling differs;
- latest-per-sphere semantics differ from first-complete immutable baseline.

Then a BEFORE INSERT trigger uses `dc_first_complete_baseline_v1()` again and replaces the snapshot.

This is two business models in sequence.

### Current conflict B — member entry status

`public.dc_member_entry_status_v1()` also independently counts completed sphere IDs and uses that count to expose `sphere_gate_complete` / state transitions.

Board user-state resolution consumes this Entry Status.

Therefore Application, Board/Entry and baseline trigger can disagree.

### Required fix

One server meaning for admission completion.

Use `dc_first_complete_baseline_v1(v_uid)` as the canonical decision primitive for application eligibility.

For `dc_submit_membership_application_v2`:

1. fetch canonical baseline once;
2. verify baseline exists;
3. verify `sphere_count == 9`;
4. verify snapshot has exactly the 9 canonical sphere keys;
5. use the same snapshot for `candidate_snapshot`;
6. retain trigger only as defense-in-depth if desired, but it must enforce the same primitive rather than a second meaning.

For `dc_member_entry_status_v1`:

- permission/gate `sphere_gate_complete` must derive from the same canonical completion meaning;
- partial informative progress count may still be calculated separately if needed for UI, but cannot redefine permission completion;
- wrong assessment versions must not make DC9 complete.

### Acceptance matrix

| Case | Expected |
|---|---|
| canonical 9/9 `dc9-v1` | COMPLETE |
| 8/9 | INCOMPLETE |
| 8 canonical + legacy self-development completion | COMPLETE after normalization |
| 9 spheres from another assessment version only | INCOMPLETE |
| first 9/9 then later repeat | baseline unchanged |
| application submit | candidate snapshot = canonical first baseline |
| Board/Entry state | same complete/incomplete answer as application authority |

---

## QA-MEM-038 — Interest Map invariant exists only in UI

Severity: **P1 / DOMAIN BOUNDARY**  
Status: **OPEN / CONFIRMED IN LIVE RPC**

### Fact

Application UI constrains the Interest Map to a 100-point distribution across nine spheres and checks total before calling RPC.

`dc_submit_membership_application_v2` accepts arbitrary `jsonb` and stores it without equivalent server validation.

An authenticated client can bypass UI.

### Canonical server contract

`p_interest_distribution` must contain exactly these nine canonical keys:

- `personality`
- `work`
- `consumption`
- `relationships`
- `control`
- `information`
- `self_development`
- `meaning`
- `technology`

Each value:

- numeric integer;
- range `0..100` inclusive.

Total:

`sum(values) = 100`

No extra keys.

### Server errors

Stable explicit errors are preferred, for example:

- `INTEREST_MAP_REQUIRED`
- `INTEREST_MAP_INVALID_KEYS`
- `INTEREST_MAP_INVALID_VALUE`
- `INTEREST_MAP_TOTAL_INVALID`

Frontend may keep its validation for UX, but backend validation is authoritative.

### SQL QA

Direct authenticated RPC tests must reject:

- `{}`;
- `{"banana":100}`;
- missing keys;
- extra keys;
- negative values;
- >100 values;
- string values if integer numeric is the contract;
- total 99;
- total 101.

Valid 9-key integer map totaling 100 must pass all other application preconditions.

---

## QA-MEM-039 — Active membership meaning is inconsistent across runtime/RPCs

Severity: **P0/P1 / ACCESS STATE**  
Status: **OPEN / CONFIRMED**

### Correct existing primitive

`public.dc_membership_active(profile_id)` already checks:

- `status='active'`;
- `valid_from <= now()`;
- `valid_to IS NULL OR valid_to > now()`.

### Drift

Other locations still treat `status='active'` alone as active membership.

Confirmed important surfaces include:

- application page client decision;
- `dc_submit_membership_application_v2` `ALREADY_MEMBER` check;
- `dc_member_entry_status_v1` membership state.

The public Header already has an active-window check, creating the possibility of contradictory UI/server states.

### Target

All permission/lifecycle decisions asking “is membership active now?” use one validity-window meaning.

Prefer server canonical primitive for server decisions.

Client UI should consume canonical server status where practical rather than independently invent a second membership lifecycle.

### Required cases

- active, past `valid_from`, null `valid_to` → active;
- active, future `valid_to` → active;
- active, expired `valid_to` → not active;
- active, future `valid_from` → not active;
- non-active status → not active.

### Cross-surface acceptance

Header, Join/Application, Workspace and Board must not classify the same identity differently because one component ignores validity dates.

An expired row with `status='active'` must not produce “you are already in the club” forever.

Whether an expired former member may immediately reapply is a lifecycle policy question. If current approved sources do not define it, do not invent policy: report Decision needed. The fix here is only to stop misclassifying expired/future membership as currently active.

---

## QA-MEM-040 — Legacy `/degradation_club/` path handling is inconsistent in Join storage guard

Severity: **P2 / COMPATIBILITY**  
Status: **OPEN / CONFIRMED SOURCE DEFECT, NOT PRIMARY dementor.club BLOCKER**

### Fact

Shared runtime supports a legacy `/degradation_club/` base path.

`join-storage-guard.js` currently starts from a raw `/join` pathname check.

Therefore `/degradation_club/join/` can bypass the guard.

### Required fix

Use the same canonical runtime-path/base-path meaning everywhere.

Do not introduce a third routing helper.

For non-module legacy code, a minimal equivalent normalization is acceptable if importing shared runtime would create an unnecessary second architecture.

### Constraint

This compatibility work must not reintroduce `/degradation_club/` as a canonical production route. Production canonical remains `https://dementor.club/...`.

---

## QA-MEM-041 — Supabase client ownership is duplicated by account sync

Severity: **P1 / AUTH RUNTIME OWNERSHIP**  
Status: **OPEN / CONFIRMED**

### Canonical owner

`community-runtime-v1.js → getClient()` already implements the singleton via `window.DEMENTOR_SUPABASE_CLIENT`.

Other runtime such as GlobalHeader also reuses the global client if already present.

### Defect

The active account sync creates its own Supabase client and then overwrites `window.DEMENTOR_SUPABASE_CLIENT`.

This risks multiple independent auth/token refresh clients on one page and duplicate sync/listener behavior.

### Required fix

Account sync must acquire the canonical client, preferably through:

`import { getClient } from '/community-runtime-v1.js'`

or an equivalent existing canonical provider.

Do not create a new auth runtime module.

Multiple domain subscribers to one client are acceptable. Multiple clients owning token refresh/session persistence are not.

### Acceptance

On canonical `/join/`:

- one Supabase client instance identity remains stable;
- GlobalHeader and account sync share it;
- login/logout/token refresh do not create a second instance;
- sync is not executed twice from duplicate client lifecycle events.

---

## QA-MEM-042 — Existing DC-9 QA contract does not cover these semantic-integrity risks

Severity: **P1 / RELEASE INTEGRITY**  
Status: **OPEN / CONFIRMED TEST GAP**

### Fact

Existing `scripts/validate-dc9-baseline-contract.mjs` correctly covers immutable baseline/repeat/reset behavior and some ownership checks.

It currently does not prove:

- partial draft preservation during account merge;
- cross-device draft restore;
- unknown state preservation;
- canonical sphere ID before server source-key creation;
- one Supabase client ownership;
- single server 9/9 meaning across Entry Status and Application;
- server Interest Map invariant;
- membership validity consistency.

### Required fix

Extend executable validation rather than relying only on static code review.

Recommended coherent contracts:

- `scripts/validate-dc9-sync-integrity.mjs`
- `scripts/validate-membership-semantic-authority.mjs`

Do not create one tiny validator per finding unless there is a strong repository convention requiring it.

---

# 3. Implementation architecture

## 3.1 State merge

Implement a deterministic canonical merge for local/remote DC-9 state.

Principles:

- canonicalize sphere IDs first;
- preserve unknown fields;
- merge domain fields explicitly;
- never overwrite immutable baseline by “newer wins”;
- keep repeat history append/union based;
- use draft timestamps only for compatible current-version draft conflict resolution;
- `active` is derived/validated against merged draft state.

Do not store partial answers inside `assessment_runs` merely to avoid fixing snapshots. `assessment_runs` is completed-run/history authority; incomplete state belongs in the account snapshot/local state unless a separately approved design changes that boundary.

## 3.2 Account sync owner

Current production loads v8. A v9 source also exists.

Do not blindly swap version numbers.

First make the chosen canonical sync implementation satisfy this specification, then update the single production loader.

After release, obsolete v8/v9 compatibility should be evaluated in G8 rather than leaving two apparent owners indefinitely.

## 3.3 Sphere normalization

Normalization must be centralized enough that persistence cannot accidentally bypass it.

A server row, source key or permission gate must never depend on the historical spelling once input is normalized.

## 3.4 Server authority

Rework current server functions by **new migration**, not by editing already-released migration files in history.

Expected migration scope:

- replace/adjust `dc_submit_membership_application_v2`;
- replace/adjust `dc_member_entry_status_v1`;
- add Interest Map validation helper only if useful, otherwise validate inline;
- route active-membership checks through `dc_membership_active` or identical canonical shared logic;
- keep grants/revokes explicit if a helper function is exposed.

Do not create a baseline table.

## 3.5 Existing trigger

The first-baseline BEFORE INSERT trigger may remain as defense-in-depth if it uses the same baseline primitive.

Do not keep a situation where RPC eligibility and trigger snapshot enforcement intentionally implement different definitions.

---

# 4. Read-only data audit before mutation

Before applying any data-changing migration, report counts/examples for:

1. `assessment_runs` using legacy `self-development`;
2. semantic duplicate canonical/legacy source keys;
3. `assessment_snapshots` with legacy keys;
4. active-status memberships whose validity window is currently inactive;
5. existing Membership v2 applications whose candidate snapshot differs from the derived first-complete baseline;
6. existing application Interest Maps that violate the 9-key/100-point invariant;
7. any `assessment_runs` for other assessment versions currently contributing to old entry/application gate logic.

Do not silently rewrite historical applications or user records merely to make audit output cleaner.

If repair is necessary, propose a separate explicit repair plan with deterministic matching rules and evidence.

---

# 5. Required executable QA

## 5.1 Local/state tests

A deterministic test must cover:

### Partial local vs remote

Local 4/6, remote 1/6 → merged 4/6.

### Cross-device recovery

Remote 3/6, clean local → local restores 3/6 and resumes next unanswered question.

### Unknown fields

Add a sentinel top-level field → merge → sentinel still exists.

### Baseline

First 9/9 locks → repeat sphere → sync → first baseline unchanged.

### Repeat history

Local and remote repeat arrays merge without loss and without legacy/canonical duplicate identity.

### Invalid active pointer

Active pointer without matching current-version draft → clear active rather than fabricate answers.

## 5.2 Source-key test

Run legacy alias through persistence boundary.

Expected generated sphere/source key is canonical only.

Static contract must reject future introduction of `dc9-v1:self-development:` writes in active runtime.

## 5.3 Single-client test

Boot relevant Join/Auth runtimes in one browser context and prove `window.DEMENTOR_SUPABASE_CLIENT` remains the same object identity after all owners initialize.

## 5.4 Server gate tests

Using a controlled test identity/data fixture:

- 8/9 canonical → incomplete;
- valid 9/9 `dc9-v1` → complete;
- legacy alias participates canonically;
- other assessment version does not satisfy canonical DC9 completion;
- repeat does not move baseline;
- application and Entry Status agree.

## 5.5 Interest Map RPC tests

Test invalid direct RPC payloads, not only frontend range controls.

## 5.6 Membership window tests

Test current, expired and future validity windows across server Entry Status/Application decisions.

---

# 6. Browser regression sequence

Minimum real-browser flow:

## Flow A — anonymous partial DC-9 → login/sync

1. open canonical `/join/`;
2. start a sphere;
3. answer 4 of 6;
4. assert local draft = 4 answers;
5. authenticate/sync through the supported auth path or controlled browser fixture;
6. return to Join;
7. assert same sphere offers continuation at 4/6;
8. answer one more;
9. reload;
10. assert 5/6 persists.

## Flow B — cross-device simulation

Browser context A: same user, save partial draft and sync.

Browser context B: clean localStorage, same account, load Join.

Expected: remote partial state restores without overwriting with empty local state.

## Flow C — completion/admission

Canonical 9/9 → Entry Status complete → application available.

## Flow D — immutable baseline

First 9/9 → capture baseline → repeat one sphere → application snapshot remains first-complete baseline.

## Flow E — auth regression

Verify public login, OAuth callback, Workspace recovery and logout/login still work. Keep WebKit regression because auth-related change is in scope.

---

# 7. Regression surfaces outside Join

Because shared auth/client and entry semantics change, run regression on:

- Public GlobalHeader auth identity;
- `/auth/callback/`;
- `/join/`;
- `/join/result/`;
- `/join/apply/`;
- `/workspace/`;
- `/workspace/board/`;
- ordinary Member state;
- authenticated Guest states;
- Dementor;
- Owner Admin.

Do not regress the already released Board access model while fixing membership/entry status.

---

# 8. Files likely in scope

The authoritative detailed path map is in:

`operations/QA_DC9_MEMBERSHIP_PATH_MAP_2026-09-08.md`

The external developer must inventory actual current owners before editing. The path map is a starting map, not permission to blindly replace each listed file.

---

# 9. Non-goals

Do not use this bug cluster to:

- redesign DC-9 questions/scoring;
- change the nine-sphere product meaning;
- add AI behavior;
- redesign application UX;
- change review threshold;
- change Board role permissions;
- create a new `membership_state` entity;
- create a new baseline table;
- introduce another auth callback;
- introduce another Supabase client wrapper;
- change public URL structure;
- wholesale merge `dementor-club-site` into production.

---

# 10. Result / branch / release requirements

Proposed coherent Result:

`dementor-club.result.dc9-membership-semantic-integrity-v1`

Implementation must be based on the then-current `dementor-club-production` HEAD.

Recommended branch:

`agent/dc9-membership-semantic-integrity-v1`

One Result → one integration branch.

Production release candidate must contain only required diff from current production baseline.

## G6 minimum

- syntax/build;
- DC-9 sync-integrity contract;
- baseline contract;
- membership semantic authority SQL/static contract;
- direct SQL/RPC tests in safe environment/controlled transaction where applicable;
- Chromium sequential flows;
- WebKit auth regression;
- route integrity;
- shell ownership;
- Board role regression;
- full Site Integrity / Release Readiness.

## G7

Stop after green PR/candidate unless owner explicitly authorizes:

1. live DB migration application;
2. production merge, if not already separately approved;
3. production deploy.

These are separate release mutations.

## G8

After live retest, inspect/remove if safe:

- obsolete account sync version;
- dual sphere alias writer;
- 1200ms compatibility interval;
- duplicated canonicalization functions;
- duplicated `status==='active'` membership decisions;
- duplicated 9/9 SQL;
- stale tests anchoring legacy owner names;
- superseded comments/compatibility paths.

---

# 11. Acceptance criteria

Result is not G6-valid until all applicable criteria pass:

- AC-01 partial DC-9 answers survive login/sync;
- AC-02 remote partial draft restores on clean local state;
- AC-03 unknown state fields are not dropped by sync;
- AC-04 new server persistence never emits legacy `self-development` identity;
- AC-05 new `source_key` uses canonical sphere ID;
- AC-06 first baseline remains immutable after repeats and sync;
- AC-07 Application gate uses canonical first-complete baseline meaning;
- AC-08 Entry Status / Board use the same canonical DC9-complete meaning;
- AC-09 another assessment version cannot accidentally satisfy DC9 9/9;
- AC-10 malformed Interest Map is rejected server-side;
- AC-11 Interest Map server total is exactly 100 across exactly nine canonical keys;
- AC-12 expired membership is not active;
- AC-13 future membership is not active;
- AC-14 Header/Application/Workspace/Board agree on active membership meaning;
- AC-15 one Supabase client instance owns session/token lifecycle on Join;
- AC-16 OAuth callback and login/logout recovery pass regression;
- AC-17 legacy base-path Join guard behaves safely without changing production canonical routes;
- AC-18 current Board Owner Admin/Member/Guest access regression passes;
- AC-19 Chromium flow passes;
- AC-20 WebKit auth proxy passes;
- AC-21 full Site Integrity passes;
- AC-22 DB security/advisor inspection reveals no new issue attributable to migration;
- AC-23 no unrelated production files are included in release diff;
- AC-24 no live database or deploy mutation occurs without explicit authorization.

---

# 12. Required developer report back

The PR/handoff back to the owner must state for each `QA-MEM-035..042`:

- confirmed/not reproduced;
- root cause;
- canonical owner chosen;
- exact files/functions changed;
- DB migration version;
- tests added;
- G6 evidence;
- unresolved decision, if any;
- G8 cleanup item, if any.

Never write `DONE`, `PRODUCTION READY`, `RELEASED` or `LIVE PASS` without matching Gate/live evidence.
