#!/usr/bin/env tsx

/**
 * Check remaining images for Chinese text content via original article alt text
 */

import { getDb, migrate } from "./lib/db";
import { getAllPosts } from "../src/lib/blog";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "public", "images", "blog");
const chineseRegex = /[一-鿿]/;

async function main() {
  migrate();
  const db = getDb();
  const posts = getAllPosts();

  for (const post of posts) {
    const dirPath = path.join(IMAGES_DIR, post.slug);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) continue;

    // Get source URL
    let sourceUrl = "";
    const srcMatch = post.content.match(/source:\s*"?([^"\n]+)"?/);
    if (srcMatch?.[1]) {
      sourceUrl = srcMatch[1];
    } else {
      const row = db.prepare(
        "SELECT source_url FROM blog_posts WHERE local_slug = ? OR external_slug = ?"
      ).get(post.slug, post.slug) as { source_url: string } | undefined;
      if (row?.source_url) sourceUrl = row.source_url;
    }

    if (!sourceUrl) {
      console.log(`${post.slug}: no source URL, skipping`);
      continue;
    }

    try {
      const res = await fetch(sourceUrl, {
        headers: { "User-Agent": "AIModelsNavi/1.0" },
      });
      if (!res.ok) { console.log(`${post.slug}: HTTP ${res.status}`); continue; }
      const html = await res.text();

      // Extract alt texts from content images (exclude logos)
      const regex = /<img[^>]*?src="[^"]*\/([^"\/?]+)(?:\?[^"]*)?"[^>]*?alt="([^"]*)"[^>]*?>/gi;
      let match;
      const alts: { filename: string; alt: string }[] = [];
      while ((match = regex.exec(html)) !== null) {
        const filename = match[1];
        const alt = match[2] || "";
        if (!alt.includes("DataLearner") && !alt.includes("标志")) {
          alts.push({ filename, alt });
        }
      }

      // Check each local image
      for (const file of files) {
        const imgNum = parseInt(file.match(/img-(\d+)/)?.[1] || "0");
        const origAlt = alts[imgNum - 1];
        const hasChinese = origAlt ? chineseRegex.test(origAlt.alt) : false;

        if (hasChinese) {
          console.log(`⚠️  ${post.slug}/${file} — Chinese alt: "${origAlt!.alt.slice(0, 80)}"`);
        } else if (!origAlt || !origAlt.alt) {
          console.log(`   ${post.slug}/${file} — alt empty, can't determine`);
        } else {
          console.log(`✓  ${post.slug}/${file} — OK: "${origAlt.alt.slice(0, 80)}"`);
        }
      }
    } catch (e) {
      console.log(`${post.slug}: fetch error`);
    }
  }
}

main().catch(console.error);
