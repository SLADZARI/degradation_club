# Dementor Club — Community Artifact Card Contract v1

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v1**  
DATE: **2026-08-30**  
SCOPE: Community Artifact card fields, presentation variants, text limits, multilingual behavior, interaction states  
IMPLEMENTATION TARGET: `dementor-club-site`

This document extends `MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md` and `COMMUNITY_BOARD_ACCESS_AND_SPATIAL_MODEL_V2.md` without changing the canonical Artifact identity or promotion model.

A notice may look event-like, contain a date, place or countdown, but it remains an `Artifact` until an explicit Club/product action promotes it into an approved Event/Course/Project/Practice/other entity.

## 1. Card principle

The Board must not force every Artifact into one fixed card template.

The card footprint and visible modules are derived from the fields actually present.

Approved modules:

- author identity;
- Artifact short identifier;
- optional title;
- required body;
- optional one image;
- optional external link;
- optional start date/time;
- optional expiry date/time;
- optional human-readable location;
- computed timer/countdown when a future start/expiry makes it useful;
- reaction count;
- response count where permitted;
- status marker;
- ownership marker for the current Member;
- source/provenance marker for Club/historical Artifacts where applicable.

The absence of a module must not leave an empty placeholder.

## 2. Approved visual/card variants

These are presentation variants, not separate mature entity types:

1. `TEXT_MINIMAL` — body only plus author/system metadata.
2. `TITLE_TEXT` — title + body.
3. `IMAGE_TEXT` — image + optional title + body.
4. `DATED` — start and/or expiry information.
5. `COUNTDOWN` — future start/expiry rendered with a live timer.
6. `LOCATION` — human-readable place shown.
7. `DATED_LOCATION` — date/time + place; may visually resemble an invitation/event notice but remains Artifact.
8. `LINKED` — external URL present.
9. `PERSISTENT` — no expiry.
10. `EXPIRING` — active Artifact with expiry.
11. `OWN` — current Member's Artifact; may expose own-only movement/close controls.
12. `LOCKED_INTERACTION` — readable full Board Artifact for `MEMBER_ACTIVE / FIRST_ARTIFACT_REQUIRED`, but reaction/response controls locked.
13. `PUBLIC_PREVIEW` — teaser-safe projection only, used in fog-of-war/public preview.
14. `EXPIRED_ARCHIVE` — historical/archive presentation outside the current active Board when implemented.
15. `SOURCE_BACKED_CLUB` — Club/historical Artifact with provenance marker.

Multiple variants may apply to one Artifact simultaneously, e.g. `IMAGE_TEXT + DATED_LOCATION + COUNTDOWN + LINKED`.

## 3. Field contract and limits

### Required canonical field

`body`
- required for Member notice;
- maximum **4000 user-perceived characters**;
- line breaks allowed;
- multilingual Unicode text allowed;
- no HTML supplied by users; render escaped/sanitized text.

### Optional title

`title`
- optional;
- maximum **160 user-perceived characters**;
- multilingual Unicode text allowed;
- line breaks not allowed in the input value;
- interface may visually clamp title on compact cards but full title must remain available in Artifact detail.

### Optional external URL

`external_url`
- optional;
- maximum **1000 characters**;
- server accepts only `http://` / `https://` according to v1 QA clarification;
- interface may normalize hostname-like input to `https://` before RPC;
- external links use safe browser semantics.

### Optional location

`location_label`
- optional human-readable place label;
- maximum **180 user-perceived characters**;
- multilingual Unicode text allowed;
- examples of shape only: venue name, neighborhood, city, address fragment, `online` label;
- this field does not create an Event entity and does not imply verified geocoding;
- precise coordinates/map integration are not part of this contract.

### Optional temporal fields

`starts_at`
- optional ISO timestamp.

`expires_at`
- optional ISO timestamp;
- cannot be in the past at creation/update time;
- empty means persistent Artifact.

### Timer

Timer is **computed presentation**, not author-entered free text.

If `starts_at` is future, UI may show `ДО НАЧАЛА` countdown.
If `expires_at` is future and relevant, UI may show `ЕЩЁ ДЕЙСТВУЕТ` / expiry countdown.
When threshold is reached, client refreshes presentation and server remains authoritative for status.
No timer value is stored as canonical text.

### Media

First stable release:
- maximum **1 image**;
- maximum **4 MiB**;
- JPG / PNG / WebP only;
- private Community bucket;
- alt/accessible description should be derived from author-provided context where available; a separate editable alt field is not yet required by this v1 contract.

### Reaction/response metadata

`reaction_count`
- computed/read model field, not author input.

`response_count`
- computed/read model field, not author input;
- detailed response content remains permission-gated.

Response message:
- optional;
- maximum **2000 user-perceived characters**;
- only `MEMBER_ACTIVATED` may submit a response to another Member's Artifact;
- author self-response remains prohibited.

### Secondary/system metadata

Card may display compact secondary data when useful:
- short Artifact identifier;
- publication time/date;
- status;
- author display name;
- reaction count;
- response count;
- provenance/source marker;
- own-card marker.

System metadata is not manually editable card copy.

## 4. Multilingual and character counting rules

Community text inputs are Unicode-first.

The interface must not restrict text to Latin/Cyrillic or to a fixed keyboard layout.

