# Каноническая карточка товара Dementor Club

Каждый физический товар хранится отдельным Markdown-файлом в `merch/products/`.

## Обязательные поля

- `product_id`
- `entity_type`
- `name`
- `public_name`
- `public_url`
- `category`
- `line`
- `status`
- `sales_state`
- `drop`
- `short_idea`
- `public_description`
- `materials`
- `dimensions`
- `weight`
- `finish`
- `marking`
- `packaging`
- `edition`
- `base_price_eur`
- `production_cost_ceiling_eur`
- `currency_display`
- `production_notes`
- `website_assets`
- `primary_asset`
- `social_assets`
- `related_project`
- `related_entities`
- `recommendation_tags`
- `placement_tags`
- `recommendation_priority`
- `approved_phrases`
- `prohibited_presentation`
- `updated_at`

## Recommendation metadata

Поля рекомендации не превращают сайт в отдельный источник правды. Они описывают, где уже существующий товар разрешено показывать в экосистеме.

- `entity_type` — `object / wear / paper / edition / project-edition`;
- `public_url` — стабильный публичный URL товара;
- `sales_state` — публичное коммерческое состояние (`not-open / coming / available / sold-out / archived`);
- `primary_asset` — основной site-ready asset;
- `related_entities` — явные связи с course/event/project/product IDs;
- `recommendation_tags` — контекстные теги для ранжирования;
- `placement_tags` — разрешённые named slots;
- `recommendation_priority` — относительный приоритет среди одинаково релевантных сущностей, без отмены контекстной релевантности.

Архитектура placements и ограничения описаны в `merch/ENTITY_PLACEMENT_AND_RECOMMENDATION_RULES.md`.

## Цена

`base_price_eur` — единственная каноническая публичная цена.

Другие валюты не записываются в карточку как источник правды. Они вычисляются интерфейсом сайта из EUR.

Если товар имеет варианты размеров, каждый вариант получает собственные:

- `variant_id`;
- размеры;
- ориентировочный вес;
- `base_price_eur`;
- лимит серии.

## Описание

Карточка должна разделять:

1. **факт** — что физически производится;
2. **публичную подачу** — как объект описывается покупателю;
3. **рабочие параметры** — себестоимость, подрядчик, прототипы, упаковка;
4. **неутверждённые решения** — отдельно, без выдачи за факт.

## Принцип

Товар Dementor Club не должен выглядеть как рекламная сувенирная продукция с нанесённым логотипом. Если убрать логотип, предмет всё ещё должен оставаться осмысленным объектом коллекции.
