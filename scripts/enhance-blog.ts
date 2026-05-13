#!/usr/bin/env tsx

/**
 * enhance-blog.ts — Two-pass AI blog enhancement with WebSearch and quality scoring
 *
 * Inspired by OpenClaw workspace-writing agent (deep_research.py + article_optimizer.py)
 *
 * Flow for each short post:
 *   1. WebSearch: Gather additional context, data, and references
 *   2. Pass 1 (deepseek-v3.2): Content enrichment with search results
 *   3. Pass 2 (gemma4:31b): Style polish for natural Japanese
 *   4. Quality check: 6-dimension scoring (target >= 35/50)
 *
 * Usage:
 *   npx tsx scripts/enhance-blog.ts              # enhance all short posts
 *   npx tsx scripts/enhance-blog.ts --dry-run    # preview candidates
 *   npx tsx scripts/enhance-blog.ts --slug=xxx   # enhance specific post
 */

import fs from "fs";
import path from "path";
import { getAllPosts } from "../src/lib/blog";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");
const MIN_CONTENT_LENGTH = 1500;
const TARGET_QUALITY_SCORE = 35; // out of 50

const OLLAMA_BASE = process.env.LLM_BASE_URL || "https://ollama.com/v1/chat/completions";
const OLLAMA_KEY = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
const ENRICH_MODEL = process.env.ENRICH_MODEL || "deepseek-v3.2:cloud";
const POLISH_MODEL = process.env.POLISH_MODEL || "gemma4:31b";

// ── Ollama Web Search ──

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function webSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  try {
    const res = await fetch("https://ollama.com/api/web_search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OLLAMA_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, max_results: maxResults }),
    });
    if (!res.ok) return [];
    const data = await res.json() as { results?: SearchResult[] };
    return data.results || [];
  } catch {
    return [];
  }
}

async function deepResearch(topic: string, tag: string): Promise<string> {
  console.log("    WebSearch: gathering context...");

  // Multi-angle search (inspired by deep_research.py)
  const queries = [
    `${topic} 技术细节 最新进展`,
    `${topic} benchmark 性能数据`,
    `${topic} 日本での評価 影響`,
  ];

  const allResults: SearchResult[] = [];
  const seen = new Set<string>();

  for (const q of queries) {
    const results = await webSearch(q, 3);
    for (const r of results) {
      if (!seen.has(r.url)) {
        seen.add(r.url);
        allResults.push(r);
      }
    }
  }

  if (allResults.length === 0) return "";

  const context = allResults
    .map((r, i) => `[${i + 1}] ${r.title}\n  URL: ${r.url}\n  ${r.snippet}`)
    .join("\n\n");

  console.log(`    Found ${allResults.length} references`);
  return `\n# 参考情報（WebSearch結果）\n${context}\n`;
}

// ── LLM call ──

