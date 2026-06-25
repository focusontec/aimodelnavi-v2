"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";

export interface CommentData {
  id: number;
  slug: string;
  name: string;
  content: string;
  parent_id: number | null;
  created_at: string;
  likes_count: number;
  replies: CommentData[];
}

interface CommentItemProps {
  comment: CommentData;
  slug: string;
  depth?: number;
}

const T = {
  ja: {
    justNow: "たった今",
    minutesAgo: (n: number) => `${n}分前`,
    hoursAgo: (n: number) => `${n}時間前`,
    daysAgo: (n: number) => `${n}日前`,
    reply: "返信",
    replySubmitted: "返信を投稿しました。承認後に表示されます。",
    dateLocale: "ja-JP",
  },
  en: {
    justNow: "just now",
    minutesAgo: (n: number) => `${n}m ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    daysAgo: (n: number) => `${n}d ago`,
    reply: "Reply",
    replySubmitted: "Reply submitted. It will be displayed after approval.",
    dateLocale: "en-US",
  },
  ko: {
    justNow: "방금",
    minutesAgo: (n: number) => `${n}분 전`,
    hoursAgo: (n: number) => `${n}시간 전`,
    daysAgo: (n: number) => `${n}일 전`,
    reply: "답글",
    replySubmitted: "답글이 제출되었습니다. 승인 후 표시됩니다.",
    dateLocale: "ko-KR",
  },
};

function relativeTime(dateStr: string, locale: string): string {
  const t = T[locale as keyof typeof T] || T.ja;
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return t.justNow;
  if (diff < hour) return t.minutesAgo(Math.floor(diff / minute));
  if (diff < day) return t.hoursAgo(Math.floor(diff / hour));
  if (diff < 30 * day) return t.daysAgo(Math.floor(diff / day));
  return new Date(dateStr).toLocaleDateString(t.dateLocale);
}

export default function CommentItem({ comment, slug, depth = 0 }: CommentItemProps) {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubmitted, setReplySubmitted] = useState(false);

  return (
    <div className={depth > 0 ? "pl-6 border-l-2 border-gray-100" : ""}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{comment.name}</span>
          <span className="text-xs text-gray-400">{relativeTime(comment.created_at, locale)}</span>
        </div>

        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <LikeButton
            slug={slug}
            target="comment"
            targetId={comment.id}
            initialCount={comment.likes_count}
          />
          {depth === 0 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t.reply}
            </button>
          )}
        </div>

        {showReplyForm && !replySubmitted && (
          <div className="mt-3">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              onSuccess={() => {
                setReplySubmitted(true);
                setShowReplyForm(false);
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {replySubmitted && (
          <p className="mt-2 text-xs text-green-600">{t.replySubmitted}</p>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              slug={slug}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
