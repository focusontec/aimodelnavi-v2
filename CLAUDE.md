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

# From markdown
./scripts/publish-blog.sh _drafts/<file>.md --local --yes
```

- `fetch-article.ts` — URL → CN markdown + download images
- `publish-blog.sh` — translate + commit + push
- `translate-blog.ts` — CN→JP via LLM
- `image-filter.ts` — heuristic + AI vision filter

## LLM Providers

`LLM_PROVIDER` env: `mimo` (primary) | `ollama` | `anthropic` | `openai`

MIMO: `LLM_PROVIDER=mimo LLM_MODEL=mimo-v2.5-pro` at `token-plan-sgp.xiaomimimo.com/anthropic/v1/messages`

## Hard Constraints

- NEVER edit `src/data/*.ts` — auto-generated
- Admin routes require `admin_session` cookie (middleware)
- `is_core=1` models protected from AI overwrite in pipeline
- Every blog article MUST include images

## Gotchas

- macOS `grep` does not support `-P` (Perl regex) — use `-E`
- WeChat images require `Referer: https://mp.weixin.qq.com/` header
- `translateBlogMarkdown()` can return incomplete JSON — regex fallback handles this
- `leaderboard_scores` table is unused; leaderboard comes from `generate-leaderboard-data.ts`
- Vision model: use `mimo-v2.5` (supports images; `mimo-v2.5-pro` does NOT support images)
- Image filter: reject on vision API failure to prevent Chinese-text images passing through

## User Preferences

- Blog publishing: Claude Code with `fetch-article.ts` + `publish-blog.sh --local`
- Every article must include images from original source
- No WeChat links, 参考/出典/翻訳元 disclaimers, or raw video prompts
- Database: Git-committed SQLite, no external services
- Japanese-first content; natural idiomatic Japanese
