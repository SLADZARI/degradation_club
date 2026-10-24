---
artifactId: dementor-club.proposal.team-orchestration-and-github-handoff-v0.1
project: dementor-club
documentType: PROPOSAL
projectStage: PLANNING
status: DRAFT
version: "0.1"
updated: "2026-10-17"
owner: "Dementor Club / owner review pending"
sourceSystem: GIT
authorityType: REFERENCE
relatedIssues:
  - 237
  - 228
  - 227
implementationAuthorized: false
productionDeployAuthorized: false
semanticMutationAuthorized: false
---

# DEMENTOR CLUB — Team Orchestration & GitHub Handoff v0.1

**Статус: DRAFT / на обсуждение. НЕ APPROVED.**  
**Контекст:** подготовка переезда портала, игр и микропроектов на существующую VM; совместная разработка без повторной локальной настройки.  
**Решение владельца:** ещё требуется. Этот документ НЕ создаёт новый Result, не открывает implementation, не меняет доступы, не меняет production, не утверждает роли продукта и не отменяет действующие решения.

## 0. Основная идея

`GitHub = traceable work graph`:

- **GitHub Issues** — единица работы, проверяемая постановка, зависимости, вопросы, блокеры, приёмка;
- **GitHub PR** — точный кодовый или документальный diff, ревью, CI;
- **`.weekly-os` Result/Gate** — разрешение на implementation, связь с approved authorities, интеграционная ветка, доказательства release;
- **источники продукта** — остаются у своих canonical owners, Issues не заменяют семантическую authority;
- **release/deploy evidence** — отдельное подтверждение фактического состояния, а не вывод из успешного коммита.

Главное правило: **одна задача → один ответственный исполнитель → один проверяемый результат → одно решение о закрытии**. Исполнителей и запросов может быть несколько, но ответственный за интеграцию остаётся один.

**Лид — оркестратор**, а не обязательный исполнитель каждого технического шага. Он читает состояние, выбирает следующий безопасный объём, выстраивает зависимости, выполняет работу в своей компетенции и передаёт специализированные подзадачи команде.

Каждый участник может направлять другому участнику **GitHub-запрос**, но не может сам себе выдавать полномочия, менять чужой scope или публиковать production.

## 1. Existing truth и границы

Прочитать до изменения любого действующего кода или продуктового смысла:

1. `dementor-club/.weekly-os/PROJECT.json` → `ARTIFACT_INDEX.json` → `APPROVED_STATE.json`;
2. `readFirst` из PROJECT и точный authoritative artifact через artifactId/metadata/pointer;
3. относящиеся к работе `Result`, его актуальный `Gate`, integration branch, acceptance criteria, evidence;
4. actual repository/source branch и runtime ownership;
5. существующий Issue, PR, canonical owner, аналогичный механизм;
6. current production SHA, deploy/release status; Git commit ≠ live deploy.

Существующие рабочие направления:

- **#228** — стабилизация и контроль accepted baseline;
- **#237** — миграция инфраструктуры; сейчас **BACKLOG / DEFERRED**, implementation/cutover **не разрешены**;
- **#227** — проверка реального пути idea → Board → Share → приглашённый пользователь;
- `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md` — canonical QA ledger;
- `concept/PRODUCT_MARKETING_PACKAGE_INDEX_V1.md` — навигация по продуктовым источникам (не blanket APPROVED);
- `dementor-club-production/docs/deployment.md` — действующая manual production publication policy;
- `operations/MEMBER_ACTIVATION_SEMANTICS_V2.md` — локальное утверждённое решение, но не разрешение изменить runtime без Result.

Конфликт authoritative sources → **STOP semantic mutation** → Issue с evidence и явным решением владельца. `MP_DSL v0.1` остаётся DRAFT/REFERENCE.

## 2. Организация: роли ≠ конкретные люди ≠ системные полномочия

