# Dementor Club — Content Readiness Audit

Date: 2026-08-24
Branch: `dementor-club-site`
Role: implementation audit, not a new source-of-truth for club facts.

## Summary

Current page states are tracked in `content/page-readiness.json`.

- FINAL: 11
- PLACEHOLDER: 5
- REQUIRES_APPROVAL: 5
- TOTAL: 21 routes

A page marked FINAL means its current public copy can ship in the current factual state. It does not mean visuals, external services or future content are complete.

## FINAL now

- `/`
- `/about/`
- `/events/`
- `/projects/`
- `/projects/logic-awareness/`
- `/join/`
- `/catalog/`
- `/archive/`
- `/legal/privacy/`
- `/legal/terms/`
- `/404.html`

## PLACEHOLDER but structurally correct

### Fuengirola
`/events/fuengirola/`

Approved now:
- name;
- city/country;
- PLANNED status;
- public description;
- global Join CTA.

Still missing approval:
- date/time;
- exact venue;
- duration;
- programme;
- price;
- participation terms;
- registration mechanics;
- organizers/participants.

### Dementor profiles

- `/community/valentin/`
- `/community/nikita/`
- `/community/evgeniy/`
- `/community/gabil/`

Approved now:
- public roster;
- stable profile URLs;
- Valentin relation to the approved-draft course.

Still missing:
- approved short biography for each Dementor;
- approved practice spheres for each Dementor;
- future course/project/event relations only when explicitly fixed in source-of-truth.

## REQUIRES APPROVAL

### Community
`/community/`

Needed before membership can be activated:
- membership format;
- internal channels;
- participant roles;
- rules;
- rituals;
- joint activities;
- activation URL/provider if external tooling is used.

### Merch
`/merch/`

Needed for the first live object:
- OBJECT ID;
- approved title;
- statement;
- material;
- edition/stock logic;
- price/currency;
- sale status;
- approved checkout provider/URL.

Working names in club notes are not public products.

### Course — Думай с опасностью
`/courses/dumai-s-opasnostyu/`

Current canonical status: `approved-draft`.

The interactive page may exist as a preview but remains outside the main catalog.
Needed for launch:
- explicit source-of-truth status promotion;
- approval for main-catalog placement if desired.

### Donate
`/donate/`

Needed:
- recipient;
- provider;
- currency;
- payment URL;
- recurring-support rule;
- legal/privacy review before activation if the payment flow introduces data processing.

### Contacts
`/contacts/`

Needed:
- approved public contact channel;
- form endpoint if form submission is activated;
- public email/social/phone/address only when actually approved.

## Missing entities for a fuller V1

These are content gaps, not missing page architecture.

### Second event

Only one event is currently approved in `dementor-club`: Fuengirola.
A second event should not be invented in the site branch. It must first exist as a canonical event record with at least:
- title;
- type;
- status;
- public description;
- public visibility rule;
- location/date/registration fields where known.

### First merch object

The Merch section has no approved public object yet.
The first object should be approved in the club source before it is added to `content/registry.json` and `/catalog/`.

### Dementor profile content

Four public profile URLs exist, but only Valentin has one approved relation (course). The most visible editorial gap is therefore not more pages, but approved short bios and practice spheres.

## Resolved source conflict

The old `dementor-club/community/onboarding.md` unified v2 psychometric model conflicted with the newer canonical `operations/ONBOARDING_SYSTEM.md` profile-onboarding model.

Resolution on 2026-08-24:
- `operations/ONBOARDING_SYSTEM.md` remains canonical;
- `community/onboarding.md` is now a SUPERSEDED historical stub;
- `/join/` continues to use the nine-sphere profile model.

## Publication priority

Recommended content-filling order without changing architecture:

1. approve short bios + practice spheres for 4 Dementors;
2. approve a second real event record;
3. approve the first Merch object;
4. decide whether the course moves from `approved-draft` to a public active state;
5. approve official Contacts channel;
6. approve Donate/payment mechanics;
7. define Community membership only when the team is ready to operate it.

## Release rule

Before every release run:

```bash
node scripts/validate-site.mjs
node scripts/validate-content-readiness.mjs
```

`FINAL`, `PLACEHOLDER` and `REQUIRES_APPROVAL` are implementation readiness labels only. Canonical facts still belong to their responsible source branches.
