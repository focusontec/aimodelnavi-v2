#!/usr/bin/env tsx

/**
 * backfill-ko-blog.ts — Generate Korean translations for existing blog posts
 *
 * Usage:
 *   npx tsx scripts/backfill-ko-blog.ts --dry-run  # preview
 *   npx tsx scripts/backfill-ko-blog.ts --limit 5  # process 5 posts
 *   npx tsx scripts/backfill-ko-blog.ts            # process all missing
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { processBlogArticleKo } from "./lib/anthropic";
import { saveBlogPostKo } from "./lib/storage";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const BLOG_KO_DIR = path.join(process.cwd(), "src/content/blog-ko");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) || Infinity : Infinity;

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tag: string;
  images: { alt: string; localPath: string }[];
}

function extractImages(content: string): { alt: string; localPath: string }[] {
  const imageRegex = /!\[([^\]]*)\]\((\/images\/blog\/[^)]+)\)/g;
  const images: { alt: string; localPath: string }[] = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({ alt: match[1] || "Blog image", localPath: match[2] });
  }
  return images;
}

async function translatePost(post: BlogPost): Promise<void> {
  console.log(`\n  [${post.slug}] Translating to Korean...`);
  console.log(`    Title: ${post.title.slice(0, 60)}...`);

  const koResult = await processBlogArticleKo(
    post.title,
    post.content,
    "",
    post.images.length > 0 ? post.images : undefined
  );

  saveBlogPostKo(post.slug, {
    title: koResult.title,
    date: post.date,
    tag: koResult.tag || post.tag || "AI",
    excerpt: koResult.excerpt || "",
  }, koResult.content);

  console.log(`    ✓ KO title: ${koResult.title.slice(0, 60)}...`);
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  Backfill Korean Blog Translations");
  console.log("═══════════════════════════════════════\n");

  if (DRY_RUN) console.log("  [DRY RUN] No files will be written.\n");

  const jaFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".md"));
  console.log(`  Found ${jaFiles.length} Japanese posts`);

  const koFiles = new Set(
    fs.existsSync(BLOG_KO_DIR)
      ? fs.readdirSync(BLOG_KO_DIR).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
      : []
  );
  console.log(`  Found ${koFiles.size} Korean posts`);

  const missing: BlogPost[] = [];
  for (const file of jaFiles) {
    const slug = file.replace(".md", "");
    if (koFiles.has(slug)) continue;

    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    missing.push({
      slug,
      title: data.title || slug,
      content,
      excerpt: data.excerpt || "",
      date: data.date || "",
      tag: data.tag || "AI",
      images: extractImages(content),
    });
  }

  console.log(`  Missing Korean translations: ${missing.length}\n`);

  const toProcess = missing.slice(0, LIMIT);
  console.log(`  Processing ${toProcess.length} posts...\n`);

  let success = 0;
  let failed = 0;
  for (const post of toProcess) {
    try {
      if (!DRY_RUN) await translatePost(post);
      else console.log(`  [DRY] Would translate: ${post.slug}`);
      success++;
      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      console.error(`  ✗ Failed: ${post.slug} — ${err.message?.slice(0, 100)}`);
      failed++;
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`  Done! Success: ${success}, Failed: ${failed}`);
  console.log(`═══════════════════════════════════════`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
