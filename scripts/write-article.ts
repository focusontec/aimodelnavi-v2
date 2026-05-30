#!/usr/bin/env tsx

/**
 * write-article.ts — Topic-driven article creation with web research and image sourcing
 *
 * Pipeline:
 *   1. Queries    — Generate multi-angle search queries from topic
 *   2. Research   — Web search + fetch source pages for deep content
 *   3. Images     — Search, download, and validate images (mimo-v2.5 vision)
 *   4. Write      — LLM generates article with image placeholders
 *   5. Validate   — Fact-check against research sources
 *   6. Save       — Output draft to _drafts/
 *   7. Publish    — Optional: auto-publish via publish-blog.sh --local
 *
 * Usage:
 *   npx tsx scripts/write-article.ts --topic "Claude Opus 4.7 新機能"
 *   npx tsx scripts/write-article.ts --topic "DeepSeek V4" --images 2 --lang ja
 *   npx tsx scripts/write-article.ts --topic "GPT-5.2" --dry-run
 *   npx tsx scripts/write-article.ts --topic "MiniMax M3" --publish
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { callLLM } from "./lib/anthropic";
import { fetchSources, formatResearchForLLM, type ResearchSource } from "./lib/research";
import { filterImages, type ImageToFilter } from "./lib/image-filter";

// ── CLI args ──

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const AUTO_PUBLISH = args.includes("--publish");

function getArg(name: string, fallback: string): string {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const TOPIC = getArg("--topic", "");
const TAG = getArg("--tag", "");
const MAX_IMAGES = parseInt(getArg("--images", "3"), 10);
const LANG = getArg("--lang", "zh") as "zh" | "ja";
const DEPTH = getArg("--depth", "standard") as "deep" | "standard";

if (!TOPIC) {
  console.error("Error: --topic is required");
  console.error("Usage: npx tsx scripts/write-article.ts --topic \"Your topic here\"");
  process.exit(1);
}

// ── Constants ──

const QUERY_COUNT = DEPTH === "deep" ? 5 : 3;
const MAX_TOKENS = DEPTH === "deep" ? 5000 : 3000;
const OLLAMA_BASE = process.env.LLM_BASE_URL || "https://ollama.com/v1/chat/completions";
const OLLAMA_KEY = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
const VISION_API_KEY = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
const VISION_BASE_URL = process.env.LLM_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1/chat/completions";
const VISION_MODEL = process.env.VISION_MODEL || "mimo-v2.5";

const TAGS = "OpenAI, Anthropic, Google, オープンソース, ベンチマーク, チュートリアル, AIエージェント, xAI, DeepSeek, 解説, 速報, 料金比較";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

// ── Web search (from enhance-blog.ts) ──

async function webSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  if (!OLLAMA_KEY) {
    console.warn("  No LLM_API_KEY, skipping web search");
    return [];
  }
  try {
    const res = await fetch("https://ollama.com/api/web_search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OLLAMA_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, max_results: maxResults }),
    });
    if (!res.ok) {
      console.warn(`  Web search HTTP ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { results?: SearchResult[] };
    return data.results || [];
  } catch (err) {
    console.warn(`  Web search failed: ${err}`);
    return [];
  }
}

// ── Step 1: Generate search queries ──

async function generateSearchQueries(topic: string): Promise<string[]> {
  console.log("\n═══ Step 1: Generating search queries ═══\n");

  const system = `You are a research assistant. Generate ${QUERY_COUNT} search queries to deeply research the given topic.

Cover these angles:
1. Technical details, architecture, benchmarks
2. Pricing, API comparison with competitors
3. Recent news, announcements, release dates
4. Developer reactions, use cases, practical implications
5. Official screenshots, diagrams, charts (for images)

Respond as a JSON array of strings. Each query should be in English for best search results.
Example: ["query 1", "query 2", "query 3"]`;

  const result = await callLLM(system, `Topic: ${topic}`, 512);
  const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const queries = JSON.parse(cleaned);
    if (Array.isArray(queries) && queries.length > 0) {
      queries.forEach((q: string) => console.log(`  → ${q}`));
      return queries.slice(0, QUERY_COUNT);
    }
  } catch {
    // fallback: extract quoted strings
    const matches = cleaned.match(/"([^"]+)"/g);
    if (matches && matches.length > 0) {
      const queries = matches.map((m) => m.replace(/"/g, ""));
      queries.forEach((q) => console.log(`  → ${q}`));
      return queries.slice(0, QUERY_COUNT);
    }
  }

  // ultimate fallback: use the topic itself
  console.log(`  → (fallback) ${topic}`);
  return [topic];
}

// ── Step 2: Web research ──

async function researchTopic(queries: string[]): Promise<{ facts: string; sources: ResearchSource[] }> {
  console.log("\n═══ Step 2: Web research ═══\n");

  // Run all searches
  const allResults: SearchResult[] = [];
  const seen = new Set<string>();

  for (const q of queries) {
    console.log(`  Searching: ${q.slice(0, 60)}...`);
    const results = await webSearch(q, 5);
    for (const r of results) {
      if (!seen.has(r.url)) {
        seen.add(r.url);
        allResults.push(r);
      }
    }
  }

  console.log(`  Total: ${allResults.length} unique results`);

  if (allResults.length === 0) {
    console.warn("  No search results, using topic alone");
    return { facts: `Topic: ${TOPIC}`, sources: [] };
  }

  // Fetch top source pages for deep content
  const topUrls = allResults.slice(0, 5).map((r) => r.url);
  console.log(`\n  Fetching ${topUrls.length} source pages...`);
  const sources = await fetchSources(topUrls, 8000);

  // Build research context from search snippets + fetched content
  const snippets = allResults
    .map((r, i) => `[S${i + 1}] ${r.title}\n  URL: ${r.url}\n  ${r.snippet}`)
    .join("\n\n");

  const fetchedContent = formatResearchForLLM(sources);

  // Extract key facts
  console.log("\n  Extracting key facts...");
  const system = `Extract key facts from these research sources for a blog article.
Focus on:
- Specific numbers (revenue, users, benchmark scores, prices)
- Official product names, company names, person names
- Dates and timelines
- Important quotes
- Comparison data with competitors

Mark each fact with its source reference. Output as a Markdown list.`;

  const facts = await callLLM(system, `# Search Results\n${snippets}\n\n# Source Content\n${fetchedContent}`, 2048);
  console.log(`  Extracted ${facts.length} chars of facts`);

  return { facts, sources };
}

// ── Step 3: Image search + download + validate ──

async function searchAndDownloadImages(
  topic: string,
  slug: string
): Promise<{ paths: string[]; errors: string[] }> {
  console.log("\n═══ Step 3: Image sourcing ═══\n");

  if (MAX_IMAGES === 0) {
    console.log("  Skipping (--images 0)");
    return { paths: [], errors: [] };
  }

  // Search for images
  const imageQueries = [
    `${topic} benchmark chart 2026`,
    `${topic} official announcement screenshot`,
    `${topic} architecture diagram technical`,
  ];

  const imageUrls: string[] = [];
  const seenUrls = new Set<string>();

  for (const q of imageQueries) {
    const results = await webSearch(q, 3);
    for (const r of results) {
      // Look for image URLs in the result URLs or snippets
      const urls = extractImageUrls(r.url, r.snippet || "");
      for (const url of urls) {
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          imageUrls.push(url);
        }
      }
    }
  }

  console.log(`  Found ${imageUrls.length} candidate image URLs`);

  if (imageUrls.length === 0) {
    console.log("  No images found, continuing without images");
    return { paths: [], errors: [] };
  }

  // Create image directory
  const imgDir = path.join(process.cwd(), "public", "images", "blog", slug);
  fs.mkdirSync(imgDir, { recursive: true });

  // Download images
  const downloaded: ImageToFilter[] = [];
  const localPaths: string[] = [];

  for (let i = 0; i < Math.min(imageUrls.length, MAX_IMAGES * 2); i++) {
    const url = imageUrls[i];
    try {
      console.log(`  Downloading: ${url.slice(0, 80)}...`);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AIModelsNavi/1.0)",
          Referer: new URL(url).origin,
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.warn(`    ✗ HTTP ${res.status}`);
        continue;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) {
        console.warn(`    ✗ Not an image: ${contentType}`);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 1024) {
        console.warn(`    ✗ Too small (${buffer.length} bytes)`);
        continue;
      }

      const ext = contentType.split("/")[1]?.split(";")[0] || "jpg";
      const filename = `img-${downloaded.length + 1}.${ext}`;
      const filepath = path.join(imgDir, filename);
      fs.writeFileSync(filepath, buffer);

      const localPath = `/images/blog/${slug}/${filename}`;
      downloaded.push({ url: localPath, alt: `Image ${downloaded.length + 1}` });
      localPaths.push(localPath);
      console.log(`    ✓ ${filename} (${buffer.length} bytes)`);
    } catch (err) {
      console.warn(`    ✗ ${err}`);
    }

    if (downloaded.length >= MAX_IMAGES) break;
  }

  if (downloaded.length === 0) {
    return { paths: [], errors: ["No images could be downloaded"] };
  }

  // Validate with vision API
  console.log(`\n  Validating ${downloaded.length} images...`);
  const { kept, rejected } = await filterImages(downloaded, TOPIC, {
    useVision: !!VISION_API_KEY,
    apiKey: VISION_API_KEY,
    baseUrl: VISION_BASE_URL,
    model: VISION_MODEL,
  });

  // Delete rejected images
  for (const r of rejected) {
    const fullPath = path.join(process.cwd(), "public", r.image.url);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`  Deleted: ${r.image.url} (${r.reason})`);
    }
  }

  const finalPaths = kept.map((k) => k.url);
  console.log(`\n  Final: ${finalPaths.length} images kept`);

  return { paths: finalPaths, errors: rejected.map((r) => `${r.image.url}: ${r.reason}`) };
}

function extractImageUrls(url: string, snippet?: string): string[] {
  const urls: string[] = [];
  const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i;

  // Check if the URL itself is an image
  if (imagePattern.test(url)) {
    urls.push(url);
  }

  // Check snippet for image URLs
  if (snippet) {
    const urlPattern = /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg|avif)(\?[^\s"'<>]*)?/gi;
    const matches = snippet.match(urlPattern);
    if (matches) {
      urls.push(...matches);
    }
  }

  return urls;
}

// ── Step 4: Write article ──

// Banned phrases (AI slop detection — English + Japanese)
const BANNED_PHRASES_EN = [
  "In today's digital landscape", "In the ever-evolving", "It's important to note",
  "It is worth mentioning", "Dive into", "deep dive", "delve",
  "Game-changer", "Revolutionize", "transformative",
  "Cutting-edge", "state-of-the-art", "robust",
  "Harness the power", "Unlock the potential", "Leverage",
  "Seamlessly", "seamless integration",
  "Tapestry", "rich tapestry", "multifaceted",
  "Comprehensive guide", "Furthermore", "Moreover",
  "Navigate the landscape", "Empower", "empowering", "At its core",
  "In this article, we will", "crucial", "elevate", "foster",
  "embark", "endeavor", "facilitate", "paramount", "nuanced",
  "intricate", "meticulous", "realm", "utilize", "illuminate",
  "underscore", "indeed", "pivotal", "testament",
];

const BANNED_PHRASES_JA = [
  "注目すべきは", "特筆すべきは", "重要なのは", "言うまでもなく",
  "深く掘り下げ", "包括的", "シームレス", "革新的",
  "最先端", "強力な", "끊임없이進化する",
  "本記事では", "～について解説します",
];

async function writeArticle(
  research: { facts: string; sources: ResearchSource[] },
  imagePaths: string[]
): Promise<{ title: string; tag: string; excerpt: string; body: string }> {
  console.log("\n═══ Step 4: Writing article ═══\n");

  const isJa = LANG === "ja";
  const langInstruction = isJa
    ? "Write in Japanese (だ・である form, no ですます). Professional but accessible for Japanese developers."
    : "Write in Chinese. Professional but accessible for Chinese-speaking developers.";

  const bannedList = isJa ? BANNED_PHRASES_JA : BANNED_PHRASES_EN;
  const bannedExamples = bannedList.slice(0, 10).join('", "');

  const system = `You are a technical blog writer for aimodelsnavi.com (AI model comparison site).
Write a blog article based on the research facts provided.

## RULES

### Facts & Sources
1. Use ONLY facts from the research. No speculation or fabrication.
2. Every statistic MUST have inline source: ([Source Name](url), year)
3. For uncertain info, use hedging language sparingly.

### Language & Style
4. ${langInstruction}
5. Do NOT include H1 heading (frontmatter title is used).
6. ${DEPTH === "deep" ? "4000-6000 characters" : "2000-3000 characters"}, structured with H2 headings.
7. End with a "まとめ" or "总结" section.

### Answer-First Formatting (CRITICAL)
8. Every H2 section MUST open with a 40-60 word paragraph that:
   - Contains at least one specific statistic with source attribution
   - Directly answers the heading's implicit question
   - Uses natural, conversational language
   Pattern: ## Heading → [Stat with source]. [Direct answer in 1-2 sentences.]

### Sentence Variation (Anti-AI Detection)
9. Vary sentence length deliberately — mix short (8-12 words) and long (20-30 words) sentences.
10. No more than 3 consecutive sentences within 5 words of each other's length.
11. Use rhetorical questions every 200-300 words to break declarative patterns.
12. Vary paragraph lengths — some 2 sentences, some 5 sentences. No uniform blocks.

### Banned Phrases (ZERO TOLERANCE)
13. NEVER use these phrases: "${bannedExamples}" and similar AI-sounding expressions.
14. No em dashes (—). Use commas, colons, or periods instead.

### E-E-A-T & Citations
15. Cite 5-8 unique sources inline. Format: ([Source](url), year)
16. Include experience markers naturally: "テストした結果...", "実際に使ってみると...", "データを見ると..."
17. Lead with data, not opinions. "92.4%を記録した" not "非常に優秀な性能"

### Images
18. Include image placeholders: ![description](image:0), ![description](image:1), etc.
    Place them naturally where they add value.
    ${imagePaths.length > 0 ? `You have ${imagePaths.length} images available (indices 0-${imagePaths.length - 1}).` : "No images available."}

Available tags: ${TAGS}

Respond as JSON:
{"title":"SEO-friendly title","tag":"one tag from list","excerpt":"2-3 sentence summary with one stat","body":"Markdown body without H1"}`;

  const sourceList = research.sources.map((s, i) => `[${i + 1}] ${s.title} — ${s.url}`).join("\n");

  const userMessage = `# Topic
${TOPIC}

# Research Facts
${research.facts}

# Sources
${sourceList}`;

  const result = await callLLM(system, userMessage, 8192, 120000);
  const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.title && parsed.body) {
      console.log(`  Title: ${parsed.title}`);
      console.log(`  Body: ${parsed.body.length} chars`);
      return {
        title: parsed.title,
        tag: parsed.tag || TAG || "解説",
        excerpt: parsed.excerpt || "",
        body: parsed.body,
      };
    }
  } catch {
    // Try regex extraction
    const extractField = (name: string): string | null => {
      const re = new RegExp(`"${name}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "s");
      const m = cleaned.match(re);
      if (!m) return null;
      return m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    };
    const title = extractField("title");
    const body = extractField("body");
    if (title && body) {
      return {
        title,
        tag: extractField("tag") || TAG || "解説",
        excerpt: extractField("excerpt") || "",
        body,
      };
    }
  }

  throw new Error("Failed to parse article output from LLM");
}

// ── Step 5: Replace image placeholders ──

function replaceImagePlaceholders(body: string, imagePaths: string[]): string {
  if (imagePaths.length === 0) {
    // Remove image placeholders when no images available
    return body.replace(/!\[[^\]]*\]\(image:\d+\)\n?/g, "");
  }

  let result = body;
  const usedIndices = new Set<number>();

  // Replace image:N placeholders with actual paths
  result = result.replace(/!\[([^\]]*)\]\(image:(\d+)\)/g, (match, alt, idx) => {
    const index = parseInt(idx, 10);
    if (index >= 0 && index < imagePaths.length) {
      usedIndices.add(index);
      return `![${alt}](${imagePaths[index]})`;
    }
    return match;
  });

  // Append unused images before the last section
  const unused = imagePaths.filter((_, i) => !usedIndices.has(i));
  if (unused.length > 0) {
    const lastH2 = result.lastIndexOf("\n## ");
    if (lastH2 > 0) {
      const images = unused.map((p, i) => `\n![Image](${p})\n`).join("");
      result = result.slice(0, lastH2) + images + result.slice(lastH2);
    } else {
      const images = unused.map((p) => `\n![Image](${p})\n`).join("");
      result += images;
    }
  }

  return result;
}

// ── Step 6: Fact-check and revise ──

async function validateAndRevise(
  article: { title: string; tag: string; excerpt: string; body: string },
  research: { facts: string; sources: ResearchSource[] }
): Promise<{ title: string; tag: string; excerpt: string; body: string }> {
  console.log("\n═══ Step 5: Fact-checking ═══\n");

  const system = `You are a fact-checker. Verify the blog article against the research sources.

Check:
1. Numbers/data match sources
2. Product names, company names, person names are correct
3. Dates are accurate
4. Claims accurately reflect source content

Respond as JSON:
{"valid":true/false,"issues":["issue 1","issue 2"],"suggestions":["fix 1","fix 2"]}`;

  const userMessage = `# Article to verify
Title: ${article.title}

${article.body}

# Research facts (source of truth)
${research.facts}`;

  const result = await callLLM(system, userMessage, 2048);
  const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    console.log(`  Valid: ${parsed.valid}`);
    if (parsed.issues?.length > 0) {
      parsed.issues.forEach((i: string) => console.log(`    ✗ ${i}`));
    }

    if (!parsed.valid && parsed.issues?.length > 0) {
      console.log("\n  Revising...");
      const revised = await reviseArticle(article, parsed);
      console.log("  ✓ Revised");
      return revised;
    }
  } catch {
    console.log("  Could not parse validation, proceeding as-is");
  }

  return article;
}

async function reviseArticle(
  article: { title: string; tag: string; excerpt: string; body: string },
  validation: { issues: string[]; suggestions: string[] }
): Promise<{ title: string; tag: string; excerpt: string; body: string }> {
  const system = `Fix the fact-check issues in this blog article.
Only fix the specific issues mentioned. Keep the structure and tone.
Respond as JSON: {"title":"...","tag":"...","excerpt":"...","body":"corrected Markdown"}`;

  const userMessage = `# Article
${JSON.stringify(article, null, 2)}

# Issues
${validation.issues.join("\n")}

# Suggestions
${validation.suggestions.join("\n")}`;

  const result = await callLLM(system, userMessage, 8192);
  const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.title && parsed.body) return parsed;
  } catch { /* keep original */ }

  return article;
}

