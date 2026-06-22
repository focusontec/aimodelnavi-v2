import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Model {
  name: string;
  highlight: string;
  slug: string;
}

interface PopularModelsProps {
  locale: string;
  t: {
    popularModels: string;
    viewAll: string;
  };
  models: Model[];
}

export function PopularModels({ locale, t, models }: PopularModelsProps) {
  const prefix = locale === "ja" ? "" : `/${locale}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t.popularModels}</h2>
        <Link href={`${prefix}/leaderboard`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
          {t.viewAll} <ArrowRight className="w-4 h-4 inline" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {models.map((model) => (
          <Link
            key={model.slug}
            href={`${prefix}/models/${model.slug}`}
            className="glow-border group p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all"
          >
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
              {model.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{model.highlight}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
