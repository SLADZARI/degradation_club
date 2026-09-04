---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.1
updated: 2026-09-04
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: —
---

# MP | Dementor Club | BUILD | Portal QA Harmonization | v0.1

## Goal
Bring the current Dementor Club portal through pre-advertising QA while progressively harmonizing implementation with the project kernel and approved local operating rules, without creating duplicate UI/navigation/auth/domain systems or silently changing product semantics.

## Owner
Modern Pilgrims

## Status
ACTIVE / DRAFT v0.1

## Branch
`result/qa-portal-harmonization`

## Gate
Current: `G5_BUILD`
Next: `G6_VALIDATION`
Production release requires separate `G7_RELEASE` authorization and explicit user deploy instruction.

## Scope
- Existing live QA findings and portal regressions recorded in `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`.
- Public shell, Workspace shell, auth/login, Join/DC-9 onboarding, member/application surfaces and related route/state integrity.
- Progressive MP_DSL / Weekly OS harmonization only where needed to safely implement QA fixes.
- Duplicate-owner detection for header, footer, navigation, auth identity, Workspace sidebar/topbar and local product navigation.
- Route and state reconciliation across guest / authenticated guest / member / Dementor / owner-admin states.

## Non-goals
- No speculative redesign outside the QA backlog.
- No new parallel auth, state, menu, shell or domain systems.
- No project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN authority promotion without explicit approval.
- No production deployment as part of implementation or validation.
- No broad branch-history reconciliation while active live QA is in progress unless it becomes necessary for a concrete fix.

## Approved Local Operating Rules
For this Result, every fix follows:

`QA observation → authority/current-state check → existing implementation inventory → duplicate/semantic/route check → decision if required → implementation → G6 validation → release candidate → explicit deploy authorization → live retest → G8 cleanup`.

Known explicitly approved product decisions from 2026-09-04 remain recorded in the single QA ledger and may be implemented within this Result only where they do not conflict with higher authority:
- primary CTA wording: `Вступить в клуб`;
- public header separates club-entry CTA from login;
- current Join navigation role becomes login rather than DC-9 entry;
- authentication becomes mandatory only immediately before application submission, not before DC-9;
- first complete DC-9 baseline is immutable; later attempts must not overwrite it.

## Acceptance Criteria
1. Every implemented QA finding is linked to verified source/root cause and existing implementation before new code is introduced.
2. One canonical owner exists for each shared shell responsibility touched by the Result; no new duplicate header/footer/menu/auth shell is introduced.
3. Existing Membership v2 boundary remains intact: `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP` unless an explicit approved change supersedes it.
4. Critical guest/auth/member/Dementor/owner-admin routes remain canonical and no dead legacy destination is reintroduced.
5. Relevant browser regression tests cover the exact live failure path, not only isolated pages.
6. Desktop/mobile states are validated where the affected UI is responsive.
7. No unresolved P0/P1 issue included in a release candidate remains without explicit deferral/decision.
8. Production candidate is built from current production authority using the established safe release method while branch divergence remains unresolved.
9. Commit/merge is never treated as deploy; production requires explicit user authorization.
10. After each released batch, stale compatibility code, duplicate assets/routes and temporary branches introduced by that batch are reviewed under G8 cleanup.

## Affected Domain / Systems
- Public shell/navigation
- Workspace shell/navigation
- Authentication/session entry
- Join / DC-9 onboarding and application handoff
- Membership v2 presentation and route integrity
- QA/release validation tooling

No new canonical domain entity is authorized by this Result by itself.

## Evidence Plan
- source/authority references from Project Kernel and QA ledger;
- exact code/root-cause evidence per finding;
- compare/diff evidence;
- static/build validation;
- browser regression evidence;
- production candidate release-readiness evidence;
- live human retest after explicit deployment;
- cleanup/lineage record after release.

## Production Impact
NONE until a separately authorized G7 deployment occurs.
