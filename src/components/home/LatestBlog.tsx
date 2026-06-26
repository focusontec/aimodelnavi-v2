import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  title_en?: string;
  title_ko?: string;
  tag: string;
  tag_ko?: string;
  date: string;
  excerpt?: string;
  excerpt_en?: string;
  excerpt_ko?: string;
}

interface LatestBlogProps {
  locale: string;
  t: {
    latestBlog: string;
    viewAll: string;
  };
  posts: BlogPost[];
}

export function LatestBlog({ locale, t, posts }: LatestBlogProps) {
  const prefix = locale === "ja" ? "" : `/${locale}`;

  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t.latestBlog}</h2>
          <Link href={`${prefix}/blog`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
            {t.viewAll} <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`${prefix}/blog/${post.slug}`}
              className="shimmer-hover group p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                  {locale === "ko" ? (post.tag_ko || post.tag) : post.tag}
                </span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                {locale === "ko" ? (post.title_ko || post.title) : locale === "en" ? (post.title_en || post.title) : post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3">
                {locale === "ko" ? (post.excerpt_ko || post.excerpt || "") : locale === "en" ? (post.excerpt_en || post.excerpt || "") : (post.excerpt || "")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
