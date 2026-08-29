# Dementor Club — Official Site

Production snapshot официального сайта клуба.

## Branch role

`dementor-club-production` = **PRODUCTION SNAPSHOT**.

Это единственная ветка, из которой разрешена публикация официального сайта на `https://dementor.club`.

Рабочая разработка, визуальные тесты и макеты выполняются в `dementor-club-site`. Изменения попадают сюда только после прохождения approval + QA.

Полный release contract: `docs/deployment.md`.
Главное правило утверждения: `dementor-club/operations/PRODUCTION_RELEASE_POLICY_V1.md`.

## Production rule

`STAGING ≠ PRODUCTION`.

Макет может быть утверждён на тестовом материале. Это утверждает дизайн, композицию и responsive-поведение, но **не утверждает тестовый материал к публикации**.

До production обязательно:

1. source facts/content approved в ответственном source-of-truth;
2. layout approved на staging;
3. test/demo/mock/placeholder content заменён на отдельно утверждённый public content;
4. final candidate просмотрен снова уже с реальным контентом;
5. production validators пройдены;
6. получено явное release approval;
7. только после этого выполняется production release action.

## Что хранится здесь

- production candidate/site snapshot;
- UI-компоненты и стили;
- маршруты и страницы;
- SEO/metadata;
- production-safe интеграции;
- контентные маппинги из ветки `dementor-club`;
- deployment/QA документация.

## Обязательная дизайн-документация

- `docs/DESIGN_PRESENTATION_GUIDE.md`
- `docs/ENTITY_PRESENTATION_STANDARD_v1.md`
- `docs/COMPONENT_SYSTEM_v1.md`
- `docs/GLOBAL_HEADER_v1.md`
- `docs/MOTION_NAV_SEO_IMPLEMENTATION_v1.md`
- `docs/PRODUCTION_QA_v1.md`
- `docs/SITE_HARMONIZATION_AUDIT_2026-08-26.md`
- `docs/deployment.md`
- `docs/PUBLISHING_PLAYBOOK_v1.md`
- `docs/OPERATIONS_RUNBOOK_v1.md`
- `docs/FEATURE_ACTIVATION_MATRIX_v1.md`
- `references/REFERENCE_RESPONSIBILITIES.md`

## Asset rules

- `assets/ink/README.md` — production contract для Dementor Ink.
- `assets/social/README.md` — OpenGraph/social preview contract.

**Artistic illustrations are raster-only.** Для Dementor Ink и social artwork используем WebP / PNG / JPG. SVG не используется как формат художественной иллюстрации и не должен появляться через autotrace/vectorization.

## Source-of-truth

Смыслы, правила клуба, продукты и утверждённые тексты сначала фиксируются в ветке `dementor-club`. Production branch не является местом принятия смысловых решений.

«Логика и осознанность» развивается независимо в `logic-awareness`; production website представляет только publishable/approved состояние проекта.

## Production domain

Canonical origin:

`https://dementor.club`

Legacy `https://sladzari.github.io/degradation_club/` не является canonical production origin и не должен попадать в production artifact.

## Release validation

Production workflow выполняет:

```bash
node scripts/validate-site.mjs
node scripts/validate-content-readiness.mjs
node scripts/validate-visual-contract.mjs
node scripts/validate-production-release.mjs
```

Любая validation error блокирует deployment.

Production workflow: `.github/workflows/deploy-pages.yml`.

Обычные push с изменениями сайта не публикуют домен. Release требует отдельного явного approval action согласно `docs/deployment.md`.

## External feature activation

UI readiness ≠ feature live.

Contacts, Donate, Merch checkout, Event registration и Membership/other integrations включаются только после утверждения реального provider/endpoint и соответствующего source-of-truth состояния.

## Deployment status

Production branch: `dementor-club-production`.
Canonical domain: `https://dementor.club`.

Не считать новый production опубликованным, пока workflow не завершился успешно и live routes не прошли smoke verification.

## Storage split

GitHub stores optimized delivery assets, code and implementation rules.

Google Drive stores high-resolution raster masters, photos/video, design exports, presentations and heavy source assets.
