/**
 * Blog sync pipeline stage.
 *
 * Reads newly crawled blog articles from the blog_posts table,
 * extracts and downloads images (filtering out promotional/Chinese-text images),
 * processes articles via LLM (Chinese → Japanese translation + adaptation),
 * and saves as Markdown.
 */

import { migrate, getSourceId, getBlogPostsNeedingProcessing, markBlogPostProcessed } from "../lib/db";
import { processBlogArticle } from "../lib/anthropic";
import { saveBlogPost } from "../lib/storage";
import { rateLimitedFetch } from "../lib/http";
import fs from "fs";
import path from "path";

interface BlogImage {
  src: string;
  alt: string;
  localPath: string;
}

export interface BlogSyncResult {
  processed: number;
  skipped: number;
  errors: string[];
}

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images", "blog");

// ── Image extraction from HTML ──

function extractImages(html: string): { src: string; alt: string; context: string }[] {
  const images: { src: string; alt: string; context: string }[] = [];
  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes("blog_images") || src.includes("resources")) {
      // Capture ~200 chars of surrounding HTML for context
      const idx = match.index;
      const context = html.slice(Math.max(0, idx - 100), idx + 300);
      images.push({ src, alt: match[2] || "", context });
    }
  }
  return images;
}

// ── Heuristic promo filter (fast, no API calls) ──

const PROMO_KEYWORDS = [
  "微信", "公众号", "扫码", "关注", "二维码", "读者群",
  "wechat", "QR", "qrcode", "订阅", "加群", "客服",
  "点赞", "在看", "转发", "分享", "推广",
];

const PROMO_URL_PATTERNS = [
  "wechat", "qrcode", "qr-code", "promotion", "banner", "ad-",
];

function isPromoByHeuristic(alt: string, src: string): boolean {
  const lowerAlt = alt.toLowerCase();
  const lowerSrc = src.toLowerCase();

  // Check alt text for promo keywords
  for (const kw of PROMO_KEYWORDS) {
    if (lowerAlt.includes(kw)) return true;
  }

  // Check URL for promo patterns
  for (const pat of PROMO_URL_PATTERNS) {
    if (lowerSrc.includes(pat)) return true;
  }

  // Image without alt text and with generic name is suspicious
  if (!alt && (src.includes("img-") || src.includes("image-"))) return false; // generic names are OK

  return false;
}

// ── AI-based image filter (Gemma text model) ──

async function filterImagesByAI(
  images: { src: string; alt: string; context: string }[],
  articleTitle: string
): Promise<{ src: string; alt: string }[]> {
  if (images.length === 0) return [];

  const key = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
  const baseUrl = process.env.LLM_BASE_URL || "https://ollama.com/v1/chat/completions";
  const model = "gemma4:31b";

  // First pass: heuristic filter
  const heuristicKeep: typeof images = [];
  const heuristicReject: string[] = [];
  for (const img of images) {
    if (isPromoByHeuristic(img.alt, img.src)) {
      heuristicReject.push(img.alt || img.src);
    } else {
      heuristicKeep.push(img);
    }
  }

  if (heuristicReject.length > 0) {
    console.log(`    Heuristic: rejected ${heuristicReject.length} promo images`);
  }

  // If only 0-1 images remain after heuristic, skip AI filter
  if (heuristicKeep.length <= 1) {
    return heuristicKeep.map(({ src, alt }) => ({ src, alt }));
  }

  // AI filter: classify remaining images
  console.log(`    AI filter: classifying ${heuristicKeep.length} images...`);

  const imageList = heuristicKeep.map((img, i) =>
    `[${i + 1}] alt="${img.alt}"`
  ).join("\n");

  const systemPrompt = `You are an image content classifier. Given a list of images from a Chinese AI blog article, classify each image as "KEEP" or "REJECT".

REJECT if the image likely contains:
- Chinese text (especially if it's a WeChat/微信公众号 promotional banner)
- QR codes, "scan to follow" prompts
- Advertisement or promotional content
- Screenshots that are mostly Chinese text (not diagrams)

KEEP if the image is likely:
- A diagram, chart, or technical illustration
- A photo or screenshot showing AI model results/benchmarks
- An architecture diagram or flowchart
- A relevant product screenshot (not promotional)

Article title: ${articleTitle}

Respond as JSON array of indices to KEEP:
{
  "keep": [1, 3, 5]
}`;

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 256,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: imageList },
        ],
      }),
    });

    if (!res.ok) return heuristicKeep.map(({ src, alt }) => ({ src, alt }));

    const data = await res.json() as { choices: { message: { content: string } }[] };
    const content = data.choices[0].message.content;
    const cleaned = content.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    const result = JSON.parse(cleaned) as { keep: number[] };
    const keepIndices = new Set(result.keep.map((k: number) => k - 1));

    const kept = heuristicKeep.filter((_, i) => keepIndices.has(i));
    const rejected = heuristicKeep.length - kept.length;
    if (rejected > 0) {
      console.log(`    AI filter: rejected ${rejected}, kept ${kept.length}`);
    }

    return kept.map(({ src, alt }) => ({ src, alt }));
  } catch {
    // Fallback: keep all heuristic-passing images
    console.warn("    AI filter failed, keeping all non-promo images");
    return heuristicKeep.map(({ src, alt }) => ({ src, alt }));
  }
}

