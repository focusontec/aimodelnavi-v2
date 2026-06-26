"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, BarChart3, Users, Lightbulb, Newspaper } from "lucide-react";
import { addModelLinks } from "@/components/ModelLinkMarkdown";

interface Props {
  summary: string;
  performance: string;
  comparisons: string;
  community: string;
  useCaseDeep: string;
  latestNews: string;
  locale: string;
}

const tabs = [
  { key: "summary", icon: BookOpen, ja: "概要", en: "Overview", ko: "개요" },
  { key: "performance", icon: BarChart3, ja: "ベンチマーク", en: "Benchmarks", ko: "벤치마크" },
  { key: "comparisons", icon: BarChart3, ja: "詳細比較", en: "Comparisons", ko: "상세 비교" },
  { key: "community", icon: Users, ja: "コミュニティ", en: "Community", ko: "커뮤니티" },
  { key: "useCases", icon: Lightbulb, ja: "ユースケース", en: "Use Cases", ko: "유스케이스" },
  { key: "news", icon: Newspaper, ja: "ニュース", en: "News", ko: "뉴스" },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function extractHeadings(content: string): string[] {
  const matches = content.match(/^###\s+(.+)$/gm);
  if (!matches) return [];
  return matches.map((m) => m.replace(/^###\s+/, ""));
}

function TableOfContents({ headings, locale }: { headings: string[]; locale: string }) {
  if (headings.length < 2) return null;
  return (
    <div className="analysis-toc">
      <p className="font-medium text-gray-700 mb-1.5">{locale === "ko" ? "목차" : locale === "en" ? "Contents" : "目次"}</p>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h}>
            <a href={`#${slugify(h)}`}>{h}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const markdownComponents = {
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="table-wrapper">
      <table {...props}>{children}</table>
    </div>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === "string" ? children : "";
    return <h3 id={slugify(text)} {...props}>{children}</h3>;
  },
};

export default function AnalysisTabs({
  summary,
  performance,
  comparisons,
  community,
  useCaseDeep,
  latestNews,
  locale,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const contents = [summary, performance, comparisons, community, useCaseDeep, latestNews];
  const linkedContents = contents.map((c) => addModelLinks(c, locale));

  return (
    <div>
      {/* Tab bar */}
      <nav className="analysis-tabs-nav" role="tablist">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const label = locale === "ko" ? tab.ko : locale === "en" ? tab.en : tab.ja;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === i}
              aria-controls={`tabpanel-${tab.key}`}
              className={`analysis-tab ${activeTab === i ? "analysis-tab-active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Tab panels */}
      <div className="pt-4">
        {/* Tab 0 (Overview): always in DOM for SEO */}
        <div
          id="tabpanel-summary"
          role="tabpanel"
          style={{ display: activeTab === 0 ? "block" : "none" }}
        >
          <div className="analysis-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {linkedContents[0]}
            </ReactMarkdown>
          </div>
        </div>

        {/* Tabs 1-5: conditionally rendered */}
        {tabs.slice(1).map((tab, i) => {
          const idx = i + 1;
          if (activeTab !== idx) return null;
          const headings = extractHeadings(contents[idx]);
          return (
            <div
              key={tab.key}
              id={`tabpanel-${tab.key}`}
              role="tabpanel"
            >
              <TableOfContents headings={headings} locale={locale} />
              <div className="analysis-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {linkedContents[idx]}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
