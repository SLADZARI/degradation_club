# Dementor Club — Official Site

Рабочая ветка официального сайта клуба.

## Branch role

`dementor-club-site` = **STAGING / WORKING SITE**.

Здесь находятся реализация, визуальные тесты, responsive-проверки, интеграции и подготовка релизов. Эта ветка не является production source и обычный push в неё не должен публиковать `dementor.club`.

Публичный production snapshot хранится отдельно в `dementor-club-production`.

Полный release contract: `docs/deployment.md`.
Главное правило утверждения: `dementor-club/operations/PRODUCTION_RELEASE_POLICY_V1.md`.

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
- `docs/ENTITY_PRESENTATION_STANDARD_v1.md` — обязательный presentation contract для Dementor / Event / Course / Project / Merch / Quote / Test / Service states; визуальный эталон — `/design-system/`.
- `docs/COMPONENT_SYSTEM_v1.md` — рабочая component/page system.
- `docs/GLOBAL_HEADER_v1.md` — единый header, desktop navigation, mobile burger и правила локальных product bars.
- `docs/MOTION_NAV_SEO_IMPLEMENTATION_v1.md` — navigation, motion и metadata baseline.
- `docs/PRODUCTION_QA_v1.md` — production gate и responsive QA.
- `docs/SITE_HARMONIZATION_AUDIT_2026-08-26.md` — карта применения presentation standard по существующим страницам.
- `docs/deployment.md` — deployment contract.
- `docs/PUBLISHING_PLAYBOOK_v1.md` — процедура публикации сущностей.
- `docs/OPERATIONS_RUNBOOK_v1.md` — operational runbook.
- `docs/FEATURE_ACTIVATION_MATRIX_v1.md` — READY vs LIVE для внешних функций.
- `references/REFERENCE_RESPONSIBILITIES.md` — карта ответственности Public Records / Actual Source / 032c / Mouthwash / DIA / Dementor Ink.

Эти документы являются обязательным source-of-truth для новых страниц и редизайна существующих экранов. Новая сущность не получает новый случайный дизайн: сначала определяется `entity_type`, `presentation_role`, `context` и responsive contract, затем используются общие primitives.

## Test material ≠ public content

Макеты разрешено проектировать и утверждать на тестовом материале.

Это утверждает **дизайн и композицию**, но не превращает test/demo/mock/placeholder/draft данные в публичный контент.

Перед production обязательно:

1. заменить тестовый материал на отдельно утверждённые публичные данные;
2. повторно проверить макет уже с реальным контентом;
3. пройти production QA;
4. получить явное release approval;
5. только после этого обновить `dementor-club-production` и выполнить отдельное production release action.

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
- `/projects/logic-awareness/dossiers/`
- `/projects/logic-awareness/dossiers/logic/`
- `/projects/logic-awareness/dossiers/awareness/`
- `/community/`
- `/community/valentin/`
- `/community/nikita/`
- `/community/evgeniy/`
- `/community/gabil/`
- `/merch/`
- `/objects/001-ne-nado/`
- `/catalog/`
- `/archive/`
- `/join/`
- `/courses/dumai-s-opasnostyu/`
- `/courses/ne-komanda/`
- `/courses/dengi-na-veter/`
- `/courses/slaboumie-i-otvaga/`

Служебные страницы:

- `/donate/`
- `/contacts/`
- `/legal/privacy/`
- `/legal/terms/`
- `404.html`

Internal reference:

- `/design-system/` — noindex UI Lab / visual standard; не добавляется в публичную навигацию.

`content/registry.json` — единый implementation registry публичных сущностей. Records обязаны соответствовать `content/ENTITY_CONTRACT.md`.

## Release validation

Перед production-кандидатом обязательно выполнить:

```bash
node scripts/validate-site.mjs
node scripts/validate-content-readiness.mjs
node scripts/validate-visual-contract.mjs
node scripts/validate-production-release.mjs
```

Validator stack проверяет:

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
- статусные инварианты;
- визуальный contract;
- отсутствие legacy production origin и очевидного test/demo contamination в production release.

Любая validation error является release blocker. Warning требует проверки, но не блокирует процесс автоматически.

## External feature activation

Все внешние функции включаются через `site-config.js`.
До утверждения провайдера/endpoint они должны оставаться disabled:

- Contacts submit;
- Donate payment;
- Merch checkout;
- Event registration;
- Community membership — только согласно актуальному source-of-truth и provider state.

UI readiness не является фактом публичной доступности функции.

## Deployment status

Canonical domain: `https://dementor.club`.

Production branch contract: `dementor-club-production` only.

`dementor-club-site` is staging and does not publish the production domain on ordinary pushes.

Production release is explicit-only and is blocked when the validation stack finds release contamination or inconsistent production metadata.

Do not claim a new version published until the production workflow succeeds and the live domain is smoke-tested.

## Storage split

GitHub stores optimized delivery assets, code and implementation rules.

Google Drive stores high-resolution raster masters, photos/video, design exports, presentations and heavy source assets.
