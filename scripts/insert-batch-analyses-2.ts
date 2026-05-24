/**
 * Insert batch 2 of model analyses from agent research into SQLite.
 * Covers: OpenAI (19), Google/DeepMind (15), Others (32) = 66 total
 * Run with: npx tsx scripts/insert-batch-analyses-2.ts
 */

import { getDb, migrate } from "./lib/db";
import { readFileSync } from "fs";

migrate();
const db = getDb();

interface AnalysisData {
  slug: string;
  keyMetrics: { label: string; value: string; context?: string }[];
  pros: string[];
  cons: string[];
  competitorTable: { name: string; arena?: string; swe?: string; gpqa?: string; price?: string }[];
  summary: string;
  performance: string;
  comparisons: string;
  community: string;
  useCaseDeep: string;
  latestNews: string;
  sources: { title: string; url: string }[];
}

// Load all analyses from JSON files
const openaiAnalyses: AnalysisData[] = JSON.parse(readFileSync("/tmp/openai_analyses.json", "utf-8"));
const googleAnalyses: AnalysisData[] = JSON.parse(readFileSync("/tmp/google_deepmind.json", "utf-8"));
const othersAnalyses: AnalysisData[] = JSON.parse(readFileSync("/tmp/others_analyses.json", "utf-8"));

const allAnalyses = [...openaiAnalyses, ...googleAnalyses, ...othersAnalyses];

console.log(`Total analyses to insert: ${allAnalyses.length}`);
console.log(`  OpenAI: ${openaiAnalyses.length}`);
console.log(`  Google/DeepMind: ${googleAnalyses.length}`);
console.log(`  Others: ${othersAnalyses.length}`);

// Check which slugs exist in models table
const modelRows = db.prepare("SELECT id, slug FROM models").all() as { id: number; slug: string }[];
const slugToId = new Map(modelRows.map(r => [r.slug, r.id]));

// Check which already have analyses
const existingAnalyses = db.prepare(
  "SELECT m.slug FROM model_analyses ma JOIN models m ON m.id = ma.model_id WHERE ma.language = 'en'"
).all() as { slug: string }[];
const existingSlugs = new Set(existingAnalyses.map(r => r.slug));

let inserted = 0;
let skippedNoModel = 0;
let skippedExists = 0;
let errors = 0;

const insertStmt = db.prepare(`
  INSERT INTO model_analyses (model_id, language, key_metrics_json, pros_json, cons_json,
    competitors_json, summary, performance, comparisons, community, use_case_deep,
    latest_news, sources_json, generated_at)
  VALUES (?, 'en', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

for (const a of allAnalyses) {
  const modelId = slugToId.get(a.slug);
  if (!modelId) {
    skippedNoModel++;
    console.log(`  SKIP (no model): ${a.slug}`);
    continue;
  }

  if (existingSlugs.has(a.slug)) {
    skippedExists++;
    continue;
  }

  try {
    insertStmt.run(
      modelId,
      JSON.stringify(a.keyMetrics || []),
      JSON.stringify(a.pros || []),
      JSON.stringify(a.cons || []),
      JSON.stringify(a.competitorTable || []),
      a.summary || "",
      a.performance || "",
      a.comparisons || "",
      a.community || "",
      a.useCaseDeep || "",
      a.latestNews || "",
      JSON.stringify(a.sources || [])
    );
    inserted++;
    console.log(`  INSERTED: ${a.slug}`);
  } catch (err) {
    errors++;
    console.error(`  ERROR: ${a.slug} - ${err}`);
  }
}

console.log(`\nDone: ${inserted} inserted, ${skippedNoModel} skipped (no model), ${skippedExists} skipped (exists), ${errors} errors`);
