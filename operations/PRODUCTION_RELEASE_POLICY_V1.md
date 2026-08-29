# Dementor Club — Production Release Policy v1

Status: APPROVED
Updated: 2026-08-29

## Purpose

Зафиксировать жёсткую границу между разработкой/визуальными тестами и публичным production, чтобы тестовые макеты, временный контент, demo-данные и незавершённые материалы не могли случайно стать публичной версией Dementor Club.

## Branch contract

- `dementor-club` — source-of-truth: утверждённые смыслы, правила, сущности, события, статусы и публичные тексты.
- `dementor-club-site` — STAGING / WORKING SITE. Здесь разрешены разработка, проверка компонентов, тестовые макеты, временные данные и визуальные эксперименты. Эта ветка НЕ является production и НЕ должна автоматически деплоиться на основной домен.
- `dementor-club-production` — PRODUCTION SNAPSHOT. Единственная ветка, из которой разрешена публикация официального сайта на `dementor.club`.
- `logic-awareness` — самостоятельный editorial source проекта «Логика и осознанность».
- `main` — общий технический уровень репозитория; не источник production-сайта.

## Absolute rule

`STAGING ≠ PRODUCTION`.

Любой материал, использованный для проверки дизайна, композиции или поведения интерфейса, считается TEST MATERIAL до отдельного подтверждения его публичной готовности.

То, что макет визуально утверждён на тестовом материале, НЕ означает, что тестовый материал утверждён к публикации.

## Required pre-production sequence

Production release допускается только после прохождения последовательности:

1. **Source approval** — факты, статусы и публичный смысл зафиксированы в ответственном source-of-truth.
2. **Layout approval on test material** — макеты, композиция, responsive-поведение и компоненты проверены и утверждены на тестовом/рабочем материале.
3. **Test-material replacement** — все test/demo/mock/placeholder/draft материалы заменены на отдельно утверждённые публичные тексты, изображения, цены, даты, имена, статусы и ссылки.
4. **Final visual review** — production-кандидат повторно просмотрен уже с реальным публичным материалом. Утверждение макета на тестовых данных не заменяет этот шаг.
5. **Production QA** — routes, responsive, assets, metadata, external feature state, console/runtime и source provenance проверены.
6. **Explicit release approval** — человек явно подтверждает публикацию production-кандидата.
7. **Production branch update** — только после предыдущих шагов изменения попадают в `dementor-club-production`.
8. **Manual deploy** — публикация на основной домен запускается отдельным осознанным действием, а не обычным push в рабочую ветку.
9. **Post-deploy verification** — проверяется `dementor.club`, ключевые маршруты, изображения, CSS, metadata и публичные статусы.

## Forbidden in production unless explicitly approved as public copy

Перед переносом в production необходимо удалить или отдельно подтвердить любые элементы, являющиеся рабочими маркерами, включая:

- TEST / TEST DATA / TEST MATERIAL;
- MOCK / MOCKUP;
- DEMO;
- PLACEHOLDER;
- TEMP / TEMPORARY;
- SAMPLE;
- INTERNAL ONLY;
- WIP;
- DRAFT / APPROVED DRAFT, если статус относится к внутренней готовности, а не является осознанной публичной частью страницы;
- фиктивные цены, даты, регистрации, участники, отзывы, контакты;
- временные изображения и случайные visual references;
- preview/staging URLs в canonical / OpenGraph / sitemap.

Если такой текст является намеренной частью художественной подачи клуба, он должен быть явно отмечен как approved public copy в source-of-truth. По умолчанию он считается release blocker.

## Design approval rule

До production должны существовать два разных подтверждения:

### A. Visual/layout approval

Подтверждает:
- геометрию;
- типографику;
- композицию;
- component states;
- responsive;
- motion;
- общую визуальную систему.

Это разрешено делать на тестовом материале.

### B. Public-content approval

Отдельно подтверждает:
- конкретные тексты;
- изображения;
- имена;
- цены;
- даты;
- event/project status;
- CTA;
- registration/payment/contact URLs;
- metadata/social previews.

Без B макет не может быть production-ready, даже если A уже утверждён.

## Technical deployment guard

Production pipeline должен соблюдать следующие ограничения:

1. Push в `dementor-club-site` никогда не публикует `dementor.club`.
2. GitHub Pages production workflow выполняется только для `dementor-club-production`.
3. Production deploy запускается вручную и требует явного подтверждения `APPROVED`.
4. Рекомендуется запретить прямые push в `dementor-club-production` через GitHub branch protection / ruleset и принимать изменения только через reviewed PR.
5. Любая validation error блокирует release.
6. Если production-кандидат содержит неутверждённый test material, release отменяется — тестовый материал не «доделывается уже на production».

## Canonical release flow

`responsible source` → `dementor-club` approved fact/decision → `dementor-club-site` implementation/staging → visual approval on test material → replace test material with approved public material → final visual + content QA → `dementor-club-production` → manual production deploy → live verification.

## Rollback

Production branch является журналом опубликованных состояний. При критической ошибке необходимо вернуть `dementor-club-production` на последний подтверждённый production commit и повторно выполнить manual deploy.

Рабочую ветку нельзя использовать как rollback target для основного домена.
