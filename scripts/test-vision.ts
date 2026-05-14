#!/usr/bin/env tsx

import { getDb, migrate } from "./lib/db";
import { getAllPosts } from "../src/lib/blog";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "public", "images", "blog");
const KEY = "72e4425f35e5426290a088787189f446.ZUOKJvidlzsLbiiJEnd7UvYl";
const MODEL = "gemma4:31b-cloud";

async function classifyImage(filePath: string, articleTitle: string): Promise<string> {
  const buf = fs.readFileSync(filePath);
  const b64 = buf.toString("base64");
  const ext = path.extname(filePath).slice(1);
  const mime = ext === "png" ? "image/png" : ext === "jpg" ? "image/jpeg" : "image/webp";

  const prompt = `Classify this image as "promo", "chinese_text", or "content":
- promo: WeChat QR, subscription banner, advertisement
- chinese_text: content image (diagram/chart/screenshot) that contains Chinese text
- content: technical image with no Chinese text at all

Respond with EXACTLY one word.`;

  const res = await fetch("https://ollama.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 32,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
        ],
      }],
    }),
  });
  const data = await res.json() as any;
  if (data.error) return `ERROR: ${data.error.message}`;
  return data.choices[0].message.content.trim();
}

async function main() {
  migrate();
  const db = getDb();
  const posts = getAllPosts();

  for (const post of posts) {
    const dirPath = path.join(IMAGES_DIR, post.slug);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) continue;

    // Get article title
    let sourceUrl = "";
    const srcMatch = post.content.match(/source:\s*"?([^"\n]+)"?/);
    if (srcMatch?.[1]) sourceUrl = srcMatch[1];
    else {
      const row = db.prepare("SELECT source_url FROM blog_posts WHERE local_slug = ? OR external_slug = ?").get(post.slug, post.slug) as any;
      if (row?.source_url) sourceUrl = row.source_url;
    }

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const label = await classifyImage(filePath, post.title);
      console.log(`  ${label.padEnd(18)} | ${post.slug}/${file}`);
    }
  }
}

main().catch(console.error);
