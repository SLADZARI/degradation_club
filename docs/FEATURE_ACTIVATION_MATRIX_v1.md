# Dementor Club — Feature Activation Matrix v1

Status: implementation readiness

| Feature | Public page | Architecture | Source approval | Provider/data | Current state |
|---|---|---:|---:|---:|---|
| Onboarding | `/join/` | READY | READY | localStorage | LIVE |
| Contact form | `/contacts/` | READY | channel pending | endpoint pending | DISABLED |
| Donate | `/donate/` | READY | payment mechanic pending | provider pending | DISABLED |
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

## Known technical follow-up

`/join-storage-guard.js` exists as a capability guard but is not yet wired into the legacy Join boot path. The current onboarding itself is live and stores data in `localStorage`; this guard must be wired during the next safe Join runtime consolidation rather than by risking a partial rewrite of the pinned scoring engine.
