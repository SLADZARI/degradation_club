# GA4 + CLARITY SETUP v1

Production IDs
- GA4: `G-QTZY2GKZ4R`
- Microsoft Clarity: `y9yuo1zabw`

## GA4 — manual property setup

After event tracking is deployed and live events are visible in Realtime, create event-scoped custom dimensions in Admin → Data display → Custom definitions for:
- `entity_type`
- `entity_id`
- `placement`
- `source_page`
- `cta_id`
- `member_state`

Do not create a custom dimension for standard page dimensions that GA4 already provides.

Candidate key events after validating real data quality:
- `assessment_complete`
- `auth_complete`
- `course_cta_click`
- `event_cta_click`
- `merch_cta_click`

Recommended Explorations:
1. Path Exploration from Home / landing pages.
2. Funnel: `join_start → join_sphere_open → assessment_complete → auth_start → auth_complete → workspace_open`.
3. Free-form: `event_name × entity_id × placement × source_page`.
4. Recommendation funnel: `recommendation_click → target *_open → target *_cta_click`.

## Microsoft Clarity — manual project setup

No event duplication is required in v1. Use Clarity primarily for recordings, heatmaps and friction analysis.

Recommended:
- verify production project receives `dementor.club` sessions;
- keep privacy masking enabled for sensitive content and form inputs;
- use URL/path filters for `/join/`, `/workspace/`, `/projects/`, `/events/`, `/merch/`;
- use device filters for mobile regression review;
- use custom tags `dc_page`, `dc_entity_type`, `dc_entity_id` emitted by the production runtime after consent;
- review rage/dead clicks and recordings around GA4 funnel drop-offs.

## Privacy contract

Never send PII to GA4/Clarity event parameters or custom tags: email, name, phone, auth/session tokens, Supabase IDs, free-form assessment answers.
