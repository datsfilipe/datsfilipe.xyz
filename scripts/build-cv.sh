#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cv_dir="$repo_root/public/cv"
html="$cv_dir/_FILIPE_LIMA-EN.html"
pdf="$cv_dir/FILIPE_LIMA-EN.pdf"

if [[ ! -f "$html" ]]; then
  echo "error: source not found: $html" >&2
  exit 1
fi

chromium_bin=""
for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
  if command -v "$candidate" >/dev/null 2>&1; then
    chromium_bin="$candidate"
    break
  fi
done

if [[ -z "$chromium_bin" ]]; then
  echo "error: no chromium/chrome binary found in PATH" >&2
  exit 1
fi

"$chromium_bin" \
  --headless \
  --no-sandbox \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$pdf" \
  "$html"

echo "wrote $pdf"
