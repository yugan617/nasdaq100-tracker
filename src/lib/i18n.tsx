"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type Locale = "en" | "zh";

const STORAGE_KEY = "nasdaq100-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

const translations: Record<string, Record<Locale, string>> = {
  // Site & header
  siteTitle: {
    en: "Nasdaq-100 Additions Tracker",
    zh: "纳斯达克100新增公司追踪",
  },
  headerTitle: {
    en: "Nasdaq-100 Additions",
    zh: "纳斯达克100新增追踪",
  },

  // Page - empty state
  selectStock: {
    en: "Select a stock from the sidebar",
    zh: "请从侧边栏选择一只股票",
  },
  stocksAddedCount: {
    en: "stocks added to Nasdaq-100 in the past 3 years",
    zh: "只股票在过去3年被加入纳斯达克100指数",
  },
  loading: {
    en: "Loading...",
    zh: "加载中...",
  },

  // TickerList
  tickerListTitle: {
    en: "Nasdaq-100 Additions",
    zh: "纳斯达克100新增",
  },
  searchPlaceholder: {
    en: "Search ticker or company...",
    zh: "搜索代码或公司...",
  },
  filterAll: {
    en: "All",
    zh: "全部",
  },
  stockCount: {
    en: "stock",
    zh: "只股票",
  },
  stocksCount: {
    en: "stocks",
    zh: "只股票",
  },
  noMatchingStocks: {
    en: "No matching stocks",
    zh: "没有匹配的股票",
  },

  // StockHeader
  announced: {
    en: "Announced:",
    zh: "宣布日期：",
  },
  effective: {
    en: "Effective:",
    zh: "生效日期：",
  },
  removed: {
    en: "Removed:",
    zh: "剔除日期：",
  },
  nasdaqAnnouncement: {
    en: "Nasdaq announcement",
    zh: "纳斯达克公告",
  },

  // RangeSelector
  range3M: {
    en: "3M",
    zh: "3月",
  },
  range6M: {
    en: "6M",
    zh: "6月",
  },
  range1Y: {
    en: "1Y",
    zh: "1年",
  },
  range2Y: {
    en: "2Y",
    zh: "2年",
  },
  range3Y: {
    en: "3Y",
    zh: "3年",
  },
  rangeAll: {
    en: "All",
    zh: "全部",
  },
  eventWindow: {
    en: "Event Window",
    zh: "事件窗口",
  },

  // StockChart - loading/error
  loadingData: {
    en: "Loading",
    zh: "正在加载",
  },
  dataEllipsis: {
    en: "data...",
    zh: "数据...",
  },
  failedToLoadData: {
    en: "Failed to load data",
    zh: "数据加载失败",
  },

  // StockChart - out of range messages
  eventsBeforeRange: {
    en: "\u2190 Nasdaq-100 events occurred before the current chart range",
    zh: "\u2190 纳斯达克100事件发生在当前图表范围之前",
  },
  eventsAfterRange: {
    en: "Nasdaq-100 events occur after the current chart range \u2192",
    zh: "纳斯达克100事件发生在当前图表范围之后 \u2192",
  },
  eventsOutsideRange: {
    en: "\u2190 Events are outside the current chart range",
    zh: "\u2190 事件不在当前图表范围内",
  },
  outsideRangePrefix: {
    en: "\u2190 Nasdaq-100",
    zh: "\u2190 纳斯达克100",
  },
  outsideRangeSuffix: {
    en: "outside the current chart range",
    zh: "不在当前图表范围内",
  },
  announcement: {
    en: "announcement",
    zh: "宣布日期",
  },
  effectiveDate: {
    en: "effective date",
    zh: "生效日期",
  },
  removalDate: {
    en: "removal date",
    zh: "剔除日期",
  },
  viewEventWindow: {
    en: "View event window",
    zh: "查看事件窗口",
  },

  // StockChart - markers
  markerAnnounced: {
    en: "Announced:",
    zh: "宣布：",
  },
  markerEffective: {
    en: "Effective:",
    zh: "生效：",
  },
  markerRemoved: {
    en: "Removed:",
    zh: "剔除：",
  },

  // StockChart - legend
  legendAnnouncement: {
    en: "Announcement date",
    zh: "宣布日期",
  },
  legendEffective: {
    en: "Effective date",
    zh: "生效日期",
  },
  legendRemoval: {
    en: "Removal date",
    zh: "剔除日期",
  },
  legendAdjusted: {
    en: "Adjusted prices (splits & dividends reflected)",
    zh: "调整后价格（已反映拆股和分红）",
  },

  // Warnings - CDW
  warningCDWTitle: {
    en: "Removed from Nasdaq-100 in December 2025",
    zh: "于2025年12月从纳斯达克100中剔除",
  },
  warningCDWDesc: {
    en: "CDW was added to the Nasdaq-100 in December 2023 but removed in the December 2025 annual reconstitution. It remains a publicly traded company.",
    zh: "CDW于2023年12月加入纳斯达克100指数，但在2025年12月的年度调整中被剔除。该公司仍然是上市公司。",
  },

  // Warnings - SPLK
  warningSPLKTitle: {
    en: "Acquired by Cisco, delisted March 2024",
    zh: "被思科收购，2024年3月退市",
  },
  warningSPLKDesc: {
    en: "Splunk was acquired by Cisco Systems for $157/share in March 2024. The stock ceased trading on March 18, 2024. Historical price data ends at that date.",
    zh: "Splunk于2024年3月被思科系统以每股157美元收购。该股票于2024年3月18日停止交易。历史价格数据截止到该日期。",
  },

  // Warnings - ARM
  warningARMTitle: {
    en: "IPO in September 2023",
    zh: "2023年9月IPO上市",
  },
  warningARMDesc: {
    en: "Arm Holdings went public on September 14, 2023. Historical price data only goes back to that date, so the full chart history is limited.",
    zh: "Arm Holdings于2023年9月14日上市。历史价格数据仅追溯到该日期，因此完整图表历史有限。",
  },

  // Warnings - SMCI
  warningSMCITitle: {
    en: "Removed from Nasdaq-100 in December 2024",
    zh: "于2024年12月从纳斯达克100中剔除",
  },
  warningSMCIDesc: {
    en: "SMCI was removed in the December 2024 reconstitution after its auditor Ernst & Young resigned and accounting concerns emerged. The stock experienced extreme volatility during this period.",
    zh: "SMCI在其审计师安永辞任及会计问题浮出水面后，于2024年12月调整中被剔除。该股票在此期间经历了极端波动。",
  },

  // Warnings - MSTR
  warningMSTRTitle: {
    en: "10-for-1 stock split (Aug 2024) & renamed to Strategy Inc.",
    zh: "10拆1股票分割（2024年8月）并更名为Strategy Inc.",
  },
  warningMSTRDesc: {
    en: "MicroStrategy completed a 10-for-1 stock split on August 8, 2024. The company rebranded to Strategy Inc. in February 2025. Chart uses adjusted prices, so the split is reflected in historical data. The company is primarily a Bitcoin treasury vehicle.",
    zh: "MicroStrategy于2024年8月8日完成10拆1股票分割。公司于2025年2月更名为Strategy Inc.。图表使用调整后价格，因此拆股已反映在历史数据中。该公司主要是比特币储备工具。",
  },

  // Warnings - INSM
  warningINSMTitle: {
    en: "Removed from Nasdaq-100 in June 2026",
    zh: "于2026年6月从纳斯达克100中剔除",
  },
  warningINSMDesc: {
    en: "Insmed was added in December 2025 but removed in the June 2026 quarterly rebalance, staying in the index for only about 6 months.",
    zh: "Insmed于2025年12月加入，但在2026年6月季度调整中被剔除，仅在指数中停留了约6个月。",
  },

  // Warnings - CRWV
  warningCRWVTitle: {
    en: "Recently IPO'd company",
    zh: "近期IPO上市公司",
  },
  warningCRWVDesc: {
    en: "CoreWeave went public in 2025. Historical price data is limited to the period since its IPO.",
    zh: "CoreWeave于2025年上市。历史价格数据仅限于IPO以来的时期。",
  },

  // Warnings - NBIS
  warningNBISTitle: {
    en: "Formerly part of Yandex",
    zh: "前身为Yandex旗下业务",
  },
  warningNBISDesc: {
    en: "Nebius was created from the restructuring of Yandex N.V. Historical price data under this ticker may not reflect the prior Yandex business.",
    zh: "Nebius由Yandex N.V.重组而来。该代码下的历史价格数据可能不反映此前的Yandex业务。",
  },

  // Stock descriptions
  descCDW: {
    en: "IT solutions and services provider for business, government, and education.",
    zh: "面向企业、政府和教育的IT解决方案和服务提供商。",
  },
  descCCEP: {
    en: "Largest Coca-Cola bottler by revenue, serving Western Europe, Australia, and Southeast Asia.",
    zh: "按收入计算最大的可口可乐瓶装商，服务于西欧、澳大利亚和东南亚。",
  },
  descDASH: {
    en: "Food delivery and local commerce platform.",
    zh: "外卖配送和本地商务平台。",
  },
  descMDB: {
    en: "Developer data platform based on a NoSQL document database.",
    zh: "基于NoSQL文档数据库的开发者数据平台。",
  },
  descROP: {
    en: "Diversified industrial company providing software and engineered products.",
    zh: "提供软件和工程产品的多元化工业公司。",
  },
  descSPLK: {
    en: "Data analytics and security platform (acquired by Cisco).",
    zh: "数据分析和安全平台（已被思科收购）。",
  },
  descTTWO: {
    en: "Video game publisher (GTA, NBA 2K, Red Dead Redemption).",
    zh: "电子游戏发行商（GTA、NBA 2K、荒野大镖客）。",
  },
  descLIN: {
    en: "World's largest industrial gases company.",
    zh: "全球最大的工业气体公司。",
  },
  descARM: {
    en: "Semiconductor and software design company, dominant in mobile CPU architecture.",
    zh: "半导体和软件设计公司，在移动CPU架构领域占主导地位。",
  },
  descSMCI: {
    en: "Server and storage solutions provider for AI, cloud, and enterprise.",
    zh: "面向AI、云计算和企业的服务器和存储解决方案提供商。",
  },
  descPLTR: {
    en: "Data analytics and AI software platform for government and commercial clients.",
    zh: "面向政府和商业客户的数据分析和AI软件平台。",
  },
  descMSTR: {
    en: "Enterprise analytics software company and largest corporate Bitcoin holder.",
    zh: "企业分析软件公司，也是最大的企业比特币持有者。",
  },
  descAXON: {
    en: "Law enforcement technology company (Taser, body cameras, cloud software).",
    zh: "执法技术公司（电击枪、执法记录仪、云软件）。",
  },
  descALNY: {
    en: "Biopharmaceutical company focused on RNA interference therapeutics.",
    zh: "专注于RNA干扰疗法的生物制药公司。",
  },
  descFER: {
    en: "Global infrastructure operator (toll roads, airports, construction).",
    zh: "全球基础设施运营商（收费公路、机场、建筑）。",
  },
  descINSM: {
    en: "Biopharmaceutical company focused on serious pulmonary diseases.",
    zh: "专注于严重肺部疾病的生物制药公司。",
  },
  descMPWR: {
    en: "Semiconductor company providing power management solutions.",
    zh: "提供电源管理解决方案的半导体公司。",
  },
  descSTX: {
    en: "Data storage solutions manufacturer (hard drives, SSDs).",
    zh: "数据存储解决方案制造商（硬盘、固态硬盘）。",
  },
  descWDC: {
    en: "Data storage devices and solutions manufacturer.",
    zh: "数据存储设备和解决方案制造商。",
  },
  descALAB: {
    en: "Semiconductor company providing connectivity solutions for AI infrastructure.",
    zh: "为AI基础设施提供连接解决方案的半导体公司。",
  },
  descCRWV: {
    en: "AI hyperscaler providing GPU-accelerated cloud computing.",
    zh: "提供GPU加速云计算的AI超大规模服务商。",
  },
  descNBIS: {
    en: "AI infrastructure and cloud platform company (spun off from Yandex).",
    zh: "AI基础设施和云平台公司（从Yandex分拆）。",
  },
  descRKLB: {
    en: "Aerospace company providing launch services and spacecraft components.",
    zh: "提供发射服务和航天器部件的航空航天公司。",
  },
  descTER: {
    en: "Automatic test equipment manufacturer for semiconductors and electronics.",
    zh: "半导体和电子产品自动测试设备制造商。",
  },

  // Company names (Chinese)
  nameCDW: {
    en: "CDW Corporation",
    zh: "CDW公司",
  },
  nameCCEP: {
    en: "Coca-Cola Europacific Partners plc",
    zh: "可口可乐欧洲太平洋合作伙伴",
  },
  nameDASH: {
    en: "DoorDash, Inc.",
    zh: "DoorDash公司",
  },
  nameMDB: {
    en: "MongoDB, Inc.",
    zh: "MongoDB公司",
  },
  nameROP: {
    en: "Roper Technologies, Inc.",
    zh: "罗珀科技公司",
  },
  nameSPLK: {
    en: "Splunk Inc.",
    zh: "Splunk公司",
  },
  nameTTWO: {
    en: "Take-Two Interactive Software, Inc.",
    zh: "Take-Two互动软件公司",
  },
  nameLIN: {
    en: "Linde plc",
    zh: "林德集团",
  },
  nameARM: {
    en: "Arm Holdings plc",
    zh: "Arm控股",
  },
  nameSMCI: {
    en: "Super Micro Computer, Inc.",
    zh: "超微电脑公司",
  },
  namePLTR: {
    en: "Palantir Technologies Inc.",
    zh: "Palantir科技公司",
  },
  nameMSTR: {
    en: "Strategy Inc. (formerly MicroStrategy)",
    zh: "Strategy公司（原MicroStrategy）",
  },
  nameAXON: {
    en: "Axon Enterprise, Inc.",
    zh: "Axon企业公司",
  },
  nameALNY: {
    en: "Alnylam Pharmaceuticals, Inc.",
    zh: "Alnylam制药公司",
  },
  nameFER: {
    en: "Ferrovial SE",
    zh: "Ferrovial集团",
  },
  nameINSM: {
    en: "Insmed Incorporated",
    zh: "Insmed公司",
  },
  nameMPWR: {
    en: "Monolithic Power Systems, Inc.",
    zh: "矽力杰半导体",
  },
  nameSTX: {
    en: "Seagate Technology Holdings plc",
    zh: "希捷科技",
  },
  nameWDC: {
    en: "Western Digital Corp.",
    zh: "西部数据",
  },
  nameALAB: {
    en: "Astera Labs, Inc.",
    zh: "Astera Labs公司",
  },
  nameCRWV: {
    en: "CoreWeave, Inc.",
    zh: "CoreWeave公司",
  },
  nameNBIS: {
    en: "Nebius Group N.V.",
    zh: "Nebius集团",
  },
  nameRKLB: {
    en: "Rocket Lab USA, Inc.",
    zh: "火箭实验室",
  },
  nameTER: {
    en: "Teradyne, Inc.",
    zh: "泰瑞达公司",
  },
};

export function useT() {
  const { locale } = useLocale();
  return useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[locale] || entry.en || key;
    },
    [locale]
  );
}
