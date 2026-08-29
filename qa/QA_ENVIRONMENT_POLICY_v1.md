# Dementor Club QA Environment Policy v1

Status: APPROVED
Decision: internal admin/system diagnostic tools are QA/STAGING ONLY.
Effective: 2026-08-30

## Environment boundary

### Production (`https://dementor.club`)
Production ships only approved public surfaces plus the authenticated Personal Workspace.

Production MUST NOT expose navigation or CTA links to:
- `/design-system/`
- `/design-system/admin/`
- `/design-system/auth-test/`
- `/design-system/sync-test/`
- other internal diagnostic/test surfaces

The production artifact may exclude those routes entirely.

### QA / staging
QA/staging may expose internal tools for OWNER_ADMIN and testing:
- System Health
- Auth Diagnostics
- Sync Diagnostics
- UI / Design Lab
- browser/runtime QA tools

These tools exist to validate release candidates and must not become a hidden production admin console by accident.

## Future admin surface

If Dementor Club later needs real operational administration from production, create a separate explicit `/admin/` product surface with its own specification, OWNER_ADMIN authentication/authorization contract, RLS rules, audit requirements, and release tests.

Do not reuse `/design-system/` as a production admin product.

## Release assertions

A production release is BLOCKED when:
1. a visible production link points to a route excluded from the production artifact;
2. `/design-system/*` is reachable from normal production navigation;
3. a disabled feature still has a visible production navigation/CTA;
4. internal QA tools are required for a normal user flow.

## LLM rule

When working on production code, do not restore links to internal test/design-system routes to make a broken link pass. Fix the environment boundary instead.
