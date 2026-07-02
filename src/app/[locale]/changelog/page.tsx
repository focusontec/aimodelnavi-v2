import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { modelDetails } from "@/data/models";

const T = {
  ja: {
    title: "AIモデル リリース履歴",
    description: "2026年のAIモデルリリースを時系列で追跡。GPT、Claude、Geminiなど主要モデルの発表スケジュール。",
    subtitle: "2026年の主要AIモデルリリースを時系列で追跡します",
  },
  en: {
    title: "AI Model Release History",
    description: "Track AI model releases over time. GPT, Claude, Gemini and other major model announcements.",
    subtitle: "Track major AI model releases in 2026 over time",
  },
  ko: {
    title: "AI 모델 출시 이력",
    description: "GPT, Claude, Gemini 등 주요 모델 발표 일정을 시간순으로 추적합니다.",
    subtitle: "2026년 주요 AI 모델 출시를 시간순으로 추적합니다",
  },
};

const licenseEn: Record<string, string> = {
  "プロプライエタリ": "Proprietary", "オープンソース": "Open Source", "条件付オープン": "Conditional Open",
};
const licenseKo: Record<string, string> = {
  "プロプライエタリ": "독점", "オープンソース": "오픈소스", "条件付オープン": "조건부 오픈",
};
const paramsEn: Record<string, string> = { "非公開": "Undisclosed" };
const paramsKo: Record<string, string> = { "非公開": "비공개" };

const localeFormats: Record<string, string> = {
  ja: "ja-JP",
  en: "en-US",
  ko: "ko-KR",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = T[locale as keyof typeof T] || T.ja;
  return {
    title: `${t.title} | AI Models Navi`,
    description: t.description,
  };
}

interface GroupedModels {
  [month: string]: typeof modelDetails;
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = T[locale as keyof typeof T] || T.ja;
  const prefix = locale === "ja" ? "" : `/${locale}`;

  const sorted = [...modelDetails]
    .filter((m) => m.releaseDate)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

  const grouped: GroupedModels = {};
  for (const model of sorted) {
    const month = model.releaseDate.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(model);
  }

  const months = Object.keys(grouped);
  const loc = localeFormats[locale] || "ja-JP";

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
      <p className="text-gray-500 mb-8">{t.subtitle}</p>

      {months.map((month) => {
        const date = new Date(month + "-01");
        const label = date.toLocaleDateString(loc, { year: "numeric", month: "long" });
        return (
          <section key={month} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              {label}
            </h2>
            <div className="relative border-l-2 border-gray-200 ml-2 space-y-6">
              {grouped[month].map((model) => (
                <div key={model.slug} className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`${prefix}/models/${model.slug}`}
                          className="text-lg font-medium text-blue-600 hover:underline"
                        >
                          {model.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{model.developer}</p>
                      </div>
                      <time className="text-sm text-gray-400 whitespace-nowrap">
                        {model.releaseDate}
                      </time>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{locale === "en" ? (paramsEn[model.params] || model.params) : locale === "ko" ? (paramsKo[model.params] || model.params) : model.params}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{model.contextWindow}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{locale === "en" ? (licenseEn[model.license] || model.license) : locale === "ko" ? (licenseKo[model.license] || model.license) : model.license}</span>
                      {model.pricing && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded">
                          ${model.pricing.inputPer1M}/M in
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
