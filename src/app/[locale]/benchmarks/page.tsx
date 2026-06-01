'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { benchmarksData, Benchmark } from '@/data/benchmarks';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const T = {
  ja: {
    title: "AI モデル評価ベンチマーク",
    desc: "业界主流の AI モデル評価ベンチマーク一覧。各ベンチマークの説明と、モデルのランキングを確認できます。",
    categories: [
      { key: 'all', label: 'すべて' },
      { key: 'math', label: '数学' },
      { key: 'coding', label: 'プログラミング' },
      { key: 'reasoning', label: '推論' },
      { key: 'comprehensive', label: '総合' },
      { key: 'agent', label: 'エージェント' },
    ],
    categoryMap: { math: '数学', coding: 'プログラミング', reasoning: '推論', comprehensive: '総合', agent: 'エージェント' } as Record<string, string>,
    models: "モデル",
    rank: "#",
    model: "モデル",
    developer: "開発元",
    score: "スコア",
    mode: "モード",
    morePrefix: "... 他",
    moreSuffix: "モデル",
    noData: "ランキングデータがありません",
    infoTitle: "評価ベンチマークについて",
    infoDesc: "各評価ベンチマークは、AI モデルの特定の能力を測定するために設計されています。数学推論、コーディング、総合的な理解力など、多様な角度からモデルの性能を評価できます。データは定期的に更新され、最新のモデルのスコアが反映されます。",
  },
  en: {
    title: "AI Model Evaluation Benchmarks",
    desc: "A list of mainstream AI model evaluation benchmarks. View benchmark descriptions and model rankings.",
    categories: [
      { key: 'all', label: 'All' },
      { key: 'math', label: 'Math' },
      { key: 'coding', label: 'Coding' },
      { key: 'reasoning', label: 'Reasoning' },
      { key: 'comprehensive', label: 'Comprehensive' },
      { key: 'agent', label: 'Agent' },
    ],
    categoryMap: { math: 'Math', coding: 'Coding', reasoning: 'Reasoning', comprehensive: 'Comprehensive', agent: 'Agent' } as Record<string, string>,
    models: "models",
    rank: "#",
    model: "Model",
    developer: "Developer",
    score: "Score",
    mode: "Mode",
    morePrefix: "... and",
    moreSuffix: "more",
    noData: "No ranking data available",
    infoTitle: "About Evaluation Benchmarks",
    infoDesc: "Each evaluation benchmark is designed to measure specific capabilities of AI models. You can evaluate model performance from diverse angles including mathematical reasoning, coding, and comprehensive understanding. Data is updated regularly to reflect the latest model scores.",
  },
};

export default function BenchmarksPage() {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedBenchmark, setExpandedBenchmark] = useState<string | null>(null);

  const filteredBenchmarks = benchmarksData.filter(
    (b) => filterCategory === 'all' || b.category === filterCategory
  );

  const toggleBenchmark = (key: string) => {
    setExpandedBenchmark(expandedBenchmark === key ? null : key);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-2 text-gray-500">{t.desc}</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-lg border border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {t.categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterCategory === cat.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmarks list */}
      <div className="space-y-4">
        {filteredBenchmarks.map((benchmark) => (
          <div
            key={benchmark.key}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Benchmark header */}
            <button
              onClick={() => toggleBenchmark(benchmark.key)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">{benchmark.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{benchmark.nameJa}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {t.categoryMap[benchmark.category] || benchmark.category}
                </span>
                <span className="text-sm text-gray-400">
                  {benchmark.totalModels} {t.models}
                </span>
              </div>
              {expandedBenchmark === benchmark.key ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Benchmark details (expanded) */}
            {expandedBenchmark === benchmark.key && (
              <div className="px-6 pb-6">
                {/* Description */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{benchmark.description}</p>
                </div>

                {/* Rankings table */}
                {benchmark.rankings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">{t.rank}</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">{t.model}</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">{t.developer}</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">{t.score}</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">{t.mode}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {benchmark.rankings.slice(0, 20).map((ranking, idx) => (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm text-gray-500">{idx + 1}</td>
                            <td className="py-2 px-3 text-sm font-medium text-gray-900">{ranking.name}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{ranking.developer}</td>
                            <td className="py-2 px-3 text-sm text-right font-mono font-medium text-emerald-600">
                              {ranking.score.toFixed(1)}
                            </td>
                            <td className="py-2 px-3 text-xs text-gray-500">{ranking.mode || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {benchmark.rankings.length > 20 && (
                      <p className="mt-3 text-sm text-gray-500 text-center">
                        {t.morePrefix} {benchmark.rankings.length - 20} {t.moreSuffix}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">{t.noData}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info section */}
      <div className="mt-10 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4" />
          {t.infoTitle}
        </h2>
        <p className="text-sm text-gray-600">{t.infoDesc}</p>
      </div>
    </div>
  );
}
