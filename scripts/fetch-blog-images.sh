#!/bin/bash
# Fetch images from a URL via Jina Reader and save to public/images/blog/
# Usage: bash scripts/fetch-blog-images.sh <URL> [slug]
#
# Extracts image URLs from the page, downloads them, and outputs markdown image references.
# Designed to be called during blog research phase.

set -euo pipefail

URL="${1:?Usage: fetch-blog-images.sh <URL> [slug]}"
SLUG="${2:-blog-$(date +%Y%m%d)}"
OUTPUT_DIR="public/images/blog"
mkdir -p "$OUTPUT_DIR"

echo "═══════════════════════════════════════"
echo "  Fetching images from: $URL"
echo "  Output dir: $OUTPUT_DIR"
echo "═══════════════════════════════════════"

# Fetch page content via Jina Reader
CONTENT=$(curl -s "https://r.jina.ai/$URL" -H "Accept: text/plain" 2>/dev/null)

if [ -z "$CONTENT" ]; then
  echo "  ✗ Failed to fetch page content"
  exit 1
fi

# Extract image URLs (markdown format: ![alt](url))
IMG_COUNT=0
echo "$CONTENT" | grep -oE '!\[([^\]]*)\]\(([^)]+)\)' | while IFS= read -r match; do
  # Extract alt text and URL
  ALT=$(echo "$match" | sed -E 's/!\[([^]]*)\]\(.*/\1/')
  IMG_URL=$(echo "$match" | sed -E 's/.*\(([^)]+)\)/\1/')

  # Skip tiny images, icons, tracking pixels
  if echo "$IMG_URL" | grep -qiE "icon|logo|pixel|tracking|1x1|badge|button"; then
    continue
  fi

  # Generate filename
  IMG_COUNT=$((IMG_COUNT + 1))
  FILENAME="${SLUG}-${IMG_COUNT}.png"
  FILEPATH="$OUTPUT_DIR/$FILENAME"

  # Download image
  echo "  Downloading: $IMG_URL"
  if curl -sL "$IMG_URL" -o "$FILEPATH" 2>/dev/null; then
    FILESIZE=$(wc -c < "$FILEPATH" | tr -d ' ')
    if [ "$FILESIZE" -gt 10000 ]; then
      echo "  ✓ Saved: $FILENAME ($(( FILESIZE / 1024 ))KB)"
      echo "![${ALT}](/images/blog/${FILENAME})"
    else
      rm -f "$FILEPATH"
      echo "  ✗ Skipped (too small: ${FILESIZE}B)"
    fi
  else
    echo "  ✗ Failed to download"
  fi
done

echo ""
echo "═══════════════════════════════════════"
echo "  Done. Check $OUTPUT_DIR/"
echo "═══════════════════════════════════════"
