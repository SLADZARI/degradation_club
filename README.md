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
- `docs/MOTION_NAV_SEO_IMPLEMENTATION_v1.md` — navigation, motion и metadata baseline.
- `docs/PRODUCTION_QA_v1.md` — production gate и responsive QA.
- `docs/deployment.md` — deployment contract и текущий verified Vercel state.
- `references/REFERENCE_RESPONSIBILITIES.md` — карта ответственности референсов: Public Records / Actual Source / 032c / Mouthwash / DIA / Dementor Ink.

Эти документы являются обязательным source-of-truth для новых страниц и редизайна существующих экранов.

## Asset rules

- `assets/ink/README.md` — production contract для Dementor Ink.
- `assets/social/README.md` — OpenGraph/social preview contract.

**Artistic illustrations are raster-only.** Для Dementor Ink и social artwork используем WebP / PNG / JPG. SVG не используется как формат художественной иллюстрации и не должен появляться через autotrace/vectorization.

## Source-of-truth

Смыслы, правила клуба, продукты и утверждённые тексты сначала фиксируются в ветке `dementor-club`. Правила публичной подачи — в `dementor-club/brand/PRESENTATION_RULES.md`. Эта ветка отвечает только за их веб-реализацию.

«Логика и осознанность» развивается независимо в `logic-awareness`; сайт представляет проект, но не переписывает и не публикует его draft-материалы как утверждённые.

## Current site architecture

- `/`
- `/about/`
- `/events/`
- `/events/fuengirola/`
- `/projects/`
- `/projects/logic-awareness/`
- `/community/`
- `/merch/`
- `/join/`

## Deployment status

Production branch contract: `dementor-club-site` only.

Current Vercel connection is **not yet verified as deployable**: the connected team is visible, but its project listing currently returns zero projects. Treat older deployment notes/aliases as historical until a live project and routes are verified again.

## Storage split

GitHub stores optimized delivery assets, code and implementation rules.

Google Drive stores high-resolution raster masters, photos/video, design exports, presentations and heavy source assets.
