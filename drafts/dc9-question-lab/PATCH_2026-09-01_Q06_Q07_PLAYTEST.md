# DC-9 targeted playtest patch — Q06 / Q07

Status: **TARGETED DRAFT PATCH / PLAYTEST**  
Date: 2026-09-01  
Base: `BANK_V0.6_FULL_54_IMMERSIVE.md` v0.6.4  
Scope: **only Q06/54, Q07/54 and Q06 fixation contrast in the playable prototype**.

This patch does not reopen the bank and does not change scoring, guards, sphere semantics, answer scores or any other question.

## Q06 / 54 — Личность / Responsibility guard

### Scene wording

Replace:

`Вчера решаешь никого не собирать, не напоминать время и не проверять адрес. Взрослые люди разберутся.`

With:

`Вчера решено никого не собирать, не напоминать время и не проверять адрес. Взрослые люди разберутся.`

### Canonical answer score 1

Replace:

`Значит, всё-таки без меня никак. Возвращаю привычный порядок.`

With:

`Возвращаю привычный порядок. Без меня никак...`

All other Q06 scene lines, fixation and answer scores remain unchanged.

### Playable visual correction

On the dark guard screen the acid fixation highlight must use **black ink text on acid**, not white text on acid. This is presentation-only and does not change the question bank.

## Q07 / 54 — Работа / #незанятость

### Scene wording

Replace:

`Следующий созвон — в 16:00.`

With:

`Следующий созвон в 16:00 — отменён.`

This makes the stated `В календаре пусто` condition literal rather than leaving a future commitment in the scene.

### Canonical answer score 3

Because there is no longer a 16:00 call, replace:

`Ничего не добавляю. Если всё закрыто, до созвона просто свободно.`

With:

`Ничего не добавляю. Если всё закрыто, оставшееся рабочее время просто свободно.`

All other Q07 scene lines, fixation, answers and answer scores remain unchanged.

## QA boundary

- Q06 keeps the same responsibility evidence `0/1/2/3`.
- Q07 keeps the same `#незанятость` evidence `0/1/2/3`.
- No score mapping changes.
- No other public copy changes in this patch.
