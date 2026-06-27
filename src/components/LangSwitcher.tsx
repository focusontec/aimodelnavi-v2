"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
];

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchTo(targetLocale: string) {
    // Set NEXT_LOCALE cookie so middleware respects the new locale
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Get clean path by stripping any locale prefix from pathname
    let cleanPath = pathname.replace(/^\/(?:ja|en|ko)(?=\/|$)/, "") || "/";
    // Build target URL: default locale (ja) has no prefix, others get /xx prefix
    const newPath = targetLocale === "ja" ? cleanPath : `/${targetLocale}${cleanPath}`;
    window.location.href = newPath;
  }

  const currentLang = LANGUAGES.find((l) => l.code === locale);

  return (
    <div ref={ref} className="fixed bottom-16 sm:bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm text-gray-700"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang?.label || locale}</span>
      </button>
      {open && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchTo(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                lang.code === locale ? "font-semibold text-primary-600" : "text-gray-700"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
