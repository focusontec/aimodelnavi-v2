import type { Metadata } from "next";
import BlogList from "@/components/BlogList";

const T = {
  ja: { title: "ブログ", desc: "AIモデルの最新ニュース、ベンチマーク分析、料金更新、技術解説。" },
  en: { title: "Blog", desc: "Latest AI model news, benchmark analysis, pricing updates, and technical insights." },
  ko: { title: "블로그", desc: "AI 모델 최신 뉴스, 벤치마크 분석, 가격 업데이트 및 기술 인사이트." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = T[locale as keyof typeof T] || T.ja;
  return { title: t.title, description: t.desc };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = T[locale as keyof typeof T] || T.ja;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.title}</h1>
      <BlogList />
    </div>
  );
}
