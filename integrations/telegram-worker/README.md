# Dementor Club — Telegram Worker

Purpose: distribute approved Community Board Artifacts to the official Telegram chat through VALERA🤖.

## Canonical deployable source

`supabase/functions/telegram-outbox-worker/index.ts`

This is the only executable source of truth. Do not keep a second copy of the worker here.

## Runtime

Supabase Edge Function: `telegram-outbox-worker`

Flow:

`dc_artifacts (active/community)` → `dc_distribution_outbox` → Edge Function → Telegram Bot API → `Dementor Club Official Chat`

## Required secrets

Stored only in Supabase Edge Function Secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_COMMUNITY_CHAT_ID`

Supabase runtime/backend credentials are supplied by Supabase default secrets. Never commit secret values to Git.

## Delivery state

`pending → processing → sent | failed`

`external_ref` stores Telegram `message_id` after a successful send.
`last_error` stores the last safe delivery error.

## Media

Community Artifact media remains in the private Supabase Storage bucket `dc-community-artifacts`. The worker creates a short-lived signed URL and uses Telegram `sendPhoto`. If no image is available, it falls back to `sendMessage`.

## Diagnostics

The worker may log only:

- presence/absence of expected environment variables;
- environment variable names (never values);
- stage names;
- safe API/database error messages;
- queue ids and Telegram message ids.

Bot tokens, chat ids, Supabase secret keys and signed URLs must never be logged.
