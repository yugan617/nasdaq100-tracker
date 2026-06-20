"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  createChart,
  createSeriesMarkers,
  IChartApi,
  ISeriesApi,
  ISeriesMarkersPluginApi,
  CandlestickData,
  Time,
  LogicalRange,
  SeriesMarker,
  CandlestickSeries,
  CandlestickSeriesPartialOptions,
} from "lightweight-charts";
import { Nasdaq100Addition } from "@/data/nasdaq100Additions";
import { OHLCData, fetchStockData } from "@/lib/marketData";
import {
  RangeKey,
  getRangeFromKey,
  getEventWindow,
  isDateInRange,
  formatDate,
  DateRange,
} from "@/lib/dateRange";
import RangeSelector from "./RangeSelector";

interface StockChartProps {
  stock: Nasdaq100Addition;
}

interface EventVisibilityResult {
  announcementVisible: boolean;
  effectiveVisible: boolean;
  removalVisible: boolean;
  allVisible: boolean;
  noneVisible: boolean;
}

function getEventVisibility(
  announcementDate: string,
  effectiveDate: string,
  visibleFrom: string,
  visibleTo: string,
  removalDate?: string
): EventVisibilityResult {
  const range: DateRange = {
    from: new Date(visibleFrom),
    to: new Date(visibleTo),
  };
  const announcementVisible = isDateInRange(announcementDate, range);
  const effectiveVisible = isDateInRange(effectiveDate, range);
  const removalVisible = removalDate ? isDateInRange(removalDate, range) : true; // no removal = not missing

  const allVisible = announcementVisible && effectiveVisible && (removalDate ? removalVisible : true);
  const noneVisible = !announcementVisible && !effectiveVisible && (!removalDate || !removalVisible);

  return { announcementVisible, effectiveVisible, removalVisible, allVisible, noneVisible };
}

function getOutOfRangeMessage(
  announcementDate: string,
  effectiveDate: string,
  visibleFrom: string,
  visibleTo: string,
  removalDate?: string
): string | null {
  const vis = getEventVisibility(
    announcementDate,
    effectiveDate,
    visibleFrom,
    visibleTo,
    removalDate
  );
  if (vis.allVisible) return null;

  const from = new Date(visibleFrom);
  const to = new Date(visibleTo);

  const missing: string[] = [];
  if (!vis.announcementVisible) missing.push("announcement");
  if (!vis.effectiveVisible) missing.push("effective date");
  if (removalDate && !vis.removalVisible) missing.push("removal date");

  if (vis.noneVisible) {
    const effDate = new Date(effectiveDate);
    const annDate = new Date(announcementDate);
    if (effDate < from) {
      return "\u2190 Nasdaq-100 events occurred before the current chart range";
    }
    if (annDate > to) {
      return "Nasdaq-100 events occur after the current chart range \u2192";
    }
    return "\u2190 Events are outside the current chart range";
  }

  // Some events visible, some not
  const label = missing.join(" and ");
  return `\u2190 Nasdaq-100 ${label} outside the current chart range`;
}

