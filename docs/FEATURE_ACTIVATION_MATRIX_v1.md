# Dementor Club — Feature Activation Matrix v1

Status: implementation readiness
Updated: 2026-08-24

| Feature | Public page | Architecture | Source approval | Provider/data | Current state |
|---|---|---:|---:|---:|---|
| Onboarding | `/join/` | READY | READY | localStorage | LIVE / LIVE QA PENDING |
| Contact form | `/contacts/` | READY | channel pending | endpoint pending | DISABLED |
| Donate | `/donate/` | READY | payment mechanic pending | recipient/provider pending | DISABLED |
| Merch catalog | `/merch/` + `/catalog/?type=merch` | READY | objects pending | records pending | EMPTY |
| Merch checkout | object page / adapter | READY | sale mechanic pending | provider pending | DISABLED |
| Event lifecycle | `/events/` | READY | READY | event records | LIVE |
| Event registration | event page | ADAPTER READY | registration mechanic pending | URL/provider pending | NOT EXPOSED |
| Community roster | `/community/` | READY | READY | approved roster | LIVE |
| Community membership | `/community/` + `/join/` | ADAPTER READY | membership mechanic pending | URL/provider pending | NOT EXPOSED |
| Course page | `/courses/dumai-s-opasnostyu/` | READY | approved-draft | no provider required | DRAFT PUBLIC URL |
| Archive | `/archive/` | READY | READY | completed/cancelled records pending | EMPTY |

## Activation discipline

`READY` means the site architecture can accept the feature without redesign.
It does not mean the feature is publicly available.

A feature may move to LIVE only after all applicable columns are confirmed:
1. source-of-truth approval;
2. data/provider configuration;
3. privacy/terms impact check;
4. production test;
5. public status update.

## Current code controls

Central config: `/site-config.js`
Runtime adapters: `/service-adapters.js`

Current false flags:
- `contacts.enabled`
- `donate.enabled`
- `merch.checkoutEnabled`
- `events.registrationEnabled`
- `community.membershipEnabled`

These must not be enabled from design copy alone.

## Join runtime status

The old duplicate CDN onboarding engine has been removed from the boot path.
`/join-storage-guard.js` is connected through `/script.js`.
Join currently uses one scoring engine and a fail-closed localStorage capability preflight.

Remaining Join work is live browser QA, responsive verification and production persistence testing after a successful deployment.
