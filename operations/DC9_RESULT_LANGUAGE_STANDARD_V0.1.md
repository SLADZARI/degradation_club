# DC-9 Result Language Standard v0.1

Status: **APPROVED EDITORIAL DIRECTION / PERSONAL STATE MATRICES REQUIRED**  
Date: 2026-09-01

This document governs the **public editorial language of the DC-9 result experience**.

It does not change:
- the nine-sphere taxonomy;
- scoring;
- guards;
- Graph Linked Cards v5 presentation contract;
- Community membership semantics.

Diagnostic and presentation authorities remain:
- `operations/DC9_RESULT_SYSTEM_V0.1.md`;
- `join/result/GRAPH_LINKED_CARDS_V5.md` on `dementor-club-site`.

---

## 1. Core rule

> **Результат DC-9 не объясняет пользователю, какой он. Он оформляет последствия его собственных решений.**

Internal authoring frame:

> The result behaves like a clear official record produced by an institution that has observed the user's decisions. The institution is dry, slightly suspicious and occasionally absurd, but it must not turn the user into a defective object.

The result must not read like:
- wellness UX;
- coaching advice;
- psychometric interpretation;
- medical examination;
- defect / repair classification;
- gamified rank table.

---

## 2. Editorial proportion

Target proportion across the result page:

- **70% clarity** — direct, readable system language;
- **20% institutional deadpan** — dry administrative framing;
- **10% strong absurdity** — rare lines with real satirical force.

Strong absurdity must remain rare. If every line is written as a bureaucratic gag, the device becomes visible and stops working.

---

## 3. Three public text layers

Every sphere result has three different editorial layers. Do not merge them.

### Layer A — System name

Dry navigation / indexing only:

- `01 / ЛИЧНОСТЬ`
- `02 / РАБОТА`
- `03 / ПОТРЕБЛЕНИЕ`
- `04 / ОТНОШЕНИЯ`
- `05 / КОНТРОЛЬ`
- `06 / ИНФОРМАЦИЯ`
- `07 / САМОРАЗВИТИЕ`
- `08 / СМЫСЛ`
- `09 / ТЕХНОЛОГИИ`

These names are not jokes and should not be rewritten for personality.

### Layer B — Permanent public territory descriptor

This is a constant satirical description of the territory, not advice.

- **ЛИЧНОСТЬ** — `ВЕРСИЯ СЕБЯ, КОТОРУЮ УЖЕ ВСЕ ЗАПОМНИЛИ.`
- **РАБОТА** — `МЕСТО, ГДЕ ПУСТОЙ КАЛЕНДАРЬ ТРЕБУЕТ ОБЪЯСНЕНИЙ.`
- **ПОТРЕБЛЕНИЕ** — `ВЕЩИ. ЧАСТЬ ИЗ НИХ УЖЕ У ВАС ЕСТЬ.`
- **ОТНОШЕНИЯ** — `ДРУГИЕ ЛЮДИ. ФУНКЦИЯ ОТКЛЮЧЕНИЯ НЕ НАЙДЕНА.`
- **КОНТРОЛЬ** — `ВСЁ, ЧТО БЕЗ ВАС НЕМЕДЛЕННО РАЗВАЛИТСЯ. ПО ВАШЕЙ ВЕРСИИ.`
- **ИНФОРМАЦИЯ** — `ФАКТЫ, МНЕНИЯ И ТО, ЧТО УЖЕ ПЕРЕСЛАЛИ В ЧАТ.`
- **САМОРАЗВИТИЕ** — `РЕМОНТ ЧЕЛОВЕКА БЕЗ ЗАЯВЛЕННОЙ ПОЛОМКИ.`
- **СМЫСЛ** — `ПРИЧИНА ПРОИСХОДЯЩЕГО. ПОЛЕ НЕОБЯЗАТЕЛЬНОЕ.`
- **ТЕХНОЛОГИИ** — `ТО, ЧТО СЭКОНОМИТ ВРЕМЯ СРАЗУ ПОСЛЕ НАСТРОЙКИ.`

Do not turn these descriptors into recommendations such as “меньше контролировать”, “не обслуживать образ” or “лучше делегировать”.

### Layer C — Personal state fixation

This text **depends on the final 0–5 sphere result**.

It must:
- describe observed behavioural state;
- reflect the logic of that sphere;
- avoid “you are X” identity language;
- avoid moral ranking;
- avoid advice;
- avoid a universal template repeated nine times;
- occasionally use strong absurdity, but not on every state.

Each sphere therefore requires a separate matrix:

`0 / 1 / 2 / 3 / 4 / 5 → personal editorial fixation`

The 54-state matrix is a separate authoring artifact and must be QA'd against the canonical sphere semantics before production implementation.

Example only — Self-development:

- low state: `УЛУЧШЕНИЕ ПОЛЬЗОВАТЕЛЯ ПРОДОЛЖАЕТСЯ. ПРИЧИНА ВСЁ ЕЩЁ СЧИТАЕТСЯ ОЧЕВИДНОЙ.`
- mid state: `НЕКОТОРЫЕ НЕИСПРАВНОСТИ УЖЕ ОФИЦИАЛЬНО ОСТАВЛЕНЫ БЕЗ РЕМОНТА.`
- high state: `ПОЛЬЗОВАТЕЛЬ СПОСОБЕН ОСТАВИТЬ СЕБЯ В ПОКОЕ. ПОВТОРНЫЕ ПРОВЕРКИ ПРИЗНАНЫ ИЗБЫТОЧНЫМИ.`

