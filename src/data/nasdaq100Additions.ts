export interface StockWarning {
  title: string;
  description: string;
}

export interface Nasdaq100Addition {
  ticker: string;
  companyName: string;
  shortDescription?: string;
  announcementDate: string; // YYYY-MM-DD
  effectiveDate: string; // YYYY-MM-DD
  removalDate?: string; // YYYY-MM-DD, date removed from Nasdaq-100 (if applicable)
  officialSourceUrl: string;
  chartSymbol: string; // symbol used for fetching chart data
  warning?: StockWarning;
}

const nasdaq100Additions: Nasdaq100Addition[] = [
  // === December 2023 Annual Reconstitution ===
  {
    ticker: "CDW",
    companyName: "CDW Corporation",
    shortDescription: "IT solutions and services provider for business, government, and education.",
    announcementDate: "2023-12-08",
    effectiveDate: "2023-12-18",
    removalDate: "2025-12-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08",
    chartSymbol: "CDW",
    warning: {
      title: "Removed from Nasdaq-100 in December 2025",
      description:
        "CDW was added to the Nasdaq-100 in December 2023 but removed in the December 2025 annual reconstitution. It remains a publicly traded company.",
    },
  },
  {
    ticker: "CCEP",
    companyName: "Coca-Cola Europacific Partners plc",
    shortDescription: "Largest Coca-Cola bottler by revenue, serving Western Europe, Australia, and Southeast Asia.",
    announcementDate: "2023-12-08",
    effectiveDate: "2023-12-18",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08",
    chartSymbol: "CCEP",
  },
  {
    ticker: "DASH",
    companyName: "DoorDash, Inc.",
    shortDescription: "Food delivery and local commerce platform.",
    announcementDate: "2023-12-08",
    effectiveDate: "2023-12-18",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08",
    chartSymbol: "DASH",
  },
  {
    ticker: "MDB",
    companyName: "MongoDB, Inc.",
    shortDescription: "Developer data platform based on a NoSQL document database.",
    announcementDate: "2023-12-08",
    effectiveDate: "2023-12-18",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08",
    chartSymbol: "MDB",
  },
  {
    ticker: "ROP",
    companyName: "Roper Technologies, Inc.",
    shortDescription: "Diversified industrial company providing software and engineered products.",
    announcementDate: "2023-12-08",
    effectiveDate: "2023-12-18",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08",
    chartSymbol: "ROP",
  },
  {
    ticker: "SPLK",
    companyName: "Splunk Inc.",
    shortDescription: "Data analytics and security platform (acquired by Cisco).",
    announcementDate: "2023-12-08",
    effectiveDate: "2023-12-18",
    removalDate: "2024-03-18",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-to-the-nasdaq-100-indexr-2023-12-08",
    chartSymbol: "SPLK",
    warning: {
      title: "Acquired by Cisco, delisted March 2024",
      description:
        "Splunk was acquired by Cisco Systems for $157/share in March 2024. The stock ceased trading on March 18, 2024. Historical price data ends at that date.",
    },
  },
  {
    ticker: "TTWO",
    companyName: "Take-Two Interactive Software, Inc.",
    shortDescription: "Video game publisher (GTA, NBA 2K, Red Dead Redemption).",
    announcementDate: "2023-12-12",
    effectiveDate: "2023-12-18",
    officialSourceUrl: "https://ir.nasdaq.com/news-releases/news-release-details/update-annual-changes-nasdaq-100r-index",
    chartSymbol: "TTWO",
  },

  // === March 2024 Special Reconstitution (Splunk acquired by Cisco) ===
  {
    ticker: "LIN",
    companyName: "Linde plc",
    shortDescription: "World's largest industrial gases company.",
    announcementDate: "2024-03-08",
    effectiveDate: "2024-03-18",
    officialSourceUrl: "https://www.nasdaq.com/press-release/linde-plc-to-join-the-nasdaq-100-indexr-beginning-march-18-2024-2024-03-08",
    chartSymbol: "LIN",
  },

  // === June 2024 Special Reconstitution (Sirius XM replacement) ===
  {
    ticker: "ARM",
    companyName: "Arm Holdings plc",
    shortDescription: "Semiconductor and software design company, dominant in mobile CPU architecture.",
    announcementDate: "2024-06-13",
    effectiveDate: "2024-06-24",
    officialSourceUrl: "https://www.nasdaq.com/press-release/arm-holdings-plc-join-nasdaq-100-indexr-beginning-june-24-2024-2024-06-13",
    chartSymbol: "ARM",
    warning: {
      title: "IPO in September 2023",
      description:
        "Arm Holdings went public on September 14, 2023. Historical price data only goes back to that date, so the full chart history is limited.",
    },
  },

  // === July 2024 Special Reconstitution (Walgreens replacement) ===
  {
    ticker: "SMCI",
    companyName: "Super Micro Computer, Inc.",
    shortDescription: "Server and storage solutions provider for AI, cloud, and enterprise.",
    announcementDate: "2024-07-12",
    effectiveDate: "2024-07-22",
    removalDate: "2024-12-23",
    officialSourceUrl: "https://www.nasdaq.com/press-release/super-micro-computer-inc-join-nasdaq-100-indexr-beginning-july-22-2024-2024-07-12",
    chartSymbol: "SMCI",
    warning: {
      title: "Removed from Nasdaq-100 in December 2024",
      description:
        "SMCI was removed in the December 2024 reconstitution after its auditor Ernst & Young resigned and accounting concerns emerged. The stock experienced extreme volatility during this period.",
    },
  },

  // === December 2024 Annual Reconstitution ===
  {
    ticker: "PLTR",
    companyName: "Palantir Technologies Inc.",
    shortDescription: "Data analytics and AI software platform for government and commercial clients.",
    announcementDate: "2024-12-13",
    effectiveDate: "2024-12-23",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2024-12-13",
    chartSymbol: "PLTR",
  },
  {
    ticker: "MSTR",
    companyName: "Strategy Inc. (formerly MicroStrategy)",
    shortDescription: "Enterprise analytics software company and largest corporate Bitcoin holder.",
    announcementDate: "2024-12-13",
    effectiveDate: "2024-12-23",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2024-12-13",
    chartSymbol: "MSTR",
    warning: {
      title: "10-for-1 stock split (Aug 2024) & renamed to Strategy Inc.",
      description:
        "MicroStrategy completed a 10-for-1 stock split on August 8, 2024. The company rebranded to Strategy Inc. in February 2025. Chart uses adjusted prices, so the split is reflected in historical data. The company is primarily a Bitcoin treasury vehicle.",
    },
  },
  {
    ticker: "AXON",
    companyName: "Axon Enterprise, Inc.",
    shortDescription: "Law enforcement technology company (Taser, body cameras, cloud software).",
    announcementDate: "2024-12-13",
    effectiveDate: "2024-12-23",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2024-12-13",
    chartSymbol: "AXON",
  },

  // === December 2025 Annual Reconstitution ===
  {
    ticker: "ALNY",
    companyName: "Alnylam Pharmaceuticals, Inc.",
    shortDescription: "Biopharmaceutical company focused on RNA interference therapeutics.",
    announcementDate: "2025-12-12",
    effectiveDate: "2025-12-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13",
    chartSymbol: "ALNY",
  },
  {
    ticker: "FER",
    companyName: "Ferrovial SE",
    shortDescription: "Global infrastructure operator (toll roads, airports, construction).",
    announcementDate: "2025-12-12",
    effectiveDate: "2025-12-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13",
    chartSymbol: "FER",
  },
  {
    ticker: "INSM",
    companyName: "Insmed Incorporated",
    shortDescription: "Biopharmaceutical company focused on serious pulmonary diseases.",
    announcementDate: "2025-12-12",
    effectiveDate: "2025-12-22",
    removalDate: "2026-06-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13",
    chartSymbol: "INSM",
    warning: {
      title: "Removed from Nasdaq-100 in June 2026",
      description:
        "Insmed was added in December 2025 but removed in the June 2026 quarterly rebalance, staying in the index for only about 6 months.",
    },
  },
  {
    ticker: "MPWR",
    companyName: "Monolithic Power Systems, Inc.",
    shortDescription: "Semiconductor company providing power management solutions.",
    announcementDate: "2025-12-12",
    effectiveDate: "2025-12-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13",
    chartSymbol: "MPWR",
  },
  {
    ticker: "STX",
    companyName: "Seagate Technology Holdings plc",
    shortDescription: "Data storage solutions manufacturer (hard drives, SSDs).",
    announcementDate: "2025-12-12",
    effectiveDate: "2025-12-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13",
    chartSymbol: "STX",
  },
  {
    ticker: "WDC",
    companyName: "Western Digital Corp.",
    shortDescription: "Data storage devices and solutions manufacturer.",
    announcementDate: "2025-12-12",
    effectiveDate: "2025-12-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/annual-changes-nasdaq-100-indexr-2025-12-13",
    chartSymbol: "WDC",
  },

  // === June 2026 Quarterly Rebalance ===
  {
    ticker: "ALAB",
    companyName: "Astera Labs, Inc.",
    shortDescription: "Semiconductor company providing connectivity solutions for AI infrastructure.",
    announcementDate: "2026-06-11",
    effectiveDate: "2026-06-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/nasdaq-100-indexr-june-2026-quarterly-changes-2026-06-12",
    chartSymbol: "ALAB",
  },
  {
    ticker: "CRWV",
    companyName: "CoreWeave, Inc.",
    shortDescription: "AI hyperscaler providing GPU-accelerated cloud computing.",
    announcementDate: "2026-06-11",
    effectiveDate: "2026-06-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/nasdaq-100-indexr-june-2026-quarterly-changes-2026-06-12",
    chartSymbol: "CRWV",
    warning: {
      title: "Recently IPO'd company",
      description:
        "CoreWeave went public in 2025. Historical price data is limited to the period since its IPO.",
    },
  },
  {
    ticker: "NBIS",
    companyName: "Nebius Group N.V.",
    shortDescription: "AI infrastructure and cloud platform company (spun off from Yandex).",
    announcementDate: "2026-06-11",
    effectiveDate: "2026-06-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/nasdaq-100-indexr-june-2026-quarterly-changes-2026-06-12",
    chartSymbol: "NBIS",
    warning: {
      title: "Formerly part of Yandex",
      description:
        "Nebius was created from the restructuring of Yandex N.V. Historical price data under this ticker may not reflect the prior Yandex business.",
    },
  },
  {
    ticker: "RKLB",
    companyName: "Rocket Lab USA, Inc.",
    shortDescription: "Aerospace company providing launch services and spacecraft components.",
    announcementDate: "2026-06-11",
    effectiveDate: "2026-06-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/nasdaq-100-indexr-june-2026-quarterly-changes-2026-06-12",
    chartSymbol: "RKLB",
  },
  {
    ticker: "TER",
    companyName: "Teradyne, Inc.",
    shortDescription: "Automatic test equipment manufacturer for semiconductors and electronics.",
    announcementDate: "2026-06-11",
    effectiveDate: "2026-06-22",
    officialSourceUrl: "https://www.nasdaq.com/press-release/nasdaq-100-indexr-june-2026-quarterly-changes-2026-06-12",
    chartSymbol: "TER",
  },
];

export default nasdaq100Additions;

export function getAdditionByTicker(ticker: string): Nasdaq100Addition | undefined {
  return nasdaq100Additions.find(
    (a) => a.ticker.toUpperCase() === ticker.toUpperCase()
  );
}

export function getAdditionYears(): number[] {
  const years = new Set(
    nasdaq100Additions.map((a) => new Date(a.effectiveDate).getFullYear())
  );
  return Array.from(years).sort((a, b) => b - a);
}

export function filterByYear(year: number): Nasdaq100Addition[] {
  return nasdaq100Additions.filter(
    (a) => new Date(a.effectiveDate).getFullYear() === year
  );
}
