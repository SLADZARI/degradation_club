# Dementor Club — Community Board Access & Spatial Model v2

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v2**  
DATE: **2026-08-30**  
SCOPE: Community Board visibility, access gates, first-participation rule, spatial presentation  
IMPLEMENTATION TARGET: `dementor-club-site`

This document refines and, where explicitly stated below, supersedes the Board access/visibility assumptions in `community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`.

The canonical member-entry chain remains:

`9 SPHERES → RESULT → IDENTITY → MEMBERSHIP → BOARD → FIRST ARTIFACT → COMMUNITY REACTION`

The new Board principle is:

> **The Board may be seen before membership, but participation must be earned by becoming part of it.**

A person is allowed to observe a deliberately limited public preview of Community activity. Publishing, reacting and responding remain gated Community actions.

## 1. Product status of the Board

Community Board is a distinct Community product/surface inside the Dementor Club ecosystem.

It is not a generic social feed and not a public social network.

The Board is the spatial Community surface where Artifacts occupy places in a shared world.

Recommended stable route remains:

`/community/board/`

`/community/` remains the Community root/index and must not be replaced by the Board.

## 2. Spatial Board model

The Board is not a chronological card grid.

Canonical presentation direction:

> **Community Board = a shared spatial field of club Artifacts.**

Each active Artifact occupies a position in the Board world.

The Member explores the Board by panning/zooming the space, focusing individual Artifacts and using navigation/filter routes between existing Artifacts.

Spatial coordinates are presentation state, not Artifact meaning. They must be stored separately from the canonical Artifact semantic record so the same Artifact can retain identity/provenance independent of Board layout.

The presentation layer should support:

- persistent Artifact position;
- content-driven card footprint;
- modest visual irregularity without destroying readability;
- viewport-based loading for scale;
- direct focus on an Artifact from a stable URL/reference;
- author movement of their own Artifact only;
- factual navigation filters derived from actual available Artifacts;
- later semantic navigation only when a separately approved metadata/tagging model exists.

The Board must not become a general-purpose Miro-style editor. Drawing tools, arbitrary shapes, arrows, unrestricted resize, free layers/frames and unrelated canvas mechanics are not part of the approved model.

## 3. Access states

Canonical Board access states:

### A. ANONYMOUS / PUBLIC PREVIEW

A non-authenticated visitor may open the Board route or a link to an Artifact and see a **deliberately restricted preview region** of the Board.

The visitor must not receive unrestricted access to Community Artifact data.

The visual metaphor is **fog of war**:

- the visitor can understand that a much larger Community world exists;
- only a small approved preview area and/or explicitly preview-safe Artifact teasers are readable;
- distant/locked areas may be visible as silhouettes, blurred forms, obscured cards, counts or spatial presence without exposing protected Community content;
- private Community media, contact identity, response details and other protected fields remain inaccessible;
- the public preview must be implemented with server/data access rules, not only CSS blur over already-downloaded private content.

The purpose is discovery, not public consumption of the Community Board.

Any attempt to meaningfully interact with the Board must open the entry gate.

### B. AUTHENTICATED / ONBOARDING INCOMPLETE

An authenticated user who has not completed the nine canonical sphere onboardings may retain the same restricted preview and the context of the Artifact/Board location that brought them there.

The system must direct them to continue:

`AUTHENTICATION → 9 SPHERES`

If entry began from a specific Artifact, the system should preserve a safe `return_to` / Artifact reference so the user can return after completing the required flow.

### C. MEMBER_ACTIVE / FIRST_ARTIFACT_REQUIRED

After:

- authentication;
- completion of all 9 sphere onboardings;
- Sphere Map result availability;
- required Community identity (`display_name` + at least one supported social/contact identity);
- required privacy/legal consent;

membership becomes active according to v1.

At this stage the Member may enter and explore the full authenticated Board.

They may:

- pan/zoom the full Board;
- read available Community Artifacts;
- use approved filters/navigation;
- open Member/Artifact surfaces allowed to active Members;
- create and publish their first Artifact using the first slot.

They may **not yet react to or respond to another Member's Artifact**.

### D. MEMBER_ACTIVATED

A Member becomes `MEMBER_ACTIVATED` only after the first Artifact has been successfully published.

