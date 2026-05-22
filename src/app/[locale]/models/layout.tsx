import type { Metadata } from "next";

const META: Record<string, { title: string; description: string; ogTitle: string; ogDesc: string }> = {
  ja: {
    title: "AIモデル一覧",
    description: "OpenAI、Anthropic、Google、DeepSeekなど250以上のAIモデルをパラメータ数、コンテキスト長、ライセンスで比較。オープンソースモデルや日本国産モデルも網羅。",
    ogTitle: "AIモデル一覧 | AI Models Navi",
    ogDesc: "250以上のAIモデルの仕様・ライセンス・性能概要を一覧で比較。",
  },
  en: {
    title: "AI Model List",
    description: "Compare 250+ AI models from OpenAI, Anthropic, Google, DeepSeek, and more by parameters, context window, and license. Includes open-source and Japanese models.",
    ogTitle: "AI Model List | AI Models Navi",
    ogDesc: "Compare 250+ AI model specs, licenses, and performance summaries at a glance.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] || META.ja;
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.ogTitle, description: m.ogDesc },
  };
}

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}