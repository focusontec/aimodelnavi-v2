"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";

const T = {
  ja: {
    unlike: "いいねを取り消す",
    like: "いいね",
  },
  en: {
    unlike: "Unlike",
    like: "Like",
  },
};

interface LikeButtonProps {
  slug: string;
  target?: "post" | "comment";
  targetId?: number;
  initialCount?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  slug,
  target = "post",
  targetId,
  initialCount = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, target, target_id: targetId || null }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.count);
      }
    } catch {
      // Revert on error
      setLiked(liked);
      setCount((c) => (liked ? c + 1 : c - 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-sm transition-colors ${
        liked
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-400"
      }`}
      aria-label={liked ? t.unlike : t.like}
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