Роли ниже — **предложение о распределении инженерной ответственности**, а не новые product membership/permission roles. Один человек может исполнять несколько ролей; один AI-агент может быть помощником, но не владельцем production credentials, доступа или самостоятельного release.

| Роль / ID | Отвечает | Выход | Чего НЕ делает самостоятельно |
| --- | --- | --- | --- |
| **L-01 Lead / Orchestrator** | Приоритизация, dependency DAG, scope/Result/Gate, распределение, интеграция и отчёт владельцу | Единый план, решения о маршрутизации, отчёты, merge-ready состояние | Не обходит owner approval, не выдумывает authority, не называет merged = deployed |
| **P-01 Product / Business Analyst** | JTBD, аудит approved vs implemented, CJM, критерии пользовательской ценности, экономические допущения | Product gap matrix, сценарии acceptance, Proposal для спорных решений | Не меняет membership/roles/pricing и не выдаёт гипотезы за утверждённый продукт |
| **A-01 Solution Architect** | Состав компонентов, service boundaries, current vs target, безопасность изменений, ADR/Change Proposal | Архитектурные схемы, dependency map, rollback boundary | Не создаёт новые таблицы/state/auth ownership до решения |
| **I-01 DevOps / Platform** | VM, isolated /srv/dementor, Docker/Nginx, GitHub Actions, staging, observability, бэкапы и восстановление | Повторяемый deploy/rollback, operational evidence | Не трогает legacy /data, MDAO, чужие сервисы, DNS/production без approval |
| **B-01 Backend / Data** | Supabase Auth/RLS/RPC/Storage/worker, миграции, data parity | DB contracts, migration/replay/restore validation, тесты прав | Не переносит production DB и не меняет scopes/permissions без Gate |
| **F-01 Frontend / Web** | Public shell, Workspace, Board, auth callback, routes, accessibility/mobile, frontend integration | Код + browser tests + PR | Не дублирует Header/Footer/Auth/Board owners |
| **G-01 Games / Projects Integrator** | Инвентаризация Battle/Robo/Lab, reproducible builds, runtimes, links, изоляция | Manifest игр, staging deployment, smoke tests | Не смешивает игровые runtime с membership lifecycle |
| **U-01 UX/UI** | Понимание CJM, task-flow, action vocabulary, mobile usability, visual QA | UX findings, прототип/макет, visual acceptance | Не превращает дизайн в approval новой семантики |
| **Q-01 QA / Security Validator** | Независимые функциональные, role, access, deployment, performance и rollback проверки | Test matrix, FAIL/PASS с evidence, reproduce steps | Не объявляет release-ready по одному screenshot/build |
| **E-01 Editorial/Content** | Статусы/смыслы публикаций и проектов, содержимое страниц, редакционный workflow | Публично допустимый материал и provenance | Не публикует ideas как announced и не обходит source approval |
| **X-01 Host Administrator** | Хостинг, изоляция legacy, VM-сеть, ресурсы и согласование host-level изменений | Подтверждения инфраструктуры и host limitations | Не становится автоматически продуктовым owner |

### Предварительное распределение людей — требует подтверждения

- **Владелец переезда / финальное решение:** пользователь; выполняет настройку и перенос кода, владеет DNS-доступом. Может выступать Lead/DevOps; единоличное техническое действие не заменяет QA/release Gate.
- **Второй разработчик:** совместная разработка портала/игр; реальные области и доступы не подтверждены, назначаются по задачам.
- **Кирилл:** администратор существующей VM Габиля; host-level согласование. Никаких предположений о выдаче ему club GitHub/Supabase доступов.
- **AI-специалисты:** помощники по анализу, реализации, UX, тестам в отдельных задачах, с минимально необходимым доступом.
- Роли `B-01/F-01/G-01` могут распределяться между **двумя исполнителями** по Result; роли `P-01/A-01/Q-01` оформляются как отдельные проверки, даже если человек один.

