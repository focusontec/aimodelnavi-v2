"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight, Cpu, Sparkles, Globe, Code, Brain, Zap, BookOpen, BarChart3 } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  date: string;
  title_en?: string;
  excerpt_en?: string;
}

const ITEMS_PER_PAGE = 9;

// Tag color and icon configuration
const TAG_CONFIG: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "Anthropic": { gradient: "from-amber-500 to-orange-600", icon: <Cpu className="w-8 h-8" /> },
  "OpenAI": { gradient: "from-emerald-500 to-teal-600", icon: <Sparkles className="w-8 h-8" /> },
  "Google": { gradient: "from-blue-500 to-indigo-600", icon: <Globe className="w-8 h-8" /> },
  "AIエージェント": { gradient: "from-purple-500 to-violet-600", icon: <Brain className="w-8 h-8" /> },
  "解説": { gradient: "from-cyan-500 to-blue-600", icon: <BookOpen className="w-8 h-8" /> },
  "オープンソース": { gradient: "from-green-500 to-emerald-600", icon: <Code className="w-8 h-8" /> },
  "ベンチマーク": { gradient: "from-rose-500 to-pink-600", icon: <BarChart3 className="w-8 h-8" /> },
  "DeepSeek": { gradient: "from-violet-500 to-purple-600", icon: <Zap className="w-8 h-8" /> },
  "xAI": { gradient: "from-gray-500 to-slate-600", icon: <Zap className="w-8 h-8" /> },
  "フロントエア": { gradient: "from-indigo-500 to-blue-600", icon: <Cpu className="w-8 h-8" /> },
};

const DEFAULT_TAG_CONFIG = { gradient: "from-gray-400 to-gray-500", icon: <BookOpen className="w-8 h-8" /> };

function getTagConfig(tag: string) {
  return TAG_CONFIG[tag] || DEFAULT_TAG_CONFIG;
}

export default function BlogList() {
  const params = useParams();
  const locale = (params.locale as string) === "en" ? "en" : "ja";
  const isEn = locale === "en";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const url = isEn ? "/blog-manifest-en.json" : "/blog-manifest.json";
    fetch(url).then(r => r.json()).then(setPosts).catch(() => {});
  }, [isEn]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.tag, (counts.get(p.tag) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [posts]);

  const sorted = useMemo(() => {
    let result = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (selectedTag) result = result.filter(p => p.tag === selectedTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const title = (isEn ? p.title_en || p.title : p.title).toLowerCase();
        const excerpt = (isEn ? p.excerpt_en || p.excerpt : p.excerpt || "").toLowerCase();
        return title.includes(q) || excerpt.includes(q);
      });
    }
    return result;
  }, [posts, selectedTag, search, isEn]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const blogBase = isEn ? "/en/blog" : "/blog";

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          placeholder={isEn ? "Search articles..." : "記事を検索..."}
          className="w-full pl-12 pr-12 py-3 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setCurrentPage(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setSelectedTag(null); setCurrentPage(1); }}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
            selectedTag === null
              ? "bg-primary-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isEn ? "All" : "すべて"}
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => { setSelectedTag(selectedTag === tag ? null : tag); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              selectedTag === tag
                ? "bg-primary-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Article Count */}
      <div className="mb-4 text-sm text-gray-500">
        {isEn ? `${sorted.length} articles` : `${sorted.length}件の記事`}
      </div>

      {/* Blog Cards Grid */}
      {posts.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : paged.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          {isEn ? "No articles found" : "該当する記事が見つかりません"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.map(post => {
            const tagConfig = getTagConfig(post.tag);
            return (
              <Link
                key={post.slug}
                href={`${blogBase}/${post.slug}`}
                className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image / Gradient Placeholder */}
                <div className={`relative h-40 bg-gradient-to-br ${tagConfig.gradient} flex items-center justify-center`}>
                  <div className="text-white/80 group-hover:scale-110 transition-transform duration-300">
                    {tagConfig.icon}
                  </div>
                  {/* Tag Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full shadow-sm">
                    {post.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <time className="text-xs text-gray-400 mb-2 block">{post.date}</time>
                  <h2 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {isEn ? post.title_en || post.title : post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {isEn ? post.excerpt_en || post.excerpt || "" : post.excerpt || ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              {isEn ? "Prev" : "前へ"}
            </button>
          )}

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let page: number;
            if (totalPages <= 7) {
              page = i + 1;
            } else if (currentPage <= 4) {
              page = i + 1;
            } else if (currentPage >= totalPages - 3) {
              page = totalPages - 6 + i;
            } else {
              page = currentPage - 3 + i;
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              {isEn ? "Next" : "次へ"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
