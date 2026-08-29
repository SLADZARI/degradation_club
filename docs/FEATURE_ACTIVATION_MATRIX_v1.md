# Dementor Club — Feature Activation Matrix v1

Status: implementation readiness
Updated: 2026-08-30

| Feature | Public page | Architecture | Source approval | Provider/data | Current state |
|---|---|---:|---:|---:|---|
| Onboarding / DC-9 | `/join/` + `/join/result/` | READY | READY | localStorage + Supabase account sync | STAGING IMPLEMENTED / BROWSER QA PENDING |
| Contact form | `/contacts/` | READY | channel pending | endpoint pending | DISABLED |
| Donate | `/donate/` | READY | payment mechanic pending | recipient/provider pending | DISABLED |
| Merch catalog | `/merch/` + `/catalog/?type=merch` | READY | objects pending | records pending | EMPTY |
| Merch checkout | object page / adapter | READY | sale mechanic pending | provider pending | DISABLED |
| Event lifecycle | `/events/` | READY | READY | event records | LIVE |
| Event registration | event page | ADAPTER READY | registration mechanic pending | URL/provider pending | NOT EXPOSED |
| Community roster | `/community/` | READY | READY | approved roster | LIVE |
| Community membership v1 | `/join/member/` | READY | READY | Supabase / `dc_member_entry_v1` | STAGING IMPLEMENTED / QA + LEGAL UPDATE PENDING |
| Community Board v1 | `/community/board/` | READY | READY | Supabase + private Storage | STAGING IMPLEMENTED / QA PENDING |
| Community Artifact detail | `/community/artifact/:id/` | READY | READY | Supabase + private Storage | STAGING IMPLEMENTED / QA PENDING |
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

`STAGING IMPLEMENTED` means code and provider/data wiring exist on `dementor-club-site`, but the feature is not yet approved for `dementor-club-production`.

## Current code controls

Central config: `/site-config.js`
Runtime adapters: `/service-adapters.js` plus feature-local Community runtime.

Current false flags:
- `contacts.enabled`
- `donate.enabled`
- `merch.checkoutEnabled`
- `events.registrationEnabled`

Community membership is now enabled **only on the staging implementation branch** through:

- `community.membershipEnabled = true`
- `community.membershipProvider = dc_member_entry_v1`
- `community.membershipUrl = /join/member/`
- `community.boardUrl = /community/board/`

This does not activate production because `dementor-club-site` is not the production branch and ordinary git pushes do not publish `dementor.club`.

## Join runtime status

The old duplicate CDN onboarding engine remains removed from the boot path.
`/join-storage-guard.js` remains connected through `/script.js`.

Community v1 adds a second, explicitly separate layer after DC-9:

`DC-9 local result → authenticated account sync → /join/result/ → 9/9 gate → /join/member/ → active membership → /community/board/ → first Artifact`

The diagnostic model is still the nine independent sphere results. Community entry does not create a new aggregate score.

The legacy `/join/apply/` review application is superseded for the v1 Community flow and now redirects to `/join/member/`. Historical application data remains untouched.

## Production blockers for Community v1

Before changing these rows to `LIVE`:

1. browser QA of auth redirect, session restore and local → Supabase DC-9 synchronization;
2. responsive QA at 1440 / 1024 / 768 / 390 / 320;
3. upload QA for the private Artifact bucket and signed-media reads;
4. reaction/response/slot race-condition smoke tests in browser context;
5. Privacy/Terms review for the newly stored Community data: display identity, external contact identity, membership state, Artifacts, reactions and responses;
6. production validation stack;
7. explicit production release approval.
