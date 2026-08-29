# DEMENTOR CLUB — ANALYTICS EVENT MAP v1

Status: DRAFT FOR IMPLEMENTATION
Date: 2026-08-29
Scope: public production surface + authenticated club flows

## Principle

We measure user movement through the ecosystem, not every click.

ACTIVITY ≠ PROGRESS.

One event name = one semantic action. Context is carried by parameters.

Do not create separate event names for every card, course, event or placement.

## Shared parameters

Use these whenever applicable:

- `entity_type`: `club | project | course | event | merch | community | assessment | workspace`
- `entity_id`: stable slug/id, e.g. `logic-awareness`, `think-dangerously`, `fuengirola`, `sh-dem-04`
- `source_page`: `location.pathname`
- `placement`: where the entity/action was shown, e.g. `hero`, `nav`, `entity-card`, `contextual-recommendation`, `footer`, `project-register`, `event-programme`, `merch-grid`, `workspace`
- `cta_id`: stable action id when several CTAs exist
- `member_state`: `anonymous | registered | member | role-holder` when available without sending PII
- `assessment_progress`: integer 0–9 where useful

Never send email, name, phone, free-form answers, access tokens, Supabase IDs or other PII into GA4/Clarity event parameters.

## Event set v1

| Event | Trigger | Main parameters | Why |
|---|---|---|---|
| `join_start` | User starts club onboarding / preliminary examination | `source_page`, `placement`, `cta_id` | Acquisition funnel entry |
| `join_sphere_open` | User opens one of the 9 spheres | `entity_id`, `assessment_progress`, `source_page` | Understand assessment progression |
| `assessment_complete` | 9/9 assessment completed/saved | `source_page`, `member_state` | Core activation milestone |
| `auth_start` | User starts authentication | `source_page`, `placement` | Auth funnel start |
| `auth_complete` | Auth callback/session succeeds | `source_page`, `member_state` | Auth conversion |
| `workspace_open` | Authenticated workspace loaded successfully | `source_page`, `member_state` | Club activation / retention |
| `project_open` | Project entity opened | `entity_id`, `source_page`, `placement` | Content interest |
| `course_open` | Course entity opened | `entity_id`, `source_page`, `placement` | Course discovery |
| `course_cta_click` | User clicks primary course action | `entity_id`, `source_page`, `placement`, `cta_id` | Course intent |
| `event_open` | Event entity opened | `entity_id`, `source_page`, `placement` | Event discovery |
| `event_cta_click` | User clicks primary event action | `entity_id`, `source_page`, `placement`, `cta_id` | Event intent |
| `merch_open` | Merch/product entity opened | `entity_id`, `source_page`, `placement` | Product discovery |
| `merch_cta_click` | User clicks merch primary action | `entity_id`, `source_page`, `placement`, `cta_id` | Purchase intent before checkout exists |
| `recommendation_click` | Contextual recommendation card is clicked | `entity_type`, `entity_id`, `source_page`, `placement` | Measure recommendation engine effectiveness |
| `external_community_click` | User leaves site to Telegram/community external surface | `source_page`, `placement`, `cta_id` | Community migration |

## Page-view layer

GA4 `page_view` stays automatic through the production analytics runtime.

Required properties:

- `page_title`
- `page_location`
- `page_path`

Navigation tracking must cover:

- normal document navigation;
- `history.pushState`;
- `history.replaceState`;
- `popstate`;
- `hashchange`.

No duplicate `page_view` for the same path.

## Funnels

### 1. Club acquisition

`page_view(Home/landing)` → `join_start` → `join_sphere_open` → `assessment_complete` → `auth_start` → `auth_complete` → `workspace_open`

Primary questions:

- Where do users leave the onboarding?
- Which entry page produces the highest assessment completion rate?
- How many completed assessments become authenticated club accounts?

### 2. Content → entity intent

`page_view(project/editorial)` → `project_open/course_open/event_open/merch_open` → relevant `*_cta_click`

Primary questions:

- Which editorial/project pages create intent?
- Which entities are discovered organically versus through recommendations?

### 3. Contextual recommendation

`page_view(source)` → `recommendation_click` → destination `*_open` → destination CTA

`placement` is mandatory here.

Primary questions:

