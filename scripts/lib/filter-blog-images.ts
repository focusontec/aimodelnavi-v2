#!/usr/bin/env tsx
/**
 * filter-blog-images.ts — Filter promotional images from a blog markdown file
 *
 * Used by publish-blog.yml workflow and can be run standalone.
 * Removes promo/QR code images and updates markdown references.
 *
 * Usage: npx tsx scripts/lib/filter-blog-images.ts <markdown-file> [--vision]
 */

import * as fs from "fs";
import * as path from "path";
import { isPromoByHeuristic, filterImages, type ImageToFilter } from "./image-filter";

export interface FilterResult {
  kept: string[];
  removed: string[];
}

export async function filterBlogImages(
  markdownContent: string,
  articleTitle: string,
  imageDir: string,
  options: { useVision?: boolean; apiKey?: string; baseUrl?: string; model?: string } = {}
): Promise<{ content: string; result: FilterResult }> {
  // Extract all image references from markdown
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: ImageToFilter[] = [];
  let match;

  while ((match = imgRegex.exec(markdownContent)) !== null) {
    images.push({ alt: match[1], url: match[2] });
  }

  if (images.length === 0) {
    return { content: markdownContent, result: { kept: [], removed: [] } };
  }

  // Run filter
  const { kept, rejected } = await filterImages(images, articleTitle, options);

  // Remove rejected references from markdown
  let content = markdownContent;
  for (const r of rejected) {
    const escaped = r.image.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const imgMdRegex = new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)\\n?`, "g");
    content = content.replace(imgMdRegex, "");
  }
  content = content.replace(/\n{3,}/g, "\n\n");

  // Delete rejected image files from disk
  for (const r of rejected) {
    if (r.image.url.startsWith("/images/")) {
      const filePath = path.join(process.cwd(), "public", r.image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`  Deleted: ${r.image.url}`);
      }
    }
  }

  return {
    content,
    result: {
      kept: kept.map((i) => i.url),
      removed: rejected.map((i) => i.image.url),
    },
  };
}

// CLI entry point
if (process.argv[1]?.endsWith("filter-blog-images.ts")) {
  (async () => {
    const mdFile = process.argv[2];
    const useVision = process.argv.includes("--vision");

    if (!mdFile) {
      console.error("Usage: npx tsx scripts/lib/filter-blog-images.ts <markdown-file> [--vision]");
      process.exit(1);
    }

    if (!fs.existsSync(mdFile)) {
      console.error(`File not found: ${mdFile}`);
      process.exit(1);
    }

    const content = fs.readFileSync(mdFile, "utf-8");
    const titleMatch = content.match(/^title:\s*"(.+)"$/m);
    const title = titleMatch?.[1] || path.basename(mdFile);

    const imageDir = path.dirname(mdFile).replace("src/content/", "public/images/");

    const options: any = {};
    if (useVision) {
      options.useVision = true;
      options.apiKey = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
      options.baseUrl = process.env.LLM_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1/chat/completions";
      options.model = process.env.VISION_MODEL || "mimo-v2.5";
    }

    const { content: filtered, result } = await filterBlogImages(content, title, imageDir, options);

    if (result.removed.length > 0) {
      fs.writeFileSync(mdFile, filtered, "utf-8");
      console.log(`\nFiltered ${result.removed.length} promo images from ${mdFile}`);
      console.log(`  Removed: ${result.removed.join(", ")}`);
    } else {
      console.log(`No promo images found in ${mdFile}`);
    }
  })();
}
