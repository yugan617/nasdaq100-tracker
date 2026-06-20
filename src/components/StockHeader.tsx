"use client";

import { Nasdaq100Addition } from "@/data/nasdaq100Additions";
import { formatDate } from "@/lib/dateRange";
import WarningTooltip from "./WarningTooltip";

interface StockHeaderProps {
  stock: Nasdaq100Addition;
}

export default function StockHeader({ stock }: StockHeaderProps) {
  return (
    <div className="px-4 py-4 sm:px-6 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center flex-wrap gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {stock.ticker}
        </h1>
        {stock.warning && <WarningTooltip warning={stock.warning} />}
      </div>

      <p className="text-gray-300 text-base mt-1">{stock.companyName}</p>

      {stock.shortDescription && (
        <p className="text-gray-400 text-sm mt-1">{stock.shortDescription}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div>
          <span className="text-gray-500">Announced: </span>
          <span className="text-orange-400 font-medium">
            {formatDate(stock.announcementDate)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Effective: </span>
          <span className="text-red-400 font-medium">
            {formatDate(stock.effectiveDate)}
          </span>
        </div>
        {stock.removalDate && (
          <div>
            <span className="text-gray-500">Removed: </span>
            <span className="text-violet-400 font-medium">
              {formatDate(stock.removalDate)}
            </span>
          </div>
        )}
        <a
          href={stock.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
        >
          Nasdaq announcement &rarr;
        </a>
      </div>
    </div>
  );
}
