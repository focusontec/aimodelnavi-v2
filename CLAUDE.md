# AI Models Navi

Japanese AI model comparison site. Next.js 16 SSG, SQLite build-time data, Prisma Postgres for comments. Deployed on Vercel.

## Commands

```bash
npm run dev                  # dev server
npm run build                # production build (must pass before deploy)
npx tsx scripts/sync-all.ts  # incremental pipeline crawl
```

## Architecture

```
src/app/            → Route pages (SSG)
src/app/api/        → API routes (comments, likes, admin)
src/app/admin/      → Admin dashboard (auth via middleware)
src/components/     → Shared UI (Header, Footer, LeaderboardTable, comments/)
src/data/           → Auto-generated TS files (DO NOT EDIT)
src/lib/            → Shared utilities (blog, db, leaderboard-categories)

scripts/            → Pipeline scripts
scripts/pipeline/   → Crawler pipeline modules (crawl, process, translate, generate)
data/crawler.db     → Build-time SQLite database
```

Pipeline: `DataLearnerAI → SQLite → src/data/*.ts → SSG pages`

## Code Style

- TypeScript, Tailwind CSS v4, Lucide icons
- Japanese UI text throughout. No Chinese in user-facing strings.
- `scripts/` are standalone Node scripts (tsx), not part of Next.js build
- auto-generated data files (`src/data/`) — never edit manually
- Chinese → Japanese developer names translated via `developerJaMap`

## Blog Publishing

All publishing via Claude Code (not OpenClaw).

**From URL (standard workflow):**
```bash
npx tsx scripts/fetch-article.ts "<URL>" --filter-images
./scripts/publish-blog.sh _drafts/<slug>.md --local --yes
```

**From markdown:**
```bash
./scripts/publish-blog.sh _drafts/<file>.md --local --yes
```

Key scripts: `fetch-article.ts` (URL → CN markdown), `publish-blog.sh` (translate + commit), `translate-blog.ts` (CN→JP using LLM), `image-filter.ts` (heuristic + AI vision).

## LLM Configuration

Provider via `LLM_PROVIDER`: `ollama` (default) | `mimo` (primary, Anthropic-compatible) | `anthropic` | `openai`

MIMO: `LLM_PROVIDER=mimo LLM_MODEL=mimo-v2.5-pro` at `token-plan-sgp.xiaomimimo.com/anthropic/v1/messages`

## Hard Constraints

- Never edit `src/data/*.ts` files — they are auto-generated
- `is_core=1` models are protected from AI overwrite in the pipeline
- Admin routes require `admin_session` cookie (middleware check)
- Do not write to production database from tests
- Every blog article must include images (use fetch-article.ts pipeline)

## Known Gotchas

- macOS `grep` does not support `-P` (Perl regex) — use `-E` instead
- WeChat images (`mmbiz.qpic.cn`) require `Referer: https://mp.weixin.qq.com/` to download
- `translateBlogMarkdown()` can return incomplete JSON — fallback regex extraction handles this
- `leaderboard_scores` table is unused — leaderboard data comes from DataLearner via `generate-leaderboard-data.ts`
- Ollama cloud model `gemma4:31b-cloud` does not exist — use `gemma3:27b-cloud`
- Image filtering: reject on vision API failure (not accept), to prevent Chinese-text images from passing through

## User Preferences

- Blog publishing: Claude Code with `fetch-article.ts` + `publish-blog.sh --local`
- Every article must include images from the original source
- No WeChat links in articles (auto-stripped by fetch-article.ts)
- No 参考/出典/翻訳元 disclaimers
- No video prompts or un-embeddable video references
- Database: Git-committed SQLite (no external services)
- Japanese-first content, natural idiomatic Japanese
