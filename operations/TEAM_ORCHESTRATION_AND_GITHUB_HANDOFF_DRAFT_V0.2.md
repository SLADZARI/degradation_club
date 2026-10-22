---
artifactId: dementor-club.proposal.team-orchestration-and-github-handoff-v0.2
project: dementor-club
documentType: PROPOSAL
projectStage: PLANNING
gate: G3_ARCHITECTURE
status: DRAFT
version: "0.2"
updated: "2026-10-22"
owner: Dementor Club / owner review
sourceSystem: GIT
authorityType: CANDIDATE
supersedes: operations/TEAM_ORCHESTRATION_AND_GITHUB_HANDOFF_DRAFT_V0.1.md
implementationAuthorized: false
productionDeployAuthorized: false
semanticMutationAuthorized: false
---

# Dementor Club — Lead-first orchestration & GitHub handoff v0.2

**Этот документ — DRAFT в существующем PR #254, не новая approved authority.** Старые v0.1 и project instruction v2 — сохранённая история. WeeklyOS [PR #125](https://github.com/SLADZARI/WeeklyOS/pull/125) про конвейер LEAD/REQUIRED/OPTIONAL находится на G6 review и служит здесь reference/candidate, а не якобы принятым изменением MP_DSL Core. Никаких изменений прав, данных, production и интеграционного kernel из этого файла не следует.

## A. Источники истины и актуальный контекст

