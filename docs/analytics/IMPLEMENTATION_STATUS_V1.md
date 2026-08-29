# Analytics implementation status v1

Implemented in branch `analytics/event-map-v1`:
- production-only semantic `track()` API;
- GA4 event allowlist and PII guard;
- page/entity route tracking for project/course/event/merch;
- delegated Join, recommendation, entity and external Telegram/community tracking;
- Clarity page/entity custom tags;
- consent gate preserved;
- manual GA4/Clarity setup documented.

Still requires page-specific explicit hooks before claiming full funnel coverage:
- `assessment_complete` after confirmed 9/9 save;
- `auth_complete` after confirmed persisted session;
- `workspace_open` only after authenticated workspace initialization.

These are intentionally not inferred from DOM text to avoid false conversions.