- Does the same course perform better in a project page, homepage or recommendation block?
- Which merch joke actually produces product exploration?

### 4. Community

`page_view` → community surface → `external_community_click`

Primary questions:

- Which content causes a user to move into Telegram/community?
- Which pages return people to the club ecosystem later? (GA4 path exploration + UTM when external return links are introduced.)

### 5. Merch intent

`page_view(/merch/)` → `merch_open` → `merch_cta_click`

Checkout/cart are production-disabled until explicitly approved, therefore there is no purchase/conversion event in v1.

## Route / placement map v1

### `/`
Track:
- primary Join CTA → `join_start` (`placement=hero` or corresponding section id)
- contextual course/event/project/merch recommendations → `recommendation_click`
- nav entity transitions rely on page views; do not instrument generic nav clicks unless attribution is later needed

### `/join/`
Track:
- onboarding start → `join_start`
- sphere selection → `join_sphere_open` (`entity_id=sphere-01` … `sphere-09`)
- 9/9 saved → `assessment_complete`
- sign-in/register transition → `auth_start`

### `/auth/callback/`
Track only successful persisted session:
- `auth_complete`

Do NOT log failed auth text or user identifiers to analytics.

### `/workspace/`
Track after authenticated workspace initializes:
- `workspace_open`

### `/projects/`
Track project register entity opening:
- `project_open`

### `/projects/logic-awareness/`
Track:
- project open if direct landing is distinguishable from listing transition
- course/content/entity recommendations → `recommendation_click`

### Course pages
Track:
- `course_open`
- primary CTA → `course_cta_click`

### `/events/`
Track event programme entity opening:
- `event_open`

### `/events/fuengirola/`
Track:
- `event_open`
- primary event action → `event_cta_click`

### `/merch/`
Track every individual product entity open:
- `merch_open`

The removed multi-shirt overview image is not an entity and must not generate events.

### `/merch/drop-001/*`
Track:
- `merch_open`
- active primary intent CTA only → `merch_cta_click`

### `/community/`
Track only meaningful external/community transition:
- `external_community_click`

Do not instrument decorative interactions as product events.

## Implementation contract

Expose one public method from `production-analytics-v1.js`:

```js
window.DEMENTOR_ANALYTICS.track(eventName, params)
```

Contract:

1. No-op outside `https://dementor.club`.
2. No-op before analytics consent is `granted`.
3. Event names must exist in the v1 allowlist.
4. Automatically attach `source_page` when absent.
5. Strip undefined/null values.
6. Never accept PII keys (`email`, `name`, `phone`, `token`, `user_id`, free-form answers).
7. Send to GA4 through `gtag('event', ...)`.
8. Clarity remains behavioral/session visualization; do not duplicate every GA event as a Clarity custom event in v1.

## Data-quality rules

- One semantic action → one event.
- Entity identity belongs in parameters, not event names.
- No `click_button_1`, `click_card_3`, DOM-generated names or translated labels.
- Stable slugs only.
- `placement` is mandatory for `recommendation_click`.
- Do not fire an `*_open` event twice during one unchanged page state.
- Do not treat hover/scroll as conversion events in v1.
- Do not track admin/test/design-system surfaces.

## GA4 configuration after code deployment

Mark as key events only after enough live data exists to validate event quality:

Candidate key events:
- `assessment_complete`
- `auth_complete`
- `course_cta_click`
- `event_cta_click`
- `merch_cta_click`

Do not mark every event as a conversion.

Recommended explorations:
- Path exploration from Home and external landing pages;
- Funnel exploration for Club acquisition;
- Free-form table: `event_name × entity_id × placement × source_page`;
- Landing page → `recommendation_click` → target entity CTA.

## Clarity usage

Use Clarity for:
- dead/rage clicks;
- scroll depth visually;
- mobile layout friction;
- seeing whether a CTA/recommendation is actually noticed;
- reviewing sessions around GA4 funnel drop-offs.

GA4 answers **what happened**. Clarity helps explain **how it happened**.

## Explicitly out of scope v1

- checkout / purchase events;
- ad-platform pixels;
- Google Tag Manager;
- identity stitching with email/user IDs;
- custom scroll-depth events;
- automatic tracking of every link/button;
- experimentation/A-B framework.

These are added only when there is a concrete decision they need to support.
