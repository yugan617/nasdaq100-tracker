"use client";

import { useState, useMemo } from "react";
import nasdaq100Additions, {
  Nasdaq100Addition,
  getAdditionYears,
} from "@/data/nasdaq100Additions";
import { formatDate } from "@/lib/dateRange";
import { useT, useLocale } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";

interface TickerListProps {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function TickerList({
  selectedTicker,
  onSelectTicker,
  collapsed,
  onToggleCollapse,
}: TickerListProps) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const t = useT();
  const { locale } = useLocale();

  const years = useMemo(() => getAdditionYears(), []);

  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  const filtered = useMemo(() => {
    let items = [...nasdaq100Additions];

    if (yearFilter !== null) {
      items = items.filter(
        (a) => new Date(a.effectiveDate).getFullYear() === yearFilter
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (a) =>
          a.ticker.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q)
      );
    }

    // Sort by effective date descending (most recent first)
    items.sort(
      (a, b) =>
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime()
    );

    return items;
  }, [search, yearFilter]);

  return (
    <aside
      className={`bg-gray-950 border-r border-gray-800 flex flex-col transition-all ${
        collapsed ? "w-0 overflow-hidden" : "w-full md:w-72 lg:w-80"
      }`}
      data-testid="ticker-list"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            {t("tickerListTitle")}
          </h2>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block">
              <LanguageToggle />
            </span>
            <button
              onClick={onToggleCollapse}
              className="md:hidden text-gray-500 hover:text-gray-300 p-1 cursor-pointer"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500"
          data-testid="ticker-search"
        />

        {/* Year filter */}
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            onClick={() => setYearFilter(null)}
            className={`px-2 py-0.5 text-xs rounded cursor-pointer ${
              yearFilter === null
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t("filterAll")}
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setYearFilter(year)}
              className={`px-2 py-0.5 text-xs rounded cursor-pointer ${
                yearFilter === year
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-600 mt-2">
          {filtered.length} {filtered.length !== 1 ? t("stocksCount") : t("stockCount")}
        </div>
      </div>

      {/* Ticker list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((stock) => (
          <TickerItem
            key={stock.ticker + stock.effectiveDate}
            stock={stock}
            selected={selectedTicker === stock.ticker}
            onClick={() => onSelectTicker(stock.ticker)}
            dateLocale={dateLocale}
            t={t}
          />
        ))}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-gray-600 text-sm">
            {t("noMatchingStocks")}
          </div>
        )}
      </div>
    </aside>
  );
}

function TickerItem({
  stock,
  selected,
  onClick,
  dateLocale,
  t,
}: {
  stock: Nasdaq100Addition;
  selected: boolean;
  onClick: () => void;
  dateLocale: string;
  t: (key: string) => string;
}) {
  const companyName = t(`name${stock.ticker}`);
  const displayName = companyName !== `name${stock.ticker}` ? companyName : stock.companyName;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 border-b border-gray-800/50 transition-colors cursor-pointer ${
        selected
          ? "bg-blue-900/40 border-l-2 border-l-blue-500"
          : "hover:bg-gray-900/50 border-l-2 border-l-transparent"
      }`}
      data-testid={`ticker-item-${stock.ticker}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-mono font-bold text-sm ${
            selected ? "text-blue-300" : "text-gray-200"
          }`}
        >
          {stock.ticker}
        </span>
        {stock.warning && (
          <span className="text-amber-500 text-xs">&#9888;</span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-0.5 truncate">
        {displayName}
      </div>
      <div className="text-xs text-gray-600 mt-0.5">
        {formatDate(stock.effectiveDate, dateLocale)}
      </div>
    </button>
  );
}
