# ДУМАЙ С ОПАСНОСТЬЮ — RELEASE LOOP V1 · G6 VALIDATION EVIDENCE

Status: **G6 VALIDATION PASS / G7 CANDIDATE**  
Date: **2026-09-16**  
Result: `dementor-club.result.dumai-s-opasnostyu-release-loop-v1`  
Candidate branch: `result/dumai-s-opasnostyu-release-loop-v1`  
Production baseline: `48a18b5567804d29219efcea217b846f1ebdd675`  
Candidate commit: `bc36c67b17e37e9dd718298d08e971b78e39d242`  
Pull request: **#212**  
Site Integrity run: **#1194**  
Run id: `35075627995`  
Conclusion: **SUCCESS**

## Validated causal loop

`THING → COURSE EXPERIENCE → COMPLETION → CERTIFICATE → ONE NEXT THING → RETURN`

The candidate proves the loop on the existing `Думай с опасностью` course without introducing a replacement course engine, database/session model, Membership gate, CRM, recommendation engine or parallel analytics runtime.

Validated continuation v1:

`Думай с опасностью → certificate → program:dengi-na-veter → /courses/dengi-na-veter/`

Return semantics remain strict:
- first continuation exposure is not Return;
- same-version revisit is not Return;
- elapsed time alone is not Return;
- `return_payoff` requires a meaningful approved continuation-version delta.

## Exact-head validation

PR #212 remained open and mergeable with exact head:

`bc36c67b17e37e9dd718298d08e971b78e39d242`

Site Integrity / Release Readiness run #1194 / id `35075627995` completed with conclusion `success` for this exact candidate head.

The successful matrix included:
- registry/routes/feature-state validation;
- content readiness;
- visual contract;
- DC-9 baseline and sync integrity;
- Membership semantic authority;
- Board contracts and browser regressions;
- production candidate build;
- Current Program contract/browser acceptance;
- DSO Release Loop static contract;
- production analytics + consent/privacy guards;
- canonical shell integration;
- built JavaScript syntax;
- OAuth handoff;
- DSO sequential browser acceptance at desktop 1440 and mobile 390;
- mobile Board, public harmonization, Projects, DC-9, WebKit and route-manifest regression checks;
- production artifact release gate.

## Validation drift found and corrected

Sequential G6 found a pre-existing semantic drift in shared runtime ownership rather than a defect in the new continuation card.

Before corrective:
- `site-config.js` classified `Думай с опасностью` as `interactiveAuthRequired`;
- this loaded `required-auth-v1.js` and blocked the public Stage 1 course behind mandatory login;
- the same route also loaded `program-account-sync-v1.js`, creating server enrollment/progress/certificate side effects for an experience whose approved Stage 1 contract is browser-local.

Canonical authority already stated:
- public route;
- deterministic browser-local state;
- no required account;
- no server-side course session/e-mail delivery claim unless separately approved and validated.

Corrective applied inside the same Result:
- DSO removed from mandatory auth gating;
- DSO removed from server program-account sync;
- account-identity decoration removed from the DSO route;
- `Деньги на ветер` auth semantics were not changed.

The acceptance was not bypassed with forced clicks or weakened thresholds. The shared owner was corrected to the approved meaning, then the full matrix was rerun to success.

## Scope lock at G6

No further runtime changes belong to this candidate before G7 unless validation discovers a new blocker.

Still explicitly excluded:
- new database/schema;
- Supabase course-session mutation;
- Membership/login gate for DSO;
- CRM;
- payment;
- server-side course session;
- real e-mail delivery;
- AI answer analysis;
- automatic recommendation engine;
- Current Program composition change;
- Phase 3 ThingProjection abstraction/extraction.

## Release boundary

`productionMergeAuthorized=false`  
`productionDeployAuthorized=false`

This evidence establishes **G6_VALIDATION** only.

`G6 PASS ≠ production merge ≠ deploy ≠ live G8 closure`.

PR #212 is now the exact G7 candidate. Production merge and deploy each require separate explicit authorization. Phase 3 remains blocked until production release, live sequential retest and G8 cleanup are complete.
