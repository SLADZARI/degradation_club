# DEMENTOR LIVE — GLOBAL DESIGN AUDIT / EXECUTION PLAN v0.1
Дата: 2026-10-17 | Аудит: GA-01 | Статус: IN PROGRESS — документальный и числовой аудит, не runtime QA.
Базовый GDD: docs/dementor-live-gdd-v0.1 / projects/dementor-live/gdd/v0.1. Базу v0.1 не переписывать; предложения исправлений складывать в новую ревизию и связывать с ID проблемы.
## Цель
Превратить 27 концептуальных глав в согласованную, покрытую тестами, численно проверенную и технически реализуемую спецификацию. Результат — Master GDD v0.2 candidate + отдельные domain contracts, config, suite сценариев, протоколы проверки, decision register, release gates. V0.2 не APPROVED без явной проверки пользователем.
## Принципы
1. Одно определение, один владелец и один источник данных; другие разделы только ссылаются.
2. Разделять design assertion, числовой TEST, calculated result, user approval, actual automated test. Не смешивать.
3. У каждой цифры: ID, единицы измерения, длительность (real vs world), допущение, источник, версия, дата расчёта, зависимые таблицы.
4. Каждый расход = запись баланса/резерв; каждая передача = debit+credit без двойного начисления; действия идемпотентны.
5. Для офлайн-процессов с общими ресурсами нужен event replay; нельзя просто умножать rate на прошедшее время.
6. Визуальные исходники и игровая геометрия независимо версионируются, перед runtime проверяется один полностью готовый 8-view SVG master.
7. Базовый канон, разделы, цены и новый проект хранить изолированно от Dementor Battle и Robo Games.

## Рабочие волны и контрольные этапы
R0 | Source integrity. Инвентаризация 27 разделов, первичных решений, полнота архива чата, Drive character 0.1/0.2/0.3, сопоставление статусов. Выход: provenance index и coverage. PASS: ни одно утверждение не превращено без источника в APPROVED; исходный текст или честный признак consolidated-only.
R1 | Ontology and ownership. Единый словарь ItemID/PAPER/PAPER_SHEET/HEMP_FIBER/FLAX_FIBER, роли, states, time domain, area vs sprite. Выход: DATA_DICTIONARY + contracts. PASS: нет разных смыслов одного resource ID.
R2 | Numeric static verification. Пересчёт участка, стройматериалов, суточных курьеров, 4 растений, волокна, воды, бумаги, картона, затрат, пропускной способности. Выход: BALANCE_AUDIT_01 + machine-readable cases. PASS: арифметика повторяема, значения либо consistent, либо зарегистрирован дефект.
R3 | Finance ledger. Проверить денежный источник: CITY treasury, стартовые гранты, job payouts, shop purchases, trade escrow/refunds, tax/sinks, abuse replay. Симуляции 1/2/20/100 игроков. PASS: ни одна операция не создаёт PAPER без утверждённой эмиссии.
R4 | Conservation. Для WOOD/HEMP/FLAX/fibers/water/PAPER_SHEET/CARDBOARD проверить рецепты, транспорт, склады и журналы. PASS: нет двойного расхода, отрицательного баланса, незарегистрированного спавна.
R5 | Time/offline/concurrency. Growth/pump/processing/shared tank, active/offline equivalent; двухпользовательские одновременные покупки; сетевые retries; сбой после каждого транзакционного шага. PASS: детерминированный итог и exactly-once effects.
R6 | Geometry/visual. Проверить 2D camera, WU↔BuildCell/Tile, 12×12 plot fit, setbacks, NPC scale 256×320 anchor(128,285), 2.0 board geometry и 8 consistent gameplay views. PASS: first hero rig animated, human approved; только потом engine/runtime.
R7 | Gameplay/cooperation. Onboarding from 80 PAPER to first house; доступность работ при низком онлайне; shop public/private split; 2-person expedition replay/world liberation once. PASS: нет невозможных шагов/социального тупика.
R8 | Economy stress test. Игровые сутки vs реальные; 24h/7d/30d farm and industrial snapshots at manual/automated modes; CITY budget/stock scarcity, price caps, player market; faucet-sink and profitability. PASS: нет бесконечного неконтролируемого арбитража и вынужденного банкротства казны.
R9 | Security/privacy/safety. Server authority, RLS/auth, moderator actions, age gating, chat storage, anti-abuse, inventory/land/treasury permissions. PASS: критические сценарии имеют негативные тесты и реальные политики до public gate.
R10 | Release/documentation reconciliation. Каждый из 27 документов: definitions, entities, state machine, numbers, invariants, flows, dependencies, risks, acceptance, migrations; user review → GDD v0.2 candidate. PASS: coverage=27/27 по спецификации, all P0 blockers resolved and tested in their owning gate.

## Документационные результаты
A. Global Audit Index + Change Log + Source Completeness Matrix.
B. Crosscheck Register (старые CC-001..027 сохранены; новые CC-028+).
C. Numeric Balance Audit (assumptions / formulas / calculated tests).
D. Data Dictionary / Units and resource provenance policy.
E. 27-System Test Matrix / Acceptance gates.
F. Transaction and Time Invariants / negative, rollback and failure cases.
G. Scenario library: first 60min, 24h farm, 7day microenterprise, 30day treasury stress, multiplayer trade, water concurrency.
H. Risk register / owner / severity / closure evidence.
I. Proposed patches for each owning chapter; approved changes only after review.
J. Master GDD v0.2 candidate and review minutes — not yet created as an approved revision.

## Как трактовать статусы
CALCULATED = только формула и арифметика проверены на тестовых допущениях.
DESIGN CHECK = текстовая проверка и обнаружение конфликта.
NOT RUN = нет исполняемой игровой подсистемы / нет визуального образца.
BLOCKED = требуется утверждение, данные или реализованная система.
VERIFIED = фактический тест с evidence, конфигурацией и воспроизводимыми входами.
Списки acceptance в GDD — планы, а не автоматически пройденные тесты.

## Жизненный цикл дефекта
DISCOVERED → TRIAGED → PROPOSED_FIX → APPROVED_FIX → IMPLEMENTED → TESTED → CLOSED.
Каждой записи: CC-ID, системы-источники, важность, репродукция, ожидаемое, фактическое, Proposed Fix, owner, dependency, test/evidence, status, versions affected.
Закрытие денежного/ресурсного дефекта требует проверяемого контракта и сценария, не только обновлённого текста.

## Приоритеты
P0 Character pipeline before runtime, currency/material distinction, city treasury mechanics, multi-resource time replay, data ownership; P1 onboarding and resource balancing; P2 market/social/expedition; P3 commercialization/public policy.
Не переносить выполнение на фон по умолчанию: без отдельной автоматизации и/или Work дальнейшие шаги выполняются в рамках активных сеансов.
