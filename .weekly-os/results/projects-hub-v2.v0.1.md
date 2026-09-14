# Result — Projects Hub v2

- **Artifact ID:** `dementor-club.result.projects-hub-v2`
- **Version:** `0.1`
- **Status:** `DRAFT`
- **Gate:** `G6_VALIDATION`
- **Issue:** `#169`
- **Integration branch:** `agent/169-projects-hub-v2`
- **Implementation start:** authorized by owner in chat on 2026-09-14
- **Production merge:** not authorized
- **Production deploy:** not authorized

## Goal

Rebuild `/projects/` as the canonical Dementor Club projects hub while preserving the current public site shell and Home hero. The hub must show four project territories, explain their connection through the Club/Board, and route only to destinations that are actually supported by source authority.

## Authority / sources

Read before implementation:

1. `.weekly-os/PROJECT.json`
2. `.weekly-os/ARTIFACT_INDEX.json`
3. `.weekly-os/APPROVED_STATE.json`
4. `docs/PROJECTS_V2_SOURCE_AUDIT_GATE_2026-09-14.md`
5. `docs/PROJECTS_V2_EDITORIAL_DESIGN_HANDOFF_2026-09-14.md`
6. issue `#169`
7. current production baseline inherited by `agent/169-projects-hub-v2`

The semantic kernel on `dementor-club` is not mutated by this Result. This branch-local Result does not displace the currently active Board Result.

## Scope

### In scope

- `/projects/` hub content and presentation.
- Existing canonical Club Header/Footer/navigation preserved.
- Four visible project territories:
  - Dementor Lab — `PUBLIC / APPROVED`
  - Dementor Battle — `IN DEVELOPMENT`
  - Robo Games — `IN DEVELOPMENT`
  - Логика и осознанность — `EDITORIAL PROJECT`
- Board bridge using canonical `/workspace/board/` route.
- Lab hub CTA points to `/projects/dementor-lab/`.
- Logic hub CTA points to `/projects/logic-awareness/`.
- Hero reel remains an optional enhancement: stable Club-owned fallback is primary; external video is a link and cannot break the page.
- Mobile/desktop responsive presentation.
- Metadata for `/projects/` describes the complete hub rather than the obsolete single-project framing.
- Exact approved Dementor Lab V19 projection at the canonical Lab route.
- #44 fragment/history regression correction inside the existing Logic content-series owner.

### Explicitly out of scope

- Home hero redesign or global shell redesign.
- Board architecture changes.
- New activity CMS/feed.
- Invented Battle or Robo mechanics.
- Rebuilding Logic & Awareness into the hub visual language.
- Production merge/deploy.
- Promoting this branch-local Result to semantic-kernel current Result.

## Acceptance Criteria

- [x] `/projects/` first screen communicates `У ВСЕГО ЕСТЬ СВЯЗЬ.` and provides a Board CTA.
- [x] Four project territories are visible with source-bounded statuses and copy.
- [x] Lab CTA is `/projects/dementor-lab/`.
- [x] Logic CTA is `/projects/logic-awareness/`.
- [x] Battle/Robo CTAs point to canonical `/workspace/board/`.
- [x] Acid CTAs use INK/black text.
- [x] New page styles are scoped to the Projects hub and do not override global Home/About/Community selectors.
- [x] No horizontal overflow on 1440/390 Projects browser matrix.
- [x] Canonical public Header is present on hub + all four canonical slugs in the Projects browser matrix.
- [x] `/projects/` metadata describes the whole hub, not only Logic & Awareness.
- [x] #44 browser regression: fresh hub/slugs open at top; Logic `#series-01` / `#series-03` land correctly; browser Back restoration remains enabled on 1440/390.
- [x] Home hero remains structurally unchanged. Exact PR diff changes only the Projects ecosystem status text from `01 ACTIVE PROJECT` to `04 PROJECTS`.
- [x] Approved Dementor Lab V19 is integrated at `/projects/dementor-lab/` with its verified visual derivatives and `ПУБЛИЧНЫЙ ДОСТУП / СКОРО` availability boundary.
- [x] Hub + Lab visual evidence exists for desktop 1440 and mobile 390.
- [x] Mobile Projects headings are regression-guarded against owner-level clipping, not only document-level overflow.

## Dementor Lab V19 source binding

The exact approved Dementor Lab V19 public landing authority is resolved and pinned:

