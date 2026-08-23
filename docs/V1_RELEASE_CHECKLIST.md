# Dementor Club — V1 Release Checklist

Status: release-prep
Branch: `dementor-club-site`
Date: 2026-08-24

Этот документ отделяет готовность кода от внешних блокеров и неутверждённых данных.

## 1. Architecture — READY

- [x] Home `/`
- [x] About `/about/`
- [x] Events `/events/`
- [x] Event entity `/events/fuengirola/`
- [x] Projects `/projects/`
- [x] Logic & Awareness `/projects/logic-awareness/`
- [x] Community `/community/`
- [x] Dementor profiles: Valentin / Nikita / Evgeniy / Gabil
- [x] Merch `/merch/`
- [x] Join `/join/`
- [x] Course `/courses/dumai-s-opasnostyu/`
- [x] Catalog `/catalog/`
- [x] Archive `/archive/`
- [x] Support `/donate/`
- [x] Contacts `/contacts/`
- [x] Privacy `/legal/privacy/`
- [x] Terms `/legal/terms/`
- [x] 404

## 2. Content system — READY

- [x] Entity Contract
- [x] `content/registry.json`
- [x] event record
- [x] project record
- [x] 4 dementor records
- [x] course record
- [x] templates for Event / Project / Merch / Course / Dementor
- [x] Publishing Playbook
- [x] Operations Runbook
- [x] Feature Activation Matrix
- [x] canonical source responsibilities preserved

## 3. Runtime — READY

- [x] one Join scoring engine only
- [x] Join localStorage guard
- [x] Join fail-closed storage fallback
- [x] Contacts adapter with validation and timeout
- [x] Donate provider adapter, disabled until approval
- [x] Merch checkout adapter, disabled until approval
- [x] Event registration adapter, disabled until source status allows it
- [x] Community membership adapter, disabled until membership mechanics are approved
- [x] centralized `site-config.js`
- [x] reduced-motion support

## 4. Accessibility — READY AT CODE LEVEL

- [x] keyboard focus states
- [x] form focus states
- [x] skip to content
- [x] `aria-current` for active navigation
- [x] menu `aria-controls`
- [x] disabled actions are fail-closed
- [x] contact status uses live region
- [x] storage failure uses alert semantics

Browser/screen-reader manual pass remains part of live QA.

## 5. SEO / navigation — READY AT CODE LEVEL

- [x] title/description baseline
- [x] shared canonical runtime
- [x] normalized `og:url`
- [x] sitemap
- [x] robots sitemap declaration
- [x] entity URLs included in sitemap
- [x] internal-link/asset/anchor validator
- [x] 404 route

Dedicated final OG artwork is intentionally deferred with the illustration work.

## 6. Automated release gate — READY

Required command before release:

```bash
node scripts/validate-site.mjs
```

GitHub workflow:

`.github/workflows/site-integrity.yml`

Validator checks:

- registry ↔ records;
- required fields / provenance;
- unique IDs / URLs;
- orphan records;
- public route existence;
- sitemap / robots / canonical origin;
- service feature flags;
- adapter boot order;
- Join bootstrap invariants;
- course/public status conflicts;
- registration/membership lifecycle conflicts;
- internal links / scripts / styles / assets / anchors;
- 404 presence/noindex warning.

## 7. Requires approval/data — NOT A CODE BLOCKER

### Contacts
- [ ] official public email
- [ ] social links
- [ ] optional phone/address
- [ ] form endpoint/provider

### Donate
- [ ] recipient/legal receiver
- [ ] payment provider
- [ ] checkout URL
- [ ] currency
- [ ] recurring policy

### Merch
- [ ] first approved OBJECT record
- [ ] statement
- [ ] material
- [ ] edition
- [ ] price
- [ ] availability
- [ ] checkout provider

### Community
- [ ] membership format
- [ ] roles
- [ ] internal channels
- [ ] rituals/activities
- [ ] membership provider or approved destination

### Fuengirola
- [ ] date/time
- [ ] venue
- [ ] duration
- [ ] programme
- [ ] price
- [ ] participation terms
- [ ] registration mechanic
- [ ] organizers/participants if public

### Dementors
- [ ] approved stories where pending
- [ ] approved spheres/practices where pending

### Course
- [ ] source status change from `approved-draft` before public ACTIVE claim/catalog placement

## 8. Visual assets — DEFERRED BY DECISION

- [ ] final high-resolution Dementor Ink assets
- [ ] dedicated route OG images
- [ ] final licensed typography if/when assets are supplied

These are not to be fabricated by the site implementation branch.

## 9. External release blocker

Current available GitHub commit status reports Vercel failure caused by `build-rate-limit`.

This is an infrastructure/deployment blocker, not evidence of a code validation failure.

Before declaring V1 LIVE:

1. Vercel build must be allowed again.
2. Deploy current `dementor-club-site` HEAD.
3. Run `node scripts/validate-site.mjs` in CI successfully.
4. Perform live browser pass on production URL.
5. Test 360 / 390 / 430 / 768 / desktop widths.
6. Test keyboard-only navigation.
7. Test Join persistence/reload.
8. Confirm disabled features remain disabled.
9. Confirm sitemap/robots/canonical on production.
10. Only then mark V1 LIVE.

## Release state

**CODE / STRUCTURE: V1 READY**

**PUBLIC DATA: PARTIALLY PENDING APPROVAL**

**VISUAL ASSETS: DEFERRED**

**PRODUCTION DEPLOYMENT: BLOCKED BY CURRENT VERCEL BUILD RATE LIMIT / REQUIRES LIVE VERIFICATION**
