import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({
  suppressNotices: ["ripHistorical"],
});

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface ChartQuote {
  date: Date;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  close?: number | null;
  adjclose?: number | null;
  volume?: number | null;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { error: "Missing symbol parameter" },
      { status: 400 }
    );
  }

  const cacheKey = symbol.toUpperCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch up to 10 years of data using chart() API
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10);

    const result = await yf.chart(symbol, {
      period1: startDate.toISOString().split("T")[0],
      period2: endDate.toISOString().split("T")[0],
      interval: "1d",
    });

    const quotes = (result?.quotes || []) as ChartQuote[];

    if (quotes.length === 0) {
      return NextResponse.json(
        { symbol, data: [], error: "No data available" },
        { status: 404 }
      );
    }

    const data = quotes
      .filter(
        (row: ChartQuote) =>
          row.close != null &&
          row.close !== 0 &&
          row.date != null
      )
      .map((row: ChartQuote) => {
        const close = row.close!;
        const adjClose = row.adjclose != null ? row.adjclose : close;
        return {
          date: row.date.toISOString().split("T")[0],
          open: row.open ?? close,
          high: row.high ?? close,
          low: row.low ?? close,
          close,
          adjClose,
          volume: row.volume ?? 0,
        };
      })
      .sort(
        (a: { date: string }, b: { date: string }) =>
          a.date.localeCompare(b.date)
      );

    const response = { symbol, data };
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { symbol, data: [], error: message },
      { status: 500 }
    );
  }
}
