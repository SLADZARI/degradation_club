# ДУМАЙ С ОПАСНОСТЬЮ — Prototype v0.2 Technical Task

Status: internal implementation task / ready for prototype iteration
Date: 2026-08-25
Tester: **Yauhen**
Test status: **manual end-to-end walkthrough completed**
Tested prototype: `prototype/dumai-s-opasnostyu-v0-1`
Prototype route: `/prototypes/dumai-s-opasnostyu-v01/`
Prototype implementation commit: `8b6f0072c9ff2c1e2060f44f63ff373fd8866812`
Frozen product reference: `courses/dumai-s-opasnostyu-production-prototype-v0.1.md`
Frozen reference commit: `ce404490fe43c525b81af14b1cfdc86e6e1b0c07`
Canonical course: `courses/dumai-s-opasnostyu.md` — **do not change during prototype iteration**.

## Purpose

Зафиксировать результаты первого реального прохождения prototype v0.1 и техническое задание на v0.2. Документ является внутренним источником для weekly report и следующей UX/product итерации. Он не меняет approved course facts и не является production implementation contract.

## Test result

**Протестировал: Yauhen.**

Прототип успешно проходится end-to-end и подтверждает базовую механику:
- выбор направления;
- одно реальное решение;
- исходная/текущая уверенность;
- 7 модулей;
- обязательные ответы;
- предпосылки и их классификация;
- premortem;
- сигналы;
- красные линии;
- цена ошибки / цена бездействия / Plan B;
- финальное решение;
- Карта опасности;
- сертификат;
- локальное сохранение состояния.

При этом v0.1 ощущается скорее как **длинная форма с накоплением данных**, чем как последовательный авторский курс. Основной gap — UX pacing и реакция системы на качество содержания ответов.

## Product conclusions after test

1. Сохранить механику `одно решение → 7 блоков → финальный verdict`.
2. Сохранить личный голос Валентина и усилить его роль.
3. Не использовать снижение confidence как KPI. Курс уменьшает необоснованную уверенность; итоговая уверенность может снизиться, остаться почти прежней или вырасти.
4. Каждый модуль разбить на последовательность коротких экранов: **одна мысль / одно действие на экран**.
5. Пользователь должен получать содержательную реакцию на ответ, а не только validation pass/fail.
6. Карта опасности должна ощущаться как самостоятельный артефакт курса, а не дамп полей.
7. Экзамен и сертификат должны быть отдельными финальными стадиями, а не элементами длинной итоговой страницы.
8. Prototype v0.2 остаётся изолированным. Production record `COURSE-001`, текущий public route и canonical course не меняются до повторного теста.

## UX issues found in v0.1

### P0 — Screen density

На одном экране одновременно появляются несколько разных действий: ввод результата, список предпосылок, классификация, контрольный вопрос, confidence, Валентин и validation message.

**Required:** разбить каждый day/module на отдельные steps. Пользователь видит один главный вопрос или одно действие.

### P0 — Validation language

Технические сообщения вида «Нужны результат, 7 предпосылок, их классификация и контрольный ответ» выглядят как developer validation.

**Required:** validation должна говорить языком курса и точно указывать недостающее действие.

Примеры:
- `ДЕЛО ПОКА НЕ ПРИНИМАЕТСЯ. НЕ ХВАТАЕТ ЕЩЁ 3 ПРЕДПОСЫЛОК.`
- `ОДНА ПРЕДПОСЫЛКА ОСТАЛАСЬ БЕЗ СТАТУСА.`
- `ОТВЕТ СЛИШКОМ КОРОТКИЙ. ПОКА ЭТО ПОХОЖЕ НА СПОСОБ НЕ ОТВЕЧАТЬ.`

### P0 — Response quality

v0.1 принимает формально заполненные, но слабые, повторяющиеся или бессодержательные ответы и почти не реагирует на них.

**Required:** добавить prototype response-quality layer.

MVP rules without AI:
- empty / whitespace-only — reject;
- minimum meaningful length per free-text question;
- duplicate answer detection within one session;
- identical `errorCost` / `planB` or other suspicious repeats → warning / follow-up;
- generic answers such as `плохо`, `не знаю`, `что-то случится` → request concretization where applicable;
- red line must be observable/testable, not `если станет плохо`;
- at least one follow-up when answer is formally valid but operationally useless.

Later AI may analyze contradictions and free-form answers, but v0.2 must not depend on AI to be passable.

### P0 — Confidence interpretation

Raw numbers such as `89% → 85%` are not self-explanatory.

**Required:** after each day and at final, show interpretation based on discovered evidence, not praise for confidence loss.

Example:

`УВЕРЕННОСТЬ: 89 → 85`

