"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BarChart3, Users, Lightbulb, Newspaper, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Analysis {
  summary: string;
  performance: string;
  comparisons: string;
  community: string;
  useCaseDeep: string;
  latestNews: string;
  sources: { title: string; url: string }[];
  generatedAt: string;
}

interface Props {
  analysis: Analysis;
  locale: string;
}

function Section({ title, icon, content, defaultOpen = false }: {
  title: string; icon: React.ReactNode; content: string; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          {icon} {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 py-4 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default function ModelAnalysisSection({ analysis, locale }: Props) {
  const labels = locale === "en" ? {
    title: "Deep Analysis",
    summary: "Overview",
    performance: "Benchmarks & Performance",
    comparisons: "Competitor Comparison",
    community: "Community Feedback",
    useCases: "Use Cases",
    news: "Latest News",
    sources: "Sources",
    generated: "Analysis generated",
  } : {
    title: "深度分析",
    summary: "概要",
    performance: "ベンチマーク＆性能",
    comparisons: "競合比較",
    community: "コミュニティ評価",
    useCases: "ユースケース",
    news: "最新ニュース",
    sources: "出典",
    generated: "分析生成日",
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{labels.title}</h2>
      <div className="space-y-3">
        <Section
          title={labels.summary}
          icon={<BookOpen className="w-4 h-4" />}
          content={analysis.summary}
          defaultOpen={true}
        />
        <Section
          title={labels.performance}
          icon={<BarChart3 className="w-4 h-4" />}
          content={analysis.performance}
        />
        <Section
          title={labels.comparisons}
          icon={<BarChart3 className="w-4 h-4" />}
          content={analysis.comparisons}
        />
        <Section
          title={labels.community}
          icon={<Users className="w-4 h-4" />}
          content={analysis.community}
        />
        <Section
          title={labels.useCases}
          icon={<Lightbulb className="w-4 h-4" />}
          content={analysis.useCaseDeep}
        />
        <Section
          title={labels.news}
          icon={<Newspaper className="w-4 h-4" />}
          content={analysis.latestNews}
        />
      </div>

      {analysis.sources.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{labels.sources}</h3>
          <ul className="space-y-1">
            {analysis.sources.map((s, i) => (
              <li key={i} className="text-xs text-gray-500">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 underline">
                  {s.title || s.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        {labels.generated}: {analysis.generatedAt?.slice(0, 10)}
      </p>
    </div>
  );
}
