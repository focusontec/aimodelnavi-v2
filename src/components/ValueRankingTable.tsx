"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Search, ArrowUpDown, TrendingUp } from "lucide-react";
import { valueRankingData, type ValueRankedModel } from "@/data/value-ranking";

const LABELS: Record<string, Record<string, string>> = {
  ja: {
    search: "モデル名・開名・開発元で検索",
    model: "モデル",
    developer: "開発元",
    compositeScore: "総合スコア",
    valueScore: "バリュースコア",
    inputPrice: "入力料金",
    outputPrice: "出力料金",
    costPer1M: "/1Mトークン",
    noResults: "該当するモデルが見つかりません",
    models: "件のモデル",
    explanation: "バリュースコア = 総合ベンチマークスコア / API料金。高いほどコストパフォーマンスが良い。",
    all: "すべて", reasoning: "推論", foundation: "基盤", coder: "コーディング", chat: "チャット",
  },
  en: {
    search: "Search by model name or developer",
    model: "Model",
    developer: "Developer",
    compositeScore: "Composite Score",
    valueScore: "Value Score",
    inputPrice: "Input Price",
    outputPrice: "Output Price",
    costPer1M: "/1M tokens",
    noResults: "No matching models found",
    models: "models",
    explanation: "Value Score = Composite Benchmark Score / API Cost. Higher means better cost-performance.",
    all: "All", reasoning: "Reasoning", foundation: "Base", coder: "Coding", chat: "Chat",
  },
  ko: {
    search: "모델명 또는 개발사로 검색",
    model: "모델",
    developer: "개발사",
    compositeScore: "종합 점수",
    valueScore: "밸류 스코어",
    inputPrice: "입력 가격",
    outputPrice: "출력 가격",
    costPer1M: "/1M 토큰",
    noResults: "해당하는 모델이 없습니다",
    models: "개 모델",
    explanation: "밸류 스코어 = 종합 벤치마크 점수 / API 비용. 높을수록 가성비가 좋습니다.",
    all: "전체", reasoning: "추론", foundation: "파운데이션", coder: "코딩", chat: "채팅",
  },
};

const PAGE_SIZE = 30;

export default function ValueRankingTable() {
  const locale = useLocale();
  const l = LABELS[locale] || LABELS.ja;
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const [sortKey, setSortKey] = useState<string>("valueScore");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredAndSorted = useMemo(() => {
    return [...valueRankingData]
      .filter((m) => filterType === "all" || m.type === filterType)
      .filter((m) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.developer.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const aVal = a[sortKey as keyof ValueRankedModel];
        const bVal = b[sortKey as keyof ValueRankedModel];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        return (bVal as number) - (aVal as number);
      });
  }, [filterType, searchQuery, sortKey]);

  const displayData = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;
  const TYPE_KEYS = ["all", "reasoning", "foundation", "coder", "chat"];

  const handleSort = (key: string) => {
    setSortKey(key);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">{l.explanation}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder={l.search}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TYPE_KEYS.map((t) => (
            <button
              key={t}
              onClick={() => { setFilterType(t); setVisibleCount(PAGE_SIZE); }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === t ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {l[t] || t}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredAndSorted.length} {l.models}
      </p>

      {/* Table */}
      {displayData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{l.noResults}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 w-12">#</th>
                <SortableHeader label={l.model} sortKey="name" currentSort={sortKey} onSort={handleSort} />
                <SortableHeader label={l.developer} sortKey="developer" currentSort={sortKey} onSort={handleSort} />
                <SortableHeader label={l.compositeScore} sortKey="compositeScore" currentSort={sortKey} onSort={handleSort} align="right" />
                <SortableHeader label={`${l.inputPrice}${l.costPer1M}`} sortKey="inputPrice" currentSort={sortKey} onSort={handleSort} align="right" />
                <SortableHeader label={`${l.outputPrice}${l.costPer1M}`} sortKey="outputPrice" currentSort={sortKey} onSort={handleSort} align="right" />
                <SortableHeader label={l.valueScore} sortKey="valueScore" currentSort={sortKey} onSort={handleSort} align="right" />
              </tr>
            </thead>
            <tbody>
              {displayData.map((m, i) => (
                <tr key={m.slug} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-500 font-medium">{i + 1}</td>
                  <td className="py-3 px-2">
                    <Link href={`${prefix}/models/${m.slug}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {m.name}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{m.developer}</td>
                  <td className="py-3 px-2 text-right font-medium text-gray-700">
                    {m.compositeScore != null ? m.compositeScore.toFixed(1) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600">
                    ${m.inputPrice != null ? m.inputPrice.toFixed(2) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600">
                    ${m.outputPrice != null ? m.outputPrice.toFixed(2) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {m.valueScore != null ? (
                      <span className="inline-flex items-center gap-1 font-bold text-primary-700">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {m.valueScore.toFixed(2)}
                      </span>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {locale === "ja" ? "さらに読み込む" : locale === "ko" ? "더 보기" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: string;
  currentSort: string;
  onSort: (key: string) => void;
  align?: "left" | "right";
}) {
  const isActive = currentSort === sortKey;
  return (
    <th
      className={`py-3 px-2 text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-700 ${
        align === "right" ? "text-right" : "text-left"
      }`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${isActive ? "text-primary-600" : "text-gray-300"}`} />
      </span>
    </th>
  );
}
