'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { modelDetails } from '@/data/models';

const ITEMS_PER_PAGE = 30;

const T = {
  ja: {
    title: "モデル一覧",
    desc: "主要AIモデルの仕様・ライセンス・性能概要を一覧で比較できます。",
    search: "モデル名・開発元で検索...",
    license: "ライセンス:",
    all: "すべて",
    openSource: "オープンソース",
    conditional: "条件付オープン",
    proprietary: "プロプライエタリ",
    region: "地域:",
    allRegions: "全地域",
    domestic: "🇯🇵 国産",
    global: "🌍 グローバル",
    count: "件",
    noResults: "該当するモデルが見つかりません",
    modelName: "モデル名",
    developer: "開発元",
    params: "パラメータ",
    contextWindow: "コンテキスト長",
  },
  en: {
    title: "Model List",
    desc: "Compare specifications, licenses, and performance summaries of major AI models.",
    search: "Search by model name or developer...",
    license: "License:",
    all: "All",
    openSource: "Open Source",
    conditional: "Conditional",
    proprietary: "Proprietary",
    region: "Region:",
    allRegions: "All Regions",
    domestic: "🇯🇵 Domestic",
    global: "🌍 Global",
    count: "models",
    noResults: "No matching models found",
    modelName: "Model",
    developer: "Developer",
    params: "Parameters",
    contextWindow: "Context",
  },
};

const sourceLabelsJa: Record<string, string> = {
  open: 'オープンソース',
  'open-nc': '条件付オープン',
  closed: 'プロプライエタリ',
};

const sourceLabelsEn: Record<string, string> = {
  open: 'Open Source',
  'open-nc': 'Conditional',
  closed: 'Proprietary',
};

const sourceBadgeColors: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700',
  'open-nc': 'bg-amber-50 text-amber-700',
  closed: 'bg-gray-100 text-gray-600',
};

// Translate Japanese data values to English for EN locale
function tv(value: string, locale: string): string {
  if (locale !== "en") return value;
  const map: Record<string, string> = {
    "非公開": "Undisclosed",
  };
  return map[value] || value;
}

export default function ModelsPage() {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;
  const sourceLabels = locale === "en" ? sourceLabelsEn : sourceLabelsJa;

  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return modelDetails.filter((m) => {
      if (filterSource !== 'all' && m.openSource !== filterSource) return false;
      if (filterRegion === 'jp') {
        const jpDevs = ['Preferred Networks', 'Sakana AI', 'ELYZA', 'rinna', 'NTT', '富士通'];
        if (!jpDevs.includes(m.developer)) return false;
      }
      if (filterRegion === 'global') {
        const jpDevs = ['Preferred Networks', 'Sakana AI', 'ELYZA', 'rinna', 'NTT', '富士通'];
        if (jpDevs.includes(m.developer)) return false;
      }
      if (q) {
        return (
          m.name.toLowerCase().includes(q) ||
          m.developer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filterSource, filterRegion, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const displayModels = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  const handleFilterChange = (type: 'source' | 'region', value: string) => {
    setPage(1);
    if (type === 'source') setFilterSource(value);
    else setFilterRegion(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.desc}</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t.search}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">{t.license}</span>
          {['all', 'open', 'open-nc', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange('source', s)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterSource === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? t.all : sourceLabels[s]}
            </button>
          ))}
          <span className="text-xs text-gray-300 mx-1">|</span>
          <span className="text-xs text-gray-400 mr-1">{t.region}</span>
          {['all', 'global', 'jp'].map((r) => (
            <button
              key={r}
              onClick={() => handleFilterChange('region', r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterRegion === r
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 'all' ? t.allRegions : r === 'jp' ? t.domestic : t.global}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} {t.count}
          </span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_90px_100px_90px_40px] gap-3 px-4 py-2.5 bg-gray-50 text-xs font-medium text-gray-500 border-b border-gray-200">
          <span>{t.modelName}</span>
          <span>{t.developer}</span>
          <span>{t.params}</span>
          <span>{t.contextWindow}</span>
          <span>{t.license}</span>
          <span />
        </div>

        {displayModels.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">
            {t.noResults}
          </div>
        ) : (
          displayModels.map((model, i) => (
            <Link
              key={model.slug}
              href={`/${locale === "ja" ? "" : locale + "/"}models/${model.slug}`}
              className={`grid sm:grid-cols-[1fr_120px_90px_100px_90px_40px] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${
                i < displayModels.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="sm:min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {model.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 sm:hidden">
                  {model.developer} · {tv(model.params, locale)}
                </div>
              </div>
              <div className="hidden sm:block text-xs text-gray-600 truncate">{model.developer}</div>
              <div className="hidden sm:block text-xs text-gray-600 truncate">{tv(model.params, locale)}</div>
              <div className="hidden sm:block text-xs text-gray-600 truncate">{model.contextWindow}</div>
              <div className="hidden sm:block">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${sourceBadgeColors[model.openSource]}`}>
                  {sourceLabels[model.openSource]}
                </span>
              </div>
              <div className="flex justify-end">
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(p - safePage) <= 1) return true;
              return false;
            })
            .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
              if (idx > 0) {
                const prev = arr[idx - 1];
                if (p - prev > 1) acc.push('ellipsis');
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`e-${idx}`} className="px-2 text-gray-300 text-xs">...</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                    safePage === item
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
