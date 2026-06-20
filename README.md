# Nasdaq-100 Additions Tracker

Interactive visualization of stocks added to the Nasdaq-100 index over the past 3 years. Features candlestick charts with event markers showing announcement and effective dates for each addition.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run test         # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
npm run lint         # Run ESLint
```

## Data Source

**Stock data:** [Yahoo Finance](https://finance.yahoo.com/) via the `yahoo-finance2` npm package. Data is fetched server-side through a Next.js API route (`/api/stock`) with a 5-minute in-memory cache. No API key is required.

**Nasdaq-100 additions data:** Manually researched and verified from official Nasdaq press releases. See `src/data/nasdaq100Additions.ts` for the complete dataset with source URLs.

## Stocks Tracked (24 total)

### December 2023 Annual Reconstitution
| Ticker | Company | Announced | Effective | Notes |
|--------|---------|-----------|-----------|-------|
| CDW | CDW Corporation | 2023-12-08 | 2023-12-18 | Removed Dec 2025 |
| CCEP | Coca-Cola Europacific Partners | 2023-12-08 | 2023-12-18 | |
| DASH | DoorDash | 2023-12-08 | 2023-12-18 | |
| MDB | MongoDB | 2023-12-08 | 2023-12-18 | |
| ROP | Roper Technologies | 2023-12-08 | 2023-12-18 | |
| SPLK | Splunk | 2023-12-08 | 2023-12-18 | Acquired by Cisco Mar 2024 |
| TTWO | Take-Two Interactive | 2023-12-12 | 2023-12-18 | Added in update |

### 2024 Special Reconstitutions
| Ticker | Company | Announced | Effective | Notes |
|--------|---------|-----------|-----------|-------|
| LIN | Linde plc | 2024-03-08 | 2024-03-18 | Replaced SPLK |
| ARM | Arm Holdings | 2024-06-13 | 2024-06-24 | Replaced SIRI; IPO Sep 2023 |
| SMCI | Super Micro Computer | 2024-07-12 | 2024-07-22 | Removed Dec 2024 |

### December 2024 Annual Reconstitution
| Ticker | Company | Announced | Effective | Notes |
|--------|---------|-----------|-----------|-------|
| PLTR | Palantir Technologies | 2024-12-13 | 2024-12-23 | |
| MSTR | Strategy Inc. (MicroStrategy) | 2024-12-13 | 2024-12-23 | 10:1 split Aug 2024 |
| AXON | Axon Enterprise | 2024-12-13 | 2024-12-23 | |

### December 2025 Annual Reconstitution
| Ticker | Company | Announced | Effective | Notes |
|--------|---------|-----------|-----------|-------|
| ALNY | Alnylam Pharmaceuticals | 2025-12-12 | 2025-12-22 | |
| FER | Ferrovial SE | 2025-12-12 | 2025-12-22 | |
| INSM | Insmed | 2025-12-12 | 2025-12-22 | Removed Jun 2026 |
| MPWR | Monolithic Power Systems | 2025-12-12 | 2025-12-22 | |
| STX | Seagate Technology | 2025-12-12 | 2025-12-22 | |
| WDC | Western Digital | 2025-12-12 | 2025-12-22 | |

### June 2026 Quarterly Rebalance
| Ticker | Company | Announced | Effective | Notes |
|--------|---------|-----------|-----------|-------|
| ALAB | Astera Labs | 2026-06-11 | 2026-06-22 | |
| CRWV | CoreWeave | 2026-06-11 | 2026-06-22 | Recent IPO |
| NBIS | Nebius Group | 2026-06-11 | 2026-06-22 | Formerly Yandex |
| RKLB | Rocket Lab | 2026-06-11 | 2026-06-22 | |
| TER | Teradyne | 2026-06-11 | 2026-06-22 | |

## Official Source Links

- [Dec 2023 Reconstitution](https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08)
- [Dec 2023 Update (TTWO)](https://ir.nasdaq.com/news-releases/news-release-details/update-annual-changes-nasdaq-100r-index)
- [Linde Mar 2024](https://www.nasdaq.com/press-release/linde-plc-to-join-the-nasdaq-100-indexr-beginning-march-18-2024-2024-03-08)
- [ARM Jun 2024](https://www.nasdaq.com/press-release/arm-holdings-plc-join-nasdaq-100-indexr-beginning-june-24-2024-2024-06-13)
- [SMCI Jul 2024](https://www.nasdaq.com/press-release/super-micro-computer-inc-join-nasdaq-100-indexr-beginning-july-22-2024-2024-07-12)
- [Dec 2024 Reconstitution](https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2024-12-13)
- [Dec 2025 Reconstitution](https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13)
- [Jun 2026 Quarterly Changes](https://www.nasdaq.com/press-release/nasdaq-100-indexr-june-2026-quarterly-changes-2026-06-12)

## Architecture

- **Framework:** Next.js 16 with App Router
- **Chart library:** TradingView Lightweight Charts v5
- **Styling:** Tailwind CSS v4
- **Market data:** yahoo-finance2 (server-side, no API key needed)
- **Unit tests:** Vitest
- **E2E tests:** Playwright

### Key directories

```
src/
  app/
    api/stock/route.ts    # Market data API endpoint
    page.tsx              # Main page with hash routing
    layout.tsx            # Root layout
  components/
    TickerList.tsx         # Sidebar with search/filter
    StockHeader.tsx        # Company info + dates
    StockChart.tsx         # Candlestick chart with event markers
    RangeSelector.tsx      # Time range buttons
    WarningTooltip.tsx     # Warning icon + tooltip
  data/
    nasdaq100Additions.ts  # All 24 stocks with verified data
  lib/
    dateRange.ts           # Date range utilities
    marketData.ts          # Client-side data fetching
