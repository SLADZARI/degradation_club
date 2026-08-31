# DC-9 Question Presentation Patterns

Status: **DRAFT UX LIBRARY**

Purpose: make the test feel alive, tense and varied without producing illustrations for every scene.

These patterns are presentation wrappers. They must not alter hidden score meaning.

## P01 — Administrative note

A one-line deadpan institutional comment below the scene.

Example:

> Отдел соответствия личности обнаружил расхождение с архивной версией.

Use for: identity, work, control, self-development.

Cost: text only.

## P02 — Message fragment

The situation includes a short chat / email / notification fragment rendered as text UI.

Example:

> «Раз ты в субботу свободен, поможешь?»

Use for: relationships, work, consumption, technology.

Cost: one reusable CSS message component.

## P03 — Stakes strip

A compact line names what is genuinely at stake without explaining the “right” principle.

Example:

`НА КОНУ: 4 часа · чужое одобрение · ваша суббота`

Use for: medium/high-impact questions.

Cost: one reusable metadata row.

## P04 — Witness

Add one external observer reaction that raises social pressure.

Example:

> Коллега: «Странно, ты же всегда говорил совсем другое».

Use for: personality, status, relationships, work.

Cost: text only.

## P05 — Receipt / evidence

The scene contains a tiny factual artifact: price, time spent, usage count, unread count, number of revisions, etc.

Example:

`Куплено 14 месяцев назад · использовано 3 раза`

Use for: consumption, information, technology, self-development.

Cost: reusable monospace fact row.

## P06 — No-excuse constraint

The scene explicitly removes the respectable excuse.

Example:

> Вы не заняты. Вы не устали. Вы просто не хотите.

This is useful when the diagnostic target is whether a person still needs external justification.

Use sparingly. Too much of this pattern becomes predictable.

## P07 — Consequence already happened

Instead of asking about intentions, place the person after the decision when the cost has appeared.

Example:

> Вы отказались. Человек обиделся. Завтра вы снова увидитесь.

Best for responsibility guards and high-impact scenes.

Cost: text only.

## P08 — Tempting exception

A person has abandoned a successful-success rule, then receives a situation where returning to the old rule is profitable.

Example:

> Старая роль снова принесёт вам деньги и одобрение. Сыграть её вы можете без труда.

Best for intentionality guards.

Cost: text only.

## P09 — Dry classification

A short Dementor Club classification / stamp appears between scene and answers.

Examples:

`СЛУЧАЙ: НЕСАНКЦИОНИРОВАННАЯ НЕЗАНЯТОСТЬ`

`СТАТУС: ОПРАВДАНИЕ НЕ ОБНАРУЖЕНО`

Use for rhythm and club voice, not to reveal the tested tag.

Cost: one reusable stamp component.

## P10 — Two facts in conflict

Show two equally true facts without editorial explanation.

Example:

`Процесс соблюдён: 100%`
`Результат получен: 0%`

Use for: work, control, information, technology.

Cost: reusable two-row fact component.

## Rhythm rule

Do not use the same pattern on consecutive questions when another pattern fits.

Recommended sphere rhythm:

- question 1: immediate recognizable situation;
- question 2: social or artifact wrapper;
- question 3: stronger stakes;
- question 4: different texture / dry classification;
- optional question 5–7: only if they add diagnostic coverage, not because the quiz needs length;
- guards: preferably P07/P08 because they test behavior under consequence or temptation.

## Interaction rule

No timer is required and no forced countdown should affect scoring. Tension comes from the situation, not from making the interface stressful.

No illustration is required. A small reusable component library should be enough:

- `message`;
- `fact-row`;
- `stakes-strip`;
- `stamp`;
- `witness-line`.

This creates visual variation while keeping production and maintenance cheap.
