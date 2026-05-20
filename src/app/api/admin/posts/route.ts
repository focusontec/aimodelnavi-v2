import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export async function GET() {
  try {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

    const posts = files
      .map((file) => {
        const slug = file.replace(/\.md$/, "");
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
        const { data } = matter(raw);

        return {
          slug,
          title: data.title || slug,
          date: data.date || "",
          tag: data.tag || "",
        };
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("GET /api/admin/posts error:", err);
    return NextResponse.json({ error: "記事一覧の取得に失敗しました" }, { status: 500 });
  }
}