## 3. Рабочая матрица доступов и знаний

**Это проект матрицы least privilege, а не констатация уже выданных доступов.** Фактический grant подтверждается отдельно. «Read» не означает credential access.

| Зона | Lead | Product/UX/Editorial | Architect | DevOps | Backend | Frontend/Games | QA | Кирилл |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `dementor-club` semantic / .weekly-os | R + proposal | R + proposal | R + proposal | R | R | R | R | По согласованию |
| `dementor-club-site` implementation | PR/review | R | R/review | R/PR infra | PR scoped | PR scoped | R/QA | Нет по умолчанию |
| `dementor-club-production` | R + approved release coordination | R | R/review | R; deploy only on approval | R | R | R | Нет по умолчанию |
| Игровые репозитории | R + assignment | Read as needed | R | Deploy config | Scoped PR | Scoped PR | Test/read | Нет по умолчанию |
| Supabase Cloud prod data/console | По необходимости и отдельно | **Без prod данных** | Schema/docs only | Secrets/config via secure path | Scoped admin/migration only on approval | Publishable client config only | Test accounts / permitted read | Нет по умолчанию |
| VM `/srv/dementor` | SSH with assigned privilege | Нет | Read design/evidence | Scoped admin | Scoped staging | Scoped staging | Read-only test/status | Host-admin по своей роли |
| VM `/data/*` + legacy MDAO | **Нет изменений** | Нет | Нет изменений | Нет изменений | Нет | Нет | Нет | Authority Кирилла |
| DNS, OAuth, production secrets | Только назначенные человеческие операторы через vault | Нет | Design only | Restricted action by approval | Service-specific via vault | Нет | Не получает секреты | Host-level scope only |

Границы информации:

- **PUBLIC:** опубликованные страницы, открытая документация и public-approved assets.
- **INTERNAL:** working decisions, backlog, технические схемы и тестовые данные без персональной чувствительности.
- **RESTRICTED:** SSH private keys, OAuth secrets, service tokens, production DB dumps, private media, реальные пользовательские сведения и содержимое отдельных закрытых проектов.
- GitHub Issues/PR не являются secret vault. Секреты и бэкапы не прикреплять к Issues, не отправлять агентам без необходимости и не включать в логи/CI artifacts. Тестовые сценарии используют синтетические аккаунты и данные, где возможно.
- Для приватных проектов — только их разрешённый owner и явный invite; видимость в Board ≠ доступ к исходникам или данным.

## 4. Knowledge Manifest: что должен получить специалист вместе с Issue

Каждая задача содержит `knowledgeRefs` — **точные пути/ветки/версии**, а не абстрактное «прочитай всё на GitHub». Минимум:

1. **Общее**: canonical repo + `dementor-club`, три kernel JSON и актуальный `readFirst`.
2. **Authority**: `artifactId`, exact authoritative path, status (APPROVED / DRAFT / REFERENCE), конфликтные указания.
3. **Result**: ID, Gate, integration branch, acceptance criteria и доступная evidence.
4. **Runtime**: фактические repo/ref, code owner/route/API, existing equivalent, тестовый URL/fixture (без секретов).
5. **Зависимости**: Issue/PR/Result которые блокируют или от которых зависит задача.
6. **Доступ**: что разрешено читать/изменять; где искать credential по защищённой процедуре; что явно запрещено.
7. **Проверка**: нужные CI команды, browser scenarios, окружение, report destination.

Специалист читает **только релевантный read set**, с указанием приоритетного источника истины. Если источники отсутствуют — `BLOCKED: MISSING_CONTEXT`, задача не додумывается.

### Базовые знания по ролям (точные стартовые адреса)

