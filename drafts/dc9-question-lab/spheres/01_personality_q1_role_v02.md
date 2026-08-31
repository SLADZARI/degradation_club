# 01 Personality — Q1 Role Maintenance v0.2

Status: **CANDIDATE / NOT APPROVED / GOLD-STANDARD WORK**  
Parent lab: `01_personality_q1_role_candidates.md`

## Goal of this edit

Reduce the visibility of a Club-preferred answer while keeping four psychologically plausible strategies.

The scene remains intentionally low-to-medium stake (`I3`). Higher-stake verification belongs later in the sphere and guards.

## Scene

Вы много лет были человеком, который в компании обычно всё организует.

На этот раз друзья сами выбрали место, договорились о времени и всё забронировали.

В чат приходит:

> «Всё готово, увидимся завтра.»

Вас ни о чём не просят.

### Diagnostic function of presentation

Pattern: `message_fragment`.

The message removes the practical excuse that intervention is required.

No joke is needed on the question screen.

---

# Candidate answer set v0.2

Runtime order must be shuffled. Letters below are editorial only.

## A

**Смотрю адрес и время, добавляю всё в календарь. Если сходится — больше к организации не возвращаюсь.**

Internal:
- primary pattern: `DIRECT_ACTION`
- secondary pattern: `ROLE_RELEASED`
- pattern_stage: `0`
- candidate canonical_evidence: `1.00`

Why this is better than v0.1 A:

It is not an ideological “I refuse to organize” statement. The person still performs a normal self-check, then stops because no function remains.

## B

**Пишу организатору: «Если понадобится подстраховка — скажи». Если ответа нет, на этом тему закрываю.**

Internal:
- primary pattern: `SOCIAL_EXPLANATION`
- secondary pattern: `ROLE_MAINTENANCE`
- pattern_stage: `1`
- candidate canonical_evidence: `0.67`

The role remains available socially, but does not yet create a separate system.

## C

**Для себя перепроверяю бронь и место и держу в голове запасной вариант. В чат не вмешиваюсь, если всё нормально.**

Internal:
- primary pattern: `CONTROL_BUFFER`
- secondary pattern: `ROLE_MAINTENANCE`
- pattern_stage: `2`
- candidate canonical_evidence: `0.33`

This option must remain attractive to competent organizers. It is not framed as pathology.

## D

**Уточняю пару ключевых деталей. Если я заранее вижу слабое место, проще проверить сейчас, чем потом всем вместе его разруливать.**

Internal:
- primary pattern: `ROLE_MAINTENANCE`
- secondary pattern: `PRINCIPLE_JUSTIFICATION`
- pattern_stage: `3`
- candidate canonical_evidence: `0.00`

The answer is intentionally reasonable. The mechanism has become a principle: ability to foresee a problem creates an obligation to stay functionally involved.

---

# Alternate D candidates

Keep these for playtest if D still reads as the obvious “wrong” answer.

### D-alt-1

**Задаю несколько контрольных вопросов. Для меня это не вмешательство: если можно убрать проблему заранее, лучше убрать её заранее.**

Risk: slightly too polished / managerial.

### D-alt-2

**Проверяю то, что обычно проверял бы сам. Когда знаешь типичные слабые места, странно специально делать вид, что их не видишь.**

Risk: may increase identification for experienced organizers, which is useful, but slightly lengthier.

# Alternate A candidates

Use if A still reads too strongly as the Club answer.

### A-alt-1

**Проверяю только то, что нужно лично мне: где, во сколько и как добраться. Остальное оставляю тем, кто организовал.**

This makes the boundary “self-check vs system-check” especially clear.

### A-alt-2

**Сохраняю адрес, время и прихожу. Если никто не просит помощи, считаю, что помощь не требуется.**

Risk: the last sentence may sound too much like a declared Club principle.

---

# 0/1 boundary

`0` does what the current situation requires and does not keep the old role alive.

`1` leaves a social door open for the old role, but does not create a verification mechanism.

This is not directness vs politeness. Both are socially normal.

# 2/3 boundary

`2` has a mechanism: verify + keep fallback.

`3` has a principle that justifies continued involvement whenever competence can reduce risk.

This is the key distinction:

> mechanism vs worldview.

# Cost / personal stake

Impact candidate: `I3 (.90)`.

- material cost: low;
- identity stake: moderate;
- social stake: low-to-moderate;
- reversibility: high.

This question should not pretend to prove the whole tag alone. Its role is to establish a clean low-stakes baseline before a higher-stakes identity test later.

# Anti-gaming review

## Can the Club answer still be guessed?

Risk after v0.2: **low-to-medium**, improved from medium.

Why:

- A contains ordinary checking rather than theatrical refusal;
- C is professionally attractive and unobtrusive;
- D sounds responsible rather than controlling;
- none of the answers is intentionally ridiculous.

Remaining risk:

A is still the shortest path to releasing the role. In playtest, watch whether Club-aware users disproportionately select it while non-Club users distribute across B/C/D.

# Satirical payoff candidates

Do not show immediately after Q1.

Potential transition/result language:

- `РОЛЬ ПРОДОЛЖАЕТ ФУНКЦИОНИРОВАТЬ БЕЗ ВНЕШНЕГО ЗАПРОСА.`
- `ОБНАРУЖЕН РЕЗЕРВНЫЙ КОНТУР ОРГАНИЗАЦИИ.`
- `ФУНКЦИЯ ОРГАНИЗАТОРА ВРЕМЕННО СНЯТА С ЭКСПЛУАТАЦИИ.`
- `КОМПЕТЕНТНОСТЬ ПОВТОРНО ПРЕОБРАЗОВАНА В ОБЯЗАННОСТЬ.`

# Editorial QA v0.2

Scoring rubric: 10 dimensions / 50.

- Recognizability: `5/5`
- Real conflict: `3/5`
- Non-obviousness: `4/5`
- Pattern clarity: `5/5`
- 0/1 separation: `5/5`
- 2/3 separation: `5/5`
- Answer realism/balance: `5/5`
- Brevity: `5/5`
- Diagnostic stake: `3/5`
- Replay resistance / satirical usefulness: `4/5`

**Provisional total: 44/50.**

## Interpretation

This clears the current working `43+` target for a gold-standard playtest candidate, but it is **not frozen as canon**.

Before marking `approved-draft`, run a small blind playtest focused on two questions:

1. Do users perceive any answer as the obvious “correct Club answer”?
2. Do competent organizers genuinely choose C/D without feeling caricatured?

# Status decision

`candidate → playtest-ready`

Do not promote to `dementor-club` and do not implement in `dementor-club-site` yet.
