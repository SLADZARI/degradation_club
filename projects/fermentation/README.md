# Fermentation

Статус: **INTERNAL R&D / DEMAND-VALIDATION PROTOTYPE**  
Публичный статус: **не запущен**  
Тип сущности: `project`

## Канонический вход

**Fermentation** — утверждённое каноническое имя продукта и проекта внутри Dementor Club.

Protected PRODUCT authority:
- `projects/fermentation/product/fermentation-product.v1.0.md`
- artifactId: `fermentation.product.core`
- status: `APPROVED v1.0`

Decision record:
- `projects/fermentation/decisions/product-direction.v1.0.md`
- artifactId: `fermentation.decision.product-direction`
- status: `APPROVED v1.0`

Этот README — навигационная точка проекта. Он не дублирует полный продуктовый контракт.

## Кратко

Fermentation — проект Dementor Club, который проверяет спрос на персонализированную ферментацию как сочетание готового ферментированного продукта, кастомизации и live-наблюдения за собственным процессом.

Основная гипотеза: люди могут платить не только за ферментированную капусту, а за experience — сделать ферментацию своей, наблюдать живой процесс и получить готовый продукт.

## Текущая база

### Product authority

`projects/fermentation/product/fermentation-product.v1.0.md` — единственная текущая PRODUCT authority проекта. Исследования, UI-прототип и implementation docs не должны переопределять её молча.

### Google Drive — RESEARCH / REFERENCE

- Папка проекта: https://drive.google.com/drive/folders/1qvVzl-hb9Sf2PY7qTFELAauIf-eGwQTP
- Основной исследовательский документ: https://docs.google.com/document/d/1kUMKJDErN2lMX1oWL7X4Okyc18KYNLvKJzbTkBUauCg/edit

В Drive находятся продуктовые исследования, аудитория, процесс ферментации, оборудование, live-стриминг, экономика, рынок и правовые материалы. Исследовательские цифры и утверждения не становятся APPROVED автоматически.

### Implementation

Repository: https://github.com/SLADZARI/dementor-fermentation

Он хранит приложение, техническую архитектуру, тесты, implementation docs, Result/evidence и release history. Его MP_DSL kernel должен указывать обратно на этот PRODUCT authority.

Baseline frontend: Vite + React + TypeScript, импортирован из Figma Make и сохранён без production deployment.

Deployment status: **не выполнялся**. Deploy остаётся отдельным явным решением.

## Подтверждено

- каноническое имя: **Fermentation**;
- продукт сочетает food + controlled process + live experience;
- Fermentation package включает live-доступ;
- live-only и ready-product являются отдельными допустимыми входами;
- Starter / Personal / Experience — рабочая package architecture, но не утверждённая экономика;
- кастомизация является core proposition;
- клиент должен иметь возможность видеть собственную ферментацию;
- bubbles / gas activity / macro-visible process являются частью intended experience;
- pH, temperature, salt, curve/history входят в intended transparency при наличии реальных данных;
- запись процесса является частью направления;
- первый физический pilot может быть одной ферментацией с одной камерой;
- ~5 L cell — рабочее предположение для проектирования, не финальная спецификация;
- 360 / multi-cell — более поздний эксперимент;
- manual degassing не утверждён как обязательный или полезный технологический шаг;
- текущий сайт предназначен прежде всего для проверки спроса, а не для production commerce.

## Не утверждено

- цены, скидки и unit economics;
- точные веса пакетов;
- длительность цикла и release criteria;
- финальная ёмкость/ячейка;
- число ячеек/стоек;
- camera/streaming/sensor architecture;
- storage model записи;
- payment/auth/fulfillment architecture;
- food-safety, probiotic, medical или regulatory claims без отдельной проверки и approval;
- причинные claims о влиянии фаз Луны;
- обязательная ручная дегазация.

## Boundary

`degradation_club@dementor-club/projects/fermentation` = PRODUCT / semantic authority проекта и его связь с Dementor Club.

`SLADZARI/dementor-fermentation` = implementation authority.

WeeklyOS = operating projection: Project / current Result / Gate / branch / evidence. WeeklyOS не копирует PRODUCT.

Google Drive = RESEARCH / REFERENCE / source material, если конкретный артефакт не промотирован отдельно.

## Gate state

- `G1_PRODUCT_LOCK`: **PASSED** через `fermentation.product.core v1.0`.
- `G2_DOMAIN_LOCK`: **OPEN / next semantic gate**.
- ARCHITECTURE и DESIGN не считаются APPROVED по факту существования Figma/React-прототипа.
- ближайший implementation Result: demand-validation landing cleanup.
