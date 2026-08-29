# Dementor Club — Community Page Approved V1

Status: **APPROVED FOR SITE INTEGRATION**
Approved: 2026-08-30
Source-of-truth branch: `dementor-club`
Implementation branch: `dementor-club-site`
Design authority: `docs/DEMENTOR_DESIGN_CANON_v10.md`

## 1. Role of the page

Community is the human and generative layer of Dementor Club.

It answers one practical question:

**кто здесь есть и что может возникнуть вокруг людей, их идей и практик.**

Community does not replace About, Events, Projects or Join.

- About explains what the club is and how the ecosystem works.
- Events is the canonical event registry.
- Projects presents independent project worlds.
- Join is the club onboarding / diagnostic entry interface.
- Community connects people with the formats and activity that emerge around them.

## 2. Core model

Approved page logic:

**человек → идея → люди → формат → своя клубная история**

The page must communicate that Dementor is not an elite caste or closed leadership layer.

A person can bring an idea, develop a practice or format, find like-minded people and become a Dementor through a real authored territory inside the club.

A resulting format may be a course, practice, service, event, independent project, object, series of meetings or another form that has not yet received a normal category name.

## 3. Editorial voice

Use affirmative, active language.

Prefer:

- «Клуб начинается с идеи.»
- «Идея находит людей.»
- «Принесите свою странную идею.»
- «Разные школы деградации. Одна клубная среда.»

Avoid building the page from repeated negations such as «не это / не то / не надо ждать / клуб не выдаёт».

The club already contains intentionally negative titles such as «Не команда» and the object «Не надо», so general interface copy should not make negation the default rhythm.

## 4. Approved hero

Primary statement:

**ЛЮДИ ЕСТЬ.**

Supporting line:

**Разные школы деградации. Одна клубная среда.**

Supporting copy:

> Здесь встречаются люди со своими взглядами, практиками и странными идеями. Можно войти в уже существующую историю или собрать вокруг собственной тех, кому она тоже зачем-то нужна.

Desktop composition:

- left: supporting line;
- center: approved Community illustration with «ЛЮДИ ЕСТЬ.» inside the head;
- right: supporting copy.

Mobile composition:

- illustration first with «ЛЮДИ ЕСТЬ.» inside the head;
- supporting line below;
- supporting copy below.

Approved illustration paper background: **`#F7EBD4`**.

The image must be shown without darkening filters, opacity reduction, overlay veil or `mix-blend-mode:multiply` when the approved final artwork already contains its own paper field and colour treatment.

## 5. Approved content sequence

### 01 — Principle

Heading:

**КЛУБ НАЧИНАЕТСЯ С ИДЕИ.**

Core copy:

> Любая клубная история может начаться с одного человека и одной достаточно странной мысли.
>
> Идея находит людей. Люди пробуют её в реальности. Так появляются практики, курсы, события, проекты, объекты и маленькие сообщества со своим характером.

Short Dementor definition for this page:

> Дементор здесь — человек, который развивает собственную практику или формат и собирает вокруг него единомышленников.

Do not duplicate the full About-page explanation of what a Dementor is.

### 02 — Possible outcomes

Heading:

**ИЗ ЭТОГО МОЖЕТ ВЫЙТИ ЧТО УГОДНО.**

The section deliberately places different entity types next to each other so Community does not read as a course catalogue.

Current examples allowed in the page composition:

- `ДУМАЙ С ОПАСНОСТЬЮ` — course / Валентин;
- `НЕ КОМАНДА` — practice / Габиль;
- `ЛОГИКА И ОСОЗНАННОСТЬ` — independent project;
- `НЕ НАДО` — club object / artifact.

The independent editorial status of «Логика и осознанность» must remain clear. Community shows the relationship; it does not own the project.

### 03 — People

Heading:

**КТО УЖЕ ЧТО-ТО ЗАТЕЯЛ.**

The people area is a lightweight roster, not a founders wall or hierarchy.

Current implementation may show:

- Валентин;
- Никита;
- Евгений;
- Габиль.

Each row should connect the person to a concrete practice/course/event rather than presenting biography as the primary value.

### 04 — Current activity

Heading:

**СЕЙЧАС ПРОИСХОДИТ.**

This block is a live editorial layer based on canonical entity statuses, not a second catalog.

Current source-grounded entries:

1. **НЕ КОМАНДА** — `active`; Габиль; regular online practice; Monday 10:00 `Europe/Madrid`.
2. **ДЕНЬГИ НА ВЕТЕР** — `approved concept / digital card-course MVP in development`; Никита.
3. **СЛАБОУМИЕ И ОТВАГА** — `planned / approved concept / public page allowed`; Евгений; Warsaw / Gdansk.
4. **ФУЭНХИРОЛА** — `planned`; Gabil; Fuengirola, Spain; chamber offline session; capacity up to 7.

Do not invent dates, prices, registration state or venues that are not fixed in the source records.

### 05 — Create your own

Heading:

**ПРИНЕСИТЕ СВОЮ СТРАННУЮ ИДЕЮ.**

Core copy:

> Она может стать дементорской услугой, курсом, практикой, проектом, объектом, событием, серией встреч или форматом, который придётся назвать уже после запуска.
>
> Хорошее начало — найти хотя бы одного человека, которому стало интересно.

Approved simple sequence:

**ИДЕЯ → ЛЮДИ → ПЕРВЫЙ ФОРМАТ → СВОЯ КЛУБНАЯ ИСТОРИЯ**

Do not promise unapproved membership mechanics, Telegram channels, voting, publishing rights, pricing or privileges.

## 6. Visual rules

Follow design canon v10:

**paper / black / acid + editorial metadata + controlled system violation**

Specific Community rules:

- acid uses canonical club acid, not green/olive substitute;
- acid text highlight uses black text;
- avoid repeated SaaS-card rhythm;
- one section = one dominant thought;
- Dementor portraits are supporting evidence, not the page's central visual hierarchy;
- current activity is best represented as an editorial ledger/list;
- mobile/tablet are independent compositions;
- hero uses the approved Community final artwork without darkening.

## 7. Page boundaries

Do not reintroduce on Community:

- the full nine-sphere explanation from Join;
- a duplicate explanation of the whole ecosystem from About/Home;
- the full event registry from Events;
- project-independence rules from Projects;
- speculative membership mechanics.

## 8. Public routes

Community: `/community/`

People:

- `/community/valentin/`
- `/community/nikita/`
- `/community/evgeniy/`
- `/community/gabil/`

Related entity routes remain canonical in their own sections (`/courses/...`, `/events/...`, `/projects/...`, `/objects/...`).

## 9. QA / acceptance

Before release verify:

- hero composition against approved desktop and mobile reference;
- paper background `#F7EBD4` visually merges with artwork;
- no blend/filter/veil darkens the approved hero image;
- no horizontal overflow on common mobile widths;
- all person/entity links resolve;
- current statuses match source records;
- `Логика и осознанность` remains presented as an independent project;
- acid use remains selective;
- desktop / tablet / mobile preserve the same information hierarchy.
