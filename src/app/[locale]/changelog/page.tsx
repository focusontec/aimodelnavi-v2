import type { Metadata } from "next";
import Link from "next/link";
import { modelDetails } from "@/data/models";

export const metadata: Metadata = {
  title: "AIモデル リリース履歴 | AI Models Navi",
  description: "2026年のAIモデルリリースを時系列で追跡。GPT、Claude、Geminiなど主要モデルの発表スケジュール。",
};

interface GroupedModels {
  [month: string]: typeof modelDetails;
}

export default function ChangelogPage() {
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">AIモデル リリース履歴</h1>
      <p className="text-gray-500 mb-8">
        2026年の主要AIモデルリリースを時系列で追跡します
      </p>

      {months.map((month) => {
        const date = new Date(month + "-01");
        const label = date.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
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
                          href={`/models/${model.slug}`}
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
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{model.params}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{model.contextWindow}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{model.license}</span>
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
