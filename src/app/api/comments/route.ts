import { NextRequest, NextResponse } from "next/server";
import { query, initializeDatabase, hashIp, getClientIp } from "@/lib/db";

let initialized = false;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug パラメータが必要です" }, { status: 400 });
  }

  try {
    if (!initialized) { await initializeDatabase(); initialized = true; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { rows: topComments } = await query<any>(
      `SELECT id, slug, name, content, parent_id, created_at
       FROM comments WHERE slug = $1 AND status = 'approved' AND parent_id IS NULL
       ORDER BY created_at ASC`,
      [slug]
    );

    const topIds = topComments.map((c: { id: number }) => c.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let replies: any[] = [];
    if (topIds.length > 0) {
      const result = await query<any>(
        `SELECT id, slug, name, content, parent_id, created_at
         FROM comments WHERE slug = $1 AND status = 'approved' AND parent_id = ANY($2)
         ORDER BY created_at ASC`,
        [slug, topIds]
      );
      replies = result.rows;
    }

    const allIds = [...topIds, ...replies.map((r: { id: number }) => r.id)];
    const likeCounts = new Map<number, number>();

    if (allIds.length > 0) {
      const { rows: likes } = await query<any>(
        `SELECT target_id, COUNT(*)::int AS cnt
         FROM likes WHERE slug = $1 AND target = 'comment' AND target_id = ANY($2)
         GROUP BY target_id`,
        [slug, allIds]
      );
      for (const row of likes) {
        likeCounts.set(row.target_id, row.cnt);
      }
    }

    const repliesByParent = new Map<number, any[]>();
    for (const r of replies) {
      const pid = r.parent_id;
      if (!repliesByParent.has(pid)) repliesByParent.set(pid, []);
      repliesByParent.get(pid)!.push(r);
    }

    const formatted = topComments.map((c: { id: number; slug: string; name: string; content: string; parent_id: number | null; created_at: string }) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      content: c.content,
      parent_id: c.parent_id,
      created_at: new Date(c.created_at).toISOString(),
      likes_count: likeCounts.get(c.id) || 0,
      replies: (repliesByParent.get(c.id) || []).map((r: { id: number; slug: string; name: string; content: string; parent_id: number | null; created_at: string }) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        content: r.content,
        parent_id: r.parent_id,
        created_at: new Date(r.created_at).toISOString(),
        likes_count: likeCounts.get(r.id) || 0,
        replies: [],
      })),
    }));

    return NextResponse.json({ comments: formatted });
  } catch (err) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json({ error: "コメントの取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: {
    slug?: string;
    name?: string;
    content?: string;
    parent_id?: number | null;
    _hp?: string;
    _ts?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの解析に失敗しました" }, { status: 400 });
  }

  if (body._hp) {
    return NextResponse.json({ error: "スパムを検出しました" }, { status: 400 });
  }

  if (body._ts && Date.now() - body._ts < 5000) {
    return NextResponse.json({ error: "送信が速すぎます。もう少しお待ちください。" }, { status: 400 });
  }

  if (!body.slug || !body.name?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "ニックネームとコメントは必須です" }, { status: 400 });
  }

  if (body.name.length > 100) {
    return NextResponse.json({ error: "ニックネームは100文字以内で入力してください" }, { status: 400 });
  }

  if (body.content.length > 2000) {
    return NextResponse.json({ error: "コメントは2000文字以内で入力してください" }, { status: 400 });
  }

  try {
    if (!initialized) { await initializeDatabase(); initialized = true; }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS cnt FROM comments
       WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
      [ipHash]
    );
    if ((countRows[0] as { cnt: number }).cnt >= 5) {
      return NextResponse.json({ error: "コメントの投稿回数が多すぎます。1時間後に再度お試しください。" }, { status: 429 });
    }

    if (body.parent_id) {
      const { rows: parentRows } = await query(
        `SELECT id FROM comments WHERE id = $1 AND slug = $2`,
        [body.parent_id, body.slug]
      );
      if (parentRows.length === 0) {
        return NextResponse.json({ error: "返信先のコメントが見つかりません" }, { status: 400 });
      }
    }

    const { rows } = await query(
      `INSERT INTO comments (slug, name, content, parent_id, status, ip_hash)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       RETURNING id, name, content, created_at, status`,
      [body.slug, body.name.trim(), body.content.trim(), body.parent_id || null, ipHash]
    );

    const comment = rows[0] as { id: number; name: string; content: string; created_at: string; status: string };
    return NextResponse.json({
      comment: { ...comment, created_at: new Date(comment.created_at).toISOString() },
    }, { status: 201 });
  } catch (err) {
    console.error("POST /api/comments error:", err);
    return NextResponse.json({ error: "コメントの投稿に失敗しました" }, { status: 500 });
  }
}
