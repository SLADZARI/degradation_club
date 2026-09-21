---
artifactId: dementor-club.operations.artifact-detail-terminal-state-g6-2026-09-21
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.artifact-detail-terminal-state-v1
parentIssue: 228
scope: BQA-19
productionBaseline: 0852d2602df5593deead797b20c50daa36fe1c1c
candidateCommit: a6f73dbfc071085dc5e4b1147c902477af6f117e
pullRequest: 231
validationRunId: 35629843997
validationRunNumber: 1226
validationConclusion: SUCCESS
---

# STAB-02 · Artifact detail terminal-state hardening · G6 validation

## Verdict

```text
G6 VALIDATION PASS
READY FOR CLEAN RELEASE DECISION
```

No production merge or deploy is authorized by this evidence.

## STAB-01 ownership handoff

STAB-01 production release truth was fresh-read before STAB-02 activation:

```text
production = 0852d2602df5593deead797b20c50daa36fe1c1c
Supabase production #7 / 35621963033 = SUCCESS
Pages production #123 / 35622547055 = SUCCESS
live migrations = 58
latest = 20260921134959_public_activity_truth_boundary_v1
anonymous live smoke = PASS
owner authenticated live retest = PASS
```

Owner manual authenticated PASS was recorded for:
- "Сайт за Еду" visible on authenticated Board;
- "Новые связи - новая борда" visible on authenticated Board;
- private Board image loads.

Evidence:
`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_AUTHENTICATED_LIVE_RETEST_2026-09-21.md`

STAB-01 is now `WAITING / G8_CLEANUP` with no active integration branch. Parent #228 remains open.

## Clean implementation base

`dementor-club-site` remained diverged from production and was not used or mutated.

STAB-02 branch:

`result/artifact-detail-terminal-state-v1`

was created directly from:

`0852d2602df5593deead797b20c50daa36fe1c1c`

Exact candidate:

`a6f73dbfc071085dc5e4b1147c902477af6f117e`

Production → candidate:

```text
status = ahead
ahead_by = 4
behind_by = 0
changed files = exactly 3
```

Exact Result-owned delta:

1. `community/artifact/artifact.js`
2. `community/artifact/index.html`
3. `scripts/validate-artifact-history.mjs`

No schema, migration, RLS, Relations, public Activity, Membership or staging-debt files are present.

## Primary / secondary dependency classification

### Essential for primary detail

- `resolveBoardUserState()` — canonical access-path decision, now bounded;
- member `dc_artifacts` primary row — canonical primary Artifact data, now bounded;
- guest `dc_guest_board_artifact_detail_read_v1` primary payload — canonical guest primary data, now bounded.

### Optional enrichment

- `dc_member_public_profiles`;
- `dc_artifact_reactions`;
- `dc_artifact_media`;
- `dc_artifact_responses`;
- `dc_board_promotion_state_read_v1`;
- `signedMediaUrl()`.

The redundant detail-level `getEntryStatus()` wait after `resolveBoardUserState()` was removed. Existing access semantics remain owned by `resolveBoardUserState()`; no permission is broadened.

## Confirmed root cause addressed

Previous member/guest detail flows could have already resolved the primary Artifact but still wait indefinitely for optional enrichment before the first `render()`.

A never-settling optional promise therefore left static `LOADING` forever and bypassed `boot().catch(fail)`.

Corrective:

```text
essential primary data resolves
→ render primary Artifact immediately

optional enrichment resolves
→ enrich/re-render

optional enrichment fails/stalls
→ bounded degradation
→ primary Artifact remains usable

essential dependency stalls/fails
→ bounded terminal ERROR/DENIED/NOT FOUND/INVALID
```

Production defaults:
- essential deadline: 6500 ms;
- optional deadline: 1800 ms.

The existing error owner was extended with Retry + Board recovery rather than creating a second error overlay.

For canonical membership denial, the existing Join recovery remains `route('/join/')`.