Only this state grants normal interaction rights with other Members' Artifacts.

A `MEMBER_ACTIVATED` Member may, subject to normal authorization rules:

- react to another Member's Artifact;
- send a response/interest action;
- navigate/filter the Board;
- move their own Artifact where spatial movement is enabled;
- close/retire their own Artifact according to approved slot rules;
- use future approved Community participation actions.

## 4. Mandatory participation-before-reaction gate

The following rule is **mandatory**:

> **A person must publish their own first Artifact before they may react or respond to somebody else's Artifact.**

Equivalent state rule:

`REACTION_ALLOWED = MEMBER_ACTIVATED`

`RESPONSE_ALLOWED = MEMBER_ACTIVATED`

`MEMBER_ACTIVE + FIRST_ARTIFACT_REQUIRED ≠ REACTION_ALLOWED`

This gate applies server-side as well as in the interface.

Hiding or disabling UI controls alone is insufficient.

Reaction/response RPCs, policies or equivalent server operations must reject users who have not reached `MEMBER_ACTIVATED`.

The author-self-response prohibition from v1 remains in force.

## 5. Cultural principle

The participation gate is not presented as arbitrary account friction.

It expresses the Community rule:

> **На доске нет зрителей. Чтобы откликнуться на чужое, сначала оставь своё.**

A new Member may look around before publishing, but cannot become an interactive participant while contributing nothing of their own.

The first Artifact is therefore both:

- the final Community activation step;
- the Member's first visible contribution;
- the key that unlocks reactions/responses to other Artifacts.

## 6. Anonymous interaction behavior

For an anonymous visitor, interaction attempts include, for example:

- clicking a visible/preview Artifact to access protected detail;
- attempting to react/respond;
- attempting to create an Artifact;
- trying to enter a fogged/locked Board region;
- using a protected Board navigation action.

The interface should respond with a clear entry CTA rather than a generic authorization error.

Canonical direction:

`BOARD PREVIEW → AUTHENTICATE → 9 SPHERES → RESULT → IDENTITY → MEMBER_ACTIVE → FIRST ARTIFACT → MEMBER_ACTIVATED → RETURN TO BOARD/ARTIFACT`

The source Artifact/location that caused the entry attempt should be preserved when technically safe so the user can return to the original context after activation.

## 7. Fog-of-war rules

Fog of war is an approved visual/product metaphor for unauthenticated Board discovery.

It must satisfy all of the following:

- reveal scale/activity without revealing protected Community content;
- make the existence of more Board space obvious;
- provide only a small intentional preview rather than a degraded copy of the full Board;
- never ship full protected Artifact payloads to an anonymous client merely to blur them;
- never expose private media URLs or Member contact identity;
- keep preview content explicitly public-safe and separately queryable;
- preserve a clear route into authentication/onboarding.

Possible visual treatments include silhouettes, obscured papers, density fields, partial card edges, unreadable distant cards and dark/fog overlays. These are presentation choices and may be refined without changing the access rule.

## 8. Public preview data boundary

The default Member Artifact visibility remains semantically `community`.

This v2 does **not** redefine every Community Artifact as public.

Instead, Board public preview is a separate projection/surface that may expose only approved teaser-safe information.

Implementation must distinguish:

`CANONICAL COMMUNITY ARTIFACT DATA`

from

`PUBLIC BOARD PREVIEW PROJECTION`

A public preview projection may contain only explicitly permitted fields, such as a safe teaser, anonymized/approved author label, coarse type/presence metadata, approximate visual footprint, public-safe count or other separately approved preview data.

No field becomes public merely because it exists in the canonical Artifact table.

## 9. First Artifact placement

When a Member reaches `FIRST_ARTIFACT_REQUIRED`, the Board should visibly offer an empty/place-making moment rather than behave like a normal feed composer.

Approved direction:

- the Member can explore the Board first;
- reaction/response controls remain locked;
- the Board visibly indicates that the Member has not yet occupied their own place;
- CTA leads to the first-Artifact composer;
- successful publication places the Artifact into the Board world;
- only successful publication transitions the Member to `MEMBER_ACTIVATED` and unlocks reactions/responses.

Suggested product copy may communicate the idea as:

`Сначала займите своё место.`

