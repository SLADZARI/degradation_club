# Dementor Club — Merch Product Lifecycle v1

Status: WIP architecture
Branch: `wip-merch-source-entities`
Updated: 2026-08-25

## Purpose

Статус товара описывает не визуальную готовность, а степень фактической готовности физического продукта.

Дизайн, mockup, рендер или готовая фотография сами по себе не делают товар `approved`, `production` или `available`.

## Status flow

`idea → prototype → approved → production → available → sold-out → archived`

Допустимы отдельные выходы в `cancelled`.

## idea

Есть только концепция или рабочая гипотеза.

Минимум:

- понятна идея;
- есть рабочее название или направление.

На сайт как товар не выводится.

## prototype

Есть достаточно данных для проверки физической реализации, но не для продажи.

Обычно есть часть следующего:

- artwork;
- mockup;
- базовая спецификация;
- материал/GSM/размерное направление;
- способ печати/производства;
- первые образцы или подготовка к ним.

Может существовать в private/WIP site-data, но не в публичном store register.

## approved

Команда утвердила сам продукт как существующую товарную сущность.

Обязательно:

- стабильный `product_id`;
- public name;
- category/product type;
- утверждённый смысл/statement;
- материал и основные физические параметры;
- вариантная модель или решение, что вариант один;
- каноническая цена EUR либо явное решение, что цена будет утверждена до `production`;
- ограничения presentation/positioning;
- source-of-truth record.

`approved` ещё не означает, что товар можно купить.

Публичная страница может существовать со статусом `SALE CLOSED`.

## production

Производство подтверждено или запущено.

Обязательно:

- approved product;
- supplier/producer confirmed;
- производимая спецификация подтверждена;
- SKU/variant set зафиксирован;
- реальная себестоимость/производственный бюджет проверены;
- MOQ/edition/production quantity определены;
- packaging direction подтверждён;
- логистические ограничения известны;
- product assets либо уже готовы, либо имеют конкретный production state.

Checkout по умолчанию остаётся закрытым, если отдельно не утверждён preorder.

## available

Товар реально доступен к заказу.

Обязательно:

- production readiness подтверждён;
- SKU существуют;
- stock status каждого продаваемого SKU известен;
- `base_price_eur` утверждён;
- shipping class/ограничения определены;
- approved website assets готовы;
- offer имеет `sale_status: open` или `preorder`;
- checkout provider/reference/purchase URL настроены;
- legal/privacy/terms проверены для используемого commerce flow.

Только `available` разрешает обычный BUY CTA.

## sold-out

Продукт существовал в продаже, но активного доступного остатка/offer больше нет.

Публичная product page сохраняется, checkout закрывается.

## archived

Товар остаётся частью истории/архива, но больше не входит в текущую витрину.

## cancelled

Концепция/продукт остановлен. Не выводится как текущий товар.

## Sale status is separate

Product status и Offer sale status — разные состояния.

Пример:

- product: `approved`;
- offer: `closed`.

Это означает: объект утверждён и может быть показан, но его ещё нельзя купить.

Offer statuses:

`closed / preview / preorder / open / paused / sold-out`

## Promotion checklist

### prototype → approved

- [ ] product_id fixed
- [ ] public name fixed
- [ ] artwork binding fixed where relevant
- [ ] base spec fixed where relevant
- [ ] material/construction approved
- [ ] variants model defined
- [ ] canonical price decision recorded
- [ ] public copy approved
- [ ] prohibited presentation recorded

### approved → production

- [ ] supplier/producer confirmed
- [ ] sample/prototype checked
- [ ] final production spec fixed
- [ ] SKU list fixed
- [ ] quantity/MOQ/edition fixed
- [ ] packaging fixed
- [ ] logistics constraints known

### production → available

- [ ] stock/preorder state explicit
- [ ] approved media available
- [ ] price live
- [ ] shipping class live
- [ ] offer open/preorder
- [ ] checkout URL configured
- [ ] legal/privacy/terms reviewed

## Current examples

- `DC-OBJECT-001` — approved, sale closed.
- `DC-OBJECT-002` — approved, sale closed.
- `DC-M-001` — prototype.
- `DC-M-002` — prototype.
- `DC-M-003` — prototype.
- `DC-M-004` — prototype.
