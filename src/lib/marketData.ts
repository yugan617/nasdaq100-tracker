export interface OHLCData {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface StockDataResponse {
  symbol: string;
  data: OHLCData[];
  error?: string;
}

export async function fetchStockData(
  symbol: string,
  signal?: AbortSignal
): Promise<StockDataResponse> {
  const res = await fetch(
    `/api/stock?symbol=${encodeURIComponent(symbol)}`,
    { signal }
  );

  if (!res.ok) {
    const text = await res.text();
    return { symbol, data: [], error: text || `HTTP ${res.status}` };
  }

  return res.json();
}
