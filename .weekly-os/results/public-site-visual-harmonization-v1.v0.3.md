---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.3
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
---

# MP | Dementor Club | BUILD | Public Site Visual Harmonization v1 | v0.3

## Goal
Close live visual/editorial defects discovered immediately after the first production release of Public Site Visual Harmonization v1 without broadening scope or touching protected product/runtime boundaries.

## Release evidence before corrective pass
- original implementation PR: `#138`;
- validated candidate: `46e2ee37944e9535330f3e1a2b14e70eafc7eec8`;
- G6 run: `#912` / `34319014791` / SUCCESS;
- production merge commit: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`;
- production deploy run: `#50` / `34357305018` / SUCCESS;
- Pages artifact: `10106288390`;
- deploy checkout log: exact `dementor-club-production` commit `0f19e52c17a700b7e477cab0fca8f98bffaf441c`.

## Live smoke result
**FAILED / CORRECTIVE PASS REQUIRED**

User screenshots from the deployed public site exposed defects that the first browser matrix did not cover:
1. Home `/` Fuengirola feature renders two event image treatments: the route-specific full banner plus a legacy shared `visual-standard-v2.css` pseudo-image overlay.
2. The same Home feature renders two Gabil identity treatments: semantic runtime relation plus legacy decorative CTA pseudo-portrait/copy.
3. `/events/` still exposes overly internal editorial wording (`Пустое состояние — тоже данные`, `канонической записи события`).
4. `/merch/` hero still exposes internal taxonomy language (`OBJECT / WEAR / DROP сущности`, `WORKING ASSETS`, `MERCH CONTRACT`).

The screenshots also support that `/events/fuengirola/` and `/community/gabil/` are visually consistent with the intended first-pass harmonization, so the corrective patch remains narrowly scoped.

## Corrective ownership
Implementation branch remains the single Result integration branch: `agent/public-site-visual-harmonization-v1`.
It was fast-forwarded to exact production commit `0f19e52c17a700b7e477cab0fca8f98bffaf441c` before corrective mutation.

### Home Fuengirola
Canonical route owner remains `home-event-fuengirola-20260828.css`.
- keep one full event banner as the section background;
- explicitly neutralize the older shared `visual-standard-v2.css` event pseudo-layer in the route owner;
- keep the semantic Gabil relation injected by `dementor-relations-v1.js`;
- remove the legacy decorative Gabil pseudo-treatment attached to the CTA;
- mobile CTA spacing is reduced after decorative treatment removal.

### Events copy
Keep lifecycle/status structure unchanged. Replace implementation-facing explanation with public editorial language without inventing date, price, venue, registration or other facts.

### Merch copy
Keep current entity/product/sales state unchanged. Replace internal taxonomy phrasing with public-facing club language.

## Regression guards
The existing harmonization validators are extended to fail on:
- Home Fuengirola duplicate pseudo-image overlay;
- Home Fuengirola more/less than one semantic Gabil relation after runtime;
- decorative Gabil CTA pseudo-treatment;
- return of the exact internal Events/Merch phrases removed in this corrective pass.

The same built `_site` browser matrix remains required at `1440 / 1024 / 768 / 390 / 360`.

## Hard boundaries
No changes to Global Header, auth/OAuth, Membership, DC-9, Workspace, Board, Supabase, checkout semantics or event registration semantics.
Board Result remains `WAITING`.

## Authorization
The user explicitly authorized the corrective implementation with `да просто сделай` after reviewing production screenshots.
This authorizes implementation/validation only.

- corrective production merge authorized: **false**;
- corrective production deploy authorized: **false**;
- live DB mutation: **not required / not authorized**.

## Gate
Return to **G5_BUILD** for corrective implementation, then rerun full G6 before any new production merge/deploy.