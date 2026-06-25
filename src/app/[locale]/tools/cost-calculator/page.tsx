import type { Metadata } from "next";
import Client from "./client";

const META = {
  ja: { title: "AI APIコスト計算機", desc: "AIモデルのAPI使用量から月額コストを自動計算。最適なモデルを選択。" },
  en: { title: "AI API Cost Calculator", desc: "Calculate monthly API costs from usage. Find the best model for your budget." },
  ko: { title: "AI API 비용 계산기", desc: "AI 모델의 API 사용량에서 월간 비용을 자동 계산합니다. 예산에 맞는 모델을 찾아보세요." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale as keyof typeof META] || META.ja;
  return {
    title: m.title,
    description: m.desc,
    alternates: {
      canonical: `https://aimodelsnavi.com${locale === "ja" ? "" : `/${locale}`}/tools/cost-calculator`,
      languages: { ja: "https://aimodelsnavi.com/tools/cost-calculator", en: "https://aimodelsnavi.com/en/tools/cost-calculator", ko: "https://aimodelsnavi.com/ko/tools/cost-calculator", "x-default": "https://aimodelsnavi.com/tools/cost-calculator" },
    },
  };
}

export default function Page() {
  return <Client />;
}
