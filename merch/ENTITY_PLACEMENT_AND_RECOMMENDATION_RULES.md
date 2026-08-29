# Dementor Club — Entity Placement & Recommendation Rules

STATUS: APPROVED ARCHITECTURE / IMPLEMENTATION BASELINE
UPDATED: 2026-08-29

## 1. Purpose

Dementor Club does not separate culture from commerce into an isolated shop. Courses, events, projects, physical objects and wear are independent public entities inside one ecosystem.

The site may recommend an entity when it is contextually relevant to what the visitor is currently reading or doing. The recommendation must feel like continuation of the club world, not generic advertising.

The site is not the source-of-truth. Entity facts remain in their canonical branch/source and are only rendered by `dementor-club-site`.

## 2. Entity classes

Commercial / conversion-capable entities:

- `program` — course, practice, experience;
- `event` — offline or hybrid event;
- `object` — physical conceptual object;
- `wear` — clothing and wearable objects;
- `paper` — printed/paper objects;
- `edition` — numbered or limited edition;
- `project-edition` — physical output of an independent club project.

Non-commercial entities such as people and editorial projects may act as context, but are not automatically treated as products.

## 3. Entity identity

Every sellable/recommendable entity must have a stable public identity and URL.

Minimum recommendation fields:

- `entity_id`;
- `entity_type`;
- `public_name`;
- `public_url`;
- `status`;
- `sales_state`;
- `primary_asset`;
- `short_idea`;
- `related_entities`;
- `recommendation_tags`;
- `placement_tags`;
- `recommendation_priority`;
- `updated_at`.

Product-specific commercial and production fields remain governed by `merch/PRODUCT_CARD_SCHEMA.md`.

## 4. Status boundary

A recommendation may mention an entity that is publicly real but not yet available, provided its state is shown truthfully.

Rules:

- `idea` — never shown as a public product/recommendation;
- `prototype` — may appear only in clearly labelled editorial/development context, never with a purchase CTA;
- `approved` / `production` — may appear with status CTA such as `VIEW`, `FOLLOW`, `COMING`;
- `available` — may use purchase CTA;
- `sold-out` — may remain visible with sold-out state;
- `archived` / `cancelled` — not used for active recommendation unless the page is archival.

Unknown price, availability, sizes, production spec or sales terms must never be inferred.

## 5. Recommendation slots

The site has named placement slots. Pages should reference slots rather than hard-code individual products.

### Global slots

- `HOME_FEATURED` — one major current entity on Home.
- `HOME_INLINE` — one contextual entity between major homepage sections.
- `FOOTER_ROTATION` — small low-pressure recommendation near the end of eligible pages.
- `POPUP_CONTEXTUAL` — rare contextual intervention after meaningful interaction.

### Context slots

- `PROJECT_RELATED` — related course/object/wear on a Project page.
- `EVENT_RELATED` — event-related object/wear/course.
- `COURSE_RELATED` — related object/wear/event near the end of a Program page.
- `ARTICLE_INLINE` — editorial insert inside long-form material.
- `MERCH_CROSSSELL` — related product inside Merch/product pages.
- `CART_UPSELL` — one complementary entity in cart; never more than one.
- `POST_JOIN_RESULT` — 2–3 recommendations after onboarding based on declared/result context.

## 6. Fixed page locations

### Home

- one `HOME_FEATURED` after current activity/projects/events layer;
- maximum one additional `HOME_INLINE` before final Join layer;
- no automatic popup on first page view.

### About

- maximum one cultural object/wear insertion after the user has received the core club explanation;
- no hard sales block in the opening definition sections.

### Project

- one `PROJECT_RELATED` after the project proposition/content;
- for independent projects, project-editions outrank generic merch when canonically related.

### Course / Program

- one `COURSE_RELATED` after the course proposition/program and before the final CTA/footer;
- contextual wear/object may be shown as an artifact, not as an unrelated ad.

### Event

- one `EVENT_RELATED` near participation information or after program details;
- event edition/wear outranks generic merch if such entity exists.

### Merch index

- all public Wear/Object entities are first-class cards;
- related products use `MERCH_CROSSSELL`.

### Cart

- one `CART_UPSELL` only after the current cart contents are clear.

### Join / onboarding result

- use `POST_JOIN_RESULT` only after the visitor has completed enough input to produce a meaningful result;
- recommendations may be ranked by matched sphere/context tags.

## 7. Context model

Recommendation ranking uses explicit tags, not hidden psychological claims.

Allowed inputs:

1. current page/entity;
2. explicit onboarding result or choices already made by the visitor;
3. entities already viewed in the current local session;
4. cart contents;
5. campaign/referrer tag when explicitly present.

Do not infer sensitive traits. Do not use medical, political, religious or other sensitive profiling for recommendation ranking.

## 8. Ranking order

Default ranking:

1. direct `related_entities` relationship;
2. exact project/event/program relationship;
3. matching `recommendation_tags`;
4. matching `placement_tags`;
5. current availability/sales state;
6. `recommendation_priority`;
7. rotation among equally relevant entities.

Context relevance always outranks generic commercial priority.

## 9. Frequency rules

Default limits per page view:

- max 1 major recommendation block;
- max 1 minor/footer recommendation;
- max 1 contextual popup;
- never show a popup before meaningful interaction;
- do not repeat the same entity twice on one page;
- do not show the same popup repeatedly in one local session.

The purpose is discovery and continuation, not banner density.

## 10. Presentation formats

Renderer may use these formats:

- `ENTITY_CARD` — standard card;
- `EDITORIAL_INSERT` — large narrative intervention between sections;
- `ARTIFACT_INSERT` — object presented as a cultural artifact;
- `RELATED_STRIP` — compact related entity strip;
- `BOTTOM_SHEET` — mobile contextual recommendation;
- `CONTEXT_POPUP` — rare deliberately humorous popup.

The copy must be written in the voice of the entity/club. Avoid generic e-commerce language such as `You may also like` unless intentionally parodied.

Approved system label for neutral fallback:

`СИСТЕМА СЧИТАЕТ, ЧТО ВАМ ЭТО ТОЖЕ НЕ НУЖНО.`

## 11. Measurement

Each recommendation impression/click should be addressable by:

- `entity_id`;
- `slot`;
- `page_context`;
- `format`;
- `source_entity_id` when applicable.

Commercial analytics must not change the canonical entity data.

## 12. Implementation boundary

Flow:

`canonical entity source → approved recommendation metadata → dementor-club-site entity registry → named slot renderer → public page`

The first implementation may be deterministic and local. Personalization can be added later without changing the entity contract or placement names.
