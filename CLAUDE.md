# AI Models Navi

Japanese AI model comparison site. Next.js 16 SSG, SQLite build-time data, Prisma Postgres for comments. Deployed on Vercel.

## Commands

```bash
npm run dev                  # dev server
npm run build                # production build (must pass before deploy)
npx tsx scripts/sync-all.ts  # incremental pipeline
```

## Architecture

```
src/app/            → Route pages (SSG)
src/app/api/        → API routes (comments, likes, admin)
src/app/admin/      → Admin dashboard (auth via middleware)
src/components/     → Shared UI
src/data/           → Auto-generated TS files (DO NOT EDIT)
src/lib/            → Shared utilities

scripts/            → Pipeline entry points
scripts/pipeline/   → Crawler modules (crawl, process, translate, generate)
data/crawler.db     → Build-time SQLite
```

Pipeline flow: `DataLearnerAI → SQLite → src/data/*.ts → SSG pages`

## Blog Publishing

```bash
# From URL (standard)
npx tsx scripts/fetch-article.ts "<URL>" --filter-images
./scripts/publish-blog.sh _drafts/<slug>.md --local --yes

# With watermark blur (WeChat articles)
npx tsx scripts/fetch-article.ts "<URL>" --filter-images --blur-watermark

# Backfill missing English translations
npx tsx scripts/backfill-en-blog.ts --dry-run  # preview
npx tsx scripts/backfill-en-blog.ts --limit 5  # process 5 posts
npx tsx scripts/backfill-en-blog.ts            # process all

# From markdown
./scripts/publish-blog.sh _drafts/<file>.md --local --yes
```

- `fetch-article.ts` — URL → CN markdown + download images
- `publish-blog.sh` — translate + commit + push
- `translate-blog.ts` — CN→JP + EN via LLM (saves to both `blog/` and `blog-en/`)
- `image-filter.ts` — heuristic + AI vision filter
- `watermark.ts` — blur WeChat watermarks (bottom-right region)

## LLM Providers

`LLM_PROVIDER` env: `mimo` (primary) | `ollama` | `anthropic` | `openai`

MIMO: `LLM_PROVIDER=mimo LLM_MODEL=mimo-v2.5-pro` at `token-plan-sgp.xiaomimimo.com/anthropic/v1/messages`

## Web Search & Data Enrichment

**Primary: agent-reach tools** (structured results, official source verification)

```bash
# Exa semantic search (via MCP in Claude Code)
# Returns: structured results with URL, highlights, summary
mcp__plugin_ecc_exa__web_search_exa(query: "query", numResults: 5)

# Jina Reader — read any webpage as clean markdown
curl -s "https://r.jina.ai/URL" -H "Accept: text/plain"

# GitHub — verify releases and repository activity
gh release list -R owner/repo --limit 5
gh repo view owner/repo
```

**Fallback: Ollama web-search** (when Exa unavailable)

```bash
bash ~/.claude/skills/web-search/scripts/search.sh "query"
bash ~/.claude/skills/web-search/scripts/search-batch.sh '["q1", "q2", "q3"]'
```

**When to search:**
- Model pricing: verify input/output token costs from official sources
- Benchmarks: cross-check SWE-bench, GPQA, Arena Elo scores
- Specifications: context window, release dates, parameter counts
- Deep analysis: community reception, competitive comparisons, latest news

**Policy:** For any model data written to `models.ts` or `model-analyses.ts`, search to verify at least one authoritative source. Never fabricate benchmark numbers or pricing.

## Hard Constraints

- NEVER edit `src/data/*.ts` — auto-generated
- Admin routes require `admin_session` cookie (middleware)
- `is_core=1` models protected from AI overwrite in pipeline
- Every blog article MUST include images

## Working Principles

### Think Before Coding
Do not assume. If something is unclear, ask. If multiple interpretations exist, present them instead of choosing silently. If a simpler approach exists, say so.

### Simplicity First
Implement the minimum that solves the request. Do not add features beyond what was asked. Do not create abstractions for single-use code. Do not add error handling for scenarios that cannot happen here.

### Surgical Changes
Touch only what you must. Do not refactor adjacent code just because you noticed it. Do not rewrite comments or formatting outside the requested scope. Match the existing style. The test: every changed line should trace directly to the user request.

### Goal-Driven Execution
Define success criteria, then verify them. For bugs, reproduce first, then fix. Do not stop at implementation if behavior can be checked.

### Validate Before Handoff
Run the relevant lint, test, or build command for the scope of the edit. Report what was verified and any residual risk. If validation fails twice in a row, stop and analyze the root cause before making more edits.

## Gotchas

- macOS `grep` does not support `-P` (Perl regex) — use `-E`
- WeChat images require `Referer: https://mp.weixin.qq.com/` header
- `translateBlogMarkdown()` can return incomplete JSON — regex fallback handles this
- `leaderboard_scores` table is unused; leaderboard comes from `generate-leaderboard-data.ts`
- Vision model: use `mimo-v2.5` (supports images; `mimo-v2.5-pro` does NOT support images)
- Image filter: reject on vision API failure to prevent Chinese-text images passing through
- WeChat watermarks: use `--blur-watermark` flag to blur bottom-right watermarks

## User Preferences

- Blog publishing: Claude Code with `fetch-article.ts` + `publish-blog.sh --local`
- Every article must include images from original source
- No WeChat links, 参考/出典/翻訳元 disclaimers, or raw video prompts
- Database: Git-committed SQLite, no external services
- Japanese-first content; natural idiomatic Japanese
