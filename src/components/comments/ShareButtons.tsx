"use client";

import { useState } from "react";
import { ExternalLink, Bookmark, Link } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://aimodelsnavi.com/blog/${slug}`;

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">シェア:</span>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        X
      </a>

      <a
        href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Bookmark className="w-3 h-3" />
        はてブ
      </a>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Link className="w-3 h-3" />
        {copied ? "コピー済み" : "コピー"}
      </button>
    </div>
  );
}
