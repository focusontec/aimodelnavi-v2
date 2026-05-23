/**
 * Generate model analyses: web search + LLM synthesis for each model.
 * Stores structured analysis in model_analyses table.
 * Optionally generates standalone blog articles for top models.
 */

import { getDb, migrate } from "../lib/db";
import { callLLM } from "../lib/anthropic";
import { saveBlogPost, saveBlogPostEn } from "../lib/storage";

const LLM_API_KEY = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface Analysis {
  summary: string;
  performance: string;
  comparisons: string;
  community: string;
  useCaseDeep: string;
  latestNews: string;
  sources: { title: string; url: string }[];
}

// ── Web Search ──

async function webSearch(query: string): Promise<SearchResult[]> {
  if (!OLLAMA_API_KEY) return [];

  try {
    const res = await fetch("https://ollama.com/api/web_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({ query, max_results: 5 }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.results || []).map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: r.content || r.snippet || "",
    }));
  } catch {
    return [];
  }
}

async function searchModelInfo(modelName: string, developer: string): Promise<SearchResult[]> {
  const queries = [
    `${modelName} benchmark performance 2026`,
    `${modelName} vs comparison review`,
    `${modelName} ${developer} latest news`,
  ];

  const allResults: SearchResult[] = [];
  for (const q of queries) {
    const results = await webSearch(q);
    allResults.push(...results);
    await new Promise(r => setTimeout(r, 500));
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return allResults.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  }).slice(0, 10);
}

// ── LLM Analysis ──

async function generateAnalysis(
  modelName: string,
  developer: string,
  description: string,
  searchResults: SearchResult[]
): Promise<Analysis> {
  const context = searchResults.length > 0
    ? searchResults.map(r => `[${r.title}](${r.url}): ${r.snippet}`).join("\n\n")
    : "No web search results available. Use your training knowledge.";

  const system = `You are an AI model analyst. Write a detailed, factual analysis of this AI model.
Use the provided web search results for the most current data. If search results are limited, use your training knowledge.

Output JSON with these fields (all in English):
{
  "summary": "2-3 paragraph overview of the model, its positioning, and key innovations",
  "performance": "Detailed benchmark comparison with specific scores (GPQA, SWE-Bench, Arena Elo, etc). Use markdown tables where appropriate.",
  "comparisons": "Head-to-head comparison with 2-3 main competitors. Include pricing, context window, and strengths/weaknesses.",
  "community": "What developers and researchers are saying. Include any notable reactions or adoption patterns.",
  "useCaseDeep": "3-4 specific use cases with examples. When to choose this model over alternatives.",
  "latestNews": "Recent developments: pricing changes, new features, API updates, partnerships.",
  "sources": [{"title": "Source title", "url": "https://..."}]
}

Be specific with numbers. Cite sources where possible. Write in a professional but accessible tone.`;

  const user = `Model: ${modelName} (${developer})
Description: ${description}

Web search results:
${context}`;

  const result = await callLLM(system, user, 8192, 120000);

  const cleaned = result
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse LLM response as JSON");
  }
}

// ── Blog Article Generation ──

async function generateBlogArticle(
  modelName: string,
  developer: string,
  analysis: Analysis
): Promise<{ title: string; content: string; excerpt: string }> {
  const system = `You are a tech journalist writing for AI Models Navi (aimodelsnavi.com).
Write a comprehensive blog article about this AI model in English.
The article should be SEO-friendly, well-structured, and provide genuine value to readers.

Guidelines:
- Use markdown with proper headings (##, ###)
- Include specific benchmark numbers
- Compare with competing models
- No "translated from" disclaimers — write as original content
- Title should be SEO-friendly (include model name and key selling point)
- 1500-2500 words

Output JSON:
{
  "title": "SEO-friendly article title",
  "content": "Full markdown article body (NO H1 — title rendered separately)",
  "excerpt": "2-3 sentence summary"
}`;

  const user = `Model: ${modelName} (${developer})

Analysis:
Summary: ${analysis.summary}
Performance: ${analysis.performance}
Comparisons: ${analysis.comparisons}
Community: ${analysis.community}
Use Cases: ${analysis.useCaseDeep}
Latest: ${analysis.latestNews}`;

  const result = await callLLM(system, user, 8192, 120000);

  const cleaned = result
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Failed to parse blog article JSON");
  }
}

// ── Main Pipeline ──

export interface AnalysisResult {
  analyzed: number;
  blogGenerated: number;
  errors: number;
}

