# WORLD ORGANISM v0.10 — Матрица сущностей и миров
**Источник истины для реестра:** пользовательские решения, [WORLD REGISTRY v1.0](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-dual-track-v1-2026-10-20/projects/dementor-live/architecture/WORLD_REGISTRY_v1.0.md) + указанные draft PR. Машинный JSON 48 EntityKind передан в артефактах чата; не объявлять все 48 игровыми объектами production.

| Группа | Источники | В объединённой лаборатории | Не реализовано/не проверено |
|---|---|---|---|
| Внутренняя экономика | v0.8, FIRST HOME LOOP | исполняемое ядро: PAPER, ресурсы, огород, finite orders, P2P, продукт, physical PAPER_SHEET | live game runtime интеграция |
| Разные роли | [PR #273](https://github.com/SLADZARI/degradation_club/pull/273) | 10 ролей: MAYOR, RESIDENT, COURIER, FARMER, BUILDER, TOURIST, EXPLORER, NPC_WORKER, NPC_STORY, NPC_HOSTILE; раздельные права и идентичность | реальная auth/AI NPC и классы игроков |
| Сюжетные транзакции | [PR #274](https://github.com/SLADZARI/degradation_club/pull/274) | три демо: job/escrow/courier, kiosk/travel, depleted rock | реальная физика пути, боевой runtime |
| CIVIC земли | [PR #285](https://github.com/SLADZARI/degradation_club/pull/285) | типы residential/commercial/mixed и паспорта для будущих договоров | фактическая аренда/витрины/миграция real saves |
| CIVIC P3 | [PR #287](https://github.com/SLADZARI/degradation_club/pull/287) | физический объект/паспорта payphone/pager и второй мост | телефонный UI, приватный inbox, bridge server |
| CIVIC P4/P5 | [#290](https://github.com/SLADZARI/degradation_club/pull/290), [#292](https://github.com/SLADZARI/degradation_club/pull/292) | finite stone stock and footprint shrink в лабораторном DEMO | общий реальный z-buffer, collision и hiking |
| Cave, oil, fishing | [#286](https://github.com/SLADZARI/degradation_club/pull/286) | реестр/паспорта | cave gameplay, UI и ловля рыб отсутствуют |
| CIVIC world | [#275](https://github.com/SLADZARI/degradation_club/pull/275) | origin city, forest/mountains in-city, farlands, small legacy museum | actual runtime navigation |
| UNIVERSE Ideas Forest | [WORLD REGISTRY](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-dual-track-v1-2026-10-20/projects/dementor-live/architecture/WORLD_REGISTRY_v1.0.md) | карта, переход узла в DEMO | integrated server portal |
| UNIVERSE MentalHumor | [PR #279](https://github.com/SLADZARI/degradation_club/pull/279) | separate park+museum hall cards (не заменяют CIVIC музей) | licensed exhibits/live route |
| Обитель Габеля | проектное решение 20.10.2026 | концептуальная зона, 6 областей, 5000 USD external founding gate, без попытки списания PAPER | точные имена, геометрия, payment API, серверный gameplay |
| Межтрекинговая архитектура | [#281](https://github.com/SLADZARI/degradation_club/pull/281) | один объект аналитической лаборатории с provenance | НЕ выполнено объединение CIVIC/UNIVERSE в game server |

**Правило:** каждая новая область имеет world passport (ID, source ref, status, owner, scene geometry, return path, assets, collision, economy and QA). Не создавать новые валютные источники, не переносить приватную собственность при смене города, не обещать пользовательский игровой переход по карточке карты. Внешние миры требуют миграции, двух реальных браузерных клиентов и отдельного релизного гейта.
