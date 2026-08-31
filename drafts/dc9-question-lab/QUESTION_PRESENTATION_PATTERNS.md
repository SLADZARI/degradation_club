# DC-9 Question Presentation Patterns

Status: **DRAFT UX + DIAGNOSTIC LIBRARY**

Purpose: make the test feel alive, tense and varied without producing illustrations for every scene, while also reducing specific sources of self-report bias.

These patterns are not just decoration. Each should have a clear **diagnostic function**.

They must not expose hidden score meaning.

## P01 — Administrative note

A one-line deadpan institutional comment below the scene.

Example:

> Отдел соответствия личности обнаружил расхождение с архивной версией.

**Diagnostic function:** none by itself; this is primarily the Club voice wrapper. Use it after the real conflict is already clear.

**Satirical function:** turns ordinary behavior into an official incident without forcing joke answers.

Use for: identity, work, control, self-development.

Cost: text only.

---

## P02 — Message fragment

The situation includes a short chat / email / notification fragment rendered as text UI.

Example:

> «Раз ты в субботу свободен, поможешь?»

**Diagnostic function:** places the choice in a natural social environment and reduces abstract self-description.

**Satirical function:** usually none in the message itself; the humor arrives in classification/result.

Use for: relationships, work, consumption, technology.

Cost: one reusable CSS message component.

---

## P03 — Stakes strip

A compact line names what is genuinely at stake without explaining the “right” principle.

Example:

`НА КОНУ: 4 часа · чужое одобрение · ваша суббота`

**Diagnostic function:** forces editors and users to see the actual tradeoff; useful for assigning impact I1–I7.

**Satirical function:** bureaucratizes a normal life cost.

Use for: medium/high-impact questions.

Cost: one reusable metadata row.

---

## P04 — Witness

Add one external observer reaction that raises social pressure.

Example:

> Коллега: «Странно, ты же всегда говорил совсем другое».

**Diagnostic function:** attacks self-description through another person’s view and reveals reputation / consistency pressure.

**Satirical function:** turns an ordinary social comment into evidence in a dossier.

Use for: personality, status, relationships, work.

Cost: text only.

---

## P05 — Receipt / evidence

The scene contains a tiny factual artifact: price, time spent, usage count, unread count, number of revisions, etc.

Example:

`Куплено 14 месяцев назад · использовано 3 раза`

**Diagnostic function:** removes the user’s ability to redraw the situation with convenient missing context.

**Satirical function:** makes the system look excessively forensic.

Use for: consumption, information, technology, self-development.

Cost: reusable monospace fact row.

---

## P06 — No-excuse constraint

The scene explicitly removes a respectable justification.

Example:

> Вы не заняты. Вы не устали. Вы просто не хотите.

**Diagnostic function:** separates actual motivation from post-hoc respectable explanation.

**Satirical function:** dry removal of excuses can itself be funny, but should stay short.

Use sparingly. Too much of this pattern becomes predictable.

---

## P07 — Consequence already happened / `ТЫ УЖЕ СДЕЛАЛ`

Instead of asking what a person would ideally do, place them after the decision when the cost has appeared.

Examples:

> Вы уже согласились. Через два дня понимаете, что не хотите этого делать.

> Вы заплатили €800 за курс. После третьего занятия стало понятно, что он вам не нужен.

> Вы отказались. Человек обиделся. Завтра вы снова увидитесь.

**Diagnostic function:** reduces aspirational answers; reveals sunk cost, responsibility, repair behavior and post-hoc rationalization.

**Satirical function:** the system arrives after the human decision and calmly classifies the damage.

Best for: responsibility guards, consumption, personality, work, relationships.

Cost: text only.

---

## P08 — Tempting / profitable exception

A person has abandoned a rule or role, then receives a situation where returning to it is easy and profitable.

Example:

> Старая роль снова принесёт вам деньги и одобрение. Сыграть её вы можете без труда.

**Diagnostic function:** tests intentionality. Distinguishes inability/exhaustion from a real choice.

**Satirical function:** treats temptation as a routine stress test of the system.

Best for: intentionality guards and higher-impact scenes.

Cost: text only.

---

## P09 — Dry classification

A short Dementor Club classification / stamp appears between scene and answers or as a transition after a question block.

Examples:

`СЛУЧАЙ: НЕСАНКЦИОНИРОВАННАЯ НЕЗАНЯТОСТЬ`

`СТАТУС: ОПРАВДАНИЕ НЕ ОБНАРУЖЕНО`

`Система фиксирует устойчивую склонность к объяснениям. Продолжайте.`

`Ответ принят. Ответственность пока не обнаружена.`

`Зафиксирована попытка действовать напрямую. Не делайте выводов раньше времени.`

**Diagnostic function:** none directly. It must never tell the user which answer was “good”.

**Satirical function:** main reusable humor engine between otherwise believable questions.

Use for rhythm and Club voice.

Cost: one reusable stamp/transition component.

---

## P10 — Two facts in conflict

Show two equally true facts without editorial explanation.

Example:

`Процесс соблюдён: 100%`
`Результат получен: 0%`

**Diagnostic function:** prevents the scene from being solved by choosing only one convenient fact; exposes priority conflicts.

**Satirical function:** pseudo-audit language makes the contradiction feel official.

Use for: work, control, information, technology.

Cost: reusable two-row fact component.

---

## P11 — Nobody will know / `НИКТО НЕ УЗНАЕТ`

Explicitly remove reputation and public evaluation from the scene.

Example:

> Вы можете отказаться от этой задачи. Никто никогда не узнает, что именно вы её не сделали.

**Diagnostic function:** removes status performance, impression management and desire to look correct. What remains is closer to actual motivation.

**Satirical function:** the Club system knows even when nobody else does.

Use for: personality, work, responsibility, consumption, information.

Cost: text only.

---

## P12 — Forced allocation

A new request can only be accepted by explicitly removing something else.

Example:

`Новая задача: +4 часа`
`Свободных часов: 0`

The answer must identify what gives way.

**Diagnostic function:** prevents magical “I’ll just do everything” answers and makes responsibility/cost visible.

**Satirical function:** resource accounting applied to social and identity decisions.

Use for: work, control, relationships, self-development.

Cost: reusable fact block.

---

# Pattern selection rule

Every candidate question must state:

1. `presentation.pattern`;
2. **diagnostic function** — what bias/ambiguity the pattern removes;
3. **satirical function** — where the Club humor comes from;
4. why this pattern is better than plain text for this scene.

If the answer to #2 is “none”, the pattern is optional decoration and should be used only for rhythm.

# Rhythm rule

Do not use the same presentation texture on consecutive questions when another method fits.

Recommended sphere rhythm:

- question 1: immediate recognizable situation;
- question 2: social or witness pressure;
- question 3: stronger stake or already-happened consequence;
- question 4: anti-image / nobody-will-know / factual constraint;
- optional question 5–7: only if they add independent evidence;
- intentionality guard: preferably profitable exception;
- responsibility guard: preferably consequence already happened / prior commitment.

After 2–3 questions, one short system transition may appear. It should not appear after every answer.

# Interaction rule

No timer is required and no forced countdown should affect scoring. Tension comes from the situation and consequence, not from making the interface stressful.

No illustration is required. A small reusable component library should be enough:

- `message`;
- `fact-row`;
- `stakes-strip`;
- `stamp`;
- `witness-line`;
- `two-facts`;
- `allocation-row`.

This creates visual variation while keeping production and maintenance cheap.
