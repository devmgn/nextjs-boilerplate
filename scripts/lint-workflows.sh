#!/usr/bin/env bash
set -euo pipefail

ACTIONLINT=scripts/actionlint
test -f "$ACTIONLINT" || bash <(curl -s https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash) latest scripts
"$ACTIONLINT" -color
uvx zizmor --config .github/zizmor.yml .github/workflows/
