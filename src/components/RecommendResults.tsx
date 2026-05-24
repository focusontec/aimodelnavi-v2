"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Code, PenTool, BarChart3, Calculator, Languages, Bot, Coins, Image, Sparkles,
} from "lucide-react";
import { useCaseScenarios } from "@/data/use-case-taxonomy";
import { getRecommendations, type Recommendation } from "@/lib/recommend";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, PenTool, BarChart3, Calculator, Languages, Bot, Coins, Image,
};

const LABELS: Record<string, Record<string, string>> = {
  ja: {
    selectScenario: "用途を選択",
    whyRecommended: "おすすめ理由",
    topBenchmark: "主要ベンチマーク",
    matchedUseCases: "該当する活用例",
    viewDetail: "詳細を見る",
    noRecommendations: "該当するモデルが見つかりません",
    score: "スコア",
  },
  en: {
    selectScenario: "Select Scenario",
    whyRecommended: "Why Recommended",
    topBenchmark: "Top Benchmark",
    matchedUseCases: "Matched Use Cases",
    viewDetail: "View Details",
    noRecommendations: "No matching models found",
    score: "Score",
  },
};

export default function RecommendResults() {
  const locale = useLocale();
  const l = LABELS[locale] || LABELS.ja;
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const [selectedScenario, setSelectedScenario] = useState(useCaseScenarios[0].slug);

  const recommendations = getRecommendations(selectedScenario, locale);
  const scenario = useCaseScenarios.find((s) => s.slug === selectedScenario);

  return (
    <div>
      {/* Scenario selector */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">{l.selectScenario}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {useCaseScenarios.map((s) => {
            const Icon = iconMap[s.icon] || Sparkles;
            const isSelected = s.slug === selectedScenario;
            return (
              <button
                key={s.slug}
                onClick={() => setSelectedScenario(s.slug)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-primary-600"}`} />
                <span>{locale === "ja" ? s.titleJa : s.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario description */}
      {scenario && (
        <p className="text-gray-600 mb-6">
          {locale === "ja" ? scenario.descriptionJa : scenario.descriptionEn}
        </p>
      )}

      {/* Results */}
      {recommendations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{l.noRecommendations}</div>
      ) : (
        <div className="grid gap-4">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.model.slug} rec={rec} rank={i + 1} l={l} prefix={prefix} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({
  rec,
  rank,
  l,
  prefix,
}: {
  rec: Recommendation;
  rank: number;
  l: Record<string, string>;
  prefix: string;
}) {
  const locale = useLocale();
  const benchmarkLabel: Record<string, string> = {
    sweBenchVerified: "SWE-bench Verified",
    liveCodeBench: "LiveCodeBench",
    aiderPolyglot: "Aider-Polyglot",
    sweBenchPro: "SWE-bench Pro",
    elo: "LMArena Elo",
    mmluPro: "MMLU-Pro",
    gpqaDiamond: "GPQA Diamond",
    aime2025: "AIME 2025",
    aime2026: "AIME 2026",
    frontierMath: "FrontierMath",
    math500: "MATH-500",
    tauBench: "τ²-Bench",
    terminalBench: "Terminal Bench",
    hle: "HLE",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              #{rank}
            </span>
            <Link
              href={`${prefix}/models/${rec.model.slug}`}
              className="text-lg font-bold text-gray-900 hover:text-primary-600 truncate"
            >
              {rec.model.name}
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {locale === "en" ? (rec.model.developerEn || rec.model.developer) : rec.model.developer}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500">{l.score}:</span>
            <span className="text-sm font-bold text-primary-700">{rec.score}</span>
          </div>

          {rec.topBenchmark && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500">{l.topBenchmark}:</span>
              <span className="text-sm text-gray-700">
                {benchmarkLabel[rec.topBenchmark.key] || rec.topBenchmark.key}{" "}
                <span className="font-bold">{rec.topBenchmark.score}</span>
              </span>
            </div>
          )}

          {rec.matchedUseCases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs font-semibold text-gray-500">{l.matchedUseCases}:</span>
              {(locale === "en" ? rec.matchedUseCasesEn : rec.matchedUseCases).slice(0, 3).map((uc) => (
                <span key={uc} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {uc}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`${prefix}/models/${rec.model.slug}`}
          className="shrink-0 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg px-3 py-1.5 hover:bg-primary-50 transition-colors"
        >
          {l.viewDetail}
        </Link>
      </div>
    </div>
  );
}