| Роль | С чего читать сверх kernel |
| --- | --- |
| Lead | #228, #237, #227; Result/Gate каждой активной работы; canonical QA ledger |
| Product/BA | `concept/PRODUCT_MARKETING_PACKAGE_INDEX_V1.md` и по индексу конкретный owning source; #227; approved локальные Decisions |
| Architect | #237, `docs/deployment.md` в production branch, `operations/IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md` (**NOT IMPLEMENTED**) |
| DevOps | #237, current Nginx/Docker inventory из Issue, `docs/deployment.md`; host constraints `/data` |
| Backend | `supabase/migrations/*` и release/QA evidence; Membership v2; exact auth/storage/worker contract |
| Frontend | `docs/GLOBAL_HEADER_v1.md`, shell/route contracts, Site QA, нужный current Result |
| Games | project-local repo docs и собственный Project identity/runtime authority; для Dementor Lab — `projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md` (**identity only**) |
| UX | CJM/Audience/Board/Product package через index, BQA matrix, current approved visual/shell rules |
| QA | `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`, #228, конкретные G6/G7 live evidence |
| Editorial | Content/Programming и Contribution owners через product index; public content approval / runbook |

Указанные документы не получают нового authorityType от включения в таблицу. Проверять metadata и индекс перед каждым substantive Result.

## 5. «ПРОВЕРЬ» означает «восстанови и продолжи контекст», но не «меняй всё подряд»

Если Лид/разработчик получает короткое сообщение **«проверь»**:

1. Определить scope по GitHub Issue, Result, роли и текущему assignment; не искать все проекты без границ.
2. Прочитать актуальные комментарии, PR, dependencies, evidence, acceptance criteria и проверить **фактическое** состояние (GitHub, CI, stage/live).
3. Если задача **незавершена**, не блокирована и implementation прямо разрешён соответствующим Result/Gate, исполнитель **продолжает работу** в назначенном scope до ближайшего доказуемого milestone, затем отчитывается Лиду в Issue.
4. Если требуется другой специалист, исполнитель создаёт **linked request** в той же Issue или отдельную зависимую Issue (только если самостоятельный результат), указывает owner, входные данные, expected output и blocker. Лид видит связь и планирует.
5. Если acceptance уже выполнена — перепроверить evidence и дать отчёт; не запускать повторный deploy.
6. Если новый смысл, конфликт авторитетов, незапрошенный scope, нет Result, Gates/credentials/approval — **STOP / BLOCKED** и конкретный вопрос/Proposal.
7. **Не объявлять DONE** по формулировке «сделал»: только CI/review/QA и нужный Release/Live Gate позволяют закрытие.

При неопределённом «проверь» и нескольких открытых задачах исполнитель возвращает короткий список релевантных назначенных Issue с рекомендуемым следующим шагом, не начинает произвольную.

## 6. Жизненный цикл задач — proposal, не новый product lifecycle

GitHub остаётся техническим трекером. Ниже **рекомендуемые рабочие labels/поля**; они не считаются существующими пока не сверим настройки репозитория.

`TRIAGE → READY → IN_PROGRESS → IN_REVIEW → IN_QA → ACCEPTED → CLOSED`

Дополнительные состояния/признаки: `BLOCKED` (причина + зависимость), `NEEDS_DECISION`, `WAITING_ACCESS`, `CARRIED_FORWARD`.

- GitHub Issue остаётся **open** вплоть до acceptance владельцем результата. Labels/Project fields — подсказки, не независимая authority.
- Issue может быть `ACCEPTED` в scope документации, даже если релиз не нужен.
- Для production flow `merge`, `deploy` и `live retest` — разные факты; закрытие release Issue требует exact release evidence.
- Если задача меняет entity/state/permissions/auth/architecture boundary, Лид проверяет необходимость Change Proposal до реализации.
- Не создавать Issue-дубли, если существующий Issue/Result уже владеет проблемой; использовать комментарий, linked subtask или update.
- Комментарии об отказе/ошибке остаются историей, не переписывать прошлые выводы задним числом.

## 7. Контракт GitHub Issue (минимальная форма)

