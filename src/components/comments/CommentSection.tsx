"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentItem, { type CommentData } from "./CommentItem";
import LikeButton from "./LikeButton";
import ShareButtons from "./ShareButtons";

const T = {
  ja: {
    comments: "コメント",
    loading: "読み込み中...",
    noComments: "まだコメントがありません。最初のコメントを投稿しましょう。",
  },
  en: {
    comments: "Comments",
    loading: "Loading...",
    noComments: "No comments yet. Be the first to comment.",
  },
};

interface CommentSectionProps {
  slug: string;
  title: string;
}

export default function CommentSection({ slug, title }: CommentSectionProps) {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;

  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [postLikes, setPostLikes] = useState({ count: 0, liked: false });

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {
      // silent
    }
  }, [slug]);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setPostLikes({ count: data.count, liked: data.liked });
      }
    } catch {
      // silent
    }
  }, [slug]);

  useEffect(() => {
    Promise.all([fetchComments(), fetchLikes()]).finally(() => setLoading(false));
  }, [fetchComments, fetchLikes]);

  return (
    <section className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <MessageCircle className="w-5 h-5" />
          {t.comments} ({comments.length})
        </h2>
        <div className="flex items-center gap-4">
          <LikeButton
            slug={slug}
            initialCount={postLikes.count}
            initialLiked={postLikes.liked}
          />
          <ShareButtons title={title} slug={slug} />
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <CommentForm slug={slug} onSuccess={fetchComments} />
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">{t.loading}</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400">{t.noComments}</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
            />
          ))}
        </div>
      )}
    </section>
  );
}