These examples show tone, not a final approved matrix.

---

## 4. Result hero

Avoid generic product UX such as:
- `Карта готова` as the only personality-bearing line;
- `Куда стоит посмотреть сначала`;
- `Полная карта`;
- `Можно дальше`.

Also avoid turning the result into a medical commission.

Preferred model:

- dry system label / stamp;
- one strong headline;
- no explanatory paragraph unless a user task requires it.

Current preferred direction:

`DC-9 / ЗАКЛЮЧЕНИЕ`

Headline should behave like a recorded conclusion, not a product success state.

The exact headline remains a copy decision for the result implementation pass.

---

## 5. No aggregate score

The absence of a universal score must not be explained with product-copy prose.

Avoid:

`Девять сфер. Девять отдельных результатов. Никакого общего балла.`

Preferred tone example:

`ИТОГОВОГО БАЛЛА НЕТ.`  
`Девять результатов удалось не смешивать в один.`

Important: do **not** call the nine spheres “problems”.

---

## 6. Highlighted three results

The deterministic prominence logic remains unchanged in `DC9_RESULT_SYSTEM_V0.1.md`.

Public copy must **not expose ranking language**:
- no `самая высокая`;
- no `самая низкая`;
- no `самая выраженная`;
- no `top-3`;
- no claim that these are more important spheres.

Preferred section framing:

# `ЭТО МЫ ОТЛОЖИЛИ ОТДЕЛЬНО`

Supporting line:

`Обычно так делают с тем, к чему потом приходится возвращаться.`

The system does not explain the internal selection algorithm on the main public surface.

The three cards use:
- sphere icon;
- system sphere name;
- permanent territory descriptor where useful;
- personal state fixation;
- final factual level only where required by the Graph Linked Cards v5 contract.

No public ranking labels.

---

## 7. Remaining six results

Do not frame them as secondary or unimportant.

Simple administrative framing is sufficient, for example:

`ОСТАЛЬНЫЕ МАТЕРИАЛЫ`

or another equally clear neutral label.

All nine results remain independent.

---

## 8. Map and linked legend

Graph Linked Cards v5 remains the visual baseline.

The linked legend must keep the clear system index:

`01–09 → sphere → factual result`

The second public line may use the permanent territory descriptor.

Desktop may use hover/focus linking between legend and radar.
Mobile must use tap/focus behaviour; no critical meaning may depend on hover.

The map is an instrument, not a ranking visualization.

---

## 9. Dossier

The dossier is an artifact, not a second interpretation layer.

It must use the same factual values and the same approved personal state copy as the screen.

Do not generate a separate “AI interpretation” for the dossier.

Recommended administrative framing:

- `DEMENTOR CLUB / DC-9`
- `МОЯ КАРТА`
- `9 СФЕР`
- factual values;
- approved state lines;
- no universal score.

---

## 10. Community transition

Do not claim that materials have already been sent before the user acts.

Before action:

# `ДЕЛО МОЖНО ПЕРЕДАТЬ ДАЛЬШЕ`

Supporting copy:

`В клубе по таким картам проще понять, куда идти, что читать и с кем разговаривать.`

Primary CTA:

`ПЕРЕДАТЬ ДЕЛО В КЛУБ →`

Only after the action succeeds may the interface state:

`МАТЕРИАЛЫ ПЕРЕДАНЫ.`

The actual Community route must still obey the approved identity / membership flow in the result-system contract.

---

## 11. Forbidden result-language patterns

Do not use:
- `у вас высокий контроль`;
- `вы склонны к...`;
- `ваш тип...`;
- `вам стоит...`;
- `рекомендуем развивать...`;
- `самая сильная / слабая сторона`;
- medical language suggesting disease, health or diagnosis;
- “исправен / неисправен” as a universal person classification;
- repeated `НЕ ОБНАРУЖЕНО / РАЗРЕШЕНО` templates across all spheres;
- bureaucratic jokes on every line;
- copy that invents club actions which have not happened yet.

---

## 12. Final editorial test

Before shipping any DC-9 result copy, ask:

1. Is this **describing observed behaviour**, or explaining personality?
2. Is the system name still clear without the joke?
3. Is the territory descriptor an observation rather than advice?
4. Does the personal line fit this exact `0–5` state?
5. Does the copy imply “better / worse” when no such claim exists?
6. Is the institutional voice still dry, or has it become costume theatre?
7. Could this sentence live in a generic wellness product unchanged? If yes, rewrite it.
8. Could this sentence live in a generic medical commission unchanged? If yes, rewrite it.
9. Is the strong absurdity rare enough to still hit?
10. Does the next CTA describe an action that will actually happen?

---

## 13. Next required artifact

Before production result-copy implementation, create and QA:

`DC9_PERSONAL_STATE_COPY_MATRIX_V0.1.md`

Contents:

`9 spheres × 6 final levels = 54 state fixations`.

The matrix must preserve the semantic direction of each canonical sphere and pass editorial QA under this standard.
