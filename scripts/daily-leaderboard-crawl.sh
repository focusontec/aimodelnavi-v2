#!/bin/bash
# Daily leaderboard crawl + regeneration
# Runs via system crontab, logs to scripts/logs/

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"

mkdir -p "$LOG_DIR"

DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOG_DIR/leaderboard-$DATE.log"

{
  echo "=== Leaderboard Crawl: $(date) ==="
  cd "$PROJECT_DIR"

  # Load env if available
  if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
  fi

  echo "1. Crawling leaderboard data..."
  npx tsx scripts/crawl-datalearner-leaderboard.ts 2>&1

  echo ""
  echo "2. Generating leaderboard TypeScript..."
  npx tsx scripts/generate-leaderboard-data.ts 2>&1

  echo ""
  echo "=== Done: $(date) ==="
} >> "$LOG_FILE" 2>&1