`Решение пережило 14 способов провала, 4 ранних сигнала и одну красную линию. Серьёзных оснований отказаться пока не обнаружено.`

Never say that lower confidence is inherently better.

### P1 — O.P.A.S.N.O. labels

Internal notation such as `МОДУЛЬ 1 / О + П` is unclear.

**Required:** use public labels:
- `О — ОЖИДАНИЕ`
- `П — ПРЕДПОСЫЛКИ`

The mnemonic is revealed progressively; internal abbreviations are not primary UI copy.

### P1 — Valentin voice

Black Valentin card is visually and productively effective. Preserve it.

**Required:** Valentin should react at decision points, not simply decorate each page. Use him for:
- premature certainty;
- weak answer;
- contradiction;
- sunk-cost choice;
- final interpretation;
- e-mail/day result later in production.

### P1 — Danger Map

Current final map reads like a field list / database report.

**Required:** redesign as course artifact:
- case number;
- decision and domain;
- major sections, not one continuous list;
- `ЗНАЮ / ПРЕДПОЛАГАЮ / МНЕ СКАЗАЛИ` counts and items;
- stamps `ПРЕДПОЛОЖЕНИЕ`, `ПРОВЕРЕНО`, `ТРЕБУЕТ ПРОВЕРКИ`, `КРАСНАЯ ЛИНИЯ`;
- confidence trajectory;
- final decision;
- print/export state.

### P1 — Final sequence

Current final screen puts verdict, map, certificate and prototype e-mail close together.

**Required final flow:**

`final decision → Valentin verdict → exam → exam result → completed screen → Danger Map → certificate → simulated result e-mail`.

Certificate must feel earned and isolated as a final moment.

### P1 — Final copy contradiction

`РЕШЕНИЕ НЕ ПРИНЯТО АВТОМАТИЧЕСКИ` can visually conflict with `ФИНАЛЬНОЕ РЕШЕНИЕ: ДЕЛАТЬ`.

**Required copy direction:**

`СИСТЕМА РЕШЕНИЕ НЕ ПРИНИМАЛА.`

`Вы дошли до него самостоятельно. Это и была неприятная часть.`

### P2 — Visual polish

Do not prioritize decorative redesign before interaction fixes. Current paper/black/red language is sufficient for v0.2 product test.

Visual work in v0.2 should serve hierarchy:
- one primary action;
- one major question;
- visible state/step;
- clear feedback;
- Valentin as distinct commentary layer.

## v0.2 interaction architecture

Each course day/module should be a mini-flow, approximately:

`day intro → one case/provocation → Q1 → Q2 → structured interaction → response feedback → Valentin → control question → confidence → day summary → submit`.

Do not render all day fields at once.

### Draft state

Every answer saves on input/change.

Prototype storage remains `localStorage` only because v0.2 is an isolated UX prototype. Production architecture remains:

`email → course enrollment → session → day/question state → processing → result → next block email`.

Do not update production implementation record until prototype approval.

## Required onboarding flow for v0.2

`Landing → Start → prototype e-mail → course rules → domain → decision → initial confidence → Valentin opening → Day 1`.

Each screen has one primary action. See full onboarding task in the working discussion / next implementation spec.

## Acceptance criteria v0.2

Prototype is ready for second manual test when:

1. User can complete all 7 modules end-to-end.
2. Each major question/action occupies its own step or clearly focused screen.
3. Browser reload restores exact current step and draft.
4. Validation messages are user-facing course copy, not developer text.
5. Weak/duplicate/generic answers trigger at least deterministic feedback where rules allow.
6. Valentin reacts to at least one substantive user state in every module.
7. Confidence summaries explain change without treating reduction as success.
8. Final answer can be `делать / изменить условия / не делать` with equal status.
9. Danger Map is a structured artifact, not a raw dump.
10. Exam is a separate stage.
11. Certificate is a separate completion stage.
12. Existing production route `/courses/dumai-s-opasnostyu/` is untouched.
13. `content/registry.json` and `content/courses/dumai-s-opasnostyu.json` are untouched.
14. Canonical `courses/dumai-s-opasnostyu.md` is untouched.
15. Prototype remains `noindex,nofollow`.

## Weekly report interpretation

Report as completed:
- first passable course prototype created;
- full manual prototype walkthrough completed by **Yauhen**;
- core course mechanics validated;
- UX/content-quality gaps documented;
- v0.2 technical task created.

Do not report as completed:
- production course backend;
- real e-mail sending;
- server-side course state;
- AI analysis;
- production publication of the new course flow.

Next externally testable result:

**Prototype v0.2 — focused screen-by-screen flow with meaningful answer feedback, improved Valentin reactions and redesigned final sequence.**
