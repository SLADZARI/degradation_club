# Dementor Club — Merch Review Checklist v1

Status: WIP / review before merge
Branch: `wip-merch-store-architecture`
Updated: 2026-08-25

Этот файл — короткая карта того, что нужно проверить в Git перед переносом в рабочие ветки и до любого деплоя.

## A. Архитектура сущностей

Проверить модель:

`COLLECTION → ARTWORK + BASE SPEC → PRODUCT → VARIANT/SKU → OFFER → ASSET`

Ключевые решения:

- artwork не является товаром;
- base spec хранит переиспользуемую физическую спецификацию одежды;
- product связывает физическую вещь с artwork/base spec;
- SKU хранит конкретный вариант;
- offer отдельно хранит возможность купить;
- asset отдельно хранит изображение/OG/gallery.

Решение: `APPROVE / CHANGE`.

## B. Public store сейчас

Публичный store manifest содержит только два утверждённых объекта:

1. `DC-OBJECT-001 — OBJECT 001 — НЕ НАДО`;
2. `DC-OBJECT-002 — OBJECT 002 — ЦЕЛЬ`.

Оба:

- product status: `approved`;
- sale status: `closed`;
- checkout: disabled;
- media: pending.

Проверить:

- названия;
- тексты;
- цены EUR;
- материалы;
- варианты `ЦЕЛИ`;
- URL: `/merch/ne-nado/`, `/merch/tsel/`.

## C. Prototype merch — НЕ публичный

В private WIP preview сохранены:

- `DC-M-001 — CAP / CORE STATEMENT PIECE`;
- `DC-M-002 — TEE / STATEMENT PIECE`;
- `DC-M-003 — HOODIE / ANTI STATEMENT PIECE`;
- `DC-M-004 — MUG / DAILY REMINDER`.

Все имеют status `prototype`, source label `PENDING`, `publicCatalog: false`, price `null`.

Проверить сами идентичности/направления. Не нужно пока утверждать цену или продажу.

## D. Wear base specs

### Tee prototype base

- 100% cotton;
- 220–240 g/m²;
- unisex oversized;
- white primary base;
- silkscreen / water-based direction;
- Portugal / Turkey direction.

### Hoodie prototype base

- heavyweight cotton-fleece direction;
- 400 g/m²;
- unisex oversized;
- black primary base;
- silkscreen / embroidery direction;
- Portugal / Turkey direction.

Проверить: оставить ли эти параметры как направление для поиска supplier/sample.

## E. Artwork

Phase 01:

- SUCCESS IS BORING.
- DON'T IMPROVE YOURSELF.
- DO LESS.
- PERSONAL GROWTH CANCELLED.
- OPTIMIZED FOR NOTHING.
- 10X LESS.

Recovered core concepts:

- ANTI SELF HELP;
- УПАКУЕМ ЦЕЛИ В РАСТЕРЯННОСТЬ.

Важно: Phase 01 artworks пока не привязаны автоматически к конкретным T-shirt PRODUCT records.

## F. Store UX v1

Предлагаемая первая версия:

`/merch/ → category → product → variant → direct checkout`

Без:

- cart;
- account;
- внутреннего order backend.

Категории уже заложены:

- Objects;
- Wear;
- Paper;
- Editions;
- Project Editions.

Пустая категория показывает корректный empty state, а не prototype товары.

## G. Checkout gate

BUY невозможен, если не выполнены одновременно:

1. product status = `available`;
2. offer status = `open` или `preorder`;
3. есть purchase URL;
4. `site-config.js → merch.checkoutEnabled = true`.

Сейчас checkout остаётся выключен.

## H. Images

Пока изображения в работе:

- public products: `IMAGE PENDING`;
- prototype graphics не используются как product photos;
- media arrays пустые до утверждения assets.

После готовности изображений отдельно проверить:

- cover;
- gallery;
- detail;
- scale;
- packaging;
- OG/social.

## I. Перед merge/deploy

- [ ] утвердить entity model;
- [ ] решить, какие prototype records переходят в canonical `dementor-club`;
- [ ] проверить public copy двух Objects;
- [ ] проверить product routes;
- [ ] проверить изображения;
- [ ] оставить SALE CLOSED или утвердить provider/offers;
- [ ] получить зелёный Site Integrity;
- [ ] merge source decisions в `dementor-club`;
- [ ] затем merge implementation в `dementor-club-site`;
- [ ] только после этого deploy.
