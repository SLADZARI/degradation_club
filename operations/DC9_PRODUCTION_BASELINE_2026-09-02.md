# DC-9 — production baseline 2026-09-02

Status: **APPROVED / PRODUCTION BASELINE**
Date: 2026-09-02

## Role

DC-9 is the onboarding diagnostic of Dementor Club.

Public route:

`/join/`

Canonical result route:

`/join/result/`

The diagnostic does not produce one aggregate personality score. It produces nine independent sphere results.

## Instrument contract

The approved production instrument contains:

- 9 spheres;
- 6 scenes per sphere;
- 54 scenes total;
- 4 thematic scenes + intentionality guard + responsibility guard per sphere;
- exactly four public exits per scene;
- one hidden canonical evidence state `0 / 1 / 2 / 3` per scene;
- answer order shuffled at runtime;
- guards do not add score; they only cap unsupported high results.

Approved sphere order:

1. Личность
2. Работа
3. Потребление
4. Отношения
5. Контроль
6. Информация
7. Саморазвитие
8. Смысл
9. Технологии

## Public content baseline

Production content is the combined approved snapshot of:

1. `drafts/dc9-question-lab/BANK_V0.6_FULL_54_IMMERSIVE.md` v0.6.4 as the 54-scene structural/content base;
2. `drafts/dc9-question-lab/PATCH_2026-09-01_Q06_Q07_PLAYTEST.md` for the latest Q06/Q07 corrections;
3. the final public 54×4 answer-copy layer approved in editorial review on 2026-09-01;
4. the final reaction layer: prepared score-specific reactions, used selectively rather than after every answer;
5. three evidence-based callback opportunities from earlier answers.

The production website must ship this snapshot locally. It must not fetch the draft branch at runtime.

## Scoring v0.9

Each sphere uses a weighted average of the four thematic answer scores.

Weights and core questions:

1. Personality — `[1.00, 1.50, 1.50, 1.00]`, core `[1,2]`
2. Work — `[1.25, 1.50, 1.25, 1.50]`, core `[1,3]`
3. Consumption — `[1.25, 1.50, 1.00, 1.25]`, core `[0,1]`
4. Relationships — `[1.50, 1.25, 1.50, 1.25]`, core `[0,2]`
5. Control — `[1.00, 1.25, 1.25, 1.50]`, core `[2,3]`
6. Information — `[1.00, 1.25, 1.50, 1.50]`, core `[2,3]`
7. Self-development — `[1.25, 1.50, 1.50, 1.00]`, core `[1,2]`
8. Meaning — `[1.00, 1.25, 1.25, 1.50]`, core `[1,3]`
9. Technology — `[1.25, 1.50, 1.25, 1.50]`, core `[1,3]`

Weighted-average thresholds:

- level 0: `< 0.35`
- level 1: `0.35–0.94`
- level 2: `0.95–1.29`
- level 3: `1.30–1.69`
- level 4: `1.70–2.14`
- level 5: `>= 2.15`

Core gate for level 5:

- both configured core thematic questions must score `>= 2`;
- otherwise a base level 5 is capped to 4.

Guard caps:

- responsibility = 0 → max public level 2;
- intentionality = 0 → max public level 3;
- either guard = 1 → max public level 4;
- both guards >= 2 → no additional cap.

## Public level labels

0 — **Неприлично функционален**

1 — **Первые нарушения режима**

2 — **Деградация началась**

3 — **Стабильно хуже**

4 — **Случай запущен**

5 — **Показано дементорство**

Level 5 is a result in a sphere. It does not by itself rename the person a Dementor.

Special all-nine level-5 state:

- `К ДЕМЕНТОРСТВУ ГОТОВ.`
- `Девять из девяти.`
- `Дальнейшая диагностика не требуется.`
- `Срочно в клуб.`

This is not level 6 and not a psychotype.

## Result presentation

Current production presentation is Graph Linked Cards v6.

Rules:

- nine independent radar axes;
- center = 0, edge = 5;
- no aggregate score and no interpretation of polygon area as a score;
- three highlighted sphere results are selected for visual contrast, not rank;
- no public `01–09` numbering on radar/legend as a ranking signal;
- mobile preserves all nine sphere values;
- final route continues to membership/community flow already implemented by the site runtime.

Approved result-copy refinements:

- `ТРИ ЗАМЕТНЫЕ ТОЧКИ`;
- `Они выделены для контраста. Мест не присуждаем.`;
- `ОСТАЛЬНАЯ КАРТА` / `ОСТАЛЬНЫЕ СФЕРЫ.`;
- `ЗАБРАТЬ С СОБОЙ.`;
- graph note: `ЦЕНТР — 0 · КРАЙ — 5 · КАЖДАЯ ОСЬ СЧИТАЕТСЯ ОТДЕЛЬНО` and `ПЛОЩАДЬ УЛУЧШАТЬ НЕ ТРЕБУЕТСЯ.`;
- ordinary final copy: `Можно оставить всё как есть. Можно продолжить деградацию среди своих.`

## User-state compatibility

The production release must preserve the existing account/backend contract.

Canonical browser key remains:

`dementorClubOnboardingV3`

Canonical backend assessment version remains:

`dc9-v1`

Reason: this version identifies the stable nine-sphere semantic assessment contract used by Supabase/account/community sync. The immersive UI/content release does not create a new backend assessment family.

A separate UI version may be stored locally, e.g.:

`dc9-immersive-v1`

Migration rule:

- preserve completed `results`;
- normalize legacy `self-development` to `self_development`;
- do not silently discard completed local/remote sphere history;
- an incomplete `active` state from an older UI must not resume at the same screen index in the new 54-scene UI;
- archive that old active state locally if useful, clear `active`, then start/resume through the new picker;
- new completed sphere results should include raw `tagScores`, compatibility `tagLevels`, final `level`, `base`, guard scores, `date`, UI version and scoring version.

## Release boundary

Implementation path:

`dementor-club → approved DC-9 baseline → dementor-club-site → QA → dementor-club-production → manual deploy`

Do not deploy the standalone editorial/playtest HTML directly. Production `/join/` must remain integrated with the current result, authentication, account sync, membership and Community routes.

This baseline supersedes conflicting older public level labels, aggregate-style result wording, and older onboarding presentation clauses while preserving the existing nine-sphere backend/user-state contract.
