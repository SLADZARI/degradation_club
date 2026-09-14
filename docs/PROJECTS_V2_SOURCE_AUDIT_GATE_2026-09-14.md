# #169 Projects v2 — source-audit + navigation regression gate

Date: 2026-09-14
Branch: `agent/169-projects-hub-v2`
Base: `dementor-club-production@79c9d29e537fefae2fa04db4ea69174fc14a0780`
Authority: issue #169 plus each project's responsible source. Discussion/chat is not project canon.

## Gate

No substantive Projects v2 content build may invent or interpolate project mechanics, public status, availability, dates, pricing, participation promises, or visual canon.

Before a hub card or project page makes a project-specific claim, its passport below must identify the source that supports that claim. If a field is unresolved, the implementation must either:

1. omit that claim; or
2. use a neutral literal presentation that does not imply more than the verified source.

A prototype, branch name, recent discussion, or stale implementation is evidence to inspect, not automatic authority.

Required passport fields for every canonical slug:

- canonical source;
- confirmed public name;
- what the project demonstrably does/is;
- current public status;
- allowed CTA;
- verified visual assets;
- claims forbidden until a new source approves them.

The four stable routes are fixed by #169 and do not encode version numbers:

- `/projects/logic-awareness/`
- `/projects/dementor-lab/`
- `/projects/dementor-battle/`
- `/projects/dementor-robo-games/`

## Passport — `/projects/logic-awareness/`

**Audit state: VERIFIED FOR MINIMAL HUB ENTRY.**