Allowed input includes any Unicode text that the user's browser/OS can enter and the selected font fallback can render, including mixed scripts and emoji.

Implementation requirements:

- UTF-8 end-to-end storage/transport;
- do not uppercase user-authored body text in CSS;
- do not apply letter-spacing assumptions that damage Arabic/Indic/Asian scripts;
- apply `dir=auto` to user-authored title/body/location where practical so RTL scripts render correctly;
- use a broad system font fallback stack; missing glyphs fall back to OS/browser fonts;
- limits should be presented to the user as **user-perceived characters** (grapheme clusters) where the client platform supports `Intl.Segmenter`; server validation must remain authoritative and Unicode-safe;
- emoji or combining sequences should not be intentionally split by visual truncation.

Recommended UI font fallback for user content:

`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif`

Brand/display typography may remain separate where it supports the required glyphs.

## 5. Content-driven footprint

Authors do not choose arbitrary card width/height.

Card size is calculated by presentation from content/modules.

Suggested buckets:
- `XS` — short text, no media;
- `S` — normal short notice;
- `M` — longer text or several metadata modules;
- `L` — image and/or rich date/location content;
- `XL` should be avoided on the spatial Board; very long text opens in detail rather than monopolizing world space.

The Board may clamp body preview by card bucket. Full body always remains accessible in Artifact detail to authorized readers.

No manual free resize in v1.

## 6. Interaction contract by user state

### ANONYMOUS / PUBLIC_PREVIEW
May:
- pan/observe approved preview region;
- read only preview-safe teaser modules.

May not:
- read protected full Artifact payload;
- create;
- react;
- respond;
- access private media/contact data.

Any meaningful interaction opens entry CTA and preserves safe `return_to` context.

### AUTHENTICATED / ONBOARDING_INCOMPLETE
Same protected-data boundary as public preview, plus onboarding progress/continue action.

### MEMBER_ACTIVE / FIRST_ARTIFACT_REQUIRED
May:
- explore/read full authenticated Board;
- open Artifact detail;
- use approved navigation/filter routes;
- create/publish first Artifact.

May not:
- react to another Artifact;
- respond to another Artifact.

Locked controls remain visible and explain: `Сначала займите своё место.`

### MEMBER_ACTIVATED
May:
- react/respond to other Members' Artifacts;
- open detail;
- use navigation/filters;
- move own Artifact only where movement is enabled;
- close/retire own Artifact according to slot rules.

## 7. Detail/open behavior

A click/tap on an authorized readable card opens/focuses a detail surface that preserves Board context.

Detail should expose all authorized available modules without card-preview clamping.

Preferred behavior:
- desktop: modal/drawer/focused overlay or dedicated Artifact route with return-to-position state;
- mobile: full-height detail sheet/route;
- stable canonical Artifact URL remains `/community/artifact/{id}/` or the existing route contract;
- closing detail returns to prior Board camera position when possible.

## 8. Location and event-like notices

A Member may write a notice such as a meeting/invitation and include `starts_at`, `expires_at`, `location_label`, image and link.

This does **not** change its entity type automatically.

Canonical promotion remains explicit:

`ARTIFACT → INTEREST → ACTIVITY → EVENT / COURSE / PROJECT / PRACTICE / OTHER APPROVED ENTITY`

No visual card module is allowed to silently promote semantics.

## 9. Timer rules

Countdown is contextual:
- days/hours when more than 24h remain;
- hours/minutes within 24h;
- minutes within 1h;
- no seconds required on normal Board cards to avoid visual noise;
- detail may update more frequently if useful;
- expired state must not rely on client clock alone.

Timer should not displace the actual date/time; the absolute date/time remains available in detail and may also be visible on the card.

## 10. Prototype / entity gallery requirements

Before production integration, maintain an interaction gallery containing at least:

- minimal text;
- title + text;
- image;
- long text/clamped preview;
- date only;
- expiry only;
- countdown;
- location only;
- date + location;
- image + date + location + countdown;
- linked notice;
- persistent notice;
- own Artifact;
- locked interaction state;
- public preview/fog-safe teaser;
- expired/archive example;
- source-backed Club example;
- multilingual mixed-script example;
- RTL example;
- max-title/max-body stress examples.

The gallery must allow switching access state:

`OUTSIDER / ONBOARDING / FIRST_ARTIFACT_REQUIRED / MEMBER_ACTIVATED`

and must demonstrate the corresponding action gating.

## 11. Security and rendering

- escape/sanitize all user text;
- never render raw user HTML;
- safe external link attributes;
- private media URLs remain signed/permission-gated;
- public preview receives only preview projection fields;
- reaction/response permission must be server-enforced;
- card movement must be author-authorized server-side;
- visual lock/fog is never used as the only data-security boundary.

## 12. Definition of Done

This card contract is implemented when:

1. every approved module has a deterministic visible state;
2. absent optional data does not create empty UI chrome;
3. all text limits are enforced with Unicode-safe validation;
4. multilingual/RTL samples remain usable;
5. card preview can clamp without losing full detail;
6. timer derives from timestamps rather than author text;
7. location does not imply Event promotion;
8. media follows 1 image / 4 MiB / JPG-PNG-WebP policy;
9. access-state controls behave according to Board v2;
10. the prototype entity gallery demonstrates all listed combinations before production Board replacement.
