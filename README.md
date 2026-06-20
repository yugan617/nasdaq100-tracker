# Nasdaq-100 Additions Tracker

Interactive visualization of stocks added to the Nasdaq-100 index, featuring candlestick charts with event markers for announcement, effective, and removal dates.

纳斯达克100指数新增成分股的交互式可视化工具，提供K线图表并标注公告日期、生效日期和剔除日期等关键事件。

**Live Demo / 在线演示:** [nasdaq100-tracker-ashy.vercel.app](https://nasdaq100-tracker-ashy.vercel.app)

---

## Features / 功能特点

- **Candlestick Charts** — Adjusted OHLC prices with event date markers (announcement, effective, removal)
- **K线图表** — 调整后的OHLC价格，标注事件日期（公告、生效、剔除）

- **Time Range Selection** — 3M, 6M, 1Y, 2Y, 3Y, All, and Event Window views
- **时间范围选择** — 3月、6月、1年、2年、3年、全部和事件窗口视图

- **EN / 中文 Language Toggle** — Full bilingual UI with locale-aware date formatting
- **中英文切换** — 完整的双语界面，日期格式随语言自动切换

- **Search & Filter** — Filter stocks by ticker, company name, or year
- **搜索和筛选** — 按代码、公司名称或年份筛选股票

- **Warning System** — Tooltips for stocks with special situations (acquisitions, removals, IPOs, splits)
- **警告系统** — 对特殊情况的股票显示提示（收购、剔除、IPO、拆股）

- **Responsive Design** — Desktop sidebar + mobile hamburger menu
- **响应式设计** — 桌面端侧边栏 + 移动端汉堡菜单

- **No API Key Required** — Uses Yahoo Finance via `yahoo-finance2` package server-side
- **无需API密钥** — 服务端使用 `yahoo-finance2` 获取Yahoo Finance数据

- **Knowledge Bank** — Concise bilingual guides to index inclusion, removal, and event-study methods
- **知识库** — 用简短的中英双语内容介绍指数纳入、剔除与事件量化方法

---

## Quick Start / 快速开始

```bash
npm install
npm run dev
```

Open / 打开 [http://localhost:3000](http://localhost:3000)

### Commands / 命令

| Command / 命令 | Description / 说明 |
|---|---|
| `npm install` | Install dependencies / 安装依赖 |
| `npm run dev` | Start dev server / 启动开发服务器 |
| `npm run build` | Production build / 生产构建 |
| `npm run start` | Start production server / 启动生产服务器 |
| `npm run test` | Run unit tests (Vitest) / 运行单元测试 |
| `npm run test:e2e` | Run E2E tests (Playwright) / 运行端到端测试 |
| `npm run lint` | Run ESLint / 运行代码检查 |

---

## Stocks Tracked / 追踪的股票

### December 2023 Annual Reconstitution / 2023年12月年度调整
| Ticker | Company / 公司 | Effective / 生效 | Notes / 备注 |
|--------|---------|-----------|-------|
| CDW | CDW Corporation | 2023-12-18 | Removed Dec 2025 / 2025年12月剔除 |
| CCEP | Coca-Cola Europacific Partners | 2023-12-18 | |
| DASH | DoorDash | 2023-12-18 | |
| MDB | MongoDB | 2023-12-18 | |
| ROP | Roper Technologies | 2023-12-18 | |
| SPLK | Splunk | 2023-12-18 | Acquired by Cisco Mar 2024 / 2024年3月被思科收购 |
| TTWO | Take-Two Interactive | 2023-12-18 | |

### 2024 Special Reconstitutions / 2024年特别调整
| Ticker | Company / 公司 | Effective / 生效 | Notes / 备注 |
|--------|---------|-----------|-------|
| LIN | Linde plc | 2024-03-18 | Replaced SPLK / 替换SPLK |
| ARM | Arm Holdings | 2024-06-24 | IPO Sep 2023 |
| SMCI | Super Micro Computer | 2024-07-22 | Removed Dec 2024 / 2024年12月剔除 |

### December 2024 Annual Reconstitution / 2024年12月年度调整
| Ticker | Company / 公司 | Effective / 生效 | Notes / 备注 |
|--------|---------|-----------|-------|
| PLTR | Palantir Technologies | 2024-12-23 | |
| MSTR | Strategy Inc. (MicroStrategy) | 2024-12-23 | 10:1 split Aug 2024 / 2024年8月10拆1 |
| AXON | Axon Enterprise | 2024-12-23 | |

### December 2025 Annual Reconstitution / 2025年12月年度调整
| Ticker | Company / 公司 | Effective / 生效 | Notes / 备注 |
|--------|---------|-----------|-------|
| ALNY | Alnylam Pharmaceuticals | 2025-12-22 | |
| FER | Ferrovial SE | 2025-12-22 | |
| INSM | Insmed | 2025-12-22 | Removed Jun 2026 / 2026年6月剔除 |
| MPWR | Monolithic Power Systems | 2025-12-22 | |
| STX | Seagate Technology | 2025-12-22 | |
| WDC | Western Digital | 2025-12-22 | |

### June 2026 Quarterly Rebalance / 2026年6月季度调整
| Ticker | Company / 公司 | Effective / 生效 | Notes / 备注 |
|--------|---------|-----------|-------|
| ALAB | Astera Labs | 2026-06-22 | |
| CRWV | CoreWeave | 2026-06-22 | Recent IPO / 近期IPO |
| NBIS | Nebius Group | 2026-06-22 | Formerly Yandex / 前身为Yandex |
| RKLB | Rocket Lab | 2026-06-22 | |
| TER | Teradyne | 2026-06-22 | |

---

## Tech Stack / 技术栈

| Layer / 层 | Technology / 技术 |
|---|---|
| Framework / 框架 | Next.js 16 (App Router) |
| Charts / 图表 | TradingView Lightweight Charts v5 |
| Styling / 样式 | Tailwind CSS v4 |
| Market Data / 行情数据 | yahoo-finance2 (server-side) |
| i18n / 国际化 | React Context + dictionary pattern |
| Unit Tests / 单元测试 | Vitest |
| E2E Tests / 端到端测试 | Playwright |
| Deployment / 部署 | Vercel |

---

## Project Structure / 项目结构

```
src/
  app/
    api/stock/route.ts    # Market data API endpoint / 行情数据接口
    page.tsx              # Main page with hash routing / 主页面
    layout.tsx            # Root layout with LocaleProvider / 根布局
  components/
    TickerList.tsx         # Sidebar with search & filter / 侧边栏搜索筛选
    StockHeader.tsx        # Company info + event dates / 公司信息和事件日期
    StockChart.tsx         # Candlestick chart + markers / K线图和标记
    RangeSelector.tsx      # Time range buttons / 时间范围按钮
    WarningTooltip.tsx     # Warning icon + tooltip / 警告图标和提示
    LanguageToggle.tsx     # EN/中文 switch / 语言切换
    KnowledgeBank.tsx      # Index rules + research guides / 指数规则与研究指南
  data/
    nasdaq100Additions.ts  # All stocks with verified data / 全部股票数据
  lib/
    dateRange.ts           # Date range utilities / 日期范围工具
    marketData.ts          # Client-side data fetching / 客户端数据获取
    i18n.tsx               # i18n context + translations / 国际化上下文和翻译
```

---

## Deploy / 部署

### Vercel (Recommended / 推荐)

Connect this repo to [Vercel](https://vercel.com) for automatic deployments, or deploy manually:

将此仓库连接到 [Vercel](https://vercel.com) 实现自动部署，或手动部署：

```bash
npm install -g vercel
vercel --prod
```

No environment variables required. / 无需配置环境变量。

---

## Data Sources / 数据来源

- **Stock prices / 股票价格:** [Yahoo Finance](https://finance.yahoo.com/) via `yahoo-finance2` (server-side, 5-min cache)
- **Index additions / 指数调整数据:** Official Nasdaq press releases / 纳斯达克官方新闻稿 — see [`src/data/nasdaq100Additions.ts`](src/data/nasdaq100Additions.ts) for source URLs

---

## Known Limitations / 已知限制

1. **Yahoo Finance dependency / Yahoo Finance依赖** — Uses unofficial API, may change without notice / 使用非官方API，可能随时变更
2. **Delisted stocks / 退市股票** — SPLK data ends at March 2024 delisting / SPLK数据截止到2024年3月退市日
3. **Recent IPOs / 近期IPO** — ARM, CRWV, NBIS, ALAB have limited history / 历史数据有限
4. **End-of-day data / 日终数据** — Not real-time quotes / 非实时行情
5. **Event markers / 事件标记** — Weekend/holiday dates snap to nearest trading day / 周末和节假日的日期对齐到最近的交易日

---

## License / 许可证

MIT
