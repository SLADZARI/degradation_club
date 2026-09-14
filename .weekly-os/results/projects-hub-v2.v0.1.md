# Result — Projects Hub v2

- **Artifact ID:** `dementor-club.result.projects-hub-v2`
- **Version:** `0.1`
- **Status:** `DRAFT`
- **Gate:** `G5_BUILD`
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
7. current production/public implementation on branch baseline inherited by `agent/169-projects-hub-v2`

The semantic kernel on `dementor-club` is not mutated by this Result. This branch-local Result does not displace the currently active Board Result.

## Scope

### In scope

- `/projects/` hub content and presentation.
- Existing Club shell/topbar/navigation preserved.
- Four visible project territories:
  - Dementor Lab — `PUBLIC / APPROVED`
  - Dementor Battle — `IN DEVELOPMENT`
  - Robo Games — `IN DEVELOPMENT`
  - Логика и осознанность — `EDITORIAL PROJECT`
- Board bridge using canonical `/workspace/board/` route.
- Lab hub CTA points to `/projects/dementor-lab/`.
- Logic hub CTA points to `/projects/logic-awareness/`.
- Hero reel treated as optional enhancement with stable non-video content remaining readable.
- Mobile/desktop responsive presentation.
- Metadata for `/projects/` updated away from the obsolete one-project framing.

### Explicitly out of scope for this build step

- Home hero redesign or global shell redesign.
- Board architecture changes.
- New activity CMS/feed.
- Invented Battle or Robo mechanics.
- Rebuilding Logic & Awareness into the hub visual language.
- Production merge/deploy.
- Reconstructing the approved Dementor Lab V19 source from partial excerpts. Lab route integration must use the complete approved V19 source artifact, not an approximation.

## Acceptance Criteria

- [ ] `/projects/` first screen communicates `У ВСЕГО ЕСТЬ СВЯЗЬ.` and provides a Board CTA.
- [ ] Four project territories are visible with source-bounded statuses and copy.
- [ ] Lab CTA is `/projects/dementor-lab/`.
- [ ] Logic CTA is `/projects/logic-awareness/`.
- [ ] Battle/Robo CTAs point to canonical `/workspace/board/`.
- [ ] Acid CTAs use INK/black text.
- [ ] New page styles are scoped to the Projects hub and do not override global Home/About/Community selectors.
- [ ] No horizontal overflow on mobile layouts.
- [ ] Existing shared topbar and mobile INDEX behavior remain owned by the shared shell.
- [ ] `/projects/` metadata describes the whole hub, not only Logic & Awareness.
- [ ] #44 regression remains part of G6: fresh `/projects/` and `/projects/logic-awareness/` open at top; valid hashes and history continue to work.
- [ ] Home hero remains visually and structurally unchanged.

## Current build note

The exact approved Dementor Lab V19 public landing authority is resolved and pinned:

- source artifact: `dementor_lab_landing_v19_APPROVED.html`;
- Google Drive artifact id: `1JptEnjRn4ebCUHfGRAGCqxy4ALacVumP`;
- SHA-256: `b6b592c79c6c798ad140a0937bfa271c3fbf9724f8a2cf28e3456ada2602738e`;
- availability boundary: `ПУБЛИЧНЫЙ ДОСТУП / СКОРО`;
- V19 remains the project-owned visual/editorial world while the canonical Club Header/Footer own the public site shell.

The canonical route still contains only the G5 source-binding shell. Exact V19 projection plus its approved visual media must be integrated before the Lab route can move from `REQUIRES_APPROVAL / productionAllowed:false` to visual acceptance. Do not substitute a reconstructed or experiment-branch version.

The #44 navigation regression remains open at G5/G6 boundary until explicit Logic hash deep-links pass the automated desktop/mobile browser matrix without breaking fresh-top or Back restoration.

## Evidence required for G6

- exact changed-file diff;
- build success;
- route checks;
- desktop + mobile visual evidence for `/projects/`;
- shared header regression;
- Home hero before/after equivalence check;
- #44 navigation/hash/history check;
- Lab exact V19 projection + visual source binding evidence before marking Lab route complete.
