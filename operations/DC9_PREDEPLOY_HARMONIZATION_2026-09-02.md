# DC-9 Pre-deploy Harmonization — 2026-09-02

Status: **GREEN / HUMAN DEPLOY APPROVED / PAGES DISPATCH PENDING**

## Scope

This record captures the pre-deploy check requested before releasing the accepted DC-9 responsive/mobile changes.

Canonical working records:

- `operations/DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md`
- `operations/DC9_MOBILE_QA_PASS_V0.1.md`
- `operations/DC9_RESULT_QA_V0.1.md`

## Release strategy

`dementor-club-site` was **not** merged wholesale because it is substantially diverged from the current production history.

A narrow candidate was created directly from `dementor-club-production`:

`release/dc9-mobile-harmonization-2026-09-02`

PR: `#79 Release DC-9 mobile harmonization`

Merged production commit:

`ad597ab738520da95e21825334611174a2aea824`

## Changed production files

Exactly six files differ from the previous production baseline:

1. `join/dc9-entry-state-v1.js` — added;
2. `join/dc9-responsive-v2.css` — added;
3. `join/result/result-mobile-v5.css` — added;
4. `join/index.html` — responsive shell + member-return integration;
5. `join/dc9-immersive-v1.js` — answer-selection correction only;
6. `join/result/index.html` — load mobile result override.

No QA prototype/design-system files were copied into the production candidate.

## Data/control invariants

Verified unchanged:

- local storage key: `dementorClubOnboardingV3`;
- browser quiz version: `dc9-immersive-v1`;
- backend assessment family: `dc9-v1`;
- scoring version: `v0.9`;
- scoring thresholds, weights, core gate and guard caps;
- 54-scene DC-9 bank;
- canonical nine sphere ids, including `self_development`;
- Graph Linked Cards v6 result calculation;
- existing non-member membership activation semantics.

### Answer selection change

The only runtime edit inside `join/dc9-immersive-v1.js` removes first-click locking. A later tap before `ДАЛЬШЕ` replaces the value in the same existing draft slot through `writeDraft(...)`. No bonus evidence, new score path or additive state was introduced.

### Account/member entry change

`join/dc9-entry-state-v1.js` is read-only with respect to account state. It uses the existing `community-runtime-v1.js` functions `currentSession(...)` and `getEntryStatus(...)`.

It renders the club-return screen only when the authoritative server state reports `membership_active`.

It does **not**:

- create membership;
- infer membership from DC-9;
- write assessment results;
- change local scoring;
- alter the non-member → member transition.

If account state cannot be loaded, it fails open to the existing local DC-9 flow rather than fabricating access.

## Automated gates

### PR candidate

Workflow: `Production Candidate Integrity`
Run: `33626232223`
Conclusion: **SUCCESS**

Passed:

- registry/routes/feature state;
- content readiness;
- visual contract;
- interactive runtime safety;
- production artifact build;
- analytics/consent;
- production artifact/release gate.

### Production branch after merge

Workflow: `Production Candidate Integrity`
Run: `33626321214`
Commit: `ad597ab738520da95e21825334611174a2aea824`
Conclusion: **SUCCESS**

## Release state

The production branch is green and contains the approved candidate.

Actual GitHub Pages deployment is intentionally separate and manual. The workflow `Deploy Dementor Production` requires:

`release_confirmation = APPROVED`

Therefore merge alone does not publish the site.

## Post-deploy smoke test

After Pages deployment verify on live `dementor.club`:

- guest `/join/` start and local resume;
- short and long DC-9 scenes;
- answer reselection before `ДАЛЬШЕ`;
- `← К СФЕРАМ` in upper service row;
- mobile 430×932, 390×844, 375×812, 320 fallback;
- no horizontal clipping / safe-area overlap;
- 9/9 result radar and mobile legend;
- three highlighted points remain contrast, not ranking;
- dossier/share still use the same nine results;
- authenticated active member visiting `/join/` receives Community-first return state;
- authenticated non-member behavior remains unchanged from the existing membership flow.