- source artifact: `dementor_lab_landing_v19_APPROVED.html`;
- Google Drive artifact id: `1JptEnjRn4ebCUHfGRAGCqxy4ALacVumP`;
- SHA-256: `b6b592c79c6c798ad140a0937bfa271c3fbf9724f8a2cf28e3456ada2602738e`;
- availability boundary: `ПУБЛИЧНЫЙ ДОСТУП / СКОРО`;
- 13 verified visual derivatives are stored under `assets/projects/dementor-lab/v19/`;
- V19 remains the project-owned visual/editorial world while canonical Club Header/Footer own the public site shell.

Integration evidence is recorded in `docs/PROJECTS_V2_LAB_V19_INTEGRATION_EVIDENCE_2026-09-14.md`.

## #44 evidence — branch acceptance

The existing `content-series-v1.js` owner was corrected rather than adding a second fragment/navigation runtime.

Root cause: global `html { scroll-behavior:smooth }` converted explicit Logic fragment correction into a repeatedly restarted smooth animation. The owner now temporarily bypasses that global smooth-scroll rule only while an explicit Logic hash settles, restores the original rule afterwards, and does not alter browser-owned Back/Forward restoration.

Automated evidence on both 1440 and 390 widths confirms:

- fresh `/projects/` starts at top;
- fresh four canonical project slugs start at top;
- `#series-01` and `#series-03` remain explicit and land at their targets;
- Back restoration is not forced to top;
- no horizontal overflow;
- canonical public Header remains present.

Issue #44 is not treated as released/production-fixed until this Result is actually released.

## G6 visual corrective loop

The first exact visual evidence run exposed defects that generic overflow checks did not catch:

1. external YouTube iframe could render an anti-bot/sign-in screen in the Hub reel;
2. mobile owner-level clipping affected large Hub headings even though the document itself had no horizontal overflow.

Corrective action stayed inside canonical Hub ownership:

- removed the default iframe dependency from the first screen; stable branded fallback remains visible and the external video is available via `VIDEO ↗`;
- added local mobile typography guardrails only for the affected Hub headings;
- extended the existing Projects browser regression to assert `scrollWidth <= clientWidth` for mobile Hub headings;
- retained screenshot capture inside the existing Site Integrity workflow rather than introducing a parallel QA system.

A subsequent guard run correctly found one remaining Lab-territory Hub heading clip (`ИГРАЕМ В РЕАЛЬНОСТЬ`, 367 px content inside 354 px owner). It was corrected without weakening the test.

## G6 evidence — code candidate

Validated code head: `487e1faf924a1f5c803587c2851e3b77c4a3a94a`.

Site Integrity / Release Readiness:

- workflow run: `#1155` / Actions run `34900344379`;
- conclusion: `SUCCESS`;
- Projects browser regression: `SUCCESS`;
- final production artifact release gate: `SUCCESS`;
- Projects visual artifact: `projects-v2-visual-references` / artifact id `10369979488`;
- artifact digest: `sha256:23c531d0e844694e8bad228c8813f33998a60c6cc4021dc76da958e55e71d1c9`;
- visual matrix: Hub 1440, Hub 390, Lab 1440, Lab 390.

Human visual audit of the same artifact confirms:

- Hub 1440: hierarchy, territories, stable reel fallback, Board bridge and final CTA remain intact;
- Hub 390: `ИГРАЕМ В РЕАЛЬНОСТЬ`, Logic title and `ДОБАВИТЬ?` are no longer clipped; no anti-bot iframe surface remains;
- Lab 1440/390: V19 composition remains coherent and canonical Header/Footer remain visible without shell duplication or overlap.

Exact diff against production base `79c9d29e537fefae2fa04db4ea69174fc14a0780` is ahead-only (`behind=0`). Readiness registry formatting noise was removed before G6; the remaining readiness diff is Projects-semantic only.

This Result evidence update is documentation-only relative to the validated code candidate. The resulting branch head must still pass the same Site Integrity workflow before PR #183 can be moved from Draft to Ready for review.

## Release boundary

G6 implementation evidence is complete for the validated code candidate. This does **not** authorize merge or deploy.

Required next gate action:

1. exact final branch head passes Site Integrity after this Result evidence commit;
2. PR #183 may then move from Draft to Ready for review if the exact diff remains clean;
3. merge into `dementor-club-production` requires explicit owner authorization;
4. deploy requires separate explicit owner authorization;
5. release/G8 cleanup happens only after an authorized merge/release.