## Static bootstrap failure

`community/artifact/index.html` now contains a narrow watchdog only for the case where the canonical Artifact module never starts.

It does not load data and is not a second Artifact runtime.

If the module load fails / never starts while the static state is still `LOADING`, it transitions to recoverable `ERROR` with Retry + Board controls.

## Validation history

First candidate:
`fa825ce2051b639749c9d77f6da32f92d9117b74`

Site Integrity #1225 / `35629731586` exposed one in-scope regression before browser validation:

```text
Validate canonical shell integration = FAIL
Artifact detail: canonical non-member Join gate missing
```

Diagnosis:
the redundant blocking `getEntryStatus()` removal also removed the literal canonical Join recovery guarded by the shell contract.

Corrective:
membership/access denial keeps the canonical `route('/join/')` recovery without restoring optional/duplicate blocking ownership.

Corrected exact candidate:
`a6f73dbfc071085dc5e4b1147c902477af6f117e`

Fresh Site Integrity:

```text
run #1226
run id = 35629843997
exact head = a6f73dbfc071085dc5e4b1147c902477af6f117e
conclusion = SUCCESS
```

## Targeted Artifact terminal-state matrix

Existing validator `scripts/validate-artifact-history.mjs` was extended instead of creating a parallel validator owner.

Exact CI output:

`Artifact terminal-state regression PASS: My Artifacts history + normal/text/private-image/YouTube/guest detail + promotion/media/secondary fault isolation + bounded primary failure + INVALID/NOT FOUND/DENIED/ERROR terminal states + bootstrap fallback + direct refresh + mobile 390/360.`

Covered:
- normal authenticated Artifact;
- text-only Artifact;
- private-image Artifact with signed authenticated media;
- YouTube/external-url Artifact;
- guest-readable Artifact;
- promotion never-settling;
- media signing failure;
- media signing never-settling;
- secondary query failure;
- secondary query never-settling;
- primary read permission denial;
- primary read never-settling;
- invalid ID;
- missing Artifact;
- module/bootstrap 404;
- direct refresh;
- mobile 390px;
- mobile 360px.

## Board / history regression

Full exact-head CI also passed:
- Board v2.1 fullscreen browser state matrix;
- Board live corrective browser acceptance;
- Board navigation/adaptive cards;
- Board Relations browser acceptance;
- `BOARD DEEPLINK AUTH-RETURN BROWSER PASS`;
- Board Share on movable own card;
- Browser shell / Workspace recovery.

Exact shell line:
`Browser shell smoke PASS: Russian auth-aware public shell + separated Workspace shell + ordinary Member Board default + first Artifact focus + open-first Board participation -> My Activity projection + role navigation + spatial Board + Join + Admin`

These existing owners cover Board card open/close, focus/history/deep-link behavior and Workspace recovery. STAB-02 does not modify their runtime owners.

## Auth / WebKit

`WebKit auth regression PASS: hidden checking state + guest CTA/login + explicit account chooser + PKCE callback escape + member identity without Join CTA`

This is the canonical WebKit auth regression; the STAB-02 fault matrix itself runs in Chromium and is not claimed as WebKit fault-injection coverage.

## Route / release gate

Production route manifest PASS:

`34 indexable routes · 17 private/compat routes · 1 disabled routes`

Production artifact release gate also passed in run #1226.

## Change control

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backend migration = NO
RLS change = NO
access-role change = NO
Relations change = NO
```

## PR / production boundary

Draft PR #231:

```text
OPEN / DRAFT / UNMERGED
base = 0852d2602df5593deead797b20c50daa36fe1c1c
head = a6f73dbfc071085dc5e4b1147c902477af6f117e
changed files = 3
commits = 4
```

Production remains:
`0852d2602df5593deead797b20c50daa36fe1c1c`

No production merge or deploy was performed.

## Gate

```text
READY FOR CLEAN RELEASE DECISION
STOP
```

STAB-03 is not started.
