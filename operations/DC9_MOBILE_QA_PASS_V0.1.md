# DC-9 Mobile QA Pass v0.1

Status: **QA EVIDENCE / CHILD RECORD OF `DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md`**  
Date: 2026-09-02  
Production authorization: **NO**

## Purpose

This file records the mobile-specific QA findings discovered after human review of the DC-9 entry-state QA screens. The canonical decision master remains:

`operations/DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md`

This is evidence and implementation guidance, not a competing source-of-truth.

## Human review status

The desktop entry-state/copy direction was reviewed and accepted as the working direction.

Mobile remains **NOT READY FOR PRODUCTION**.

Observed human-review issue:

- some mobile headlines/text blocks can leave the intended viewport or produce unstable line breaks;
- the current mobile composition still behaves too much like a reduced desktop page;
- large map/community blocks can push the primary action too far down;
- long question scenes and four answers need a clearer decision-zone composition.

## Current assessment

Desktop direction: approximately **8.5/10 / implementation-ready direction**.

Mobile direction before this pass: approximately **6/10 / separate design pass required**.

The problem is not the DC-9 diagnostic mechanic itself. Keep:

- 4 answer choices;
- one scene at a time;
- explicit `ДАЛЬШЕ`;
- `К СФЕРАМ` in upper navigation;
- LONG typography direction as the visual baseline.

The change is in **mobile presentation mechanics**.

## Mobile v2 principles

### 1. Mobile is not scaled desktop

Use dedicated mobile composition and typography roles. Do not rely on one `vw` headline formula for all copy lengths.

Headlines must use controlled size ranges and approved line breaks so long account/member states do not clip or create accidental compositions.

### 2. Primary action before heavy evidence

On entry/member states, the primary action should normally appear in the first mobile viewport.

Preferred order:

`state → short explanation → PRIMARY CTA → secondary evidence/object`

Do not force a user to scroll through a large radar/map/community illustration before reaching the action they came for.

### 3. Completed map uses a teaser on entry

For completed DC-9 users, the entry screen should not repeat the full result presentation.

Use a compact map teaser:

`МОЯ КАРТА DC-9 / 9 из 9 / ОТКРЫТЬ →`

The full radar/result belongs on the result route after opening the map.

### 4. Active member screen is minimal

For an authenticated active member, `/join/` is an entry resolver, not onboarding.

Preferred mobile hierarchy:

**ЛЮДИ ЕСТЬ. ВЫ ТОЖЕ.**

`Клуб уже происходит. Вы в нём уже есть.`

Primary: `ВОЙТИ В COMMUNITY →`

Secondary: `МОЯ КАРТА DC-9`

Tertiary: `МОЙ АККАУНТ`

Large Community promotional content comes after these actions, if shown at all.

### 5. Question screen uses two zones

Mobile question composition:

**Upper / scene zone**

- `← СФЕРЫ`;
- sphere name;
- `02 / 06`;
- progress;
- scene;
- one quiet Dementor fixation.

**Lower / decision zone**

- `Что вы делаете?`;
- four answer rows;
- selection state;
- reaction/status;
- `ДАЛЬШЕ →`.

The answer area should feel like a decision surface rather than the continuation of a long editorial article.

### 6. Selection behavior

After tap:

- keep all four answers visible;
- visibly mark the selected answer;
- allow changing selection until `ДАЛЬШЕ`;
- enable `ДАЛЬШЕ` only after a selection;
- reaction stays short and does not push the primary action away.

Do not collapse the other choices after selection.

## QA artifact

Implementation branch:

`dementor-club-site`

Internal noindex route/file:

`design-system/dc9-mobile-qa/index.html`

The prototype contains five mobile states:

1. short/ordinary question;
2. long question;
3. partial guest;
4. completed authenticated map state;
5. active member state.

It is simulation-only and must not write auth, membership or assessment data.

## Required real viewport QA

Do not treat a CSS-sized mock-device inside a desktop viewport as final responsive evidence. CSS media queries follow the browser viewport unless the test uses a proper iframe/container strategy.

Before production, verify with true viewport rendering at minimum:

- 430×932;
- 390×844;
- 375×812 where practical;
- 320 narrow fallback.

For question screens also test short and longest real DC-9 scenes.

## Mobile release blockers

The next production candidate remains blocked if any of the following remains true:

- public headline/text leaves the viewport unintentionally;
- primary CTA is hidden behind unnecessary first-screen content;
- long scene + decision area becomes difficult to navigate;
- selected answer cannot be changed before progression;
- sticky action area covers answer text;
- safe-area/home-indicator overlaps progression controls;
- 320px fallback has horizontal overflow;
- member state still presents the test as the primary entry;
- completed-map state forces the user through a full radar before the next action.

## Next QA decision

Human review should compare the mobile-only prototype against the current live/QA mobile behavior and decide whether the two-zone question layout and CTA-first entry composition become the implementation baseline.

No production deploy is authorized by this file.