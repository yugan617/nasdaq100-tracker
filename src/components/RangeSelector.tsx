"use client";

import { RangeKey } from "@/lib/dateRange";

interface RangeSelectorProps {
  activeRange: RangeKey;
  onRangeChange: (range: RangeKey) => void;
  hasEventWindow: boolean;
}

const ranges: { key: RangeKey; label: string }[] = [
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "1y", label: "1Y" },
  { key: "2y", label: "2Y" },
  { key: "3y", label: "3Y" },
  { key: "all", label: "All" },
];

export default function RangeSelector({
  activeRange,
  onRangeChange,
  hasEventWindow,
}: RangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto px-1 py-1 no-scrollbar" data-testid="range-selector">
      {ranges.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onRangeChange(key)}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeRange === key
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          }`}
        >
          {label}
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
          Event Window
        </button>
      )}
    </div>
  );
}