```yaml
title: "[DOMAIN] Краткая проверяемая цель"
parent_issue: 237                  # пример; только если действительно относится
result_id: null                    # НЕ выдумывать Result
gate: "G0_DISCOVERY / UNKNOWN"     # записать реальное значение, не повышать автоматически
owner_role: "F-01"
assignee: "GitHub username / TBD"
reviewer_role: "L-01"
qa_role: "Q-01"
status: "TRIAGE"
scope:
  in: ["точные routes/modules/files"]
  out: ["не трогать prod DB", "не менять membership"]
knowledgeRefs:
  - repo: "SLADZARI/degradation_club"
    ref: "dementor-club"
    path: ".weekly-os/PROJECT.json"
  - "точный authority artifact ID + path + version"
dependencies:
  blocked_by: []
  enables: []
work_branch: null                   # one active Result integration branch
acceptance:
  - "доказуемый проверяемый результат"
evidence:
  - "CI run / screenshot / fixture / SHA / test log"
access_required:
  - "минимальный scope; секреты через защищённый канал"
authorization:
  implementation: false
  production_merge: false
  production_deploy: false
```

Значения выше — **пример шаблона**, не факты о конкретном Issue. Не использовать `G0_DISCOVERY` как новую формальную ступень проекта: здесь это только placeholder, фактический Gate брать из Result.

## 8. Запрос специалиста специалисту

Разработчик может обратиться напрямую к смежной роли через комментарий с явным `@assignee` или отдельную linked Issue. Он не может назначить чужому Result новый scope без Лида.

**Шаблон:**

```text
REQUEST TO [ROLE] · from [ISSUE]
Context: [Result/Gate, canonical source, exact route/file]
Need: [конкретный вывод/исправление]
Why blocked: [почему не могу продолжить]
Input: [PR, logs without secrets, reproduction, docs]
Expected output: [commit/PR/evidence/decision]
Dependency: [blocks #..., ready after #...]
Risk and forbidden actions: [...]
Ack owner: [person / pending]
```

При коротком вопросе можно использовать комментарий внутри существующей Issue. Отдельная Issue нужна, если есть отдельный исполнитель, срок/приёмка или независимый проверяемый output. **Одна ответственность → один canonical owner**.

## 9. Lead orchestration: последовательность и параллельность

Лид поддерживает dependency graph всех **активированных** задач. Предлагаемый алгоритм для каждого цикла:

1. Собрать open Issues / активные Results / PR / blockers / live evidence; выявить stale и дубли.
2. Сопоставить Impact, risk, scope, approved authority, текущий Gate.
3. Разделить работы на:
   - **SERIAL**: любые блокирующие зависимости, общий write owner, общая integration branch/release, auth/data contract, общий route/shell, DNS/production cutover;
   - **PARALLEL**: независимые bounded задачи без общих writes и без зависимостей, например documentation audit + staging asset inventory + независимый QA plan;
   - **WAITING**: нет решения, доступа, данных, baseline, Gate или предыдущий Result ещё не прошёл checkpoint.
4. Назначить **одного accountable integrator** на Result и исполнителей на bounded tasks. `One Result → one active integration branch`; небольшие task branches/PR допускаются только как контролируемые источники diff в неё, а не как независимые parallel release streams.
5. Обновить связки `blocked by / enables`, согласовать минимальные интерфейсные контракты и версии.
6. После отчёта исполнителя проверить evidence, сделать собственные корректировки только в своём scope, направить QA/другому специалисту.
7. В конце волны выдать owner-level digest: `completed / validated / blocked / decisions / next unblocked`, ссылками на GitHub, без избыточных пересказов.

### Пример конкретно по переезду (НЕ activation)

