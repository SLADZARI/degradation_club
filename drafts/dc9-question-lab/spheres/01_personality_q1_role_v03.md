# 01 Personality — Q1 Role Maintenance v0.3

Status: **CANDIDATE / NOT APPROVED / REQUIRES BLIND PLAYTEST**  
Date: 2026-08-31

Authority:

- canonical presentation: `operations/QUESTION_PRESENTATION_HUMOR_STANDARD.md`;
- lab method: `METHODOLOGY_V0.4_DRAFT.md`.

## Why v0.3 exists

v0.2 passed semantic QA but failed the newer presentation standard in practice:

- too much explanatory setup;
- first screen felt like psychometric case description;
- humor was postponed;
- the role construct was explained instead of shown.

v0.3 optimizes Q1 as **onboarding into the language of the quiz**.

## Public scene v0.3

Вы обычно собираете друзей.

На этот раз они всё сделали сами.

> Место выбрано. Стол забронирован. Даже время всех устраивает.

В чате пишут:

> **«Всё готово. Просто приходи».**

**Это выглядит подозрительно.**

## Candidate answers

Editorial order only. Runtime order must be shuffled.

### A

**Прихожу.**

Internal:
- pattern: `ROLE_RELEASED`;
- pattern_stage: `0`;
- candidate canonical_evidence: `1.00`.

### B

**Уточняю адрес и время. На всякий случай.**

Internal:
- pattern: `LIGHT_CHECK`;
- pattern_stage: `1`;
- candidate canonical_evidence: `0.67`.

### C

**Проверяю бронь. Я примерно знаю, где обычно всё ломается.**

Internal:
- pattern: `CONTROL_BUFFER / ROLE_MAINTENANCE`;
- pattern_stage: `2`;
- candidate canonical_evidence: `0.33`.

### D

**Спрашиваю, нужна ли помощь. Полностью исправная организация без моего участия пока не проверена практикой.**

Internal:
- pattern: `ROLE_MAINTENANCE / PRINCIPLE_JUSTIFICATION`;
- pattern_stage: `3`;
- candidate canonical_evidence: `0.00`.

## Hidden construct

`role_maintenance / identity_service`

Question is not about competence or kindness.

It tests whether the old organizing role keeps functioning after the external request disappears.

## 0 / 1 boundary

- `0` — accepts that no organizing function is currently required;
- `1` — performs a light personal/social check but does not rebuild the role.

## 2 / 3 boundary

- `2` — role returns as a repeatable risk-management mechanism;
- `3` — continued involvement becomes defensible as a principle.

## Impact

Candidate: `I3 (.90)`.

Low material cost, moderate identity signal. Appropriate for Q1 because this screen teaches the game rather than carrying the whole sphere.

## Presentation analysis

- current moment, not biography: PASS;
- exact detail: booking + group message;
- quiet Dementor shift: `Даже время всех устраивает` + `Это выглядит подозрительно`;
- premise readable quickly: PASS;
- four compact choices: PASS;
- humor before result: PASS;
- user need not know Dementor Club theory: PASS.

## Candidate system reaction

Do not show necessarily after Q1 in production; retained for test:

> **Понятно. Организация продолжает существовать. Участие уточняется.**

Alternative:

> **Хорошо. Самоорганизация группы зафиксирована. Наблюдение продолжается.**

## Known risk

A = `Прихожу.` is extremely concise and may become visually privileged as the Club answer.

Blind playtest should test whether brevity itself becomes a semantic cue.

If yes, candidate A-alt:

> **Сохраняю адрес и прихожу.**

## New QA status

Old `44/50` is retired because the rubric changed.

v0.3 must be scored under the new 55-point rubric after blind read. Do not promote based on previous score.
