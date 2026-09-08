# Dementor Club — DC-9 live retest evidence — 2026-09-08

Scope: production `https://dementor.club/join/` after deploy run #48.

## Guest partial-draft persistence / reload / resume

Status: **PASS**

Observed live sequence:

1. Opened `/join/` as Guest in a fresh/incognito browser context; no login gate blocked DC-9 entry.
2. Entered sphere `01 / ЛИЧНОСТЬ`.
3. Answered the first two scenes and reached `03 / 06`.
4. Reloaded the page.
5. DC-9 returned to the sphere picker rather than auto-entering the active sphere.
6. Picker preserved the unfinished draft and showed `ЛИЧНОСТЬ — ПРОДОЛЖИТЬ · 2/6`.
7. Selecting that sphere resumed at `03 / 06`, not at the beginning.

Accepted current UX contract for this Result:

- page reload without an explicit `?sphere=` route lands on the DC-9 sphere picker;
- unfinished progress must survive reload;
- the picker exposes the saved draft as `ПРОДОЛЖИТЬ · N/6`;
- selecting the saved sphere resumes at the first unanswered scene;
- automatic re-entry into the active scene after reload is **not required** by the current release contract.

This acceptance records existing live behavior; it does not change Membership/DC-9 semantics and does not authorize a new navigation mechanic.

## Boundary

This PASS closes only the Guest partial-progress reload/resume live check. It does not by itself prove authenticated login/Workspace recovery, cross-device authenticated sync, Application eligibility, or Board/Workspace role-state regressions.