The exact editorial copy remains adjustable as long as the semantic gate is preserved.

## 10. Filters and navigation

Board filters are navigation routes through the spatial world, not a conventional feed filter that necessarily removes all unmatched cards.

Approved behavior direction:

- filters should be generated from attributes actually present in current Artifacts;
- selecting a filter may dim non-matching Artifacts while preserving spatial context;
- next/previous navigation moves focus/camera between matching Artifacts;
- factual filters may be implemented first;
- semantic/topic filters require approved metadata and must not be invented from UI assumptions.

## 11. Deep-link return behavior

When a visitor enters through an Artifact or Board location and then hits an access gate, the system should preserve the origin context.

Preferred conceptual flow:

`external link → preview Artifact/location → entry gate → onboarding → first Artifact → activation → return to original Artifact/location`

The return must not bypass any access checks.

The stable canonical Artifact identifier remains independent of Board coordinates.

## 12. Security / authorization requirements

The v2 model requires server-enforced separation of capabilities.

At minimum:

- anonymous users: preview-safe projection only;
- authenticated onboarding-incomplete users: no Community protected data beyond explicitly permitted preview;
- `MEMBER_ACTIVE + FIRST_ARTIFACT_REQUIRED`: authenticated Board read access, own first-Artifact creation, no reaction/response permission;
- `MEMBER_ACTIVATED`: normal approved Board interaction rights;
- only Artifact author may move/close their Artifact unless a future moderation role is separately approved;
- public fog-of-war must not depend on client-side secrecy;
- private media remains protected;
- Member contact identity remains private by default.

## 13. Relationship to v1

This document explicitly supersedes the following v1 assumptions only where they conflict with this v2:

1. The statement that the Board is exclusively a closed authenticated surface.
2. The v1 out-of-scope prohibition on any public Community Board visibility.
3. Any interpretation that `MEMBER_ACTIVE` alone is sufficient to react/respond.

The replacement is:

- **public observation is permitted only through a restricted preview/fog-of-war projection;**
- **full Board access remains gated by the approved membership flow;**
- **interaction with other Members' Artifacts requires `MEMBER_ACTIVATED`;**
- **canonical Community Artifact visibility remains protected unless separately projected as preview-safe data.**

All other v1 semantics remain in force unless separately superseded by a newer approved source-of-truth.

## 14. Implementation sequence

Implementation should proceed in this order:

1. preserve current canonical Artifact/member models;
2. add server-side `MEMBER_ACTIVATED` authorization gate to reaction/response operations;
3. add Board spatial presentation state separately from Artifact semantics;
4. add authenticated full-board spatial rendering;
5. add own-Artifact movement with server authorization;
6. add viewport-based data loading/scaling;
7. add factual filter routes and camera navigation;
8. add public preview projection and fog-of-war rendering;
9. add preserved `return_to` flow through authentication/onboarding/first Artifact;
10. run desktop/mobile/accessibility/security QA before replacing the current production Board.

The public preview/fog-of-war layer must not be enabled before its data projection and authorization rules are verified.

## 15. Definition of Done — Board access v2

The access/spatial model is complete when QA verifies that:

1. an anonymous visitor can perceive a limited Board preview without receiving protected Community Artifact payloads;
2. an anonymous interaction attempt enters authentication/onboarding with origin context preserved;
3. an onboarding-incomplete user cannot access protected Board data;
4. a `MEMBER_ACTIVE / FIRST_ARTIFACT_REQUIRED` user can explore the authenticated Board but cannot react/respond;
5. that user can publish exactly the permitted first Artifact using the approved slot mechanic;
6. successful first publication transitions them to `MEMBER_ACTIVATED`;
7. reaction/response controls unlock only after that transition;
8. server authorization rejects pre-activation reaction/response attempts even if the UI is bypassed;
9. a Member can move only their own Artifact when movement is enabled;
10. Board position does not redefine or duplicate canonical Artifact identity;
11. filters navigate through the spatial world without silently inventing semantic taxonomy;
12. external/deep-link entry can return the activated Member to the originating Artifact/location;
13. mobile and keyboard users retain a usable non-trapping navigation path;
14. public fog-of-war does not leak private media, contacts or protected Artifact text.
