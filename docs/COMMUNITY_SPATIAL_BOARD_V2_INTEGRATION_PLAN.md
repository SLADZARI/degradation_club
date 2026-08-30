# Dementor Club Site — Community Spatial Board v2 Integration Plan

STATUS: **IMPLEMENTATION PLAN / NOT RELEASED**  
DATE: **2026-08-30**  
SOURCE OF TRUTH: `dementor-club/community/COMMUNITY_BOARD_ACCESS_AND_SPATIAL_MODEL_V2.md`  
TARGET: `community/board/`

## 1. Goal

Replace the current binary closed-board presentation with one continuous Board product that changes capabilities by user state without changing the canonical Artifact model.

The same route and same spatial world should progressively reveal itself:

`PUBLIC PREVIEW / FOG → AUTH / ONBOARDING → FULL READ / FIRST ARTIFACT GATE → FULL INTERACTION`

The transition must feel like entering deeper into the same place, not being redirected through unrelated applications.

## 2. Current implementation facts

Current `community/board/board.js` already has:

- session detection;
- Community entry status via `getEntryStatus()`;
- first Artifact composer;
- Artifact slot handling;
- active Board Artifact loading;
- reactions;
- responses;
- private signed media URLs;
- Member identity badge;
- stable Artifact links.

Current access is binary:

- no session → Board closed;
- session without active membership → Board denied;
- active membership → full Board and current interaction controls.

Current Board loader fetches the complete active `visibility=community` Artifact set and related profiles/reactions/media/responses. This cannot be reused for anonymous fog-of-war and will not scale to a large spatial Board.

Current reaction/response writes are client-side direct table writes and must not be considered sufficient authorization for the v2 participation gate.

## 3. Required capability states

Use one resolved Board capability object instead of scattered `if` checks.

Conceptual client model:

```js
{
  mode: 'PUBLIC_PREVIEW' | 'ONBOARDING_PREVIEW' | 'FIRST_ARTIFACT_REQUIRED' | 'MEMBER_ACTIVATED',
  canReadFullBoard: boolean,
  canCreateFirstArtifact: boolean,
  canReact: boolean,
  canRespond: boolean,
  canMoveOwnArtifact: boolean,
  canReadPrivateMedia: boolean
}
```

Canonical mapping:

### PUBLIC_PREVIEW

- no authenticated session;
- preview projection only;
- no full Community Artifact query;
- no private signed media;
- no create/reaction/response/move;
- interaction attempts open entry CTA and preserve origin.

### ONBOARDING_PREVIEW

- authenticated;
- membership gates incomplete;
- same or slightly personalized preview projection;
- preserve progress and `return_to`;
- no protected Board query;
- CTA continues DC-9 / identity flow.

### FIRST_ARTIFACT_REQUIRED

- membership active;
- no successful first Artifact yet;
- full authenticated Board read;
- first Artifact composer enabled;
- reactions and responses visibly locked;
- movement unavailable until own Artifact exists;
- interaction attempt explains participation rule and opens/focuses first Artifact CTA.

### MEMBER_ACTIVATED

- successful first Artifact exists;
- full authenticated Board read;
- reaction/response enabled;
- move-own enabled;
- normal Artifact lifecycle controls remain available.

## 4. One Board, not four pages

Do not build four visually separate applications.

The spatial Board shell should load once and switch data/capabilities.

Shared shell:

- world/canvas;
- camera/pan/zoom;
- top navigation;
- filter/navigation layer;
- Artifact focus model;
- deep-link resolver;
- state-specific overlay/gates.

The user should visually remain in the same world while access increases.

## 5. Public fog-of-war architecture

Do not query `dc_artifacts` anonymously and blur it in CSS.

Create a dedicated public-safe projection, view or RPC, for example:

`dc_board_public_preview_v1`

Possible safe fields only after explicit schema review:

