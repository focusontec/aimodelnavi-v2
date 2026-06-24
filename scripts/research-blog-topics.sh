#!/bin/bash
# Blog research script using agent-reach tools
# Usage: bash scripts/research-blog-topics.sh "search query"
#
# Tools used:
#   - Exa Search (via MCP): semantic web search, structured results
#   - Jina Reader (curl): full article reading, clean markdown
#   - GitHub CLI: repository/release verification

set -euo pipefail

QUERY="${1:-AI model release latest}"
OUTPUT_DIR="/tmp/blog-research-$(date +%Y%m%d)"
mkdir -p "$OUTPUT_DIR"

echo "═══════════════════════════════════════"
echo "  Blog Research: $QUERY"
echo "  Output: $OUTPUT_DIR"
echo "═══════════════════════════════════════"

# Step 1: Exa Search — discover topics and official sources
echo ""
echo "Step 1: Exa Search (semantic web search)..."
echo "  Query: $QUERY"
echo "  → Use mcp__plugin_ecc_exa__web_search_exa in Claude Code"

# Step 2: Jina Reader — deep read official sources
echo ""
echo "Step 2: Jina Reader (full article reading)..."
echo "  Usage: curl -s 'https://r.jina.ai/URL' -H 'Accept: text/plain'"

# Step 3: GitHub verification
echo ""
echo "Step 3: GitHub verification..."
echo "  Usage: gh repo view owner/repo"
echo "  Usage: gh release list -R owner/repo --limit 5"

echo ""
echo "═══════════════════════════════════════"
echo "  Research flow ready."
echo "  Run in Claude Code for full automation."
echo "═══════════════════════════════════════"
