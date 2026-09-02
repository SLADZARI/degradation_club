# DC-9 Mobile QA Pass v0.1

Status: **QA EVIDENCE / MOBILE QUESTION BASELINE HUMAN-ACCEPTED / RESULT QA NEXT**  
Date: 2026-09-02  
Production authorization: **NO**

## Purpose

This file records the mobile-specific QA findings and human decisions after review of the DC-9 entry-state and mobile-only prototypes. The canonical decision master remains:

`operations/DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md`

This is evidence and implementation guidance, not a competing source-of-truth.

## Human review status

Desktop entry-state/copy direction: **accepted as working direction**.

Mobile entry/question direction: **human-reviewed and accepted as the working baseline** on 2026-09-02.

This acceptance means the next implementation pass should use the mobile v2 principles below. It does **not** authorize production deployment; real viewport/browser QA and implementation QA are still required.

## Accepted mobile baseline

Keep the DC-9 diagnostic mechanic itself:

- 4 answer choices;
- one scene at a time;
- explicit `ДАЛЬШЕ`;
- `К СФЕРАМ` in upper navigation;
- LONG typography direction;
- selected answer remains editable until progression.

The accepted change is in **mobile presentation mechanics**.

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

The full radar/result belongs on the canonical result route after opening the map.

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

## Accepted QA artifact

Implementation branch:

`dementor-club-site`

Internal noindex route/file:

`design-system/dc9-mobile-qa/index.html`

The reviewed prototype contains five mobile states:

1. short/ordinary question;
2. long question;
3. partial guest;
4. completed authenticated map-entry state;
5. active member state.

Human review outcome: **direction accepted**.

## Next mobile QA layer: result/map

The next QA target is the canonical `/join/result/` experience on mobile.

Do not invent a new chart. Preserve Graph Linked Cards v6 semantics:

- 9 independent radar axes;
- center = 0;
- outside = 5;
- one node per sphere;
- three presentation-selected points may be highlighted for contrast only;
- no aggregate score;
- no polygon-area score;
- mobile legend explicitly maps sphere → level;
- all nine results remain accessible;
- `ТРИ ЗАМЕТНЫЕ ТОЧКИ` is not a ranking;
- dossier/share uses the same nine factual results.

Mobile result QA should test a staged reading flow rather than one very long undifferentiated page:

1. `ВОТ ВАША КАРТА` + radar + mobile legend;
2. `ТРИ ЗАМЕТНЫЕ ТОЧКИ`;
3. `ОСТАЛЬНАЯ КАРТА`;
4. `ЗАБРАТЬ С СОБОЙ` / dossier + share;
5. final club route, resolved from account/membership state.

QA artifact target:

`dementor-club-site/design-system/dc9-mobile-result-qa/index.html`

## Required real viewport QA

Before production, verify with true viewport rendering at minimum:

- 430×932;
- 390×844;
- 375×812 where practical;
- 320 narrow fallback.

For question screens test both a short and one of the longest real DC-9 scenes.

For result screens test:

- complete 9/9 map;
- long sphere names in legend (`САМОРАЗВИТИЕ`, `ПОТРЕБЛЕНИЕ`, `ОТНОШЕНИЯ`);
- three highlighted points;
- six remaining cards;
- dossier preview/export actions;
- authenticated non-member continuation;
- active-member continuation.

## Remaining mobile release blockers

The next production candidate remains blocked if any of the following remains true:

- public headline/text leaves the viewport unintentionally;
- primary CTA is hidden behind unnecessary first-screen content;
- long scene + decision area becomes difficult to navigate;
- selected answer cannot be changed before progression;
- sticky action area covers answer text;
- safe-area/home-indicator overlaps progression controls;
- 320px fallback has horizontal overflow;
- member state still presents the test as the primary entry;
- completed-map entry state forces the user through a full radar before the next action;
- result radar loses the meaning of nine independent axes on mobile;
- mobile legend clips long sphere names or hides levels;
- highlighted points read as a rank/podium;
- result CTA order contradicts resolved account/membership state.

## Current QA conclusion

The mobile entry/question redesign is no longer an open design question. It is the **accepted implementation direction**, subject to real browser QA.

The active design question now moves to **mobile result/map composition with the canonical Graph Linked Cards v6 radar**.

No production deploy is authorized by this file.