"use client";

import { useState, useRef, type FormEvent } from "react";
import { useLocale } from "next-intl";

const T = {
  ja: {
    postComment: "コメントを投稿",
    nickname: "ニックネーム",
    placeholder: "コメントを入力...",
    submitFailed: "投稿に失敗しました",
    submitted: "コメントを投稿しました。承認後に表示されます。",
    networkError: "ネットワークエラーが発生しました",
    submitting: "送信中...",
    reply: "返信する",
    post: "投稿する",
    cancel: "キャンセル",
  },
  en: {
    postComment: "Post a Comment",
    nickname: "Nickname",
    placeholder: "Enter a comment...",
    submitFailed: "Failed to submit",
    submitted: "Comment submitted. It will be displayed after approval.",
    networkError: "A network error occurred",
    submitting: "Submitting...",
    reply: "Reply",
    post: "Post",
    cancel: "Cancel",
  },
  ko: {
    postComment: "댓글 작성",
    nickname: "닉네임",
    placeholder: "댓글을 입력하세요...",
    submitFailed: "제출에 실패했습니다",
    submitted: "댓글이 제출되었습니다. 승인 후 표시됩니다.",
    networkError: "네트워크 오류가 발생했습니다",
    submitting: "전송 중...",
    reply: "답글",
    post: "게시",
    cancel: "취소",
  },
};

interface CommentFormProps {
  slug: string;
  parentId?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CommentForm({ slug, parentId = null, onSuccess, onCancel }: CommentFormProps) {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const tsRef = useRef(Date.now());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name: name.trim(),
          content: content.trim(),
          parent_id: parentId,
          _hp: "",
          _ts: tsRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.submitFailed);
        return;
      }

      setMessage(t.submitted);
      setName("");
      setContent("");
      tsRef.current = Date.now();
      onSuccess?.();
    } catch {
      setError(t.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {parentId === null && (
        <h3 className="text-sm font-semibold text-gray-700">{t.postComment}</h3>
      )}

      <input
        type="text"
        name="_hp"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        onChange={() => {}}
      />

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.nickname}
        maxLength={100}
        required
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t.placeholder}
        maxLength={2000}
        rows={parentId ? 3 : 4}
        required
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !content.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? t.submitting : parentId ? t.reply : t.post}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t.cancel}
          </button>
        )}
      </div>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
