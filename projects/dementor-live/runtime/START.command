#!/bin/bash
set -eu
cd -- "$(dirname -- "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo 'Нужен Node.js 22+. См. START_HERE.md.'
  read -r -p 'Нажми Enter, чтобы закрыть окно.'
  exit 1
fi
echo 'Dementor Live · http://127.0.0.1:4173 · остановка: Ctrl+C'
exec node server.mjs
