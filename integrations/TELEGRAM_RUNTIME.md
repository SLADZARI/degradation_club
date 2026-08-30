# Dementor Club — Telegram runtime identity

STATUS: CONFIRMED RUNTIME FACT
DATE: 2026-08-30
SCOPE: Telegram downstream distribution / discussion runtime

## Confirmed bot identity

- Name shown by Telegram: `VALERA🤖`
- Telegram bot id: `7933342881`
- `is_bot = true`
- Club role: downstream Telegram runtime for Dementor Club distribution / discussion automation.

The bot identity itself does not define Community semantics, membership, Artifact ownership or Club source-of-truth.

## Confirmed chat context

Production QA evidence supplied on 2026-08-30 shows the bot added to the group named `Dementor Club Official Chat`.

The numeric Telegram `chat_id` is not yet recorded in source-of-truth and must be resolved before automated delivery can be enabled.

## Security boundary

- Bot token MUST NOT be committed to Git or stored in public project documents.
- Token belongs in deployment/runtime secrets only.
- Telegram remains downstream from canonical platform state.
- Artifact publication MUST NOT depend on Telegram availability.
- Supabase `dc_distribution_outbox` is the delivery boundary.

Canonical direction:

`ARTIFACT / SUPABASE → dc_distribution_outbox → Telegram worker → Dementor Club Official Chat`

## Required runtime config before enabling delivery

- `TELEGRAM_BOT_ID=7933342881` (non-secret identity metadata)
- `TELEGRAM_BOT_TOKEN` (secret)
- `TELEGRAM_COMMUNITY_CHAT_ID` (runtime destination)
- bot permission to send messages/media in the destination chat

Optional later metadata:

- message id returned by Telegram;
- topic/thread id if forum topics are introduced;
- delivery status/error mapped back to the outbox record.

Do not create one Telegram chat/topic per Artifact in v1 unless separately approved.
