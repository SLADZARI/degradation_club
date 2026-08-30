# Hotfix: Community progress observer loop

Date: 2026-08-30

Observed in production: `/join/` became unresponsive after the final sphere result appeared.

Root cause: `join/community-entry-bridge-v1.js` observed subtree child mutations while also replacing its own progress panel `innerHTML`, creating a self-triggered MutationObserver render loop.

Fix:
- observe only `#result` class/style state changes;
- render progress panel only when its semantic signature changes;
- keep periodic/storage recovery render without DOM writes when state is unchanged;
- bump cache key to `20260830-05`.

No assessment scoring, Supabase schema, membership rules, or Community Artifact semantics changed.
