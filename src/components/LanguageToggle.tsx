"use client";

import { useLocale } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className="px-2 py-1 text-xs font-medium rounded bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors cursor-pointer whitespace-nowrap"
      aria-label="Toggle language"
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
