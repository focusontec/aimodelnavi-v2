import type { Metadata } from "next";

const META: Record<string, { title: string; description: string; ogTitle: string; ogDesc: string }> = {
  ja: {
    title: "API料金比較",
    description: "OpenAI、Anthropic、Google DeepMind、DeepSeek、xAIなど主要プロバイダーのAPI料金を1Mトークンあたりで比較。標準・バッチ・キャッシュ各モードの料金一覧。",
    ogTitle: "API料金比較 | AI Models Navi",
    ogDesc: "主要AIプロバイダーのAPI料金を1Mトークン単位で比較。標準・バッチ・キャッシュモード対応。",
  },
  en: {
    title: "API Pricing Comparison",
    description: "Compare API pricing per 1M tokens from OpenAI, Anthropic, Google DeepMind, DeepSeek, xAI, and more. Standard, batch, and cache pricing modes.",
    ogTitle: "API Pricing Comparison | AI Models Navi",
    ogDesc: "Compare API pricing from major AI providers per 1M tokens. Standard, batch, and cache modes.",
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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}