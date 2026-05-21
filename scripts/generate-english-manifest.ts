#!/usr/bin/env tsx
/**
 * Translate blog manifest titles and excerpts to English.
 * Generates blog-manifest-en.json for English blog listing.
 *
 * First checks blog-en/ for actual EN posts and uses their titles/excerpts.
 * Falls back to LLM translation for posts without EN versions.
 */
import { callLLM } from "./lib/anthropic";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_EN_DIR = path.join(process.cwd(), "src/content/blog-en");

interface ManifestEntry {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  topics: string[];
  date: string;
}

function loadEnFrontmatter(): Map<string, { title: string; excerpt: string }> {
  const map = new Map<string, { title: string; excerpt: string }>();
  if (!fs.existsSync(BLOG_EN_DIR)) return map;

  const files = fs.readdirSync(BLOG_EN_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    try {
      const raw = fs.readFileSync(path.join(BLOG_EN_DIR, file), "utf-8");
      const { data } = matter(raw);
      if (data.title) {
        map.set(slug, { title: data.title, excerpt: data.excerpt || "" });
      }
    } catch {
      // skip broken files
    }
  }
  return map;
}

async function main() {
  const manifestPath = path.join(process.cwd(), "src/data/blog-manifest.json");
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  // Load actual EN frontmatter from blog-en/ directory
  const enFrontmatter = loadEnFrontmatter();
  console.log(`Found ${enFrontmatter.size} EN blog posts in blog-en/`);

  // Split into posts with EN content and posts needing translation
  const withEn: typeof manifest = [];
  const needsTranslation: typeof manifest = [];
  for (const post of manifest) {
    if (enFrontmatter.has(post.slug)) {
      withEn.push(post);
    } else {
      needsTranslation.push(post);
    }
  }

  console.log(`${withEn.length} posts have EN content, ${needsTranslation.length} need LLM translation`);

  // Build translated array
  const translated: (ManifestEntry & { title_en: string; excerpt_en: string })[] = [];

  // Use actual EN content for posts that have it
  for (const post of withEn) {
    const en = enFrontmatter.get(post.slug)!;
    translated.push({
      ...post,
      title_en: en.title,
      excerpt_en: en.excerpt,
    });
  }

  // Translate remaining posts via LLM
  if (needsTranslation.length > 0) {
    const BATCH_SIZE = 15;
    console.log(`Translating ${needsTranslation.length} blog titles and excerpts to English...`);

    for (let i = 0; i < needsTranslation.length; i += BATCH_SIZE) {
      const batch = needsTranslation.slice(i, i + BATCH_SIZE);
      const input = batch
        .map((p, idx) => `[${idx}] title: ${p.title}\nexcerpt: ${p.excerpt || ""}`)
        .join("\n---\n");

      const system = `Translate these Japanese blog titles and excerpts to English. Output one translation per line in this exact format:
[0] Title: English title
[0] Excerpt: English excerpt (2-3 sentences)
Keep AI/ML technical terms accurate. Preserve numbers.`;

      try {
        const result = await callLLM(system, input, 8192, 120000);
        const lines = result.split("\n");

        for (let j = 0; j < batch.length; j++) {
          const titleLine = lines.find((l) => l.startsWith(`[${j}] Title:`));
          const excerptLine = lines.find((l) => l.startsWith(`[${j}] Excerpt:`));
          translated.push({
            ...batch[j],
            title_en: titleLine ? titleLine.replace(/^\[\d+\] Title:\s*/, "") : batch[j].title,
            excerpt_en: excerptLine ? excerptLine.replace(/^\[\d+\] Excerpt:\s*/, "") : batch[j].excerpt || "",
          });
        }
        console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needsTranslation.length / BATCH_SIZE)} done`);
      } catch (err) {
        console.error(`  Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err);
        for (const p of batch) {
          translated.push({ ...p, title_en: p.title, excerpt_en: p.excerpt || "" });
        }
      }
    }
  }

  // Sort by date descending
  translated.sort((a, b) => (a.date > b.date ? -1 : 1));

  // Write English manifest
  const outPath = path.join(process.cwd(), "src/data/blog-manifest-en.json");
  fs.writeFileSync(outPath, JSON.stringify(translated, null, 2));
  console.log(`Done. Saved ${translated.length} translations to blog-manifest-en.json`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
