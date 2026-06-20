"use client";

import { Nasdaq100Addition } from "@/data/nasdaq100Additions";
import { formatDate } from "@/lib/dateRange";
import { useT, useLocale } from "@/lib/i18n";
import WarningTooltip from "./WarningTooltip";

interface StockHeaderProps {
  stock: Nasdaq100Addition;
}

export default function StockHeader({ stock }: StockHeaderProps) {
  const t = useT();
  const { locale } = useLocale();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  const companyName = t(`name${stock.ticker}`);
  const displayName = companyName !== `name${stock.ticker}` ? companyName : stock.companyName;

  const desc = t(`desc${stock.ticker}`);
  const displayDesc = desc !== `desc${stock.ticker}` ? desc : stock.shortDescription;

  // Build localized warning if translation keys exist
  const localizedWarning = stock.warning
    ? {
        title: (() => {
          const k = t(`warning${stock.ticker}Title`);
          return k !== `warning${stock.ticker}Title` ? k : stock.warning.title;
        })(),
        description: (() => {
          const k = t(`warning${stock.ticker}Desc`);
          return k !== `warning${stock.ticker}Desc` ? k : stock.warning.description;
        })(),
      }
    : undefined;

  return (
    <div className="px-4 py-4 sm:px-6 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center flex-wrap gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {stock.ticker}
        </h1>
        {localizedWarning && <WarningTooltip warning={localizedWarning} />}
      </div>

      <p className="text-gray-300 text-base mt-1">{displayName}</p>

      {displayDesc && (
        <p className="text-gray-400 text-sm mt-1">{displayDesc}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div>
          <span className="text-gray-500">{t("announced")} </span>
          <span className="text-orange-400 font-medium">
            {formatDate(stock.announcementDate, dateLocale)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">{t("effective")} </span>
          <span className="text-red-400 font-medium">
            {formatDate(stock.effectiveDate, dateLocale)}
          </span>
        </div>
        {stock.removalDate && (
          <div>
            <span className="text-gray-500">{t("removed")} </span>
            <span className="text-violet-400 font-medium">
              {formatDate(stock.removalDate, dateLocale)}
            </span>
          </div>
        )}
        <a
          href={stock.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
        >
          {t("nasdaqAnnouncement")} &rarr;
        </a>
      </div>
    </div>
  );
}