- Семантика и Club kernel: SLADZARI/degradation_club@dementor-club, файлы .weekly-os/PROJECT.json → ARTIFACT_INDEX.json → APPROVED_STATE.json → текущий Result и только task-relevant approved Decisions. На 22 октября PROJECT v3.26 показывает активный UI Result pre-vm-webui-gate-correctives-v1@v0.2, единственную интеграционную ветку fix/board-composer-visual-stability-20261020 и [PR #308](https://github.com/SLADZARI/degradation_club/pull/308). Длинный readFirst не читать целиком.
- Источник сайта: dementor-club-production (стабильный pinned cde332779ab0e256dd1e498660d6fa651e91846e в Stage1); dementor-club-site — исторический staging; main — не live source. Сайт https://dementor.club работает с оплаченной VM; пользователь подтвердил существующий аккаунт. Но Stage1 G8 всё ещё OPEN, включая маршруты, Board и backend-contract QA. Подготовленный вручную Nginx Artifact deep-link redirect после Pages→VM нужно оформить в каноническом infra source; общий catch-all не является безопасной заменой.
- Club Stage2 self-host Auth/Postgres/RPC/RLS/Storage/Edge на VM ещё не установлен: [#237](https://github.com/SLADZARI/degradation_club/issues/237), [#228](https://github.com/SLADZARI/degradation_club/issues/228), [#255](https://github.com/SLADZARI/degradation_club/issues/255). G3 clone-first — только подготовка; реальный export, restore и host G4 NO-GO. WebKit P1 #126 остаётся test-only, PR #308 full G6 FAIL, т.к. исходник board-fullscreen-v2-1.js вне whitelist v0.2, нужен точный owner G4 before patch.
- Игровые world/CharacterId/PAPER, ALPHA/BETA image и сейвы принадлежат SLADZARI/dementor_live. На VM https://play.dementor.club (BETA) и https://alpha.dementor.club (ALPHA), отдельные volume/Compose. Реальный ALPHA source может измениться: на 22 октября был зафиксирован cc369249... / PR #66, проверяй фактический VM receipt перед инструкцией QA. Возврат к старому CharacterId и Club AccountId linking [Live #45](https://github.com/SLADZARI/dementor_live/issues/45), [#20](https://github.com/SLADZARI/dementor_live/issues/20) остаются security/identity блокерами; повторный Join по имени недопустим как recovery.
- Идея владельца [ALPHA Lab #321](https://github.com/SLADZARI/degradation_club/issues/321) — DEFERRED до полной приёмки ALPHA и Stage2 G8. Сейчас не переименовывать игровые URL или создавать новый project/task registry. Позже лаборатория покажет приоритетные сценарии, фактический build SHA, ответственные роли, Pass/Fail/Not run, запуск проверки и feedback.

## B. Один путь задачи, одна ответственность

| Что | Где искать истину | Нельзя подменять |
| --- | --- | --- |
| Поручение, scope, зависимость, ответственный, acceptance | GitHub Issue | записи другого канбана / устные чаты |
| Код, diff, исходный SHA, review | один owning PR + Result | конкурирующие решения без выбора Lead |
| Разрешённый смысл, права, материализованный Gate | approved Decision, PROJECT, APPROVED_STATE | Issue комментарий сам по себе |
| Что реально работает на VM | deploy receipt, image digest/label, HTTP/real client smoke | заголовок PR или старое QA |
| Очередь задач и обзор | GitHub Project projection из Issues + WeeklyOS read model | второй изменяемый реестр |
| Передача между LLM | последний короткий Issue/PR checkpoint | длинный пересказ всей истории |

Короткий checkpoint: asOf / repo-ref / source SHA / actual deployed SHA (если наблюдался) / Gate / tests / blocker / next actor. Detailed logs в существующих Results, не копировать в каждый чат. GitHub Issues и PR — не хранилище секретов/PII.

## C. Роли и очередь

Lead L-01 — текущая интеграция, приоритеты, code lease, выбор дублирующих PR, итог QA и пакет вопросов владельцу. Product/BA P-01 — JTBD/CJM, value и owner decision. Architect/Security A-01 — trust boundary, minimal Change Proposal. Backend/Data B-01 — только Club Auth/RPC/RLS/Storage и Q→C migration. SRE I-01 — Docker/VM/Nginx/backup по разрешённому scope, не соседние MDAO/db-dev. Frontend F-01 + UX U-01 — Board/Workspace/route/mobile/a11y. QA Q-01 — независимый browser, auth/role negative, restore, performance. Games G-01 — inventory и Club links, игровая реализация в игровом repo. Editorial E-01 — source-accurate public content. Кирилл — host/MDAO граница; владелец — Product/G7/custody/budget; Никита — назначенный оператор. Одна роль может совмещаться, но автор рискованной правки не подписывает собственную независимую security QA.

Очередь каждого worker: **LEAD > REQUIRED > OPTIONAL**, далее P0>P1>P2>P3. Только eligible Issue с confirmed scope/owner/dependencies/file lease. Один самостоятельный WIP на исполнителя; новая Lead-задача прерывает Required/Optional только в безопасной точке с HANDOFF. Нет доступной работы => IDLE/BLOCKED, не обещать продолжение в фоне. Существующий GitHub Project №1 преимущественно визуализирует Live issues; не добавлять в него все Club tasks без отдельного решения и не делать второй таск-трекер. Project workflows не создают фонового LLM worker.

## D. Решение по риску, а не по числу гейтов

**FAST:** ограниченный CSS/JS bugfix без state, роли и нового интерфейса, строго в одобренном whitelist — агент разрабатывает и тестирует, Lead/QA принимает; G1–G4 не проходить повторно.  
**STANDARD:** новая обратимая фича в утверждённом scope, изолированный тестовый контур — G5 код, применимые G6 тесты, Lead integration, VM через approved runbook.  
**PROTECTED:** membership/Auth/DC-9/roles/RLS/DB, реальные копии, CharacterId/PAPER/сейвы, общий server, DNS, production release — отдельный Decision при изменении смысла, independent G6, recoverable backup, release SHA и human G7 GO. N/A Gate объяснять, пропущенные проверки не считать PASS.

**Lead LLM решает сам:** реализацию, тесты по покрытию, устранение дублей, приоритет LEAD/REQUIRED/OPTIONAL, выбор одного candidate и распределение между разрешёнными code owners. **Владелец решает:** новую продуктовую семантику, закрытые user rights, privacy/custody, новые расходы, production/BETA exact-SHA release и необратимые действия. **Никита:** применяет предварительно утверждённую операцию и проверяет rollback. **Кирилл:** защищает существующий host и MDAO. Уже принятые узкие решения не запрашивать повторно.

**Важно:** общая модель FAST — не ретроактивное изменение текущего Result. PR #308 исходный whitelist обязателен; для board-fullscreen JS нужен отдельный owner v0.3 G4, а ещё один Guest source расширять только по отдельному proof/Decision.

## E. Очерёдность запуска продукта

**Сейчас Stage1 G8 / #308:** точный Nginx source parity; login→Board→Artifact deep-link→close/reload→Guest negative; WebKit native click stress, accepted one-file G4 before source fix; clean release SHA. 220 UI PASS не разрешают объявлять full G6, если current WebKit FAIL. RLS/Storage и членство отдельно.

**Затем Stage2 #237/#228/#255:** clone-first G3 предпочитается для дизайна: consented source snapshot → encrypted *offline* Q → approved exclusion of non-Club ownership → new clean C → independently tested restore → controlled VM launch / OAuth cutover. Не копировать сырые Q PGDATA/WAL на shared VM. Источник содержит 35 candidates на исключение (15 MP, 2 Robo, 11 legacy_edu, 7 shared owner STOP), 17 non-Club routines и управляемую GoTrue структуру; эти каталожные списки подтверждены, **ни Q, ни C физически не созданы**. Не активировать старые refresh/session/JWT, Vault/cron, foreign worker, secrets. Cloud MP/Robo accounts и сервисы сохраняются. Проверить реальную интеграцию Workspace с course_enrollments и orders перед отсечением общих таблиц: отсутствие FK не равно отсутствию JS-зависимости. В новой базе отдельно проверить Auth users/Google subject, RPC, RLS, Storage actual bytes+metadata, private objects, никакой чужой доступ.
SRE должна подтвердить 24h реальную параллельную нагрузку текущей ALPHA/BETA/MDAO, контролируемые quotas и STOP thresholds, 16GiB reserve, вторую зашифрованную независимую backup copy и custodian, restore evidence, MDAO canary/оговорённый scope; single idle measurement не даёт G4.

**После Stage2 G8:** [ALPHA Lab #321](https://github.com/SLADZARI/degradation_club/issues/321). Не спутать его с текущей игрой alpha.dementor.club: вход в тестовый Club, набор проектов/фич, фактический SHA из runtime receipt, Issues/QA statuses и feedback к owning Issue. Новый домен, Club SSO, Dementor-only ALPHA/QA roles и browser origin linking требуют отдельного scope. Не строить второй ручной реестр статусов или переносить чужие saves.

## F. QA и отчёт

Во время работы малый тест точного diff; при G6 final exact SHA полный **применимый** browser/auth/RLS/restore набор. Проверяй как пользователь: вошёл → открыл карточку по /community/artifact/<UUID>/ → сделал разрешённое действие → перезагрузил → сохранил состояние → сменил роль. Сервер выдаёт 200 не означает, что RPC/Storage работает. Не заменять GitHub Pages 404 fallback глобальным Nginx SPA rewrite. Различай TEST_FAIL / FLAKY / CI_INFRA_BLOCKED / NOT_RUN; browser emulation не равно реальному iPhone.

Отчёт в owning Issue/PR: STATUS / ROLE+MODE / ISSUE+RESULT / exact source SHA / deployed SHA or UNKNOWN / changed paths / PASS-FAIL-NOT_RUN+env / blockers / next owner action / production effect. Экономия токенов: один текущий checkpoint, delta-only чтение, не повторять identical-SHA тесты без изменения зависимости, использовать локальный Mac/Docker/собственную VM. Новые платные runner/VM/registry без owner Decision нельзя, но не останавливать существующие Club workflows без их собственного authority.

Измерять минимум раз в неделю: READY→ACCEPTED cycle time, число/возраст открытых active Draft PR, bug escapes после деплоя, повторы owner approvals, стоимость одного ACCEPTED Result если измерена. Не использовать PR count как KPI; нет данных => NOT_INSTRUMENTED.

## G. Чат и handoff

«Проверь» означает восстановить owning Issue/Gate и выполнить следующий разрешённый шаг, а не только пересказать. По «дай промпт для нового чата» — 120–250 слов: lastRole/Mode, nextRole/Mode, Issue/PR/Gate/SHA, фактические проверки, запреты, blocker, первое действие. На новом чате перепроверить HEAD; память и текст не дают разрешения на production. Нет разрешённого выполнения => конкретный BLOCKED, не симулировать службу.

**Ввод в действие:** только после owner/Lead review существующего PR #254 и проверки пересечения с AGENTS router Draft #320; не изменять kernel approved state и production от одного PR.
