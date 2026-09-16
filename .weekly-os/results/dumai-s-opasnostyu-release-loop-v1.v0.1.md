---
artifactId: dementor-club.result.dumai-s-opasnostyu-release-loop-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
branch: result/dumai-s-opasnostyu-release-loop-v1
baseline: dementor-club-production@48a18b5567804d29219efcea217b846f1ebdd675
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Dementor Club · Phase 2 · Думай с опасностью Release Loop v1

## Goal

Prove one complete Thing experience pattern on the existing public course without rebuilding its course engine:

`THING → COURSE EXPERIENCE → COMPLETION → CERTIFICATE → ONE NEXT THING → RETURN`

## Primary authority

`operations/DUMAI_S_OPASNOSTYU_PUBLIC_RELEASE_DECISION_V1.md`

`Думай с опасностью` is a **PUBLIC RELEASE**.

The current Stage 1 implementation remains the runtime baseline. Existing completion, Danger Map, certificate, local state and deterministic course logic must be extended rather than replaced.

## Existing owners

- course route/shell: `courses/dumai-s-opasnostyu/index.html`;
- content/options: `data.js`;
- state/navigation: `core.js`;
- course screens: `screens-1.js`, `screens-2.js`, `screens-3a.js`, `screens-3b.js`;
- interaction binding: `bind.js`;
- analytics transport/consent/event allow-list: `/production-analytics-v1.js`.

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

The course must not invent a timed reminder or fake future content.

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

Use existing production analytics transport and consent owner; do not create a second analytics runtime.

Allowed Phase 2 events:
- `thing_experience_start`;
- `thing_meaningful_progress`;
- `thing_experience_complete`;
- `completion_artifact_view`;
- `continuation_open`;
- `return_payoff`.

All must use non-sensitive parameters only. No course answers, e-mail, free text, user id or decision content may be sent.

## Acceptance Criteria

1. Public route literally presents the course as a release, not draft/preview.
2. Existing course state and certificate remain canonical owners; no replacement course engine.
3. Completion remains explicit and precedes certificate.
4. Certificate remains completion evidence only; no Membership/status/access semantics.
5. Certificate surface exposes exactly one primary continuation Thing: `Деньги на ветер`.
6. Continuation opens the existing public course route and is not a Join/Board/Catalog funnel.
7. First continuation exposure cannot be counted as Return.
8. `return_payoff` is possible only after a later approved continuation-version delta.
9. Existing production analytics runtime owns all Phase 2 semantic events and preserves consent/privacy guards.
10. Static + browser acceptance covers fresh user, in-progress user, completion, certificate, continuation and completed-user revisit behavior on desktop/mobile.
11. Full production CI passes on exact candidate head before any production merge.
12. No production merge/deploy without separate explicit authorization.

## Explicit exclusions

- no server-side course session;
- no real e-mail delivery;
- no AI answer analysis;
- no payment;
- no Membership/login gate;
- no CRM;
- no certificate registry/NFT/credential table;
- no leaderboard/status ladder;
- no automatic recommendation engine;
- no broad schema migration;
- no notification/streak/FOMO retention.
