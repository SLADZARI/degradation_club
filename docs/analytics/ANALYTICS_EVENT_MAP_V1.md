# DEMENTOR CLUB — ANALYTICS EVENT MAP v1

Status: IMPLEMENTATION CONTRACT
Date: 2026-08-29

Principle: measure meaningful movement through the ecosystem, not every click. ACTIVITY ≠ PROGRESS.

Shared parameters: `entity_type`, `entity_id`, `source_page`, `placement`, `cta_id`, `member_state`, `assessment_progress`.
Never send email, name, phone, auth/session tokens, Supabase IDs or free-form answers.

Event allowlist:
- `join_start`
- `join_sphere_open`
- `assessment_complete`
- `auth_start`
- `auth_complete`
- `workspace_open`
- `project_open`
- `course_open`
- `course_cta_click`
- `event_open`
- `event_cta_click`
- `merch_open`
- `merch_cta_click`
- `recommendation_click`
- `external_community_click`

Funnels:
1. Club acquisition: `page_view → join_start → join_sphere_open → assessment_complete → auth_start → auth_complete → workspace_open`.
2. Content → intent: editorial/project → entity open → entity CTA.
3. Recommendation: source page → `recommendation_click` → target entity open → CTA.
4. Community: page → community surface → `external_community_click`.
5. Merch intent: `/merch/ → merch_open → merch_cta_click`.

Implementation API:
`window.DEMENTOR_ANALYTICS.track(eventName, params)`

Rules:
- production-only;
- consent-gated;
- allowlisted event names only;
- `source_page` attached automatically;
- PII-like keys stripped;
- GA4 receives semantic events;
- Clarity is used for behavioral/session analysis, not as a duplicate event sink.

Candidate GA4 key events after live validation: `assessment_complete`, `auth_complete`, `course_cta_click`, `event_cta_click`, `merch_cta_click`.
