"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Coins, Search } from "lucide-react";
import { useState } from "react";

interface HeroProps {
  locale: string;
  t: {
    hero: string;
    hero2: string;
    heroSub: string;
    viewRankings: string;
    comparePricing: string;
    modelsListed: string;
    pricingData: string;
    dailyUpdate: string;
    dailyUpdateVal: string;
    searchPlaceholder: string;
  };
}

export function Hero({ locale, t }: HeroProps) {
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${prefix}/leaderboard?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="hero-fullwidth relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
      {/* Conic gradient decoration */}
      <div className="conic-deco absolute -right-20 top-1/2 -translate-y-1/2" style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            {t.hero}<br />{t.hero2}
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl leading-relaxed">
            {t.heroSub}
          </p>

          {/* Search Box — Glassmorphism */}
          <form onSubmit={handleSearch} className="mt-8 relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
            />
          </form>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`${prefix}/leaderboard`}
              className="btn-modern inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold shadow-lg"
            >
              <BarChart3 className="w-4 h-4" />
              {t.viewRankings}
            </Link>
            <Link
              href={`${prefix}/pricing`}
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold backdrop-blur-sm"
            >
              <Coins className="w-4 h-4" />
              {t.comparePricing}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { value: "292", label: t.modelsListed },
              { value: "1750+", label: t.pricingData },
              { value: t.dailyUpdateVal, label: t.dailyUpdate },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="text-2xl lg:text-3xl font-bold pulse-number">{stat.value}</div>
                <div className="text-sm text-primary-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
