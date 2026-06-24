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
import AdSlot from "@/components/AdSlot";
import MobileAd from "@/components/MobileAd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, { default: string; template: string; description: string }> = {
    ja: { default: "AI Models Navi — AIモデルの比較・料金・ランキング", template: "%s — AI Models Navi", description: "AIモデルのベンチマーク比較、API料金、モデル仕様を日本語で比較。" },
    en: { default: "AI Models Navi — AI Model Comparison, Pricing & Rankings", template: "%s — AI Models Navi", description: "Compare AI model benchmarks, API pricing, and specifications." },
    ko: { default: "AI Models Navi — AI 모델 비교, 가격, 순위", template: "%s — AI Models Navi", description: "AI 모델 벤치마크, API 가격, 스펙을 한국어로 비교합니다." },
  };
  const t = titles[locale] || titles.ja;
  return {
    title: { default: t.default, template: t.template },
    description: t.description,
    metadataBase: new URL("https://aimodelsnavi.com"),
    alternates: {
      canonical: `https://aimodelsnavi.com${locale === "ja" ? "" : `/${locale}`}`,
      languages: {
        ja: "https://aimodelsnavi.com",
        en: "https://aimodelsnavi.com/en",
        ko: "https://aimodelsnavi.com/ko",
        "x-default": "https://aimodelsnavi.com",
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

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
      <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <AdSlot position="header-banner" className="w-full flex justify-center py-2" />
      <div className="flex max-w-[1400px] mx-auto">
        <main className="flex-1 min-w-0 pb-16 xl:pb-0">{children}</main>
        <AdSlot
          position="sidebar"
          className="hidden xl:block w-[160px] shrink-0 sticky top-24"
        />
      </div>
      <AdSlot position="footer-banner" className="w-full flex justify-center py-2" />
      <Footer />
      <MobileAd position="mobile-banner" />
      <LangSwitcher />
      <Analytics />
      <SpeedInsights />
    </NextIntlClientProvider>
      </body>
    </html>
  );
}
