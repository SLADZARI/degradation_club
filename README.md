# Degradation Club

Единый репозиторий для трёх связанных направлений проекта:

1. **Логика и осознанность** — редакционный канал и контентная система.
2. **Dementor Club** — клуб, его концепция, правила, продукты и операционная база.
3. **Dementor Club Official Site** — официальный сайт клуба, дизайн и код.

## Ветки

- `logic-awareness` — канал «Логика и осознанность».
- `dementor-club` — клуб Dementor Club.
- `dementor-club-site` — официальный сайт Dementor Club.

## Принцип хранения

GitHub хранит версии, структуру, тексты, контент-планы, спецификации и код. Google Drive хранит исходники, визуалы, тяжёлые медиафайлы, рабочие документы и экспортные материалы. В каждой ветке есть `DRIVE.md` с привязкой к соответствующей папке Drive.

## Dementor Live — единый канон UI-иконок

Для **всех поддерживаемых старых и новых версий** Dementor Live утверждён один набор **20 Paper Cut UI Icons v1** (ручная бумажная аппликация, 2–4 слоя, приглушённые цвета). Нельзя заменять его новыми рисунками или эмодзи. Главный документ: [PAPER_CUT_UI_ICON_CANON_v1.md](https://github.com/SLADZARI/degradation_club/blob/feature/dementor-live-world-expansion-p0-2026-10-19/projects/dementor-live/design/PAPER_CUT_UI_ICON_CANON_v1.md). Каноническое расположение в игровом runtime: `public/assets/paper-icons/` и `public/paper-icons.js`; двоичные ассеты должны быть внесены в каждую собираемую ветку перед релизом. Текстовый стандарт не означает, что уже выпущенные версии изменились автоматически.

### Dementor Live: SVG-FIRST Paper Cut библиотека v3

Новая общая библиотека иконок содержит **62 SVG-позиции** с постоянными номерами `DL-ICON-001…062`, отдельными игровыми ID и связями с физическими `DL-xxx` там, где они существуют. [Аудит и порядок внедрения](https://github.com/SLADZARI/degradation_club/blob/release/dementor-live-civic-p3-safe-upgrade-2026-10-20/projects/dementor-live/design/asset-library/ASSET_LIBRARY_v3_2026-10-20.md) · [машинный реестр ID](https://github.com/SLADZARI/degradation_club/blob/release/dementor-live-civic-p3-safe-upgrade-2026-10-20/projects/dementor-live/design/asset-library/ICON_NUMBER_REGISTRY_v3_2026-10-20.json) · [SVG-исходники и сборщик](https://drive.google.com/file/d/1XUpBS8dliUCPmGzDvXRudm_oTw3s9lFQ/view). Все иконки: 2–4 слоя бумаги, прозрачный SVG, PNG только из SVG. **V3 — кандидаты, не замена утверждённых v2 и не production deployment**. Не менять героя, экономику и сохранения ради библиотеки.