export async function generateModelAnalyses(opts?: {
  limit?: number;
  generateBlog?: boolean;
  modelSlugs?: string[];
}): Promise<AnalysisResult> {
  migrate();
  const db = getDb();

  const limit = opts?.limit || 10;
  const generateBlog = opts?.generateBlog ?? true;

  console.log(`\n═══ Stage: Generate Model Analyses ═══`);

  if (!LLM_API_KEY) {
    console.log("  No LLM_API_KEY, skipping");
    return { analyzed: 0, blogGenerated: 0, errors: 0 };
  }

  // Get models that need analysis (high priority first, no existing analysis)
  let query = `
    SELECT m.id, m.slug, m.name, m.developer, m.description_ja, m.priority,
      mt_en.translated_text as description_en
    FROM models m
    LEFT JOIN model_translations mt_en ON mt_en.model_id = m.id
      AND mt_en.language = 'en' AND mt_en.field_name = 'description'
    LEFT JOIN model_analyses ma ON ma.model_id = m.id AND ma.language = 'en'
    WHERE ma.id IS NULL
  `;

  if (opts?.modelSlugs?.length) {
    const placeholders = opts.modelSlugs.map(() => "?").join(",");
    query += ` AND m.slug IN (${placeholders})`;
  }

  query += ` ORDER BY m.priority DESC, m.release_date DESC NULLS LAST LIMIT ?`;

  const params = opts?.modelSlugs?.length
    ? [...opts.modelSlugs, limit]
    : [limit];

  const models = db.prepare(query).all(...params) as {
    id: number; slug: string; name: string; developer: string;
    description_ja: string | null; description_en: string | null; priority: number;
  }[];

  if (models.length === 0) {
    console.log("  All models already have analyses");
    return { analyzed: 0, blogGenerated: 0, errors: 0 };
  }

  console.log(`  ${models.length} models to analyze`);

  const result: AnalysisResult = { analyzed: 0, blogGenerated: 0, errors: 0 };

  const insertAnalysis = db.prepare(`
    INSERT OR REPLACE INTO model_analyses
      (model_id, language, summary, performance, comparisons, community, use_case_deep, latest_news, sources_json, generated_at)
      VALUES (?, 'en', ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  for (const model of models) {
    console.log(`\n  [${model.name}] Analyzing...`);

    try {
      // Step 1: Web search
      console.log(`    Searching web...`);
      const searchResults = await searchModelInfo(model.name, model.developer);
      console.log(`    Found ${searchResults.length} results`);

      // Step 2: Generate analysis
      console.log(`    Generating analysis...`);
      const description = model.description_en || model.description_ja || "";
      const analysis = await generateAnalysis(model.name, model.developer, description, searchResults);

      // Step 3: Store in DB
      insertAnalysis.run(
        model.id,
        analysis.summary,
        analysis.performance,
        analysis.comparisons,
        analysis.community,
        analysis.useCaseDeep,
        analysis.latestNews,
        JSON.stringify(analysis.sources || [])
      );

      console.log(`    ✓ Analysis saved`);
      result.analyzed++;

      // Step 4: Generate blog article (for priority >= 5 models)
      if (generateBlog && model.priority >= 5) {
        console.log(`    Generating blog article...`);
        try {
          const article = await generateBlogArticle(model.name, model.developer, analysis);
          const slug = `${model.slug}-deep-dive`;
          const today = new Date().toISOString().split("T")[0];

          // Save EN version
          saveBlogPostEn(slug, {
            title: article.title,
            date: today,
            tag: model.developer || "AI",
            excerpt: article.excerpt,
          }, article.content);

          // Generate JA version too
          const jaResult = await callLLM(
            `Translate this English blog article to natural Japanese. Preserve markdown structure, tables, and technical terms. Title should be SEO-friendly Japanese.`,
            `Title: ${article.title}\n\n${article.content}`,
            8192, 120000
          );

          const jaTitle = jaResult.match(/^#\s*(.+)/m)?.[1] || article.title;
          const jaContent = jaResult.replace(/^#\s*.+\n/, "").trim();

          saveBlogPost(slug, {
            title: jaTitle,
            date: today,
            tag: model.developer || "AI",
            excerpt: article.excerpt,
          }, jaContent);

          console.log(`    ✓ Blog article: ${slug}`);
          result.blogGenerated++;
        } catch (err) {
          console.warn(`    ⚠ Blog generation failed: ${err}`);
        }
      }

      // Rate limiting
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`    ✗ Failed: ${err}`);
      result.errors++;
    }
  }

  console.log(`\n  Done: ${result.analyzed} analyzed, ${result.blogGenerated} blog articles, ${result.errors} errors`);
  return result;
}

// CLI entry point
if (process.argv[1]?.includes("generate-model-analyses")) {
  const args = process.argv.slice(2);
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) || 5 : 5;
  const noBlog = args.includes("--no-blog");
  const slugIdx = args.indexOf("--slug");
  const slug = slugIdx !== -1 ? args[slugIdx + 1] : undefined;

  generateModelAnalyses({
    limit,
    generateBlog: !noBlog,
    modelSlugs: slug ? [slug] : undefined,
  }).then(r => {
    console.log("\nResult:", r);
  }).catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
  });
}