```text
#228 stable baseline evidence ───────────────┐
                                             ├──> #237 migration Result activation (owner approval)
#237 inventory + capacity + backup design ───┘           |
                                                         v
                                             VM isolation + staging pipeline
                                                         |
                                       +-----------------+------------------+
                                       v                                    v
                              Portal on VM staging                 Games inventory/builds
                              using current Cloud                  (without public access)
                                       |                                    |
                                       v                                    v
                              OAuth/Board/roles QA                   Game staging QA
                                       |
                                       v
                            Optional self-hosted Supabase staging
                            (separate gated migration increment)
                                       |
                                       v
                       Restore rehearsal + security + rollback proof
                                       |
                                       v
                            Explicit production cutover approval
                                       |
                                       v
                            Live verification + G8 cleanup
```

Инвентаризацию и документирование можно выполнять до activation; это не даёт разрешение на deploy/DNS/Supabase mutation. Так как #237 исходно содержит *полную* self-hosted миграцию, разделение на этапы **не переписывает Issue молча**: Лид предлагает owner decision и фиксирует boundary прежде, чем открывать integration branch.

## 10. Отчёт исполнителя → Лиду

Каждый осмысленный handoff помещается в **родительскую Issue или linked PR**, а не только в чат.

```text
REPORT · [ROLE] · Issue #... · Result/Gate ...
STATUS: COMPLETE_FOR_REVIEW | PARTIAL | BLOCKED | NEEDS_DECISION
GOAL / ACCEPTANCE: ...
EXISTING OWNER CHECKED: [source/authority path]
CHANGED: [file list / PR / commit SHA]  (или NONE при read-only)
VERIFIED: [commands, CI run, browser case, actual result]
NOT VERIFIED: [точные остаточные проверки]
RISKS / DRIFT / SECURITY: ...
DEPENDENCIES / REQUESTS: [links]
NEXT RECOMMENDED ACTION: ...
PRODUCTION EFFECT: NONE | MERGED | DEPLOYED (exact proof)
```

Лид принимает отчёт и может: `REQUEST_CHANGES`, `SEND_TO_QA`, `NEEDS_DECISION`, `ACCEPTED_FOR_CURRENT_GATE`. Нет silent close.

## 11. QA, безопасность и критерии закрытия

Для web/UI Result: build/syntax, functional flow, semantic consistency, route integrity, auth states, guest/member/Dementor/owner, desktop/mobile, accessibility, visual integrity, canonical shell, no dead/legacy routes/duplicates.

Для миграции дополнительно: exact commit SHA on VM, proxy/HTTPS/DNS, deployment reproducibility, rollback rehearsal, DB/Auth/RLS/storage parity, backup *off VM* + restore evidence, secret scan, publicly exposed service audit, resource limits, restart/crash recovery.

**Нельзя закрыть задачу** если:
- нет конкретного acceptance;
- CI/базовый тест не выполнен либо есть непроанализированный FAIL;
- был запрос о помощи без ответа, влияющий на результат;
- обнаружен authority conflict;
- production changed without exact release approval/evidence;
- QA пишет PASS на непроверенном live поведении;
- open P0/privacy issue маскируется UI.

Особая оговорка для VM: `/data/*` — **DO NOT MODIFY**; существующий `db-dev` PostgreSQL, nginx routes MDAO, GitLab Runner — не трогать. Порт `32778` опубликован наружу, UFW inactive; сетевую экспозицию нужно отдельно проверить с Кириллом, но не «чинить» её слепым блокированием production.

## 12. Продуктовый/бизнес-аналитический checkpoint до расширения

Лид передаёт P-01 + U-01 + Q-01 **read-only аудит**, а не новый продуктовый implementation:

