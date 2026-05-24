#!/usr/bin/env tsx

/**
 * sync-all.ts - Unified pipeline orchestrator.
 *
 * Runs the full crawler pipeline:
 *   1. Crawl data from sources
 *   2. Process raw data into models
 *   3. Translate to target languages
 *   4. Generate TypeScript data files
 *
 * Usage:
 *   npx tsx scripts/sync-all.ts              # incremental (default)
 *   npx tsx scripts/sync-all.ts --full       # full crawl
 *   npx tsx scripts/sync-all.ts --generate   # only regenerate TypeScript files
 *   npx tsx scripts/sync-all.ts --analyze    # generate model analyses (requires LLM_API_KEY + OLLAMA_API_KEY)
 *   npx tsx scripts/sync-all.ts --analyze --analyze-limit 10  # analyze up to 10 models
 */

import { migrate, getModelCount, getRawModelCount, closeDb } from "./lib/db";
import { crawlAll } from "./pipeline/crawl-all";
import { processModels } from "./pipeline/process-models";
import { translateModels } from "./pipeline/translate-models";
import { generateDataFiles } from "./pipeline/generate-data-files";
import { syncLeaderboard } from "./pipeline/sync-leaderboard";
import { syncPricing } from "./pipeline/sync-pricing";
import { syncBlog } from "./pipeline/sync-blog";
import { generateModelAnalyses } from "./pipeline/generate-model-analyses";

// Import the new leaderboard crawler (Playwright-based)
import { execSync } from "child_process";

const args = process.argv.slice(2);
const fullMode = args.includes("--full") || process.env.CRAWL_MODE === "full";
const generateOnly = args.includes("--generate");
const analyzeMode = args.includes("--analyze");
const analyzeLimit = (() => {
  const idx = args.indexOf("--analyze-limit");
  return idx !== -1 ? parseInt(args[idx + 1]) || 5 : 5;
})();

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  AI Models Navi Pipeline Sync");
  console.log("═══════════════════════════════════════\n");

  const mode = fullMode ? "full" : "incremental";
  console.log(`  Mode: ${mode}`);
  console.log(`  LLM: ${process.env.LLM_PROVIDER || "ollama"}/${process.env.LLM_MODEL || "gemma4:31b"}`);

  // Initialize database
  migrate();
  const dbModelsBefore = getModelCount();
  const dbRawBefore = getRawModelCount();
  console.log(`  DB: ${dbModelsBefore} models, ${dbRawBefore} raw records\n`);

  if (generateOnly) {
    console.log("  (generate-only mode: skipping crawl/process/translate)");
    const genResult = generateDataFiles();
    console.log(`\n  Generated ${genResult.modelsGenerated} models`);
    closeDb();
    return;
  }

  // Stage 1: Crawl
  const crawlResult = await crawlAll(mode);
  const totalNew =
    crawlResult.datalearner.modelsStored + crawlResult.huggingface.modelsStored;

  // Stage 2: Process
  const processResult = await processModels();

  // Stage 3: Translate
  const translateResult = await translateModels("ja");
  const translateResultEn = await translateModels("en");

  // Stage 3.5: Pricing sync
  const pricingResult = await syncPricing();

  // Stage 3.5b: Leaderboard sync
  // NOTE: LMSYS Arena / HuggingFace sync (syncLeaderboard) is deprecated.
  // Those endpoints are unreliable. DataLearner crawler is the sole source.
  // The old syncLeaderboard() call has been removed;
  // leaderboard data comes entirely from DataLearner via crawl-datalearner-leaderboard.ts
  //   → raw_models (source_id=468) → generate-leaderboard-data.ts → leaderboard.ts
  console.log("\n[Stage 3.5b] Syncing DataLearner Leaderboard data...");
  try {
    execSync("npx tsx scripts/crawl-datalearner-leaderboard.ts", {
      cwd: process.cwd(),
      stdio: "inherit",
      timeout: 600000, // 10 minutes timeout
    });
    console.log("  DataLearner Leaderboard sync complete");

    // Generate leaderboard data files
    execSync("npx tsx scripts/generate-leaderboard-data.ts", {
      cwd: process.cwd(),
      stdio: "inherit",
      timeout: 60000,
    });
    console.log("  Leaderboard data files generated");
  } catch (err) {
    console.error(`  DataLearner Leaderboard sync failed: ${err}`);
  }

  // Stage 3.6: Blog sync (DataLearnerAI articles → Japanese + English)
  const blogResult = await syncBlog();

  // Stage 3.7: Generate English blog manifest
  try {
    execSync("npx tsx scripts/generate-english-manifest.ts", {
      cwd: process.cwd(),
      stdio: "inherit",
      timeout: 120000,
    });
    console.log("  English blog manifest generated");
  } catch (err) {
    console.error(`  English manifest generation failed: ${err}`);
  }

  // Stage 3.8: Generate model analyses (optional, requires --analyze flag)
  let analysisResult = { analyzed: 0, blogGenerated: 0, errors: 0 };
  if (analyzeMode) {
    try {
      analysisResult = await generateModelAnalyses({
        limit: analyzeLimit,
        generateBlog: false,
      });
    } catch (err) {
      console.error(`  Model analyses failed: ${err}`);
    }
  }

  // Stage 4: Generate
  const genResult = generateDataFiles();

  // Summary
  const dbModelsAfter = getModelCount();
  const dbRawAfter = getRawModelCount();

  console.log("\n═══════════════════════════════════════");
  console.log("  Pipeline Summary");
  console.log("═══════════════════════════════════════");
  console.log(`  Crawled: ${crawlResult.datalearner.detailPagesFetched} pages, ${totalNew} new/changed`);
  console.log(`  Processed: ${processResult.processed} new models`);
  console.log(`  Translated JA: ${translateResult.translated}, EN: ${translateResultEn.translated}`);
  console.log(`  Leaderboard: synced from DataLearner (see generate-leaderboard-data.ts output)`);
  console.log(`  Pricing: ${pricingResult.totalEntries} entries from ${pricingResult.providerResults.filter(p => p.success).length} providers`);
  console.log(`  Blog: ${blogResult.processed} articles processed`);
  if (analyzeMode) console.log(`  Analyses: ${analysisResult.analyzed} new, ${analysisResult.errors} errors`);
  console.log(`  Generated: ${genResult.modelsGenerated} models in TypeScript`);
  console.log(`  DB: ${dbModelsBefore} → ${dbModelsAfter} models, ${dbRawBefore} → ${dbRawAfter} raw`);

  if (crawlResult.datalearner.errors.length > 0 || crawlResult.huggingface.errors.length > 0) {
    console.log(`  Errors: ${crawlResult.datalearner.errors.length + crawlResult.huggingface.errors.length}`);
    crawlResult.datalearner.errors.slice(0, 3).forEach((e) => console.log(`    - [DL] ${e}`));
    crawlResult.huggingface.errors.slice(0, 3).forEach((e) => console.log(`    - [HF] ${e}`));
  }

  console.log("\n  Pipeline complete!");
  closeDb();
  // Force exit — Playwright or other handles may keep the event loop alive
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  closeDb();
  process.exit(1);
});