- preview id / stable Artifact reference where allowed;
- public-safe teaser text OR teaser token;
- coarse `x/y/w/h` presentation geometry;
- generic/approved author label if allowed;
- coarse type/presence metadata if approved;
- optional aggregate count;
- no contact identity;
- no private media path;
- no response text;
- no canonical body unless intentionally projected as public-safe.

The fog renderer may additionally generate non-data silhouettes locally to communicate scale. Synthetic silhouettes must be visually distinguishable from readable real preview Artifacts and must not be presented as factual club activity.

## 6. Spatial presentation state

Do not add Board coordinates directly to the semantic Artifact record.

Recommended table:

`dc_artifact_board_positions`

Baseline fields:

- `artifact_id` PK/FK;
- `board_id`;
- `x`;
- `y`;
- optional `rotation`;
- optional computed `size_class` or footprint metadata;
- `position_version`;
- `placed_at`;
- `moved_at`.

Server authorization:

- active authenticated Board readers can read positions for Artifacts they may read;
- only Artifact author may update own position in first implementation;
- public preview receives only separately approved preview geometry, never protected rows by accident.

## 7. Placement

On first publication, assign a spatial position transactionally or immediately after publication through a reliable server-side placement step.

Placement should:

- start near a currently inhabited/active region;
- avoid complete collision;
- allow modest edge overlap;
- avoid permanent privilege of early center positions;
- produce stable coordinates after placement.

Do not scatter new Artifacts randomly across an enormous coordinate range.

## 8. Board data loading

Replace current "fetch all active Artifacts" with viewport queries before large-scale release.

Conceptual query:

`load artifacts where footprint intersects viewport + overscan`

Inputs:

- x1;
- y1;
- x2;
- y2;
- zoom / detail level if needed.

Target DOM budget: roughly 60–150 rendered Artifact objects near the viewport, not thousands.

Related profiles/reactions/media/responses should load only for visible/focused Artifacts or through aggregated Board payloads rather than global N-set fanout.

## 9. Reaction / response authorization

Replace direct client table writes with server-authoritative RPCs or equivalent policies that enforce the v2 gate.

Recommended operations:

- `dc_toggle_artifact_reaction_v2`
- `dc_submit_artifact_response_v2`

Both must verify:

- authenticated session;
- active Community membership;
- successful first Artifact / `MEMBER_ACTIVATED`;
- target Artifact is active/readable;
- self-response prohibition for formal response;
- uniqueness/idempotency rules.

The UI lock is explanatory only; the server is authoritative.

## 10. First Artifact gate inside the world

For `FIRST_ARTIFACT_REQUIRED`, do not replace the Board with the composer.

Show the full Board world and render a stateful entry element in/over the world:

- `ВАШЕ МЕСТО ПОКА ПУСТУЕТ`;
- reaction/response controls display locked state;
- attempting a locked action opens a compact explanation;
- primary CTA opens the existing first Artifact composer without losing camera/origin context;
- after successful publish, place/focus the new Artifact and refresh capabilities;
- then unlock reactions/responses in-place.

No hard page reset is required.

## 11. Return-to / deep-link flow

Store an origin descriptor before sending a visitor through authentication/onboarding.

Prefer a safe structured form rather than arbitrary redirect URL:

```js
{
  board: 'community',
  artifactId: '...',
  x: optional,
  y: optional,
  zoom: optional
}
```

After authentication/onboarding/first Artifact, resolve access again and return to the originating Artifact/location if still valid/readable.

Never use `return_to` to bypass membership or Artifact visibility authorization.

## 12. Interaction model for Artifact cards

### Anonymous preview card

- only preview-safe readable content;
- protected interactions display gate;
- click may focus preview and then offer entry;
- no hidden private payload in DOM.

### Onboarding-preview card

- same data boundary;
- CTA should say continue/finish entry, not register again;
- retain progress.

### First-artifact-required Member card

- full readable Artifact;
- reaction control visible but locked;
- response visible but locked;
- locked action opens `Сначала займите своё место` explanation;
- first-Artifact CTA available globally and near locked interaction.

### Activated Member card

