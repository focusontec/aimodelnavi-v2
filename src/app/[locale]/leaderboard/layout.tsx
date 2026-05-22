import type { Metadata } from "next";

const META: Record<string, { title: string; description: string; ogTitle: string; ogDesc: string }> = {
  ja: {
    title: "AIモデルランキング",
    description: "HLE、ARC-AGI-2、FrontierMath、SWE-bench Verified、τ²-Benchの統合ランキング。推論・基盤・コーディングモデル別に主要AIモデルのベンチマークスコアを比較。",
    ogTitle: "AIモデルランキング | AI Models Navi",
    ogDesc: "主要ベンチマークに基づくAIモデルの統合ランキング。HLE、ARC-AGI-2、SWE-benchなど。",
  },
  en: {
    title: "AI Model Rankings",
    description: "Comprehensive AI model rankings across HLE, ARC-AGI-2, FrontierMath, SWE-bench Verified, and τ²-Bench. Compare benchmark scores by reasoning, foundation, and coding models.",
    ogTitle: "AI Model Rankings | AI Models Navi",
    ogDesc: "Unified AI model rankings based on major benchmarks. HLE, ARC-AGI-2, SWE-bench, and more.",
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

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}