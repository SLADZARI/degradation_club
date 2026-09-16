---
artifactId: dementor-club.result.dumai-s-opasnostyu-release-loop-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G6_VALIDATION
status: ACTIVE
version: 0.2
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/dumai-s-opasnostyu-release-loop-v1.v0.1.md
branch: result/dumai-s-opasnostyu-release-loop-v1
baseline: dementor-club-production@48a18b5567804d29219efcea217b846f1ebdd675
candidateCommit: bc36c67b17e37e9dd718298d08e971b78e39d242
integrationPullRequest: 212
validationWorkflow: Site Integrity / Release Readiness
validationRun: 1194
validationRunId: 35075627995
validationConclusion: SUCCESS
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Dementor Club · Phase 2 · Думай с опасностью Release Loop v1

## Gate status

**G6_VALIDATION PASS / EXACT G7 CANDIDATE**

The implementation candidate is frozen at:

`bc36c67b17e37e9dd718298d08e971b78e39d242`

PR: **#212**  
Production baseline: `48a18b5567804d29219efcea217b846f1ebdd675`  
Full validation: Site Integrity **#1194**, run id `35075627995`, **SUCCESS**.

Evidence:
`operations/DUMAI_S_OPASNOSTYU_RELEASE_LOOP_G6_2026-09-16.md`

No further runtime work belongs to this candidate before G7 unless validation discovers a blocker.

## Goal

Prove one complete Thing experience pattern on the existing public course without rebuilding its course engine:

`THING → COURSE EXPERIENCE → COMPLETION → CERTIFICATE → ONE NEXT THING → RETURN`

## Primary authority

`operations/DUMAI_S_OPASNOSTYU_PUBLIC_RELEASE_DECISION_V1.md`

`Думай с опасностью` is a **PUBLIC RELEASE**.

The current Stage 1 implementation remains the runtime baseline. Existing completion, Danger Map, certificate, local state and deterministic course logic are extended rather than replaced.

## Existing owners

- course route/shell: `courses/dumai-s-opasnostyu/index.html`;
- content/options: `data.js`;
- state/navigation: `core.js`;
- course screens: `screens-1.js`, `screens-2.js`, `screens-3a.js`, `screens-3b.js`;
- interaction binding: `bind.js`;
- analytics transport/consent/event allow-list: `/production-analytics-v1.js`;
- route-level runtime loading/auth boundary: `/site-config.js`.

## Phase 2 editorial continuation v1

After the certificate, the one primary continuation is:

**`Деньги на ветер`**  
Thing ref: `program:dengi-na-veter`  
Route: `/courses/dengi-na-veter/`  
Current truth: course ready to take.

Editorial pairing reason:
`Думай с опасностью` teaches structured doubt before a consequential decision; `Деньги на ветер` applies the same suspicious attitude to rationalization around spending. This is a direct next exercise, not a generic club funnel.

This pairing does not change Current Program v0 composition. It is local continuation programming for this completed experience.

## Return contract

The course does not invent a timed reminder or fake future content.

On completion it records which continuation version the person has already seen. If a later approved programming change replaces that continuation with a genuinely new next Thing, revisiting the completed course may show `НОВОЕ ПРОДОЛЖЕНИЕ` and count a `return_payoff`.

Therefore:
- first continuation view ≠ return payoff;
- elapsed time alone ≠ return payoff;
- same continuation after N days ≠ return payoff;
- only meaningful continuation delta can create the passive-return payoff.

## Product Health questions

1. Did the person actually start the course experience?
2. Did they complete at least one meaningful block?
3. Did they complete the course?
4. Did they reach the certificate?
5. Did they open the one continuation?
6. Did a later meaningful continuation delta produce a real return payoff?

## Semantic events

Existing production analytics transport and consent remain the only analytics owner.

Validated Phase 2 events:
- `thing_experience_start`;
- `thing_meaningful_progress`;
- `thing_experience_complete`;
- `completion_artifact_view`;
- `continuation_open`;
- `return_payoff`.

All use non-sensitive parameters only. Course answers, e-mail, free text, user id and decision content are blocked from analytics payloads.

## G6 validation drift and corrective

Sequential browser validation exposed a pre-existing shared-owner semantic drift:
- DSO was incorrectly included in `interactiveAuthRequired` in `site-config.js`;
- this created a mandatory login gate for a course whose approved Stage 1 contract is public/browser-local;
- DSO was also loaded into `program-account-sync-v1.js`, which created server enrollment/progress/certificate side effects outside the approved Stage 1 boundary.

Corrective was applied to the canonical owner rather than weakening the test:
- DSO removed from mandatory auth gating;
- DSO removed from server program-account sync;
- DSO account-identity decoration removed;
- `Деньги на ветер` auth semantics unchanged.

The exact corrected candidate then passed the full Site Integrity matrix.

## Acceptance Criteria — G6 state

1. Public route literally presents the course as a release, not draft/preview. **PASS**
2. Existing course state and certificate remain canonical owners; no replacement course engine. **PASS**
3. Completion remains explicit and precedes certificate. **PASS**
4. Certificate remains completion evidence only; no Membership/status/access semantics. **PASS**
5. Certificate surface exposes exactly one primary continuation Thing: `Деньги на ветер`. **PASS**
6. Continuation opens the existing public course route and is not a Join/Board/Catalog funnel. **PASS**
7. First continuation exposure cannot be counted as Return. **PASS**
8. `return_payoff` is possible only after a later approved continuation-version delta. **PASS**
9. Existing production analytics runtime owns all Phase 2 semantic events and preserves consent/privacy guards. **PASS**
10. Static + browser acceptance covers fresh user, in-progress user, completion, certificate, continuation and completed-user revisit on desktop/mobile. **PASS**
11. Full production CI passes on exact candidate head before any production merge. **PASS — #1194 / 35075627995**
12. No production merge/deploy without separate explicit authorization. **LOCKED**

## Explicit exclusions

- no server-side course session;
- no real e-mail delivery;
- no AI answer analysis;
- no payment;
- no Membership/login gate for DSO;
- no CRM;
- no certificate registry/NFT/credential table;
- no leaderboard/status ladder;
- no automatic recommendation engine;
- no broad schema migration;
- no notification/streak/FOMO retention;
- no Phase 3 `ThingProjection Runtime v1` extraction before production/live G8 proof.

## G7 boundary

PR #212 is the exact G7 candidate at `bc36c67b17e37e9dd718298d08e971b78e39d242`.

`productionMergeAuthorized=false`  
`productionDeployAuthorized=false`

`G6 PASS ≠ merge ≠ deploy`.

Next state requires separate explicit production-merge authorization. Phase 3 remains blocked until production merge, separate deploy authorization, live sequential retest and G8 cleanup are complete.
