# DC-9 — Post-Q41 Course Routing v0.1

Status: **DRAFT PRODUCT ROUTING / NOT CANON / NOT PRODUCTION**  
Date: 2026-08-31  
Branch: `draft/dc9-question-lab`

Related bank:
- `BANK_V0.6_FULL_54_IMMERSIVE.md`

## Purpose

After global screen **41/54**, DC-9 may show one contextually relevant Dementor course card.

This logic is intentionally stored **outside the question bank**.

The bank owns:
- scene;
- answer semantics;
- canonical `0/1/2/3` evidence;
- interaction candidate.

This document owns:
- whether a course card appears after Q41;
- which course is eligible;
- why it is relevant;
- ad/interstitial presentation;
- no-match behavior.

Course routing must never change the DC-9 result or scoring.

---

# Trigger

Global question **41** = Sphere 07 `Саморазвитие` → **Intentionality guard**.

Current scene tests the temptation to join a useful expensive course without a concrete task.

That makes Q41 a deliberate meta-point for a course recommendation immediately after the answer is stored.

Flow:

`Q41 answer → store canonical guard evidence → calculate course fit → optional course interstitial → Q42`

The ad is **not part of Q41 evidence**.

---

# Core rule

> **Do not use a person's susceptibility to courses as a reason to sell them a course.**

Q41 itself must not create positive course affinity.

The course match is calculated primarily from the behavioral evidence already collected in earlier screens.

Q41 is an anti-manipulation gate:
- if the answer suggests FOMO / social comparison / optimization pressure, routing becomes **more conservative**, not more aggressive;
- a course can still be shown only when earlier answers reveal a concrete problem that the approved course actually addresses.

No course should be shown merely because the user clicked the answer closest to `0` or `1` on Q41.

---

# Course match requirements

A course is eligible only when all conditions pass:

1. **Approved course record exists** with owner, public title, offer, format and public CTA/URL.
2. The course has a documented `fit_tags` map to existing DC-9 tags/behaviors.
3. At least two independent earlier signals support the same course need, unless one signal is explicitly defined as high-confidence.
4. There is no strong contradictory evidence showing that the course would likely be irrelevant.
5. The recommendation can explain the fit using a concrete observed pattern, not a psychotype.
6. Q41 does not indicate that we are exploiting course/FOMO susceptibility.
7. Only one course may be shown.

If two courses are close and no clear winner exists, **show no course** rather than inventing precision.

---

# No-match behavior

Q41 still gets a post-answer beat even when no course fits.

Recommended default:

**РЕКЛАМА ОТМЕНЕНА.**  
Подходящего курса не найдено.  
**На этот раз вам ничего не продают.**

Then continue to Q42.

This is not a failure state. It is part of the Dementor tone and makes the recommendation layer more credible when a real match does appear.

Alternative dry status:

**КОММЕРЧЕСКИЙ ИНТЕРЕС НЕ УСТАНОВЛЕН.**

Do not display a random course to fill the slot.

---

# Public course-card pattern

When a fit exists, show one compact interstitial.

Suggested structure:

`SYSTEM STATUS / dry line`

`COURSE TITLE`

One short **reason for relevance** derived from actual answered scenes.

One approved hero/description line from the course record.

`CTA`

Secondary action: continue quiz.

Rules:
- no carousel;
- no “you are type X” language;
- no hidden score shown;
- no claim that DC-9 diagnosed a problem;
- no artificial urgency unless the approved offer genuinely has it;
- no “recommended for you” black-box language without an explainable reason;
- click/no-click never changes DC-9 evidence.

Preferred voice:

> В нескольких сценах подряд полная ясность оказывалась дороже самого решения.  
> У Валентина есть курс ровно про эту неприятность.

Not:

> По результатам теста у вас высокий уровень тревоги и потребность в контроле.

---

# Candidate course registry

Only course facts supported by approved project sources may become public.

## VALENTIN

`course_id`: `dumai-s-opasnostyu`  
Owner: **Валентин Лосев**  
Public title: **ДУМАЙ С ОПАСНОСТЬЮ**  
Subtitle: **Курс последовательной деградации уверенности**  
Source status found in Drive: `approved-draft · online · self-paced · Dementor Club`  
Planned site route in source: `/courses/dumai-s-opasnostyu/`

Source-backed subject matter includes:
- hidden assumptions;
- separating promises from facts;
- premortem / ways a plan can fail;
- weak signals;
- predefined red lines;
- confirmation bias;
- decision-making under risk without turning caution into total inaction.

