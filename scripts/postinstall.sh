#!/usr/bin/env bash
# Re-run `apm install` only when apm.lock.yaml hash differs from the saved marker.

LOCK_FILE="apm.lock.yaml"
MARKER="apm_modules/.lockhash"

current="$(git hash-object "$LOCK_FILE" 2>/dev/null || echo lock-missing)"
saved="$(cat "$MARKER" 2>/dev/null || echo marker-missing)"

if [ "$current" = "$saved" ]; then
  exit 0
fi

apm install -t claude && git hash-object "$LOCK_FILE" > "$MARKER"
exit 0
