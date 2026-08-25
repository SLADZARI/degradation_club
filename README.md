# Dementor Club — Official Site

Отдельная ветка официального сайта клуба.

## Что хранится здесь

- исходный код сайта;
- UI-компоненты и стили;
- маршруты и страницы;
- SEO/metadata;
- интеграции;
- контентные маппинги из ветки `dementor-club`;
- техническая документация;
- deployment notes;
- `DRIVE.md` — связь с папкой материалов сайта на Google Drive.

## Обязательная дизайн-документация

- `docs/DESIGN_PRESENTATION_GUIDE.md` — официальный guide по архитектуре, типографике, композиции, motion, Dementor Ink, mobile и правилам применения референсов.
- `docs/COMPONENT_SYSTEM_v1.md` — рабочая component/page system.
- `docs/GLOBAL_HEADER_v1.md` — единый header, desktop navigation, mobile burger и правила локальных product bars.
- `docs/MOTION_NAV_SEO_IMPLEMENTATION_v1.md` — navigation, motion и metadata baseline.
- `docs/PRODUCTION_QA_v1.md` — production gate и responsive QA.
- `docs/deployment.md` — deployment contract.
- `docs/PUBLISHING_PLAYBOOK_v1.md` — процедура публикации сущностей.
- `docs/OPERATIONS_RUNBOOK_v1.md` — operational runbook.
- `docs/FEATURE_ACTIVATION_MATRIX_v1.md` — READY vs LIVE для внешних функций.
- `references/REFERENCE_RESPONSIBILITIES.md` — карта ответственности Public Records / Actual Source / 032c / Mouthwash / DIA / Dementor Ink.

Эти документы являются обязательным source-of-truth для новых страниц и редизайна существующих экранов.

## Asset rules

- `assets/ink/README.md` — production contract для Dementor Ink.
- `assets/social/README.md` — OpenGraph/social preview contract.

**Artistic illustrations are raster-only.** Для Dementor Ink и social artwork используем WebP / PNG / JPG. SVG не используется как формат художественной иллюстрации и не должен появляться через autotrace/vectorization.

## Source-of-truth

Смыслы, правила клуба, продукты и утверждённые тексты сначала фиксируются в ветке `dementor-club`. Правила публичной подачи — в `dementor-club/brand/PRESENTATION_RULES.md`. Эта ветка отвечает только за их веб-реализацию.

«Логика и осознанность» развивается независимо в `logic-awareness`; сайт представляет проект, но не переписывает и не публикует его draft-материалы как утверждённые.

## Current public architecture

Основные разделы:

- `/`
- `/about/`
- `/events/`
- `/events/fuengirola/`
- `/projects/`
- `/projects/logic-awareness/`
- `/community/`
- `/community/valentin/`
- `/community/nikita/`
- `/community/evgeniy/`
- `/community/gabil/`
- `/merch/`
- `/catalog/`
- `/archive/`
- `/join/`
- `/courses/dumai-s-opasnostyu/`

Служебные страницы:

- `/donate/`
- `/contacts/`
- `/legal/privacy/`
- `/legal/terms/`
- `404.html`

`content/registry.json` — единый implementation registry публичных сущностей. Records обязаны соответствовать `content/ENTITY_CONTRACT.md`.

## Release validation

Перед публикацией обязательно выполнить:

```bash
node scripts/validate-site.mjs
```

Validator проверяет:

- registry ↔ records;
- уникальность ID и URL;
- provenance;
- существование entity pages;
- registry ↔ sitemap;
- sitemap ↔ canonical origin ↔ robots;
- feature flags в `site-config.js`;
- порядок подключения service adapters;
- отсутствие старого CDN onboarding engine;
- Join storage guard;
- статусные инварианты, включая `approved-draft` и event registration.

GitHub Actions workflow: `.github/workflows/site-integrity.yml`.
Любая validation error является release blocker. Warning требует проверки, но не блокирует процесс автоматически.

## External feature activation

Все внешние функции включаются через `site-config.js`.
До утверждения провайдера/endpoint они должны оставаться disabled:

- Contacts submit;
- Donate payment;
- Merch checkout;
- Event registration;
- Community membership.

UI readiness не является фактом публичной доступности функции.

## Deployment status

Production branch contract: `dementor-club-site` only.

Known production project/domain: `degradation-club` / `https://degradation-club.vercel.app/`.
Последняя доступная проверка commit status показала ошибку Vercel `build-rate-limit`; это инфраструктурный deployment blocker, а не подтверждение ошибки site validator. Не считать последний HEAD опубликованным, пока live deployment не проверен отдельно.

## Storage split

GitHub stores optimized delivery assets, code and implementation rules.

Google Drive stores high-resolution raster masters, photos/video, design exports, presentations and heavy source assets.