'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

const T = {
  ja: {
    title: "トークンカウンター",
    desc: "テキストのトークン数を推定します。日本語と英語の混在テキストに対応。",
    placeholder: "ここにテキストを貼り付けてください...",
    estimatedTokens: "推定トークン数",
    charCount: "文字数",
    wordCount: "単語数",
    note: "※ トークン数の推定は簡易的な計算に基づきます。実際のトークン数はモデルやトークナイザーによって異なります。日本語文字は約0.5トークン/文字、英数字は約0.25トークン/文字として計算しています。",
  },
  en: {
    title: "Token Counter",
    desc: "Estimate the token count of your text. Supports mixed Japanese and English text.",
    placeholder: "Paste your text here...",
    estimatedTokens: "Estimated Tokens",
    charCount: "Characters",
    wordCount: "Words",
    note: "※ Token estimation is based on a simplified calculation. Actual token counts vary by model and tokenizer. Japanese characters are estimated at ~0.5 tokens/char, alphanumeric at ~0.25 tokens/char.",
  },
};

export default function TokenCounterPage() {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;
  const [text, setText] = useState('');

  // Simple estimation: ~4 chars per token for English, ~1-2 for Japanese
  const estimateTokens = (str: string): number => {
    const japaneseChars = (str.match(/[　-〿぀-ゟ゠-ヿ＀-ﾟ一-龯㐀-䶿]/g) || []).length;
    const otherChars = str.length - japaneseChars;
    return Math.ceil(japaneseChars * 0.5 + otherChars / 4);
  };

  const tokenEstimate = estimateTokens(text);
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
      <p className="text-gray-500 mb-8">{t.desc}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        rows={10}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
      />

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-5 bg-primary-50 rounded-xl text-center">
          <p className="text-xs font-medium text-primary-600 mb-1">{t.estimatedTokens}</p>
          <p className="text-3xl font-bold text-primary-700">{tokenEstimate.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-gray-50 rounded-xl text-center">
          <p className="text-xs font-medium text-gray-500 mb-1">{t.charCount}</p>
          <p className="text-3xl font-bold text-gray-700">{charCount.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-gray-50 rounded-xl text-center">
          <p className="text-xs font-medium text-gray-500 mb-1">{t.wordCount}</p>
          <p className="text-3xl font-bold text-gray-700">{wordCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">{t.note}</p>
      </div>
    </div>
  );
}