- Canonical source: current production project page `projects/logic-awareness/index.html`, plus #169 for registry/status framing and #44 for navigation behavior.
- Confirmed public name: `ЛОГИКА И ОСОЗНАННОСТЬ`.
- What it demonstrably is: an editorial project presented as a pseudo-official prevention campaign around logic, facts, critical thinking and awareness; the current page contains Ministry/dossier/series editorial structures.
- Current public status allowed on the Projects hub: `EDITORIAL PROJECT` (from #169). Do not replace this with a guessed lifecycle state such as `finished`, `active campaign`, or `ongoing` unless a newer responsible source approves it.
- Allowed CTA: open/read/explore the existing project route. Existing internal dossier and series links remain project-owned.
- Verified visual assets referenced by the canonical page: `/assets/projects/logic-awareness/cover.webp`, project portraits, series covers and frames under `/assets/projects/logic-awareness/`.
- Forbidden without new source: claims about publication cadence, future series, audience metrics, campaign outcomes, schedule, monetization, or broader mechanics beyond the existing editorial project.

## Passport — `/projects/dementor-lab/`

**Audit state: BLOCKED FOR SUBSTANTIVE BUILD — approved source artifact must be resolved.**

- Canonical source required by #169: the approved public landing **V19**. A repository artifact/commit/branch that is demonstrably that approved landing must be identified before copying its design/content as authority.
- Confirmed public name: `DEMENTOR LAB`.
- Confirmed issue-level public facts: #169 defines it as a public/approved project and preserves the approved core line `ИГРАЕМ В РЕАЛЬНОСТЬ`.
- Current public status allowed on hub only after source cross-check: `PUBLIC / APPROVED` is specified by #169, but page-level claims and experience details must come from the resolved V19 source.
- Allowed CTA before V19 resolution: neutral `ОТКРЫТЬ ПРОЕКТ →` only once the canonical slug has real source-backed content. Board bridge may use the #169-approved Club relationship language.
- Verified visual assets: **pending V19 source resolution**. Lab experiment/runtime branches and `dementor-lab/` materials exist in repository history, but are not automatically the approved public landing authority.
- Forbidden without V19/newer source: gameplay/mechanics descriptions, current feature list, progress/completion claims, dates, prices, participant data, launch/release promises, or treating an experiment/runtime branch as the public landing canon.

## Passport — `/projects/dementor-battle/`

**Audit state: PARTIAL — #169 supplies safe envelope; responsible project source still requires inspection.**

- Candidate source discovered: `agent/dementor-battle-map-01-authoring`. Candidate status does not make the branch canonical by itself; its current project authority must be checked before detailed content is lifted.
- Confirmed public name: `DEMENTOR BATTLE`.
- Safe issue-level description from #169: tactical browser game; isometric battlefield; characters; cover/object language; movement; ongoing work.
- Current public status: `IN DEVELOPMENT`.
- Allowed CTA before deeper source audit: open the project page and/or `ПОСМОТРЕТЬ BOARD →`; do not imply a finished playable release unless source proves it.
- Verified visual assets: **pending responsible-source audit**.
- Forbidden without new source: final win conditions, progression, final multiplayer model, monetization, release date, final class/ability system, or any unresolved rules presented as approved mechanics.

## Passport — `/projects/dementor-robo-games/`

**Audit state: BLOCKED FOR STATUS/PLAYABILITY CLAIMS — real playable source not yet resolved.**

- Canonical source: **pending discovery/verification**. #169 explicitly requires checking the actual current source at implementation time.
- Confirmed public name: `DEMENTOR ROBO GAMES` / `Dementor Robo Games` as registered by #169; exact display styling should follow the responsible source when found.
- What it demonstrably does: #169 identifies it as a project/experiment with its own sport/competition language. Detailed disciplines/premise require the real source.
- Current public status: do **not** render `PLAYABLE` until the current playable source is found and verified. Use a neutral lower literal state if implementation must proceed before that verification.
- Allowed CTA: only a destination that is demonstrably live. Do not expose `PLAY`, `ИГРАТЬ`, event registration, or similar action until verified.
- Verified visual assets: **pending real source discovery**.
- Forbidden without new source: invented disciplines, event dates, tournament structure, scoring/rules, future events, participants, prizes, release promises, or `PLAYABLE` based on old discussion alone.

## Hub implementation boundary before all audits complete

The first Draft PR may establish the `/projects/` information architecture, stable slug registry, Board bridge and safe minimal entries, but each project card must stay inside the verified passport above.

In particular:

- no `PLAYABLE` badge for Robo Games until verified;
- no Lab mechanics or V19-derived visual claims until the actual approved V19 artifact is resolved;
- no Battle rules beyond the #169 safe envelope until its responsible source is audited;
- Logic & Awareness keeps its existing project-specific visual/editorial world rather than being rebuilt into a generic template.

## #44 / #169 mandatory navigation regression contract

Issue #44 is part of #169 release acceptance, not an optional side-fix.

Test desktop and mobile separately.

1. Fresh `/projects/` navigation without a fragment starts at `scrollY = 0`.
2. Fresh navigation to every canonical `/projects/<slug>/` without a fragment starts at `scrollY = 0`.
3. A valid explicit hash deep-link is respected and lands on its target; for Logic & Awareness existing targets such as `#series-01` and `#series-03` must not be globally reset to top.
4. Browser back/forward is a separate case: history navigation must remain reasonable and must not be indiscriminately forced to top, so a restored history position can survive where the browser owns it.
5. Mobile and desktop both verify no accidental horizontal overflow and predictable slug ↔ Projects navigation.

Implementation rule for the eventual scroll fix: distinguish fresh non-hash navigation from hash navigation and history restoration. Do not solve #44 by globally disabling scroll restoration or by calling `scrollTo(0,0)` in a way that destroys explicit fragments/back-forward behavior.

## Draft PR gate

Before the first #169 Draft PR is treated as content-reviewable:

- each project-specific statement in hub/page copy maps to a passport source;
- unresolved passport fields stay omitted or neutral;
- canonical routes contain no version suffixes;
- Board is linked but not redefined and no parallel activity feed/CMS is introduced;
- #44 regression acceptance is represented in automated/browser QA for both desktop and mobile once all four routes exist;
- no unsupported mechanics/statuses appear in visible copy, metadata, OG text, CTA labels, alt text, or structured data.
