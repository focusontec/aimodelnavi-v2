#!/usr/bin/env npx tsx
/**
 * translate-models-ko.ts — Batch translate model English fields to Korean
 *
 * Reads models with English translations from the database,
 * translates description/strengths/weaknesses/use_cases to Korean via LLM,
 * and writes back to model_translations table.
 *
 * Usage:
 *   npx tsx scripts/translate-models-ko.ts              # translate all missing
 *   npx tsx scripts/translate-models-ko.ts --dry-run    # preview only
 *   npx tsx scripts/translate-models-ko.ts --limit 10   # translate 10 models
 */

import { getDb, migrate } from "./lib/db";
import { callLLM } from "./lib/anthropic";

interface ModelToTranslate {
  id: number;
  slug: string;
  name: string;
  descriptionEn: string;
  strengthsEn: string;
  weaknessesEn: string;
  useCasesEn: string;
}

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

async function translateBatch(batch: ModelToTranslate[]): Promise<Map<string, Record<string, string>>> {
  const input = batch.map((m, i) => {
    const strengths = parseJSON<string[]>(m.strengthsEn, []);
    const weaknesses = parseJSON<string[]>(m.weaknessesEn, []);
    const useCases = parseJSON<string[]>(m.useCasesEn, []);
    return [
      `[${i}] slug: ${m.slug}`,
      `description: ${m.descriptionEn}`,
      `strengths: ${JSON.stringify(strengths)}`,
      `weaknesses: ${JSON.stringify(weaknesses)}`,
      `use_cases: ${JSON.stringify(useCases)}`,
    ].join("\n");
  }).join("\n---\n");

  const system = `You are a professional translator. Translate the following AI model metadata from English to Korean.

Rules:
- Keep technical terms accurate (model names, benchmark names, API terms stay in English)
- Keep numbers, percentages, and prices as-is
- For strengths/weaknesses/use_cases arrays, output valid JSON arrays
- For description, output a natural Korean paragraph
- Output EXACTLY one block per model in this format:

[0]
description: Korean translation
strengths: ["항목1", "항목2"]
weaknesses: ["항목1", "항목2"]
use_cases: ["항목1", "항목2"]

[1]
description: ...
...`;

  const result = await callLLM(system, input, 16384, 300000);
  const results = new Map<string, Record<string, string>>();

  for (let idx = 0; idx < batch.length; idx++) {
    const m = batch[idx];
    const blockRegex = new RegExp(
      `\\[${idx}\\]\\s*\n([\\s\\S]*?)(?=\\[${idx + 1}\\]|$)`
    );
    const block = result.match(blockRegex)?.[1] || "";

    const parsed: Record<string, string> = {};

    const descMatch = block.match(/description:\s*(.+?)(?=\n(?:strengths|weaknesses|use_cases):|$)/s);
    if (descMatch) parsed.description = descMatch[1].trim();

    for (const field of ["strengths", "weaknesses", "use_cases"] as const) {
      const re = new RegExp(`${field}:\\s*(\\[.*?\\])`, "s");
      const match = block.match(re);
      if (match) {
        try {
          const arr = JSON.parse(match[1]);
          parsed[field] = JSON.stringify(arr);
        } catch {
          parsed[field] = match[1];
        }
      }
    }

    results.set(m.slug, parsed);
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 999;

  migrate();
  const db = getDb();

  const models = db.prepare(`
    SELECT m.id, m.slug, m.name,
      mt_en_d.translated_text as descriptionEn,
      mt_en_s.translated_text as strengthsEn,
      mt_en_w.translated_text as weaknessesEn,
      mt_en_u.translated_text as useCasesEn
    FROM models m
    INNER JOIN model_translations mt_en_d ON mt_en_d.model_id = m.id
      AND mt_en_d.language = 'en' AND mt_en_d.field_name = 'description'
    LEFT JOIN model_translations mt_en_s ON mt_en_s.model_id = m.id
      AND mt_en_s.language = 'en' AND mt_en_s.field_name = 'strengths'
    LEFT JOIN model_translations mt_en_w ON mt_en_w.model_id = m.id
      AND mt_en_w.language = 'en' AND mt_en_w.field_name = 'weaknesses'
    LEFT JOIN model_translations mt_en_u ON mt_en_u.model_id = m.id
      AND mt_en_u.language = 'en' AND mt_en_u.field_name = 'use_cases'
    LEFT JOIN model_translations mt_ko_d ON mt_ko_d.model_id = m.id
      AND mt_ko_d.language = 'ko' AND mt_ko_d.field_name = 'description'
    WHERE mt_ko_d.id IS NULL
    ORDER BY m.priority DESC, m.release_date DESC NULLS LAST
    LIMIT ?
  `).all(limit) as ModelToTranslate[];

  console.log(`Found ${models.length} models needing Korean translation`);

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

  const BATCH_SIZE = 5;
  const insertStmt = db.prepare(`
    INSERT INTO model_translations (model_id, language, field_name, translated_text, is_ai_generated)
    VALUES (?, 'ko', ?, ?, 1)
    ON CONFLICT(model_id, language, field_name) DO UPDATE SET
      translated_text = excluded.translated_text,
      is_ai_generated = 1,
      updated_at = datetime('now')
  `);

  let translated = 0;
  let failed = 0;

  for (let i = 0; i < models.length; i += BATCH_SIZE) {
    const batch = models.slice(i, i + BATCH_SIZE);
    console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(models.length / BATCH_SIZE)}: ${batch.map(m => m.slug).join(", ")}`);

    try {
      const results = await translateBatch(batch);

      const insertMany = db.transaction(() => {
        for (const m of batch) {
          const parsed = results.get(m.slug);
          if (!parsed) { failed++; continue; }

          if (parsed.description) {
            insertStmt.run(m.id, "description", parsed.description);
          }
          if (parsed.strengths) {
            insertStmt.run(m.id, "strengths", parsed.strengths);
          }
          if (parsed.weaknesses) {
            insertStmt.run(m.id, "weaknesses", parsed.weaknesses);
          }
          if (parsed.use_cases) {
            insertStmt.run(m.id, "use_cases", parsed.use_cases);
          }
          translated++;
          console.log(`  ✓ ${m.slug}`);
        }
      });
      insertMany();
    } catch (err) {
      console.error(`  ✗ Batch failed: ${err}`);
      failed += batch.length;
    }
  }

  console.log(`\nDone. Translated: ${translated}, Failed: ${failed}`);
  console.log(`Run 'npx tsx scripts/pipeline/generate-data-files.ts' to regenerate models.ts`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
