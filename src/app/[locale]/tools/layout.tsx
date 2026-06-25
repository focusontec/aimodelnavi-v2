import type { Metadata } from "next";

const TOOL_META: Record<string, { ja: { title: string; desc: string }; en: { title: string; desc: string }; ko: { title: string; desc: string } }> = {
  "token-counter": {
    ja: { title: "トークンカウンター＆プロンプトコスト計算機", desc: "AIプロンプトのトークン数をカウントし、APIコストを推定。GPT・Claude・Geminiの料金比較。" },
    en: { title: "AI Token Counter & Prompt Cost Calculator", desc: "Count AI prompt tokens, estimate API costs, and compare pricing across GPT, Claude, Gemini, DeepSeek." },
    ko: { title: "토큰 카운터 & 프롬프트 비용 계산기", desc: "AI 프롬프트의 토큰 수를 계산하고 API 비용을 추정. GPT·Claude·Gemini 가격 비교." },
  },
  "cost-calculator": {
    ja: { title: "AI APIコスト計算機", desc: "AIモデルのAPI使用量から月額コストを自動計算。最適なモデルを選択。" },
    en: { title: "AI API Cost Calculator", desc: "Calculate monthly API costs from usage. Find the best model for your budget." },
    ko: { title: "AI API 비용 계산기", desc: "AI 모델의 API 사용량에서 월간 비용을 자동 계산. 최적의 모델 선택." },
  },
  "model-recommender": {
    ja: { title: "AIモデル推薦", desc: "4つの質問に答えて最適なAIモデルを見つけましょう。" },
    en: { title: "AI Model Recommender", desc: "Answer 4 questions to find the perfect AI model for your needs." },
    ko: { title: "AI 모델 추천", desc: "4가지 질문에 답하여 최적의 AI 모델을 찾아보세요." },
  },
  "context-visualizer": {
    ja: { title: "コンテキストウィンドウ比較", desc: "AIモデルのコンテキストウィンドウサイズを視覚的に比較。" },
    en: { title: "AI Context Window Visualizer", desc: "Visually compare context window sizes across AI models." },
    ko: { title: "컨텍스트 윈도우 비교", desc: "AI 모델의 컨텍스트 윈도우 크기를 시각적으로 비교." },
  },
  "usage-analyzer": {
    ja: { title: "API使用パターン分析", desc: "API使用ログを分析してコスト最適化の提案を受けましょう。" },
    en: { title: "API Usage Pattern Analyzer", desc: "Analyze API usage logs to get cost optimization recommendations." },
    ko: { title: "API 사용 패턴 분석", desc: "API 사용 로그를 분석하여 비용 최적화 제안을 받으세요." },
  },
};

const DEFAULT_META = {
  ja: { title: "AIモデル無料ツール", desc: "AIモデル選定のための無料ツール：コスト計算機、トークンカウンター、モデル比較。" },
  en: { title: "Free AI Model Tools", desc: "Free tools for AI model selection: cost calculator, token counter, model comparison." },
  ko: { title: "AI 모델 무료 도구", desc: "AI 모델 선정을 위한 무료 도구: 비용 계산기, 토큰 카운터, 모델 비교." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug?: string }> }): Promise<Metadata> {
  const { locale, slug: toolSlug } = await params;
  const localeKey = locale as "ja" | "en" | "ko";
  const meta = (toolSlug && TOOL_META[toolSlug]?.[localeKey]) || DEFAULT_META[localeKey] || DEFAULT_META.ja;

  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `https://aimodelsnavi.com${locale === "ja" ? "" : `/${locale}`}/tools${toolSlug ? `/${toolSlug}` : ""}`,
    },
  };
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
