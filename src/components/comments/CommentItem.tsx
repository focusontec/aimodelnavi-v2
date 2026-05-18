"use client";

import { useState } from "react";
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

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "たった今";
  if (diff < hour) return `${Math.floor(diff / minute)}分前`;
  if (diff < day) return `${Math.floor(diff / hour)}時間前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)}日前`;
  return new Date(dateStr).toLocaleDateString("ja-JP");
}

export default function CommentItem({ comment, slug, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubmitted, setReplySubmitted] = useState(false);

  return (
    <div className={depth > 0 ? "pl-6 border-l-2 border-gray-100" : ""}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{comment.name}</span>
          <span className="text-xs text-gray-400">{relativeTime(comment.created_at)}</span>
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
              返信
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
          <p className="mt-2 text-xs text-green-600">返信を投稿しました。承認後に表示されます。</p>
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