// ── Image download ──

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AIModelsNavi/1.0" },
    });
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch {
    return false;
  }
}

// ── Main ──

export async function syncBlog(): Promise<BlogSyncResult> {
  migrate();
  const sourceId = getSourceId("blog");

  const result: BlogSyncResult = { processed: 0, skipped: 0, errors: [] };

  const posts = getBlogPostsNeedingProcessing(sourceId);
  if (posts.length === 0) {
    console.log("\n[Blog Sync] No new blog posts to process.");
    return result;
  }

  const MAX_ARTICLES_PER_RUN = 5;
  const toProcess = posts.slice(0, MAX_ARTICLES_PER_RUN);
  const remaining = posts.length - toProcess.length;

  console.log(`\n═══ Blog Sync: Processing ${toProcess.length} articles (${posts.length} total, ${remaining} queued) ═══`);

  for (let i = 0; i < toProcess.length; i++) {
    const post = toProcess[i];
    console.log(`\n  [${i + 1}/${toProcess.length}] ${post.title_zh || post.external_slug}`);

    try {
      const bodyText = post.body_text;
      if (!bodyText || bodyText.length < 100) {
        result.skipped++;
        console.warn(`  ✗ Body text too short (${bodyText?.length || 0} chars), skipping`);
        continue;
      }

      // Extract, filter, and download images
      const images: BlogImage[] = [];
      try {
        const { body } = await rateLimitedFetch(post.source_url);
        const rawImages = extractImages(body);

        // Filter images: heuristic + AI (Gemma)
        const filtered = await filterImagesByAI(
          rawImages,
          post.title_zh || post.external_slug
        );

        // Download filtered images
        const imageDir = path.join(PUBLIC_IMAGES_DIR, post.local_slug || post.external_slug);

        for (let j = 0; j < Math.min(filtered.length, 5); j++) {
          const img = filtered[j];
          const ext = img.src.match(/\.(webp|png|jpg|jpeg)(\?|$)/i)?.[1] || "webp";
          const filename = `img-${j + 1}.${ext}`;
          const localPath = `/images/blog/${post.local_slug || post.external_slug}/${filename}`;
          const fullPath = path.join(imageDir, filename);

          const ok = await downloadImage(img.src, fullPath);
          if (ok) {
            images.push({ src: img.src, alt: img.alt, localPath });
          }
        }
        if (images.length > 0) {
          console.log(`    Downloaded ${images.length} images (${rawImages.length - filtered.length} filtered out)`);
        }
      } catch {
        console.warn("    Image extraction skipped (fetch failed)");
      }

      // Process via LLM: translate Chinese → Japanese + adapt for Japanese audience
      const blogPost = await processBlogArticle(
        post.title_zh || post.external_slug,
        bodyText,
        post.source_url,
        images
      );

      const localSlug = post.local_slug || post.external_slug.slice(0, 80);

      saveBlogPost(
        localSlug,
        {
          title: blogPost.title,
          date: new Date().toISOString().split("T")[0],
          tag: blogPost.tag,
          excerpt: blogPost.excerpt,
          draft: "true",
        },
        blogPost.content
      );

      markBlogPostProcessed(post.id, localSlug);
      result.processed++;
      console.log(`  ✓ ${blogPost.title}`);
    } catch (err) {
      result.errors.push(`${post.external_slug}: ${err}`);
      console.error(`  ✗ Failed: ${err}`);
    }
  }

  console.log(`\n  Blog sync done: ${result.processed} processed, ${result.skipped} skipped, ${result.errors.length} errors`);
  return result;
}
