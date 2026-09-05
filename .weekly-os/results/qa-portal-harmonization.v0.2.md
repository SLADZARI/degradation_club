---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.2
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
---

# MP | Dementor Club | BUILD | Portal QA Harmonization | v0.2

## Goal
Bring the current Dementor Club portal through pre-advertising QA while progressively harmonizing implementation with the project kernel and approved local operating rules, without duplicate UI/navigation/auth/domain systems or silent semantic mutation.

## Owner
Modern Pilgrims

## Status
ACTIVE / DRAFT v0.2

## Branch
`result/qa-portal-harmonization`

## Gate
Current: `G5_BUILD`
Next: `G6_VALIDATION`
Production release requires separate `G7_RELEASE` authorization and explicit user deploy instruction.

## Scope
- Existing live QA findings and portal regressions recorded in `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`.
- Public shell, Workspace shell, auth/login, Join/DC-9 onboarding, member/application surfaces and related route/state integrity.
- Approved Workspace Member activation and private-shell change defined in `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.
- Progressive MP_DSL / Weekly OS harmonization only where needed to safely implement QA fixes.
- Duplicate-owner detection for header, footer, navigation, auth identity, Workspace shell and local product navigation.
- Route/state reconciliation across guest / authenticated non-member / member / Dementor / owner-admin states.

## Non-goals
- No speculative redesign outside approved QA/product decisions.
- No new parallel auth, state, menu, shell or domain systems.
- No project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN authority promotion without explicit approval.
- No production deployment as part of implementation or validation.
- No DC-9 personalization/recommendation engine, generalized fog-of-war progression engine or reward economy in this Result.
- No broad branch-history reconciliation while active live QA is in progress unless necessary for a concrete fix.

## Approved Local Operating Rules
Every fix follows:

`QA observation → authority/current-state check → existing implementation inventory → duplicate/semantic/route check → decision if required → implementation → G6 validation → release candidate → explicit deploy authorization → live retest → G8 cleanup`.

Approved product decisions currently in force include:
- public CTA `Вступить в клуб` and guest `Войти` on the public site;
- authentication mandatory only immediately before application submission, not before DC-9;
- first complete DC-9 baseline immutable; later attempts do not overwrite it;
- for authenticated `/workspace/*`, one canonical Workspace Shell replaces public landing navigation;
- `DEMENTOR CLUB` logo inside Workspace returns to public `/`;
- active ordinary Member default entry is Community Board;
- ordinary Member primary navigation begins with Community Board; `HOME` is not a primary Member item;
- name/avatar remains identity control;
- `FIRST_ARTIFACT_REQUIRED` Member receives Board spotlight on the existing first Artifact action;
- `Пропустить` dismisses the spotlight only and never activates membership state;
- closed Board remains unavailable to authenticated non-members;
- `МОЯ АКТИВНОСТЬ` exposes existing responses/reactions/Artifacts as a projection, without introducing a new universal Activity entity.

Canonical decision authority for the Workspace-specific change:
`operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.

## Acceptance Criteria
1. Every implemented QA finding is linked to verified source/root cause and existing implementation before new code is introduced.
2. One canonical owner exists for each shared shell responsibility touched by the Result; no duplicate public/private primary headers survive on authenticated Workspace.
3. Existing Membership v2 boundary remains intact: `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.
4. `MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED` remains intact; first Artifact publication is the only approved activation transition.
5. Active Member default Workspace entry resolves to Community Board without breaking role-aware Dementor/owner routes.
6. Authenticated non-member cannot read/respond/create on closed Community Board.
7. Workspace logo returns to `/`; public landing navigation is not simultaneously rendered as Workspace primary navigation.
8. First-entry spotlight reuses existing Artifact slot/gate and `Пропустить` does not mutate semantic state.
9. Member responses/reactions/Artifacts have visible confirmation/history through My Activity or the existing canonical projection owner.
10. Relevant browser regression covers first-entry Member, activated Member, authenticated non-member, Dementor and owner-admin on desktop/mobile, with WebKit auth coverage for Safari-sensitive login/callback paths.
11. Critical routes remain canonical and no dead legacy destination is reintroduced.
12. No unresolved P0/P1 issue included in a release candidate remains without explicit deferral/decision.
13. Production candidate is built from current production authority using the established safe release method while branch divergence remains unresolved.
14. Commit/merge is never treated as deploy; production requires explicit user authorization.
15. After each released batch, stale compatibility code, duplicate assets/routes and temporary branches are reviewed under G8 cleanup.

## Affected Domain / Systems
- Public shell/navigation boundary
- Workspace shell/navigation
- Authentication/session entry
- Community Board
- first Artifact activation gate
- Artifact slot/publication state
- reactions/responses presentation
- My Activity projection
- Membership v2 presentation and route integrity
- QA/release validation tooling

No new canonical domain entity is authorized by this Result.

## Evidence Plan
- source/authority references from Project Kernel, approved Workspace decision and QA ledger;
- exact implementation-owner inventory before edits;
- compare/diff evidence;
- static/build validation;
- browser regression evidence across Member/non-member/role states;
- WebKit proxy evidence for Safari-sensitive auth paths plus real Safari live retest after release;
- production candidate release-readiness evidence;
- live human retest after explicit deployment;
- cleanup/lineage record after release.

## Current G6 Evidence
- PR #102 `Community participation → My Activity projection`: G6 run #732 PASS; merged to `dementor-club-site` as `9adef4a6691e88a63030f2925bfbc004ebdc93a6`.
- PR #103 `WebKit auth regression gate`: first run #734 failed because the mobile-sized test attempted to click the service login while the canonical burger was closed. This was classified as a test interaction defect; no auth runtime mutation was made.
- PR #103 corrected run #735 PASS across registry/routes, content, visual contract, DC-9 baseline, production build, analytics, canonical shell, built-JS syntax, Chromium browser regression, WebKit auth regression, route manifest and production artifact release gate.
- PR #103 merged to `dementor-club-site` as `0fa400b6708328e3602b0eb59bed789bd9e60e85`.
- `result/qa-portal-harmonization` is synchronized to that site merge commit.
- WebKit PASS is browser-engine regression evidence, not a claim that the reported live Safari issue is closed. Real Safari production retest remains required after explicit release.
- No production branch, live Supabase state or deployment was changed by PR #102/#103.

## Production Impact
No new production impact until a separately authorized G7 deployment of this v0.2 scope occurs.