| Вопрос | Проверяемое свидетельство | Если не закрыто |
| --- | --- | --- |
| Незнакомый посетитель понимает проект и его действие? | Guest→Thing→action UX test, #227 | UX issue, без ontology invention |
| Direct Publish ≠ Contribution? | Approved local semantic decision, BQA-07 | оставить gap; отдельное разрешение Contribution runtime |
| Создание и владение Project/Course понятно? | BQA-22, owner/permission docs | Decision/Change Proposal, не Artifact subtype |
| Доступ PUBLIC / MEMBER / PRIVATE / scoped корректен? | RLS + role-based browser QA | P0 blocker перед расширением |
| Статус games: prototype/staging/live? | Repo/route/QA evidence каждого проекта | Не выдавать тестовую игру за готовый релиз |
| Работает ли ежедневный контентный цикл? | Source status → editorial approval → public route → evidence | Редакторский runbook, без автоматической публикации |
| Есть ли бизнес-основание для платежей? | Реальная нагрузка/расходы/ценность/платёжный сценарий | Не добавлять цены, memberships, subscriptions |
| Известна ли стоимость автономной эксплуатации? | VM + backup + Supabase + egress + operations baseline | Measurement plan до решения о self-host |

Итог P-01: **MUST_BE_READY_FOR_FIRST_EXTERNAL_USERS / LATER / NOT_APPROVED** с прямыми источниками; спорное требует человека, а не решения AI по умолчанию.

## 13. Границы текущей программы миграции

Фактическая VM, подтверждённая консольным read-only аудитом (17.10.2026): Ubuntu 24.04.1 LTS, 4 CPU, ~7.6 GiB RAM, 75 GiB root disk (~43 GiB free), nginx 80/443, Docker Compose v2.32.1, legacy PostgreSQL `db-dev`, UFW inactive, каталог `/srv/dementor` создан. Это **инвентарь**, не доказательство готовности к миграции.

- **Подготовка (read-only):** source inventory, authorization, disk/load budget, server isolation, DNS plan, application manifest, restore plan.
- **Staging только после Gate:** размещение site snapshot на VM с существующим Supabase Cloud и отдельным hostname; учесть callback URLs и protected access.
- **Игры по одной:** для каждой требуется confirmed repo, license, start command, storage, auth boundary, resource budget, healthcheck и owner approval to expose.
- **Supabase self-host:** только отдельная gated migration после shadow copy, OAuth, RLS, Storage, worker, parity, backup/restore, cutover/rollback proof.
- **Production:** manual release approval, exact SHA, live retest, rollback, G8. Никаких DNS cutover, `/data` cleanup или самостоятельного cloud retirement по этому документу.

## 14. Как вводим регламент после обсуждения

**Сейчас (DRAFT):**
- проверить документ владельцем;
- подтвердить назначение Lead, двух исполнителей и ревьюера QA;
- подтвердить matrix of access (фактически предоставленные права и границы);
- решить: активируем #237 как один migration Result или выделяем согласованные bounded increments;
- определить, что считать закрытием #228 и минимальным критериями Stage-0;
- согласовать ручной release decision owner.

**Только после explicit approval:**
- зарегистрировать authority pointers/Decision при необходимости;
- связать с существующими Issues и Result;
- настроить GitHub templates/labels/permissions, не дублируя имеющееся;
- открыть работу на нужном Gate и integration branch;
- провести первый цикл `CHECK → ACT/STOP → REPORT → LEAD → QA → ACCEPT`.

## 15. Правила короткой формы

1. **Existing before new.**
2. **Approved before implementation.**
3. **Issue ≠ Product authority.**
4. **Discussion ≠ Decision.**
5. **One Result → one active integration branch.**
6. **Каждый запрос оставляет trace в GitHub.**
7. **«Проверь» → проверь открытый долг и продолжи разрешённую работу; не останавливайся на отчёте, если можно завершить.**
8. **Любой исполнитель может попросить помощь; scope и приоритет управляет Лид.**
9. **Не делать параллельно то, что использует один mutable owner или требует serial Gate.**
10. **Commit ≠ merge ≠ deploy. Evidence before DONE.**
11. **Production и secrets — только по least privilege и отдельному разрешению.**
12. **Правила команды не создают новых пользовательских roles/membership mechanics.**