// ── Step 6b: Quality scoring ──

interface QualityScore {
  total: number;
  content: number;
  seo: number;
  eeat: number;
  aiDetection: number;
  issues: string[];
  blocking: boolean;
}

function detectAISlop(body: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let penalty = 0;

  // First-order: banned phrases
  const allBanned = LANG === "ja" ? BANNED_PHRASES_JA : BANNED_PHRASES_EN;
  for (const phrase of allBanned) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = body.match(regex);
    if (matches && matches.length > 0) {
      issues.push(`Banned phrase: "${phrase}" (${matches.length}x)`);
      penalty += 5;
    }
  }

  // First-order: em dash detection
  const emDashes = (body.match(/—/g) || []).length;
  if (emDashes > 0) {
    issues.push(`Em dashes found: ${emDashes} (use commas or colons instead)`);
    penalty += emDashes * 2;
  }

  // Second-order: question-cadence H2s
  const h2s = body.match(/^## .+$/gm) || [];
  const questionH2s = h2s.filter((h) => h.trim().endsWith("？") || h.trim().endsWith("?"));
  if (h2s.length > 0 && questionH2s.length / h2s.length > 0.7) {
    issues.push(`Question-cadence H2s: ${Math.round((questionH2s.length / h2s.length) * 100)}% (max 70%)`);
    penalty += 5;
  }

  // Second-order: "Here" opener pattern (English) / "以下" opener (Japanese)
  const hereOpeners = (body.match(/^(?:Here(?:'s| are| is)|以下[はが]) /gm) || []).length;
  if (hereOpeners >= 3) {
    issues.push(`"Here/以下" openers: ${hereOpeners} (max 2)`);
    penalty += 3;
  }

  // Second-order: sentence-length flatness
  const sentences = body.split(/[。.！!？?]/g).filter((s) => s.trim().length > 5);
  if (sentences.length > 10) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const sd = Math.sqrt(lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length);
    const burstiness = sd / mean;
    if (burstiness < 0.3) {
      issues.push(`Low burstiness: ${burstiness.toFixed(2)} (min 0.30)`);
      penalty += 5;
    }
  }

  // Second-order: opening-word repetition
  const firstWords = sentences.map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
  if (firstWords.length > 10) {
    const freq: Record<string, number> = {};
    for (const w of firstWords) freq[w] = (freq[w] || 0) + 1;
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const top3Share = sorted.slice(0, 3).reduce((a, [, c]) => a + c, 0) / firstWords.length;
    if (top3Share > 0.25) {
      issues.push(`Opening-word repetition: top 3 = ${(top3Share * 100).toFixed(0)}% (max 25%)`);
      penalty += 3;
    }
  }

  const score = Math.max(0, 100 - penalty);
  return { score, issues };
}

async function scoreArticle(
  article: { title: string; tag: string; excerpt: string; body: string },
  research: { facts: string; sources: ResearchSource[] }
): Promise<QualityScore> {
  console.log("\n═══ Step 6b: Quality scoring ═══\n");

  // AI slop detection (fast, no LLM needed)
  const aiCheck = detectAISlop(article.body);
  if (aiCheck.issues.length > 0) {
    aiCheck.issues.forEach((i) => console.log(`    ⚠ ${i}`));
  }
  console.log(`  AI Detection score: ${aiCheck.score}/100`);

  // LLM-based quality scoring
  const system = `You are a blog quality reviewer. Score this article on a 100-point scale.

Scoring categories:
- Content Quality (30pt): depth, readability, originality, structure
- SEO (25pt): headings, title, keywords, internal/external links
- E-E-A-T (15pt): source citations, experience signals, trustworthiness
- AI Citation Readiness (15pt): answer-first format, Q&A sections, extractable passages
- Technical (15pt): structured data, image alt text, mobile-friendly content

Respond as JSON:
{"total":N,"content":N,"seo":N,"eeat":N,"citation":N,"issues":["issue1"],"blocking":true/false}

blocking=true if total < 80 or any critical issues found.`;

  const userMessage = `# Article
Title: ${article.title}
Tag: ${article.tag}

${article.body}

# Sources used
${research.sources.map((s, i) => `[${i + 1}] ${s.title} — ${s.url}`).join("\n")}`;

  try {
    const result = await callLLM(system, userMessage, 1024);
    const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    const total = Math.min(parsed.total || 80, 100);
    console.log(`  Content: ${parsed.content}/30`);
    console.log(`  SEO: ${parsed.seo}/25`);
    console.log(`  E-E-A-T: ${parsed.eeat}/15`);
    console.log(`  AI Citation: ${parsed.citation}/15`);
    console.log(`  TOTAL: ${total}/100`);

    const allIssues = [...(parsed.issues || []), ...aiCheck.issues];
    const blocking = total < 80 || aiCheck.score < 80;

    return {
      total,
      content: parsed.content || 0,
      seo: parsed.seo || 0,
      eeat: parsed.eeat || 0,
      aiDetection: aiCheck.score,
      issues: allIssues,
      blocking,
    };
  } catch {
    console.log("  Could not parse scoring, using AI detection only");
    return {
      total: aiCheck.score,
      content: 0,
      seo: 0,
      eeat: 0,
      aiDetection: aiCheck.score,
      issues: aiCheck.issues,
      blocking: aiCheck.score < 80,
    };
  }
}

async function reviseForQuality(
  article: { title: string; tag: string; excerpt: string; body: string },
  score: QualityScore
): Promise<{ title: string; tag: string; excerpt: string; body: string }> {
  console.log("\n  Revising for quality...");

  const system = `Fix the quality issues in this blog article. Address EVERY issue listed.
Maintain the same structure, tone, and factual content. Only fix the specific problems.
Respond as JSON: {"title":"...","tag":"...","excerpt":"...","body":"corrected Markdown"}`;

  const userMessage = `# Article
${JSON.stringify(article, null, 2)}

# Quality Issues (fix all of these)
${score.issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}`;

  const result = await callLLM(system, userMessage, 8192);
  const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.title && parsed.body) {
      console.log("  ✓ Revised");
      return parsed;
    }
  } catch { /* keep original */ }

  return article;
}

// ── Step 7: Save draft ──

function saveDraft(
  article: { title: string; tag: string; excerpt: string; body: string },
  imagePaths: string[]
): string {
  console.log("\n═══ Step 6: Saving draft ═══\n");

  // Generate slug: keep ASCII words, fall back to date-based slug for non-ASCII titles
  const asciiWords = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = asciiWords.length > 10
    ? asciiWords.slice(0, 80)
    : `article-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).slice(2, 6)}`;

  const frontmatter = [
    "---",
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `date: "${new Date().toISOString().split("T")[0]}"`,
    `tag: "${article.tag}"`,
    `excerpt: "${(article.excerpt || "").replace(/"/g, '\\"')}"`,
    `source: "write-article:topic"`,
    `lang: "${LANG}"`,
    `images: ${imagePaths.length}`,
    "---",
    "",
  ].join("\n");

  const content = frontmatter + article.body;
  const filePath = path.join(process.cwd(), "_drafts", `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`  ✓ Saved: ${filePath}`);
  console.log(`  ✓ Slug: ${slug}`);
  console.log(`  ✓ Images: ${imagePaths.length}`);

  return filePath;
}

// ── Step 7: Optional publish ──

function publishDraft(filePath: string): void {
  console.log("\n═══ Step 7: Publishing ═══\n");

  try {
    execSync(`echo "y" | ./scripts/publish-blog.sh "${filePath}" --local`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  } catch (err) {
    console.error(`  Publish failed: ${err}`);
    console.log(`  Manual command: ./scripts/publish-blog.sh "${filePath}" --local`);
  }
}

// ── Main ──

async function main() {
  const startTime = Date.now();

  console.log("═══════════════════════════════════════");
  console.log("  write-article.ts");
  console.log("═══════════════════════════════════════");
  console.log(`  Topic: ${TOPIC}`);
  console.log(`  Tag: ${TAG || "(auto)"}`);
  console.log(`  Images: ${MAX_IMAGES}`);
  console.log(`  Lang: ${LANG}`);
  console.log(`  Depth: ${DEPTH}`);
  console.log(`  Dry run: ${DRY_RUN}`);
  console.log(`  Auto publish: ${AUTO_PUBLISH}`);
  console.log("");

  // Step 1: Generate search queries
  const queries = await generateSearchQueries(TOPIC);

  // Step 2: Web research
  const research = await researchTopic(queries);

  if (DRY_RUN) {
    console.log("\n═══ DRY RUN: Skipping article writing ═══\n");
    console.log("Research facts:");
    console.log(research.facts.slice(0, 1000));
    console.log(`\nSources: ${research.sources.length}`);
    research.sources.forEach((s) => console.log(`  - ${s.title} (${s.url})`));
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nDone in ${elapsed}s`);
    return;
  }

  // Generate temporary slug for image directory
  const tempSlug = TOPIC.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);

  // Step 3: Image sourcing
  const { paths: imagePaths, errors: imageErrors } = await searchAndDownloadImages(TOPIC, tempSlug);

  // Step 4: Write article
  const article = await writeArticle(research, imagePaths);

  // Step 5: Replace image placeholders
  const bodyWithImages = replaceImagePlaceholders(article.body, imagePaths);

  // Step 6: Fact-check
  const validated = await validateAndRevise(
    { ...article, body: bodyWithImages },
    research
  );

  // Step 6b: Quality scoring + revision loop
  let finalArticle = validated;
  const score = await scoreArticle(validated, research);
  if (score.blocking) {
    console.log(`\n  Score ${score.total}/100 < 80 — revising...`);
    finalArticle = await reviseForQuality(validated, score);
    // Re-score after revision
    const reScore = await scoreArticle(finalArticle, research);
    console.log(`  Revised score: ${reScore.total}/100`);
  } else {
    console.log(`  ✓ Score ${score.total}/100 — passing`);
  }

  // Step 7: Save draft
  const filePath = saveDraft(finalArticle, imagePaths);

  // Step 8: Optional publish
  if (AUTO_PUBLISH) {
    publishDraft(filePath);
  } else {
    console.log(`\n  To publish: ./scripts/publish-blog.sh "${filePath}" --local`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n  Done in ${elapsed}s`);
}

main().catch((err) => {
  console.error(`\nFatal error: ${err}`);
  process.exit(1);
});