Candidate DC-9 affinity for later semantic review:
- `05 #неопределённость`;
- `06 #факты`;
- `06 #источники`;
- `06 #сменамнения`;
- possibly selected control/risk patterns only after semantic QA.

**Production routing status:** `BLOCKED UNTIL CANONICAL COURSE RECORD IS SYNCED INTO dementor-club`.

Reason: the course currently has an approved-draft Drive artifact, but the club source-of-truth rule requires approved semantics/products to be fixed in the `dementor-club` branch before site/runtime implementation.

## YAUHEN / ЕВГЕНИЙ

Owner slot requested for future routing.

`course_id`: `TBD`  
Public course record: **NOT VERIFIED IN CURRENT CLUB SOURCES**  
Public title / offer / CTA / URL: **DO NOT INVENT**

Routing status: `DISABLED` until an approved course record exists.

## NIKITA

Owner slot requested for future routing.

`course_id`: `TBD`  
Public course record: **NOT VERIFIED AS AN APPROVED DEMENTOR CLUB COURSE**  
Public title / offer / CTA / URL: **DO NOT INVENT**

Routing status: `DISABLED` until an approved course record exists.

## GABIL

Owner slot requested for future routing.

`course_id`: `TBD`  
Public course record: **NOT VERIFIED IN CURRENT CLUB SOURCES**  
Public title / offer / CTA / URL: **DO NOT INVENT**

Routing status: `DISABLED` until an approved course record exists.

---

# Matching model — draft

Do not create a new aggregate “course score” that leaks back into DC-9.

Routing may use a separate non-diagnostic fit function over existing canonical answers.

Suggested shape:

`course_fit = evidence matches + conflict checks + availability gate`

It is a routing heuristic, not psychology and not part of the result map.

Each course must define:

- `fit_tags` — existing DC-9 tags relevant to its actual content;
- `fit_states` — which canonical states indicate a problem/opportunity the course addresses;
- `conflict_states` — evidence making the course less relevant;
- `minimum_evidence` — minimum independent matching scenes;
- `reason_templates` — explainable public reasons based on scenes;
- `public_card` — approved title/hero/CTA;
- `availability` — active/inactive;
- `source_ref` — canonical club record.

Never infer a fit from a person's identity, psychotype or total Dementor score.

---

# Q41 anti-exploitation behavior

The Q41 answer may modify **routing confidence**, never course desirability.

Draft rule:

- Q41 `0/1`: raise the fit threshold because social/FOMO pressure may be driving course interest;
- Q41 `2`: normal threshold if a concrete earlier need exists;
- Q41 `3`: normal threshold; a course can still appear if the system can name the concrete task it would address.

This creates the desired joke without punishing skepticism:

> пользователь только что ответил, что не хочет идти на курс без задачи → система либо показывает очень конкретную причину → либо отменяет рекламу.

---

# Example with Valentin — editorial mock only

If the earlier answer pattern legitimately supports the course:

**РЕКЛАМНАЯ ПАУЗА. К СОЖАЛЕНИЮ, ПО ДЕЛУ.**

### ДУМАЙ С ОПАСНОСТЬЮ
Курс последовательной деградации уверенности · Валентин Лосев

В нескольких предыдущих сценах решение задерживалось до момента, когда информации уже становилось больше, чем времени.

Курс разбирает предпосылки, слабые сигналы, красные линии и решения в условиях риска.

`НАЧАТЬ СОМНЕВАТЬСЯ`

`Продолжить деградацию →`

If the fit is weak:

**РЕКЛАМА ОТМЕНЕНА.**

Подходящего курса не найдено.

**На этот раз вам ничего не продают.**

`Продолжить →`

These are editorial mocks, not approved public copy.

---

# QA before implementation

1. Confirm global screen indexing: Q41 remains the Self-development intentionality guard.
2. Freeze course registry in `dementor-club` source-of-truth.
3. For each enabled course, document exact fit tags/states and conflicts.
4. Test false-positive rate on blind users.
5. Verify Q41 `0/1` does not increase advertising pressure.
6. Verify no-match state is common and acceptable.
7. Verify course click/no-click has zero effect on DC-9 score/result.
8. Verify ad placement does not interrupt Q41 guard evidence before it is stored.
9. Show at most one course.
10. Only after approval implement routing in `dementor-club-site`.