async function callLLM(
  model: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens = 4096
): Promise<string> {
  const res = await fetch(OLLAMA_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OLLAMA_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

// ── Pass 1: Content enrichment (deep research + expansion) ──

async function enrichContent(
  title: string,
  content: string,
  excerpt: string,
  tag: string,
  searchContext: string
): Promise<string> {
  console.log(`    Pass 1: Enrich (${ENRICH_MODEL})...`);

  const system = `あなたは日本のAI専門ジャーナリストです。「AI Models Navi」の編集者として、以下のブログ記事を深掘りして拡充してください。

# 拡充の方向性
1. **技術的深さ**: 技術原理や仕組みをわかりやすく解説する
2. **データと証拠**: 具体的なベンチマーク数値、性能データ、比較情報を盛り込む
3. **独自の視点**: このニュースの本質的な意味、業界への影響を分析する
4. **実践的価値**: 日本のAI開発者が「で、自分は何をすればいいのか」がわかる内容に
5. **文脈化**: 過去の類似事例や関連トレンドとのつながりを示す

# 文体（カズキ流）※重要
- ですます調は使わず「〜だ」「〜である」調で
- 自分の意見・分析を明確に（「〜と考える」「〜だろう」）
- 事実と意見を混同しない
- 見出しは H2（##）から始める
- 最後に「## まとめと展望」を入れる

# 禁止事項
- 事実の捏造（参照情報にない数字は使わない）
- 過度な宣伝調・まとめサイト風
- 元記事の核心から外れた脱線

# 出力
拡充された記事全文をマークダウンで出力（JSONではない、直接マークダウンのみ）`;

  const userMessage = `# タイトル: ${title}\n# タグ: ${tag}\n# 要約: ${excerpt}\n\n# 元の記事:\n${content}${searchContext}`;

  return callLLM(ENRICH_MODEL, system, userMessage, 8192);
}

// ── Pass 2: Style polish (natural Japanese) ──

async function polishStyle(content: string, title: string): Promise<string> {
  console.log(`    Pass 2: Polish (${POLISH_MODEL})...`);

  const system = `あなたは日本語のプロ編集者です。以下のブログ記事を、より自然で読みやすい日本語に磨き上げてください。

# 改善ポイント
- 翻訳調の硬い表現をこなれた日本語に
- 長すぎる段落を適切に分割（1段落3〜5文が目安）
- 冗長な繰り返しを削除
- 読者の興味を引き続けるリズムを作る
- 技術用語は正確に保つ
- マークダウン形式を維持

# 出力
改善された記事全文をマークダウンで（JSONではない、直接マークダウンのみ）`;

  const userMessage = `# タイトル: ${title}\n\n${content}`;
  return callLLM(POLISH_MODEL, system, userMessage, 4096);
}

// ── Quality check ──

async function qualityCheck(title: string, content: string): Promise<{ total: number; report: string }> {
  console.log(`    Quality check...`);

  const system = `あなたはシニア技術編集者です。以下の記事を6つの次元で評価してください。

## 評価次元（各1-10点、満点60点）
1. 技術的深さ（表面ではなく原理まで掘り下げているか）
2. 論理的一貫性（議論が破綻なく構成されているか）
3. データ・証拠（具体的数値や事例で裏付けられているか）
4. 独自洞察（非自明な視点や分析があるか）
5. 実用的価値（読者が得られる知見があるか）
6. 日本語品質（自然で読みやすい日本語か）

## 記事
タイトル: ${title}

${content.slice(0, 5000)}

## 出力（JSON）
{
  "scores": { "技術的深さ": N, "論理的一貫性": N, "データ証拠": N, "独自洞察": N, "実用的価値": N, "日本語品質": N },
  "total": N,
  "verdict": "短い所感（1文）"
}`;

  const result = await callLLM(ENRICH_MODEL, system, "", 1024);
  try {
    const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    const data = JSON.parse(cleaned);
    return { total: data.total || 0, report: data.verdict || "" };
  } catch {
    return { total: 30, report: "評価失敗" };
  }
}

// ── Main ──

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const slugFilter = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

  console.log("═══════════════════════════════════════");
  console.log("  ブログ記事 AI 拡充 (WebSearch + 2-Pass + QC)");
  console.log("═══════════════════════════════════════\n");

  const allPosts = getAllPosts();
  const candidates = slugFilter
    ? allPosts.filter((p) => p.slug === slugFilter)
    : allPosts.filter((p) => p.content.length < MIN_CONTENT_LENGTH);

  if (candidates.length === 0) {
    console.log("  拡充が必要な短い記事はありません。");
    return;
  }

  console.log(`  対象: ${candidates.length} 記事 (全 ${allPosts.length} 中)\n`);

  for (let i = 0; i < candidates.length; i++) {
    const post = candidates[i];
    const contentLen = post.content.length;
    console.log(`[${i + 1}/${candidates.length}] ${post.title.slice(0, 70)}`);
    console.log(`    ${contentLen} chars`);

    if (dryRun) {
      console.log(`    → (dry-run: スキップ)\n`);
      continue;
    }

    try {
      const filePath = path.join(BLOG_DIR, `${post.slug}.md`);
      const rawMd = fs.readFileSync(filePath, "utf-8");
      const sourceMatch = rawMd.match(/source:\s*"?([^"\n]+)"?/);

      // Step 1: Web research
      const searchContext = await deepResearch(post.title, post.tag);

      // Step 2: Content enrichment
      const enriched = await enrichContent(post.title, post.content, post.excerpt, post.tag, searchContext);

      // Step 3: Style polish
      const polished = await polishStyle(enriched, post.title);

      // Step 4: Quality check
      const qc = await qualityCheck(post.title, polished);

      // Update file
      const frontmatterEnd = rawMd.indexOf("---", 4) + 3;
      const updatedMd = rawMd.slice(0, frontmatterEnd) + "\n\n" + polished.trim() + "\n";
      fs.writeFileSync(filePath, updatedMd, "utf-8");

      const newLen = polished.length;
      const growth = Math.round(((newLen - contentLen) / contentLen) * 100);
      console.log(`    → ${newLen} chars (+${growth}%) | QC: ${qc.total}/60 ${qc.report}\n`);
    } catch (err) {
      console.error(`    ✗ ${err}\n`);
    }
  }

  console.log(`  完了!`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
