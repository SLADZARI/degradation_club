# GA4 + CLARITY SETUP v1

Production IDs:
- GA4: `G-QTZY2GKZ4R`
- Microsoft Clarity: `y9yuo1zabw`

## GA4 manual property setup

After event tracking is deployed and live events appear in Realtime, create event-scoped custom dimensions in Admin → Data display → Custom definitions for:
- `entity_type`
- `entity_id`
- `placement`
- `source_page`
- `cta_id`
- `member_state`

Do not duplicate standard page dimensions that GA4 already provides.

Candidate key events after validating live data quality:
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

## Microsoft Clarity manual setup

No duplicate event configuration is required in v1.

Recommended:
- verify sessions arrive from `dementor.club`;
- keep privacy masking enabled for sensitive content/form inputs;
- create useful filters/segments by URL/path for `/join/`, `/workspace/`, `/projects/`, `/events/`, `/merch/`;
- use device filters for mobile review;
- use runtime custom tags `dc_page`, `dc_entity_type`, `dc_entity_id`;
- review rage/dead clicks and recordings around GA4 funnel drop-offs.

## Privacy

Never send PII to GA4/Clarity event parameters or tags: email, name, phone, auth/session tokens, Supabase IDs, free-form assessment answers.
