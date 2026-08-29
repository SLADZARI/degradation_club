# PRE-PRODUCTION RELEASE GATE

Любое визуальное обновление считать staging-изменением, пока оно отдельно не прошло production readiness check.

STATUS: REQUIRED
SOURCE BRANCH: `dementor-club-site`
PRODUCTION BRANCH: `dementor-club-production`
PRODUCTION ORIGIN: `https://dementor.club`

## Обязательный порядок

1. Работать только с веткой `dementor-club-site` как staging/source для визуальных изменений.
2. Не деплоить ничего напрямую из staging.
3. Сначала проверить, что все макеты утверждены на тестовом материале.
4. Отдельно проверить, что test/demo/mock/placeholder-контент не попадает в production artifact.
5. Проверить все публичные маршруты, локальные ссылки, CSS, JS, изображения, fonts/assets и canonical/OG metadata для `https://dementor.club`.
6. В production artifact запрещены legacy/staging/internal публичные пути и origin:
   - `/degradation_club/`
   - `sladzari.github.io/degradation_club`
   - staging/test routes
   - `design-system/admin` и другие internal/admin surfaces
7. Проверить, что production build не вырезает runtime-зависимости публичных страниц.
8. Проверить Supabase полностью:
   - Site URL и redirect URLs для `https://dementor.club`;
   - auth callback;
   - session persistence;
   - profile sync;
   - join application;
   - assessment save/load;
   - workspace membership/roles;
   - course enrollment/progress;
   - merch/public catalog;
   - RLS для anon и authenticated.
9. Не создавать тестовые записи в production DB без rollback/cleanup.
10. Cart/checkout/registration/features включать только если их статус утверждён в source-of-truth.
11. Прогнать все CI/integrity checks.
12. Если есть хотя бы один blocker — НЕ ДЕПЛОИТЬ. Сначала выдать `blocker / warning / safe`.
13. Только после успешной проверки подготовить отдельный PR в `dementor-club-production`.
14. `dementor-club-production` не менять напрямую.
15. Merge разрешён только после зелёного validate.
16. Deploy запускать только вручную через production workflow с вводом `APPROVED`.
17. После deploy выполнить post-deploy smoke test на `https://dementor.club`.

## Post-deploy smoke test

Проверить:
- Home;
- About;
- Events;
- Projects;
- Community;
- Merch;
- Join;
- Account/Profile;
- Workspace;
- Auth callback;
- основные course pages;
- все навигационные переходы;
- mobile layout;
- console errors;
- 404/asset failures;
- HTTPS;
- canonical/OG;
- Supabase auth/session/data flows.

## Обязательный release report

Финальный отчёт до production merge/deploy:

- `READY / BLOCKED`
- `Blockers`
- `Warnings`
- `Visual regressions`
- `Broken routes/assets`
- `Supabase status`
- `Production diff`
- `Deploy plan`
- `Post-deploy verification plan`

Ничего не деплоить автоматически без явного подтверждения пользователя.