- full reaction/response actions;
- author-specific controls on own Artifact;
- own card draggable when spatial positioning is enabled;
- other Members' cards never draggable.

## 13. Filters

Filters should operate as camera routes rather than rebuild the Board into a feed.

First stable filters should use factual data already available or explicitly added:

- mine;
- current/active;
- expiring;
- persistent;
- with image;
- with external link;
- with response/interest where permission permits.

Do not ship semantic filters such as `спорт`, `встречи`, `технологии`, city/topic categories as factual production taxonomy until metadata rules are approved.

A selected route may:

- dim non-matches;
- focus first match;
- expose previous/next;
- keep spatial context visible.

## 14. Fog interaction

The anonymous user should be able to perceive that the world continues beyond the readable region.

Recommended behavior:

- a readable island around entry/camera;
- surrounding cards become silhouettes/obscured papers;
- density increases/decreases according to safe aggregate data or local decorative rendering;
- panning into protected space increases fog rather than leaking content;
- meaningful click on fog or locked Artifact opens the same entry gate.

Avoid fake factual titles or fake Member names in production fog. Decorative non-factual shapes are acceptable if clearly unreadable.

## 15. Mobile

Spatial Board remains the conceptual world on mobile, but touch usability may need an assisted navigation layer.

Minimum:

- one-finger pan;
- pinch zoom;
- focus selected Artifact;
- `find mine`;
- filter previous/next;
- accessible card/list navigator fallback for keyboard/screen-reader/small-screen utility;
- no gesture trap preventing page escape/navigation.

Do not create a totally unrelated mobile feed unless later QA proves spatial browsing unusable.

## 16. Existing issues to fix before v2 merge

Current `board.js` still conflicts with the approved v1 QA clarification in two places:

1. media accepts JPG/PNG/WebP/PDF/TXT up to 8 MB, while approved first-release policy is JPG/PNG/WebP only, max 4 MiB;
2. `boardError()` can replace the composer host after publish/validation failure, risking loss of entered composer state.

These should be corrected independently before or during the v2 implementation branch.

## 17. Safe integration sequence

### Phase A — authorization foundation

- add `MEMBER_ACTIVATED` server gate for reaction/response;
- add capability resolver client-side;
- preserve current grid Board temporarily;
- verify existing first Artifact flow.

### Phase B — spatial authenticated Board

- add positions table + policies;
- add placement;
- replace grid renderer with pan/zoom spatial renderer;
- enable move-own;
- add factual navigation routes;
- add viewport loading.

### Phase C — first Artifact in-world activation

- keep Board readable for `FIRST_ARTIFACT_REQUIRED`;
- lock reaction/response;
- integrate composer as in-world/overlay flow;
- publish → place → focus → unlock without route reset.

### Phase D — anonymous preview

- create public-safe preview projection;
- add fog-of-war renderer;
- add auth/onboarding gate overlay;
- add origin persistence and return flow;
- security test for data leakage.

### Phase E — QA / release

- two real Member sessions;
- pre-first-Artifact bypass attempts;
- anonymous network payload inspection;
- deep links;
- OAuth return;
- mobile gestures;
- keyboard/accessibility;
- large synthetic Board performance;
- concurrent movement and reaction tests.

## 18. Non-goals

Do not add while integrating v2:

- public full Artifact feed;
- public Member directory;
- arbitrary Miro editor tools;
- user-controlled arbitrary card size;
- moving other Members' Artifacts;
- automatic semantic AI taxonomy as truth;
- new slot reward economy;
- new membership roles;
- automatic Telegram authority.

## 19. Release principle

The implementation must feel like one continuous place whose permissions deepen as the person participates:

`ВИДИШЬ МИР → ВХОДИШЬ → ПРОХОДИШЬ 9 СФЕР → НАЗЫВАЕШЬ СЕБЯ → ЗАНИМАЕШЬ СВОЁ МЕСТО → ПОЛУЧАЕШЬ ПРАВО ВМЕШИВАТЬСЯ`

The Board itself remains the visual destination throughout the flow.
