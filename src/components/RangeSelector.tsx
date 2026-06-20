"use client";

import { RangeKey } from "@/lib/dateRange";
import { useT } from "@/lib/i18n";

interface RangeSelectorProps {
  activeRange: RangeKey;
  onRangeChange: (range: RangeKey) => void;
  hasEventWindow: boolean;
}

const rangeKeys: { key: RangeKey; labelKey: string }[] = [
  { key: "3m", labelKey: "range3M" },
  { key: "6m", labelKey: "range6M" },
  { key: "1y", labelKey: "range1Y" },
  { key: "2y", labelKey: "range2Y" },
  { key: "3y", labelKey: "range3Y" },
  { key: "all", labelKey: "rangeAll" },
];

export default function RangeSelector({
  activeRange,
  onRangeChange,
  hasEventWindow,
}: RangeSelectorProps) {
  const t = useT();

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-1 py-1 no-scrollbar" data-testid="range-selector">
      {rangeKeys.map(({ key, labelKey }) => (
        <button
          key={key}
          onClick={() => onRangeChange(key)}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeRange === key
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
      {hasEventWindow && (
        <button
          onClick={() => onRangeChange("event")}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeRange === "event"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-purple-400 hover:bg-gray-700 hover:text-purple-300"
          }`}
          data-testid="event-window-btn"
        >
          {t("eventWindow")}
        </button>
      )}
    </div>
  );
}
