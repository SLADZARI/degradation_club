# Dementor Club — Operations Runbook v1

Status: operational procedure
Branch: `dementor-club-site`
Date: 2026-08-24

This runbook is for publishing already-approved club information. It does not approve facts.

## 0. Before any publication

1. Confirm the canonical source in the responsible branch.
2. Confirm status, title, URL slug and public fields.
3. Unknown or unapproved fields stay `null` / hidden / `NOT APPROVED`.
4. Update the implementation record in `content/...`.
5. Update `content/registry.json`.
6. Update the relevant public index/page.
7. Update `sitemap.xml` when a new public URL is created.
8. Check mobile, no-JS fallback, metadata and links.

## 1. New event

Canonical source: `dementor-club/events/...`

Site procedure:
- copy `content/templates/event.json`;
- assign stable event ID and slug;
- create `content/events/<slug>.json`;
- create `/events/<slug>/` from the event entity structure;
- add the event to `/events/` programme under the factual status;
- add it to `content/registry.json`;
- add URL to `sitemap.xml`;
- do not expose registration until `registration` is approved;
- when completed/cancelled, preserve URL and add evidence/archive state.

## 2. New project

Canonical source: project branch first, then approved club reference.

Site procedure:
- copy `content/templates/project.json`;
- create `content/projects/<slug>.json`;
- create `/projects/<slug>/`;
- add to `/projects/`;
- add to `content/registry.json`;
- add URL to sitemap;
- preserve the project's own editorial/visual independence.

## 3. New dementor

Canonical source: `dementor-club/people/dementors.md`.

Site procedure:
- copy `content/templates/dementor.json`;
- create `content/dementors/<slug>.json`;
- create `/community/<slug>/`;
- add to `/community/` roster;
- add to `content/registry.json` and sitemap;
- do not invent biography, practice areas, courses or events.

## 4. New course

Canonical source: `dementor-club/courses/...`.

Site procedure:
- copy `content/templates/course.json`;
- create `content/courses/<slug>.json`;
- create stable course URL;
- add relation to dementor record if approved;
- add to registry;
- only add to a public catalog/index if canonical placement is approved;
- `approved-draft` must not be rendered as `ACTIVE`.

## 5. First merch object

Canonical source: `dementor-club` merch source must exist first.

Site procedure:
- copy `content/templates/merch.json`;
- assign stable OBJECT ID;
- create object record and `/merch/<slug>/`;
- add object to `/merch/` and Catalog;
- add to registry and sitemap;
- publish price/edition/material only when approved;
- checkout activates only when both object status and `site-config.js -> merch.checkoutEnabled` permit it.

## 6. Activate Contacts

Required approved inputs:
- official endpoint or public email;
- routing owner/process;
- privacy review.

Activation:
- update `site-config.js -> contacts`;
- set `enabled:true` only when endpoint exists;
- test successful and failed submission states;
- update Privacy if personal data leaves the browser.

## 7. Activate Donate

Required approved inputs:
- provider;
- recipient/legal recipient information where required;
- checkout URL;
- currency;
- recurring support policy;
- legal/privacy review.

Activation:
- update `site-config.js -> donate`;
- set `enabled:true` only after a real end-to-end payment test;
- update Donate status copy;
- update Terms/Privacy before launch.

## 8. Activate event registration

Required approved inputs:
- event status allowing registration;
- registration URL/provider;
- participation terms;
- price if applicable;
- privacy/legal treatment for registration data.

Activation:
- update event canonical source first;
- update event record;
- update `site-config.js -> events`;
- expose CTA only after the factual status changes.

## 9. Activate membership

Required approved inputs:
- membership mechanics;
- member data policy;
- rules/roles/channels;
- onboarding-to-membership transition.

Activation:
- update canonical club source;
- update Community page;
- set `site-config.js -> community.membershipEnabled:true` only when the mechanism actually exists.

## 10. Release check

Before treating a change as live:
- canonical source checked;
- record updated;
- registry updated;
- page/index updated;
- sitemap updated if needed;
- no invented facts;
- no dead CTA;
- mobile 360/390/430/768 checked;
- reduced-motion/no-JS acceptable;
- Privacy/Terms updated when data/payment behavior changes;
- production deployment verified separately.
