import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LangSwitcher from "@/components/LangSwitcher";

const SITE_TITLES: Record<string, string> = {
  ja: "AI Models Navi — AIモデルの比較・料金・ランキング",
  en: "AI Models Navi — AI Model Comparison, Pricing & Rankings",
  zh: "AI Models Navi — AI模型对比、定价与排名",
  ko: "AI Models Navi — AI 모델 비교, 가격 및 순위",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: SITE_TITLES[locale] || SITE_TITLES.ja,
    description: "Compare AI model benchmarks, API pricing, and specifications.",
    metadataBase: new URL("https://aimodelsnavi.com"),
    alternates: {
      canonical: "https://aimodelsnavi.com",
      languages: {
        ja: "https://aimodelsnavi.com",
        en: "https://aimodelsnavi.com/en",
        zh: "https://aimodelsnavi.com/zh",
        ko: "https://aimodelsnavi.com/ko",
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LangSwitcher />
      <Analytics />
      <SpeedInsights />
    </NextIntlClientProvider>
  );
}
