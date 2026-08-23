# Dementor Club — Site Completeness Audit

Date: 2026-08-23
Status: structural readiness review

Illustration/raster replacement is intentionally excluded from this audit because artwork is being developed separately.

## 1. Public pages — ready

### Core
- `/` — Home
- `/about/` — Club / About
- `/events/` — event programme
- `/events/fuengirola/` — event entity
- `/projects/` — project register
- `/projects/logic-awareness/` — project entity
- `/community/` — community + public Dementor roster
- `/merch/` — merch/object register
- `/join/` — onboarding
- `/archive/` — lifecycle archive
- `/catalog/` — Actual Source public register
- `/404.html` — not found

### Dementors
- `/community/valentin/`
- `/community/nikita/`
- `/community/evgeniy/`
- `/community/gabil/`

### Course
- `/courses/dumai-s-opasnostyu/`

Canonical status: APPROVED DRAFT. It must not be added to the main catalog until source-of-truth allows this.

### Utility
- `/donate/`
- `/contacts/`
- `/legal/privacy/`
- `/legal/terms/`

## 2. Navigation / discovery — ready

- primary navigation covers cultural areas;
- utility navigation covers Support / Contacts / Privacy / Terms;
- sitemap contains core pages, Dementor profiles and utility pages;
- robots points to the sitemap on the current production host;
- Catalog remains a secondary register, not a primary navigation item.

## 3. Publishing system — ready

- `content/ENTITY_CONTRACT.md` supports event/project/merch/course/dementor/archive-record;
- `docs/PUBLISHING_PLAYBOOK_v1.md` defines publishing flow;
- templates exist for event/project/merch/course/dementor records;
- Event lifecycle and Archive rules exist;
- unknown fields remain null/pending rather than invented.

## 4. Current factual content — present

- one public event record: Fuengirola / PLANNED;
- one public project: Logic & Awareness / ACTIVE;
- four approved public Dementors;
- one online course: approved-draft;
- zero approved merch objects;
- zero completed/cancelled archive records.

## 5. Not missing pages — missing approvals/data

These are not implementation gaps and must not be filled by invention.

### Donate
Pending:
- recipient/operator;
- payment method/provider;
- currencies;
- one-time/recurring rules;
- legal/tax copy.

### Contacts
Pending:
- official email;
- public social accounts;
- phone/address if wanted.

### Merch
Pending:
- first approved object;
- OBJECT ID;
- statement;
- material/edition where applicable;
- price/availability/checkout.

The site already has the register and a record template. Do not publish a fake product just to fill the page.

### Community
Pending:
- approved membership format;
- internal channels;
- roles/rituals;
- access rules.

Onboarding already exists but is not itself a promise of membership.

### Events
Only Fuengirola is currently approved as an event entity. A second event page should be created only after a second event exists in `dementor-club` source-of-truth.

Fuengirola still lacks approved public date, venue, price, programme and registration mechanics.

### Dementors
Roster/pages are ready. Profile stories and practice areas remain pending where source-of-truth says pending.

### Course
`Думай с опасностью` remains approved-draft. Existing standalone URL is valid. Do not create a Courses index/global catalog placement until the source explicitly changes placement/status.

## 6. Legal / data triggers

Privacy and Terms are implementation baselines, not final jurisdiction-specific legal advice.

Review/update before activating:
- payments;
- mailing list;
- contact form submission;
- user accounts;
- server-side onboarding storage;
- new analytics/tracking;
- file uploads.

Current onboarding stores results locally in browser localStorage.

## 7. Visual layer intentionally pending

The following are intentionally postponed:
- final Dementor Ink raster replacements;
- final OG/social binaries;
- final licensed display/UI webfonts;
- visual QA after artwork integration.

These do not require restructuring the page architecture.

## 8. Release readiness conclusion

Structurally the site is ready to be filled with newly approved entities without introducing new primary page types.

New information should normally enter through one of these existing patterns:
- event;
- project;
- Dementor;
- course;
- merch object;
- support/contact configuration;
- archive evidence.

A new top-level section should require a deliberate product/content decision, not merely the appearance of new material.
