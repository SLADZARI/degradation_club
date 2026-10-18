#!/bin/bash
set -u
cd -- "$(dirname -- "$0")"
node tools/workspace.mjs doctor && node tools/workspace.mjs check
result=$?
echo "Код проверки: $result. Подробности: reports/check.json"
read -r -p 'Нажми Enter, чтобы закрыть окно.'
exit "$result"