e2e/
  app.spec.ts             # Playwright E2E tests
```

## Chart Features

- Candlestick chart using adjusted prices (splits and dividends reflected)
- Two event markers per stock: announcement date (orange) and effective date (red)
- Time range buttons: 3M, 6M, 1Y, 2Y, 3Y, All, Event Window
- When events are outside the visible chart range, a notice appears with a "View event window" button
- Crosshair with date and price on hover
- Drag and zoom support
- Responsive layout for desktop and mobile

## Warning Icons

Stocks with special circumstances display a warning icon:

| Ticker | Reason |
|--------|--------|
| CDW | Removed from Nasdaq-100 in Dec 2025 |
| SPLK | Acquired by Cisco, delisted Mar 2024 |
| ARM | IPO Sep 2023, limited history |
| SMCI | Removed from Nasdaq-100 in Dec 2024 |
| MSTR | 10:1 stock split Aug 2024, renamed to Strategy Inc. |
| INSM | Removed from Nasdaq-100 in Jun 2026 |
| CRWV | Recently IPO'd, limited history |
| NBIS | Formerly part of Yandex, ticker history may differ |

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect this repository to [Vercel](https://vercel.com) for automatic deployments.

No environment variables are required. The Yahoo Finance data is fetched server-side without an API key.

## Known Limitations

1. **Yahoo Finance dependency:** The `yahoo-finance2` package uses Yahoo Finance's unofficial API which may change without notice. If data stops loading, check for package updates.
2. **SPLK historical data:** Splunk was acquired by Cisco in March 2024 and delisted. Historical data ends at that date.
3. **Recently IPO'd stocks:** ARM, CRWV, NBIS, and ALAB have limited price history.
4. **Rate limiting:** The API route uses a 5-minute in-memory cache. High traffic may require adding persistent caching (Redis, etc.).
5. **No real-time data:** Prices are updated with end-of-day data, not real-time quotes.
6. **Event markers use closest trading day:** If the announcement or effective date falls on a weekend/holiday, the marker appears on the nearest trading day.
