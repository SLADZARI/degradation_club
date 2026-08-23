# Dementor Club — Publishing Playbook v1

Status: implementation baseline
Updated: 2026-08-23

Purpose: make new approved entities publishable without redesigning the site.

## 1. Universal flow

1. Approve facts in the responsible source branch.
2. Assign stable ID and slug.
3. Create/mirror a record using `content/ENTITY_CONTRACT.md`.
4. Create the addressable page from an existing entity pattern.
5. Add the entity to its section register.
6. Add it to `/catalog/` only if the source explicitly allows catalog placement.
7. Add the URL to `sitemap.xml`.
8. Add raster preview/OG only after asset approval.
9. Verify mobile and production URL.
10. After lifecycle change, update status instead of changing the URL.

## 2. Event

Canonical source: `dementor-club/events/<slug>.md`

Required before public page:
- title;
- status;
- stable slug;
- public description.

Optional until approved:
- date/time;
- city/venue;
- organisers/participants;
- programme;
- price;
- registration URL;
- related projects;
- media.

Public route: `/events/<slug>/`
Register: `/events/`
Archive rule: completed/cancelled entity keeps the same URL and gains evidence/results.

## 3. Project

Canonical source: responsible project branch; club reference in `dementor-club` when required.

Required:
- title;
- project status;
- editorial source;
- public summary;
- stable slug.

Public route: `/projects/<slug>/`
Register: `/projects/`
Catalog placement only after approved publication status.

## 4. Dementor

Canonical source: `dementor-club/people/dementors.md` plus approved profile material.

Required:
- public name;
- slug;
- page status.

Optional and never invented:
- story;
- practice areas;
- events;
- courses;
- projects.

Public route: `/community/<slug>/`
Register: `/community/`

## 5. Course

Canonical source: `dementor-club/courses/<slug>.md`

Required:
- title;
- status;
- delivery format;
- Dementor if approved;
- stable route.

Public route: `/courses/<slug>/`
Do not create a Courses index or add the course to the global catalog unless the source explicitly approves that placement.

## 6. Merch object

Canonical source: `dementor-club` before site publication.

Required before a product/object page can be public:
- OBJECT ID;
- title;
- statement/meaning;
- status;
- approved image or image-pending state.

Optional until approved:
- material;
- edition;
- price;
- availability;
- purchase URL/checkout.

Public route when approved: `/merch/<slug>/`
Register: `/merch/`
Catalog: `/catalog/?type=merch`

Never make a product look purchasable until price/availability/checkout status are actually approved.

## 7. Donate

Public route already reserved: `/donate/`

Before activation approve in club source:
- recipient/operator;
- payment provider/method;
- currencies;
- one-time vs recurring support;
- any legal/tax copy.

Then update Privacy and Terms before switching payment status from pending.

## 8. Contacts

Public route already reserved: `/contacts/`

Before activation approve at least one public channel. Never infer an address from a team member's personal account.

## 9. Privacy / Terms triggers

Mandatory review before adding:
- payment processing;
- newsletter/mailing list;
- server-side onboarding profile;
- analytics/tracking beyond current delivery infrastructure;
- user accounts;
- user-submitted forms/files.

## 10. Raster assets

Illustrations remain outside this publishing pass. Follow `docs/RASTER_ASSET_SPEC_v1.md` when artwork is approved.