export default function StockChart({ stock }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const [rawData, setRawData] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<RangeKey>("2y");
  const [outOfRangeMsg, setOutOfRangeMsg] = useState<string | null>(null);
  const stockRef = useRef(stock);

  // Keep stockRef in sync
  useEffect(() => {
    stockRef.current = stock;
  }, [stock]);

  // Fetch data
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setRawData([]);

    fetchStockData(stock.chartSymbol, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        if (res.error) {
          setError(res.error);
        } else {
          setRawData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      });

    return () => controller.abort();
  }, [stock.chartSymbol]);

  // Compute default range: ensure at least one event date is visible
  const defaultRange = useMemo((): RangeKey => {
    const now = new Date();
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const annDate = new Date(stock.announcementDate);
    const effDate = new Date(stock.effectiveDate);

    // If either date is within 2 years, default to 2y
    if (annDate >= twoYearsAgo || effDate >= twoYearsAgo) {
      return "2y";
    }
    // Otherwise try 3y
    const threeYearsAgo = new Date(now);
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    if (annDate >= threeYearsAgo || effDate >= threeYearsAgo) {
      return "3y";
    }
    return "all";
  }, [stock.announcementDate, stock.effectiveDate]);

  // Reset range when stock changes
  useEffect(() => {
    setActiveRange(defaultRange);
  }, [defaultRange, stock.ticker]);

  // Chart data
  const chartData = useMemo((): CandlestickData[] => {
    return rawData.map((d) => ({
      time: d.date as Time,
      open: d.adjClose * (d.open / d.close),
      high: d.adjClose * (d.high / d.close),
      low: d.adjClose * (d.low / d.close),
      close: d.adjClose,
    }));
  }, [rawData]);

  // Create markers for event dates
  const markers = useMemo((): SeriesMarker<Time>[] => {
    const result: SeriesMarker<Time>[] = [];
    const dates = rawData.map((d) => d.date);
    const usedIndices = new Set<number>();

    // Find the closest trading date for announcement
    const annIdx = findClosestDate(dates, stock.announcementDate);
    if (annIdx >= 0) {
      usedIndices.add(annIdx);
      result.push({
        time: dates[annIdx] as Time,
        position: "aboveBar",
        color: "#f97316",
        shape: "arrowDown",
        text: `Announced: ${formatDate(stock.announcementDate)}`,
      });
    }

    // Find the closest trading date for effective date
    const effIdx = findClosestDate(dates, stock.effectiveDate);
    if (effIdx >= 0 && !usedIndices.has(effIdx)) {
      usedIndices.add(effIdx);
      result.push({
        time: dates[effIdx] as Time,
        position: "aboveBar",
        color: "#ef4444",
        shape: "arrowDown",
        text: `Effective: ${formatDate(stock.effectiveDate)}`,
      });
    }

    // Find the closest trading date for removal date (if applicable)
    if (stock.removalDate) {
      const remIdx = findClosestDate(dates, stock.removalDate);
      if (remIdx >= 0 && !usedIndices.has(remIdx)) {
        result.push({
          time: dates[remIdx] as Time,
          position: "aboveBar",
          color: "#a78bfa",
          shape: "arrowDown",
          text: `Removed: ${formatDate(stock.removalDate)}`,
        });
      }
    }

    return result.sort((a, b) =>
      (a.time as string).localeCompare(b.time as string)
    );
  }, [rawData, stock.announcementDate, stock.effectiveDate, stock.removalDate]);

  // Apply time range
  const applyRange = useCallback(
    (chart: IChartApi, range: RangeKey) => {
      if (!chart || chartData.length === 0) return;

      if (range === "event") {
        const eventRange = getEventWindow(
          stock.announcementDate,
          stock.effectiveDate,
          stock.removalDate
        );
        const fromStr = eventRange.from.toISOString().split("T")[0];
        const toStr = eventRange.to.toISOString().split("T")[0];
        chart.timeScale().setVisibleRange({
          from: fromStr as Time,
          to: toStr as Time,
        });
        return;
      }

      if (range === "all") {
        chart.timeScale().fitContent();
        return;
      }

      const dateRange = getRangeFromKey(range);
      if (dateRange) {
        const fromStr = dateRange.from.toISOString().split("T")[0];
        const toStr = dateRange.to.toISOString().split("T")[0];
        chart.timeScale().setVisibleRange({
          from: fromStr as Time,
          to: toStr as Time,
        });
      }
    },
    [chartData, stock.announcementDate, stock.effectiveDate, stock.removalDate]
  );

  // Check event visibility based on visible logical range
  const checkEventVisibility = useCallback(() => {
    const chart = chartRef.current;
    if (!chart || chartData.length === 0) return;

    const timeRange = chart.timeScale().getVisibleRange();
    if (!timeRange) {
      setOutOfRangeMsg(null);
      return;
    }

    const visibleFrom = timeRange.from as string;
    const visibleTo = timeRange.to as string;

    const msg = getOutOfRangeMessage(
      stockRef.current.announcementDate,
      stockRef.current.effectiveDate,
      visibleFrom,
      visibleTo,
      stockRef.current.removalDate
    );
    setOutOfRangeMsg(msg);
  }, [chartData]);

  // Create/update chart
  useEffect(() => {
    if (!containerRef.current || chartData.length === 0) return;

    // Clean up existing chart
    if (chartRef.current) {
      if (markersRef.current) {
        markersRef.current.detach();
        markersRef.current = null;
      }
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    const container = containerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      autoSize: true,
      layout: {
        background: { color: "#111827" },
        textColor: "#9ca3af",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "#4b5563", width: 1, style: 2, labelBackgroundColor: "#374151" },
        horzLine: { color: "#4b5563", width: 1, style: 2, labelBackgroundColor: "#374151" },
      },
      timeScale: {
        borderColor: "#374151",
        timeVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      handleScroll: { vertTouchDrag: false },
    });

    const candlestickOptions: CandlestickSeriesPartialOptions = {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    };

    const series = chart.addSeries(CandlestickSeries, candlestickOptions);
    series.setData(chartData);
    const markersPlugin = createSeriesMarkers(series, markers);
    markersRef.current = markersPlugin;

    chartRef.current = chart;
    seriesRef.current = series;

    // Apply range
    applyRange(chart, activeRange);

    // Subscribe to visible range changes
    chart.timeScale().subscribeVisibleLogicalRangeChange((_range: LogicalRange | null) => {
      checkEventVisibility();
    });

    // Initial check
    setTimeout(checkEventVisibility, 100);

    return () => {
      if (markersRef.current) {
        markersRef.current.detach();
        markersRef.current = null;
      }
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // We intentionally only re-create the chart when stock or data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, markers, stock.ticker]);

  // Apply range changes without recreating the chart
  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      applyRange(chartRef.current, activeRange);
      setTimeout(checkEventVisibility, 50);
    }
  }, [activeRange, applyRange, checkEventVisibility, chartData]);

  const handleRangeChange = useCallback((range: RangeKey) => {
    setActiveRange(range);
  }, []);

  const handleJumpToEvent = useCallback(() => {
    setActiveRange("event");
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 min-h-[400px]">
        <div className="text-gray-400 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading {stock.chartSymbol} data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 min-h-[400px]">
        <div className="text-center p-4">
          <div className="text-red-400 text-lg mb-2">Failed to load data</div>
          <div className="text-gray-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900" data-testid="stock-chart">
      {/* Range selector & event buttons */}
      <div className="px-4 py-2 flex flex-wrap items-center gap-2 border-b border-gray-800">
        <RangeSelector
          activeRange={activeRange}
          onRangeChange={handleRangeChange}
          hasEventWindow={true}
        />
      </div>

      {/* Out-of-range notice */}
      {outOfRangeMsg && (
        <div
          className="px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex flex-wrap items-center gap-2 text-sm"
          data-testid="out-of-range-notice"
        >
          <span className="text-yellow-400">{outOfRangeMsg}</span>
          <button
            onClick={handleJumpToEvent}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 whitespace-nowrap cursor-pointer"
            data-testid="jump-to-event-btn"
          >
            View event window
          </button>
        </div>
      )}

      {/* Chart container */}
      <div
        ref={containerRef}
        className="flex-1 min-h-[400px] sm:min-h-[500px]"
        data-testid="chart-container"
      />

      {/* Legend */}
      <div className="px-4 py-2 flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-800">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-orange-500" />
          <span className="w-1 h-1 rounded-full bg-orange-500" />
          <span>Announcement date</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-red-500" />
          <span className="w-1 h-1 rounded-full bg-red-500" />
          <span>Effective date</span>
        </div>
        {stock.removalDate && (
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-violet-400" />
            <span className="w-1 h-1 rounded-full bg-violet-400" />
            <span>Removal date</span>
          </div>
        )}
        <div className="text-gray-600">
          Adjusted prices (splits & dividends reflected)
        </div>
      </div>
    </div>
  );
}

function findClosestDate(dates: string[], target: string): number {
  if (dates.length === 0) return -1;

  // Binary search for exact or closest date
  let lo = 0;
  let hi = dates.length - 1;

  if (target <= dates[lo]) return lo;
  if (target >= dates[hi]) return hi;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (dates[mid] === target) return mid;
    if (dates[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  // lo is the first date > target, hi is the last date < target
  if (lo >= dates.length) return hi;
  if (hi < 0) return lo;

  // Return whichever is closer
  const diffLo = new Date(dates[lo]).getTime() - new Date(target).getTime();
  const diffHi = new Date(target).getTime() - new Date(dates[hi]).getTime();
  return diffLo <= diffHi ? lo : hi;
}
