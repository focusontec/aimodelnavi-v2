"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { leaderboardData, type ModelRanking } from "@/data/leaderboard";
import type { Benchmark } from "@/data/benchmarks";

interface LeaderboardTableProps {
  benchmarks: string[];
  benchmarkDefs: (Benchmark | undefined)[];
  maxRows?: number;
}

const PAGE_SIZE = 30;

export default function LeaderboardTable({
  benchmarks,
  benchmarkDefs,
}: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<string>(benchmarks[0] || "hle");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredAndSorted = useMemo(() => {
    return [...leaderboardData]
      .filter((m) => filterType === "all" || m.type === filterType)
      .filter((m) => filterSource === "all" || m.openSource === filterSource)
      .filter((m) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.developer.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aVal = a[sortKey as keyof ModelRanking];
        const bVal = b[sortKey as keyof ModelRanking];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        return (bVal as number) - (aVal as number);
      });
  }, [filterType, filterSource, searchQuery, sortKey]);

  const displayData = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  // Reset visible count when filters change
  function handleFilterChange(type: string, source: string) {
    setFilterType(type);
    setFilterSource(source);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="モデル名・開名・開発元で検索"
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Type filter */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {["all", "reasoning", "foundation", "coder", "chat"].map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange(t, filterSource)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === t
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "all" ? "すべて" : t === "reasoning" ? "推論" : t === "foundation" ? "基盤" : t === "coder" ? "コーディング" : "チャット"}
            </button>
          ))}
        </div>

        {/* Source filter */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: "all", label: "すべて" },
            { value: "open", label: "オープンソース" },
            { value: "closed", label: "クローズド" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => handleFilterChange(filterType, s.value)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterSource === s.value
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        {filteredAndSorted.length} 件のモデル
        {searchQuery && ` (「${searchQuery}」で検索)`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>モデル名</th>
              <th>開発元</th>
              {benchmarks.map((key) => {
                const def = benchmarkDefs.find((b) => b?.key === key);
                return (
                  <th key={key}>
                    <button
                      onClick={() => setSortKey(key)}
                      className={`inline-flex items-center gap-1 hover:text-primary-600 transition-colors ${
                        sortKey === key ? "text-primary-600" : ""
                      }`}
                    >
                      {def?.name || key}
                      {sortKey === key && <span className="text-[10px]">▼</span>}
                    </button>
                  </th>
                );
              })}
              <th>オープンソース</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + benchmarks.length + 1}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  該当するモデルが見つかりません
                </td>
              </tr>
            ) : (
              displayData.map((model, idx) => (
                <tr key={model.name}>
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {model.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {model.developer}
                  </td>
                  {benchmarks.map((key) => {
                    const val = model[key as keyof ModelRanking];
                    return (
                      <td key={key} className="px-4 py-3 text-sm">
                        {val !== null && val !== undefined ? (
                          <span
                            className={`font-mono font-medium ${
                              (val as number) >= 50
                                ? "text-emerald-600"
                                : (val as number) >= 30
                                ? "text-amber-600"
                                : "text-gray-600"
                            }`}
                          >
                            {(val as number).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-sm">
                    {model.openSource === "open" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        オープン
                      </span>
                    ) : model.openSource === "open-nc" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        非商用
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        クローズド
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-6 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
          >
            さらに読み込む（{visibleCount} / {filteredAndSorted.length}）
          </button>
        </div>
      )}
    </div>
  );
}
