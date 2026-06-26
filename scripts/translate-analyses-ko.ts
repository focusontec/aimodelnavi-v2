#!/usr/bin/env npx tsx
/**
 * translate-analyses-ko.ts — Batch translate model analyses from English to Korean
 *
 * Reads English analyses from model_analyses table,
 * translates summary/performance/comparisons/community/useCaseDeep/latestNews/pros/cons/keyMetrics to Korean,
 * and stores as language='ko' in the same table.
 *
 * Usage:
 *   npx tsx scripts/translate-analyses-ko.ts              # translate all missing
 *   npx tsx scripts/translate-analyses-ko.ts --dry-run    # preview only
 *   npx tsx scripts/translate-analyses-ko.ts --limit 10   # translate 10 models
 */

import { getDb, migrate } from "./lib/db";
import { callLLM } from "./lib/anthropic";

interface AnalysisRow {
  id: number;
  model_id: number;
  slug: string;
  name: string;
  key_metrics_json: string;
  pros_json: string;
  cons_json: string;
  competitors_json: string;
  summary: string;
  performance: string;
  comparisons: string;
  community: string;
  use_case_deep: string;
  latest_news: string;
  sources_json: string;
}

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

async function translateAnalysis(model: AnalysisRow): Promise<Record<string, string>> {
  const pros = parseJSON<string[]>(model.pros_json, []);
  const cons = parseJSON<string[]>(model.cons_json, []);
  const keyMetrics = parseJSON<{ label: string; value: string; context?: string }[]>(model.key_metrics_json, []);

  const input = JSON.stringify({
    summary: model.summary,
    performance: model.performance,
    comparisons: model.comparisons,
    community: model.community,
    useCaseDeep: model.use_case_deep,
    latestNews: model.latest_news,
    pros,
    cons,
    keyMetrics: keyMetrics.map(m => ({ label: m.label, context: m.context })),
  });

  const system = `You are a professional translator. Translate the following AI model analysis from English to Korean.

Rules:
- Keep model names, benchmark names (SWE-Bench, GPQA, Arena Elo, etc.), and numbers in English
- Keep technical terms accurate
- For keyMetrics, only translate label and context (keep value as-is)
- For pros/cons arrays, translate each item
- For text fields (summary, performance, comparisons, community, useCaseDeep, latestNews), write natural Korean paragraphs
- Output valid JSON with the same structure as input`;

  const result = await callLLM(system, input, 16384, 300000);
  const cleaned = result.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        const fixed = match[0].replace(/,\s*([}\]])/g, "$1").replace(/[\x00-\x1f]/g, "");
        return JSON.parse(fixed);
      }
    }
    throw new Error("Failed to parse LLM response as JSON");
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 999;

  migrate();
  const db = getDb();

  const models = db.prepare(`
    SELECT ma.id, ma.model_id, m.slug, m.name,
      ma.key_metrics_json, ma.pros_json, ma.cons_json, ma.competitors_json,
      ma.summary, ma.performance, ma.comparisons, ma.community,
      ma.use_case_deep, ma.latest_news, ma.sources_json
    FROM model_analyses ma
    JOIN models m ON m.id = ma.model_id
    WHERE ma.language = 'en'
      AND NOT EXISTS (
        SELECT 1 FROM model_analyses ko
        WHERE ko.model_id = ma.model_id AND ko.language = 'ko'
      )
    ORDER BY m.priority DESC, m.release_date DESC NULLS LAST
    LIMIT ?
  `).all(limit) as AnalysisRow[];

  console.log(`Found ${models.length} analyses needing Korean translation`);

  if (models.length === 0) {
    console.log("Nothing to translate.");
    return;
  }

  if (dryRun) {
    console.log("\n[DRY RUN] Models to translate:");
    for (const m of models) {
      console.log(`  - ${m.slug} (${m.name})`);
    }
    return;
  }

  const insertStmt = db.prepare(`
    INSERT INTO model_analyses
      (model_id, language, key_metrics_json, pros_json, cons_json, competitors_json,
       summary, performance, comparisons, community, use_case_deep, latest_news, sources_json, generated_at)
    VALUES (?, 'ko', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(model_id, language) DO UPDATE SET
      key_metrics_json = excluded.key_metrics_json,
      pros_json = excluded.pros_json,
      cons_json = excluded.cons_json,
      summary = excluded.summary,
      performance = excluded.performance,
      comparisons = excluded.comparisons,
      community = excluded.community,
      use_case_deep = excluded.use_case_deep,
      latest_news = excluded.latest_news,
      generated_at = datetime('now')
  `);

  let translated = 0;
  let failed = 0;

  for (let i = 0; i < models.length; i++) {
    const m = models[i];
    console.log(`\n[${i + 1}/${models.length}] ${m.slug} (${m.name})`);

    try {
      const ko = await translateAnalysis(m);
      const keyMetrics = parseJSON<any[]>(m.key_metrics_json, []);

      // Update keyMetrics with Korean labels/contexts
      const koKeyMetrics = keyMetrics.map((km, idx) => ({
        label: ko.keyMetrics?.[idx]?.label || km.label,
        value: km.value,
        context: ko.keyMetrics?.[idx]?.context || km.context,
      }));

      insertStmt.run(
        m.model_id,
        JSON.stringify(koKeyMetrics),
        JSON.stringify(ko.pros || parseJSON(m.pros_json, [])),
        JSON.stringify(ko.cons || parseJSON(m.cons_json, [])),
        m.competitors_json,
        ko.summary || m.summary,
        ko.performance || m.performance,
        ko.comparisons || m.comparisons,
        ko.community || m.community,
        ko.useCaseDeep || m.use_case_deep,
        ko.latestNews || m.latest_news,
        m.sources_json
      );

      translated++;
      console.log(`  ✓ ${m.slug}`);
    } catch (err) {
      console.error(`  ✗ ${m.slug}: ${err}`);
      failed++;
    }
  }

  console.log(`\nDone. Translated: ${translated}, Failed: ${failed}`);
  console.log(`Run 'npx tsx scripts/pipeline/generate-data-files.ts' to regenerate model-analyses.ts`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
