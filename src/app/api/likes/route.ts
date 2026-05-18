import { NextRequest, NextResponse } from "next/server";
import { query, initializeDatabase, hashIp, getClientIp } from "@/lib/db";

let initialized = false;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const commentId = request.nextUrl.searchParams.get("comment_id");

  if (!slug) {
    return NextResponse.json({ error: "slug パラメータが必要です" }, { status: 400 });
  }

  try {
    if (!initialized) { await initializeDatabase(); initialized = true; }

    const target = commentId ? "comment" : "post";
    const targetId = commentId ? parseInt(commentId) : null;

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    const targetClause = targetId !== null ? `AND target_id = $3` : `AND target_id IS NULL`;
    const params = targetId !== null ? [slug, target, targetId] : [slug, target];

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS cnt FROM likes WHERE slug = $1 AND target = $2 ${targetClause}`,
      params
    );
    const count = (countRows[0] as { cnt: number }).cnt;

    const likeParams = targetId !== null ? [slug, target, targetId, ipHash] : [slug, target, ipHash];
    const likeClause = targetId !== null
      ? `AND target_id = $3 AND ip_hash = $4`
      : `AND target_id IS NULL AND ip_hash = $3`;

    const { rows: likedRows } = await query(
      `SELECT id FROM likes WHERE slug = $1 AND target = $2 ${likeClause} LIMIT 1`,
      likeParams
    );
    const liked = likedRows.length > 0;

    return NextResponse.json({ count, liked });
  } catch (err) {
    console.error("GET /api/likes error:", err);
    return NextResponse.json({ error: "いいねの取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; target?: string; target_id?: number | null };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの解析に失敗しました" }, { status: 400 });
  }

  if (!body.slug) {
    return NextResponse.json({ error: "slug は必須です" }, { status: 400 });
  }

  const target = body.target || "post";
  const targetId = body.target_id || null;

  try {
    if (!initialized) { await initializeDatabase(); initialized = true; }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    const targetClause = targetId !== null ? `AND target_id = $4` : `AND target_id IS NULL`;
    const params = targetId !== null
      ? [body.slug, target, ipHash, targetId]
      : [body.slug, target, ipHash];

    const { rows: existing } = await query(
      `SELECT id FROM likes WHERE slug = $1 AND target = $2 AND ip_hash = $3 ${targetClause}`,
      params
    );

    let liked: boolean;

    if (existing.length > 0) {
      await query(`DELETE FROM likes WHERE id = $1`, [(existing[0] as { id: number }).id]);
      liked = false;
    } else {
      await query(
        `INSERT INTO likes (slug, target, target_id, ip_hash) VALUES ($1, $2, $3, $4)`,
        [body.slug, target, targetId, ipHash]
      );
      liked = true;
    }

    const countTargetClause = targetId !== null ? `AND target_id = $3` : `AND target_id IS NULL`;
    const countParams = targetId !== null ? [body.slug, target, targetId] : [body.slug, target];

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS cnt FROM likes WHERE slug = $1 AND target = $2 ${countTargetClause}`,
      countParams
    );
    const count = (countRows[0] as { cnt: number }).cnt;

    return NextResponse.json({ liked, count });
  } catch (err) {
    console.error("POST /api/likes error:", err);
    return NextResponse.json({ error: "いいねの処理に失敗しました" }, { status: 500 });
  }
}
