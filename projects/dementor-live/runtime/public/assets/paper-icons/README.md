# Dementor Live — канонические UI-иконки Paper Cut v1

Это **единственный разрешённый** набор графики для 20 UI предметов. Все версии игры должны использовать одни и те же бинарные ассеты, а не перерисовывать их.

## Путь импорта в любой версии
- `public/assets/paper-icons/paper_atlas_64_indexed.png` — обязательный sprite atlas, **320×256 PNG**, 5 колонок × 4 строки, 64×64 на иконку, SHA-256 `607e40f07a2695148ecbb8e541ec234eeeb92de7a223a26438d754d104576193`.
- `public/paper-icons.js` — отображение иконок по игровым ID.
- Дополнительные отдельные PNG исходников (256/64 px) и JSON registry хранятся в каноническом архиве `Dementor_Live_Paper_Icons_v1_READY.zip`; **не заменять их** альтернативными картинками.
- Утверждённый графический стандарт: [PAPER_CUT_UI_ICON_CANON_v1.md](../../../../design/PAPER_CUT_UI_ICON_CANON_v1.md).

## Атлас: порядок ячеек
| Ряд | Колонка 1 | Колонка 2 | Колонка 3 | Колонка 4 | Колонка 5 |
| --- | --- | --- | --- | --- | --- |
| 0 | wood | stone | food | seed_hemp | seed_carrot |
| 1 | hemp | carrot | water | axe | pick |
| 2 | rifle | ammo | map | shirt | souvenir |
| 3 | paper | backpack | cargo | health | stamina |

`rifle` = существующий `starter-rifle`. Новые предметы в state не создавать. Показатели и игровую валюту не переписывать.

**Проверка релиза:** из `public` должен успешно открываться `/assets/paper-icons/paper_atlas_64_indexed.png` (HTTP 200, image/png) и фронтенд не должен ссылаться на несуществующий файл. Пока бинарный PNG не добавлен в ветку, её графическая миграция считается PENDING, даже если стандартизированная документация уже есть.
