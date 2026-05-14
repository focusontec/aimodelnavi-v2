#!/usr/bin/env tsx

/**
 * cleanup-images.ts
 *
 * Scans existing blog posts, fetches original DataLearnerAI articles,
 * matches images by POSITION, filters out promotional images.
 *
 * Usage:
 *   npx tsx scripts/cleanup-images.ts --dry-run   # preview only
 *   npx tsx scripts/cleanup-images.ts              # actually delete
 */

import fs from "fs";
import path from "path";
import { getAllPosts } from "../src/lib/blog";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "blog");

const PROMO_KEYWORDS = [
  "微信", "公众号", "扫码", "关注", "二维码", "读者群", "加群",
  "wechat", "qrcode", "qr", "订阅", "客服", "推广",
  "点赞", "在看", "转发", "分享", "加入", "备注", "领取",
  "数据Learner", "DataLearner", "官方微信", "扫码加入",
  "扫码关注", "一键三连", "阅读原文", "学习交流",
  "知识星球", "小助手", "客服微信",
];

function isPromoAlt(alt: string): boolean {
  const lower = alt.toLowerCase();
  for (const kw of PROMO_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return true;
  }
  return false;
}

// Fetch image info from original article: { filename → altText }
async function fetchImageAltMap(sourceUrl: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const res = await fetch(sourceUrl, {
      headers: { "User-Agent": "AIModelsNavi/1.0" },
    });
    if (!res.ok) return map;
    const html = await res.text();

    // Extract src filename and alt
    const imgRegex = /<img[^>]*?src="[^"]*\/([^"/?]+)(?:\?(?:[^"]*))?"(?:[^>]*?alt="([^"]*)")?/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const filename = match[1];
      const alt = match[2] || "";
      if (!map.has(filename)) {
        map.set(filename, alt);
      }
    }
  } catch { /* ignore */ }
  return map;
}

// Check if any image in the original article has a promo alt
function hasAnyPromoImage(altMap: Map<string, string>): boolean {
  for (const alt of altMap.values()) {
    if (isPromoAlt(alt)) return true;
  }
  return false;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`=== 画像クリーンアップ ${dryRun ? "(dry-run)" : ""} ===\n`);

  const posts = getAllPosts();
  let totalRemoved = 0;
  let filesRemoved = 0;

  for (const post of posts) {
    const filePath = path.join(BLOG_DIR, `${post.slug}.md`);
    const rawMd = fs.readFileSync(filePath, "utf-8");

    // Find image references: ![](path)
    const imgRegex = /!\[([^\]]*)\]\((\/images\/blog\/[^)]+)\)/g;
    const imgRefs: { full: string; alt: string; path: string; num: number }[] = [];
    let m;
    while ((m = imgRegex.exec(rawMd)) !== null) {
      const num = parseInt(m[2].match(/img-(\d+)/)?.[1] || "0");
      imgRefs.push({ full: m[0], alt: m[1], path: m[2], num });
    }

    if (imgRefs.length === 0) continue;

    // Fetch original alt texts from DataLearnerAI
    let sourceUrl = "";
    const sourceMatch = rawMd.match(/source:\s*"?([^"\n]+)"?/);
    if (sourceMatch?.[1]) {
      sourceUrl = sourceMatch[1];
    } else {
      try {
        const { getDb, migrate } = await import("./lib/db");
        migrate();
        const db = getDb();
        const row = db.prepare(
          "SELECT source_url FROM blog_posts WHERE local_slug = ? OR external_slug = ?"
        ).get(post.slug, post.slug) as { source_url: string } | undefined;
        if (row?.source_url) sourceUrl = row.source_url;
      } catch { /* ignore */ }
    }
    const altMap = sourceUrl ? await fetchImageAltMap(sourceUrl) : new Map<string, string>();

    // When promo images exist in original article, keep only first image
    // (DataLearnerAI: 1-2 content images + 1-3 WeChat/promo images at end)
    let maxContentPosition = 99;
    if (hasAnyPromoImage(altMap)) {
      maxContentPosition = 1;
    }

    let modified = false;
    let newMd = rawMd;

    for (const ref of imgRefs) {
      const promo = isPromoAlt(ref.alt) || ref.num > maxContentPosition || ref.num >= 5;

      if (promo) {
        const reason = promo
          ? `promo alt: "${ref.alt.slice(0, 50)}"`
          : `position #${ref.num} (likely promo in article with promo images)`;
        console.log(`  ✗ ${ref.path}  [${reason}]`);

        // Delete file
        const fullPath = path.join(process.cwd(), "public", ref.path);
        if (!dryRun) {
          try { fs.unlinkSync(fullPath); filesRemoved++; } catch { /* gone */ }
        }

        // Remove from markdown (with surrounding blank lines)
        newMd = newMd.replace(ref.full + "\n\n", "\n");
        newMd = newMd.replace(ref.full + "\n", "");
        newMd = newMd.replace(ref.full, "");
        modified = true;
        totalRemoved++;
      }
    }

    if (modified) {
      // Clean up: remove orphaned blank lines
      newMd = newMd.replace(/\n{3,}/g, "\n\n");
      newMd = newMd.replace(/^\n+/, "");
      if (!dryRun) {
        fs.writeFileSync(filePath, newMd, "utf-8");
      }
      console.log(`  → ${post.slug}.md updated\n`);
    }
  }

  // Clean up empty directories
  if (!dryRun) {
    const dirs = fs.readdirSync(IMAGES_DIR);
    for (const dir of dirs) {
      const dirPath = path.join(IMAGES_DIR, dir);
      try {
        if (fs.statSync(dirPath).isDirectory() && fs.readdirSync(dirPath).length === 0) {
          fs.rmdirSync(dirPath);
        }
      } catch { /* ignore */ }
    }
  }

  console.log(`${dryRun ? "[dry-run] " : ""}削除: ${totalRemoved} 枚の画像, ${filesRemoved} ファイル`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
