"use client";

import { useState, useEffect, useCallback } from "react";
import nasdaq100Additions, {
  getAdditionByTicker,
} from "@/data/nasdaq100Additions";
import TickerList from "@/components/TickerList";
import StockHeader from "@/components/StockHeader";
import StockChart from "@/components/StockChart";

function getTickerFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "").toUpperCase();
  if (hash && getAdditionByTicker(hash)) {
    return hash;
  }
  return null;
}

export default function Home() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize from hash on mount
  useEffect(() => {
    setMounted(true);
    const hashTicker = getTickerFromHash();
    if (hashTicker) {
      setSelectedTicker(hashTicker);
    } else {
      // Default to first stock (most recent)
      const sorted = [...nasdaq100Additions].sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      );
      if (sorted.length > 0) {
        setSelectedTicker(sorted[0].ticker);
        window.location.hash = sorted[0].ticker;
      }
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const ticker = getTickerFromHash();
      if (ticker) {
        setSelectedTicker(ticker);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSelectTicker = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
    window.location.hash = ticker;
    // Collapse sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const selectedStock = selectedTicker
    ? getAdditionByTicker(selectedTicker)
    : null;

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile header with menu toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-gray-200 p-1 cursor-pointer"
          aria-label="Toggle ticker list"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-300">
          Nasdaq-100 Tracker
        </span>
        <span className="text-sm text-gray-500 font-mono">
          {selectedTicker || ""}
        </span>
      </div>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed
            ? "hidden md:flex"
            : "fixed md:relative z-40 md:z-auto inset-y-0 left-0"
        } md:flex flex-shrink-0`}
      >
        <TickerList
          selectedTicker={selectedTicker}
          onSelectTicker={handleSelectTicker}
          collapsed={false}
          onToggleCollapse={() => setSidebarCollapsed(true)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {selectedStock ? (
          <>
            <StockHeader stock={selectedStock} />
            <StockChart key={selectedStock.ticker} stock={selectedStock} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Select a stock from the sidebar</p>
              <p className="text-sm mt-1">
                {nasdaq100Additions.length} stocks added to Nasdaq-100 in the
                past 3 years
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
