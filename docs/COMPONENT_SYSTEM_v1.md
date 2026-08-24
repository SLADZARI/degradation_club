# Dementor Club — Component & Page System v1

Status: implementation baseline
Updated: 2026-08-24

Этот документ переводит утверждённый reference guide в рабочую систему компонентов и шаблонов страниц.

## 1. Порядок проектирования

Любая новая страница проходит в порядке:

1. Layout / information architecture
2. Type hierarchy
3. Content hierarchy
4. Composition / density rhythm
5. Motion behaviour
6. Dementor Ink intrusion

Нельзя начинать с декоративной графики или анимации.

## 2. Базовые layout primitives

### `.dc-shell`
Контейнер страницы. Max width 1600px, responsive outer margin.

### `.dc-grid`
12 колонок desktop / 8 tablet / 4 mobile.

### `.dc-section`
Стандартная секция с вертикальным ритмом.

### `.dc-band`
Полноширинная секция, допускающая black/paper inversion.

### `.dc-rule`
Тонкая структурная линия. Линия является частью информационной архитектуры, а не декором.

## 3. Typography primitives

### `.dc-kicker`
Служебная маркировка: category / status / number / timestamp.

### `.dc-display-xl`
Главный statement. Допускается crop по краям viewport.

### `.dc-display-l`
Секционный statement.

### `.dc-lead`
Крупный вводный текст.

### `.dc-body`
Основной текст.

### `.dc-meta`
Metadata и технические подписи.

Главный принцип: label называет тип сущности, headline содержит мысль.

## 4. Navigation

### Global topbar
Brand слева, compact index справа.

Desktop: прямые ссылки.
Mobile: toggle раскрывает административный индекс.

Названия разделов фиксируются как:

- CLUB
- EVENTS
- PROJECTS
- COMMUNITY
- MERCH
- JOIN

## 5. Index row

Главный компонент для Projects / Events archive / Merch / Community.

Поля:

- number/id
- title
- type
- status
- optional location/date
- action arrow

Desktop может использовать hover preview. Mobile — tap/reveal.

Не заменять generic cards, если список сущностей можно прочитать строками.

## 6. Entity feature

Большой блок одной сущности: event/project/merch object.

Состав:

- kicker
- status
- dominant headline
- short factual description
- metadata
- one primary action

Не размещать больше одного dominant entity в одном viewport.

## 7. Statement block

Полноширинный текстовый удар. 032c editorial role + Mouthwash spacing.

Содержит одну мысль. Может занимать 60–100vh. Не должен превращаться в обычный marketing section.

## 8. Ticker / notice line

Механический служебный поток. Используется как notice, status feed или короткая клубная диагностика.

Допустимое поведение:

- равномерное движение;
- пауза;
- краткая смена направления;
- reclassification одного термина.

Запрещён декоративный бесконечный marquee без содержания.

## 9. CTA / action

Кнопки квадратные или почти квадратные по геометрии, без pill shapes.

Primary action использует ACID как signal.
Secondary — paper/ink border.

Текст действия — процедурный, конкретный, иногда bureaucratic deadpan.

### 9.1 Contrast contract — обязательное системное правило

`ACID #d8ff3e` считается **светлой поверхностью**, а не цветом текста.

Разрешённые базовые пары:

- PAPER `#f2f0e8` + INK `#111`;
- INK `#111` + PAPER `#f2f0e8`;
- ACID `#d8ff3e` + INK `#111`.

Запрещено во всех компонентах и состояниях:

- PAPER / white text на ACID;
- светлый текст на `.dc-acid`;
- светлый текст на `.dc-action--primary`, `.dc-action--acid`, `.button.primary`, `.card.accent`;
- наследование цвета от тёмной секции внутрь acid-highlight или acid-CTA;
- hover/focus-состояние, в котором ACID-фон получает светлый foreground.

Правило действует независимо от родителя. Если primary CTA находится внутри тёмной секции, его текст всё равно INK.

Для новых acid-поверхностей использовать существующие классы или `data-dc-surface="acid"`. Системный accessibility layer принудительно закрепляет INK foreground через `!important`; локальный CSS не должен пытаться это переопределять.

Для новых тёмных поверхностей допустим `data-dc-surface="dark"`, но вложенный ACID всё равно остаётся парой ACID + INK.

Минимальная проверка перед merge: нормальное состояние + hover + focus + mobile + dark-parent context.

## 10. Status chip

Не rounded pill. Использовать текст + border/underline/acid field.

Примеры:

- PLANNED
- ACTIVE
- COMPLETED
- ACCESS AFTER JOIN

## 11. Dementor Ink slot

Компонент не задаёт сам рисунок; он задаёт место нарушения сетки.

Ink может:

- пересечь rule;
- выйти за frame;
- накрыть metadata;
- быть cropнутым;
- появиться на границе двух sections.

Ink slot не использовать в каждой секции. Target: 10–20% ключевых экранов.

## 12. Motion behaviours

Разрешены только системные поведения:

- Pressure
- Drift
- Reclassification
- Type Mutation
- Ink Intrusion
- Mechanical Ticker

`prefers-reduced-motion` обязателен.

Универсальный fade-up не использовать как идентичность.

## 13. Homepage v1 structure

1. Global navigation
2. Hero / service proposition
3. Mechanical notice line
4. Club service statement
5. Current event: Fuengirola / status planned / access after join
6. Ecosystem index: Merch / Community / Events / Projects
7. Featured project: Logic & Awareness
8. Nine service spheres index
9. Join/onboarding CTA
10. Footer / source/status

Только подтверждённые сущности и факты.

## 14. Page families

### Home
Public Records architecture + 032c headline + Mouthwash rhythm + DIA behaviour + Ink interruption.

### Event detail
Public Records entity model + 032c editorial + Mouthwash composition.

### Project detail
Actual Source index provenance + 032c/Mouthwash story. Локальная identity проекта разрешена.

### Index pages
Actual Source first. Минимум motion.

### About / manifesto
032c editorial system + Mouthwash spacing.

### Join
Administrative UI + state/reclassification behaviours.

## 15. QA

Перед merge:

- один dominant thought на viewport;
- корректная metadata;
- нет выдуманных событий/цен/механик;
- компонент выбран по функции, а не по моде;
- mobile не является уменьшенной desktop версией;
- Cyrillic headline проверен;
- reduced motion работает;
- Ink добавляет смысл;
- каждый новый визуальный приём можно объяснить через approved reference responsibility map;
- ACID никогда не содержит PAPER/white foreground;
- primary CTA читается внутри paper, dark и mixed sections;
- acid highlight проверен на desktop/mobile и не теряет текст из-за inheritance.
