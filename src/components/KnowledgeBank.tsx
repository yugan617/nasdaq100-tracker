"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";

type ArticleId = "inclusion" | "removal" | "research";

interface KnowledgeBankProps {
  onClose: () => void;
}

const OFFICIAL_METHODOLOGY =
  "https://indexes.nasdaqomx.com/docs/Methodology_NDX.pdf";
const GLOBAL_INDEX_WATCH = "https://indexes.nasdaqomx.com/";

const content = {
  en: {
    eyebrow: "Learn the mechanics",
    title: "Knowledge Bank",
    intro:
      "A short guide to what an addition means, why a company may leave, and how this event can be studied instead of merely narrated.",
    close: "Close knowledge bank",
    updated: "Rules summarized from Nasdaq's official 2026 methodology.",
    source: "Official methodology",
    announcements: "Nasdaq Global Index Watch",
    tabs: {
      inclusion: "How companies enter",
      removal: "How companies leave",
      research: "How to quantify it",
    },
    articles: {
      inclusion: {
        title: "What does it take to enter the Nasdaq-100?",
        lead:
          "It is not simply a list of the 100 biggest technology companies. Eligibility comes first; market-cap ranking comes second.",
        sections: [
          {
            heading: "Basic eligibility",
            body:
              "The company must be primarily listed on an eligible U.S. Nasdaq exchange, be classified outside the financial industry, and issue an eligible security. REITs and SPACs are excluded.",
          },
          {
            heading: "Liquidity and trading history",
            body:
              "A security generally needs at least $5 million in three-month average daily value traded and three full calendar months of seasoning. Special fast-entry rules can apply to exceptionally large new listings.",
          },
          {
            heading: "Selection is ranked, but buffered",
            body:
              "At the December reconstitution, eligible companies are ranked by full market capitalization. The top 75 enter first, while existing members receive retention buffers through ranks 100 and, in some cases, 125. This reduces unnecessary turnover.",
          },
        ],
        takeaway:
          "Inclusion is evidence that a company has become large, liquid and index-eligible—not proof that its future return will be positive.",
      },
      removal: {
        title: "Why can a company be removed?",
        lead:
          "Leaving the index does not always mean the business has failed. Removal can be mechanical, structural or event-driven.",
        sections: [
          {
            heading: "Ranking pressure",
            body:
              "At annual reconstitution, lower-ranked incumbents may lose their place to larger eligible companies. During quarterly reviews, constituents ranked outside the top 125 can also be removed and replaced.",
          },
          {
            heading: "Loss of eligibility",
            body:
              "A company may leave after transferring to an ineligible exchange, becoming a financial company or an ineligible security type, entering bankruptcy, or ceasing operations.",
          },
          {
            heading: "Corporate events",
            body:
              "Mergers, acquisitions, going-private transactions and some spin-offs can make continued inclusion impossible or inappropriate. A replacement is generally selected from the largest eligible non-member.",
          },
        ],
        takeaway:
          "The reason for removal matters. A market-cap decline, an acquisition and an exchange transfer describe very different investment outcomes.",
      },
      research: {
        title: "Can index inclusion be quantified?",
        lead:
          "Yes—but three years is an observation window, not a conclusion. The next step is to turn the event into a repeatable test.",
        sections: [
          {
            heading: "Extend the sample",
            body:
              "Expand from three years to five or ten, and keep every eligible addition rather than only memorable winners. A larger sample helps reduce cycle and selection bias.",
          },
          {
            heading: "Measure event-time returns",
            body:
              "Compare returns from the announcement date and effective date over 1, 3, 6, 12 and 24 months. Report the median, hit rate and maximum drawdown—not only the average.",
          },
          {
            heading: "Use a benchmark",
            body:
              "Subtract the return of QQQ or the Nasdaq-100 over the same period. Otherwise, a stock rising in a broad bull market can be mistaken for an inclusion effect.",
          },
          {
            heading: "Separate the cohorts",
            body:
              "Annual additions, replacement additions, IPOs and acquired companies should not be mixed blindly. Their paths into the index—and their risks—are different.",
          },
        ],
        takeaway:
          "The useful question is not “did it go up?” but “did new members produce persistent excess returns, with what probability and at what risk?”",
      },
    },
  },
  zh: {
    eyebrow: "理解指数机制",
    title: "知识库",
    intro:
      "用几分钟了解一家公司为何被纳入、为何被剔除，以及如何把一个市场故事变成可以检验的问题。",
    close: "关闭知识库",
    updated: "规则依据 Nasdaq 2026 年官方指数方法文件整理。",
    source: "官方方法文件",
    announcements: "Nasdaq 指数公告",
    tabs: {
      inclusion: "如何被纳入",
      removal: "如何被剔除",
      research: "如何量化",
    },
    articles: {
      inclusion: {
        title: "进入纳斯达克100，需要满足什么？",
        lead:
          "它并不是简单地选出“市值最大的100家科技公司”。先满足资格，再进行市值排名。",
        sections: [
          {
            heading: "基础资格",
            body:
              "公司需要主要上市于符合条件的美国 Nasdaq 交易所，不能被归类为金融行业，证券类型也必须合规。REIT 和 SPAC 不具备纳入资格。",
          },
          {
            heading: "流动性与上市时间",
            body:
              "通常需要达到至少500万美元的三个月日均成交额，并拥有三个完整自然月的交易历史。对于市值特别大的新上市公司，另有快速纳入机制。",
          },
          {
            heading: "按市值排名，但保留缓冲",
            body:
              "每年12月调整时，合资格公司按总市值排序。前75名优先入选；已有成分股在100名以内，部分情况下在125名以内，仍可能被保留，以减少不必要的频繁进出。",
          },
        ],
        takeaway:
          "被纳入说明公司已经足够大、流动性足够好并符合指数规则，但它并不等于未来股价一定上涨。",
      },
      removal: {
        title: "公司为什么会被剔除？",
        lead:
          "离开指数不一定代表公司经营失败。剔除可能来自排名、资格变化，也可能只是一次公司事件。",
        sections: [
          {
            heading: "市值排名下降",
            body:
              "年度调整时，排名靠后的旧成分股可能被更大的合资格公司替代。季度审查中，排名跌出前125名的成分股也可能被剔除并替换。",
          },
          {
            heading: "不再符合资格",
            body:
              "转到不符合条件的交易所、被重新归类为金融公司或不合资格证券、进入破产程序或停止经营，都可能导致剔除。",
          },
          {
            heading: "并购与其他公司事件",
            body:
              "被收购、私有化、合并及部分分拆事件，可能让公司无法继续留在指数中。通常会由市值最大的合资格非成分公司补位。",
          },
        ],
        takeaway:
          "研究剔除事件时，必须区分市值下滑、被收购和转板上市——它们对应的是完全不同的投资结果。",
      },
      research: {
        title: "“纳入效应”能不能被量化？",
        lead:
          "可以。但三年更像一个观察窗口，还不足以下结论。下一步，是把这个事件变成一套可以重复的检验。",
        sections: [
          {
            heading: "把样本扩展到五年或十年",
            body:
              "保留所有符合条件的新增公司，而不是只挑令人印象深刻的赢家。更长的时间和更完整的样本，可以降低市场周期与幸存者偏差。",
          },
          {
            heading: "按事件时间计算收益",
            body:
              "分别从公告日和生效日出发，观察1、3、6、12、24个月收益，同时统计中位数、正收益比例和最大回撤，而不只是平均涨幅。",
          },
          {
            heading: "必须加入基准",
            body:
              "用同期 QQQ 或纳斯达克100收益作为基准，计算超额收益。否则，一只股票在大牛市中上涨，很容易被误认为是“纳入指数”的效果。",
          },
          {
            heading: "对样本进行分组",
            body:
              "年度新增、临时补位、IPO公司和并购相关公司不应简单混在一起。它们进入指数的路径不同，风险结构也不同。",
          },
        ],
        takeaway:
          "真正有价值的问题不是“它后来涨了吗”，而是“新增公司能否持续获得超额收益，概率多大，又承担了多少风险”。",
      },
    },
  },
} as const;

export default function KnowledgeBank({ onClose }: KnowledgeBankProps) {
  const { locale } = useLocale();
  const copy = content[locale];
  const [activeArticle, setActiveArticle] =
    useState<ArticleId>("inclusion");
  const article = copy.articles[activeArticle];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      data-testid="knowledge-bank"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="knowledge-bank-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-gray-700 bg-gray-950 shadow-2xl sm:rounded-2xl"
      >
        <header className="border-b border-gray-800 px-5 py-4 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                {copy.eyebrow}
              </p>
              <h2
                id="knowledge-bank-title"
                className="mt-1 text-xl font-bold text-white sm:text-2xl"
              >
                {copy.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                {copy.intro}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label={copy.close}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="border-b border-gray-800 px-4 py-3 sm:px-7">
          <div
            className="flex gap-2 overflow-x-auto no-scrollbar"
            role="tablist"
          >
            {(Object.keys(copy.tabs) as ArticleId[]).map((id) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeArticle === id}
                onClick={() => setActiveArticle(id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeArticle === id
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                {copy.tabs[id]}
              </button>
            ))}
          </div>
        </div>

        <article
          className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          role="tabpanel"
        >
          <h3 className="text-xl font-semibold text-gray-100">
            {article.title}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-300">
            {article.lead}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {article.sections.map((section, index) => (
              <section
                key={section.heading}
                className={`rounded-xl border border-gray-800 bg-gray-900/60 p-4 ${
                  article.sections.length % 2 === 1 &&
                  index === article.sections.length - 1
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <h4 className="text-sm font-semibold text-gray-100">
                  {section.heading}
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm leading-6 text-cyan-100">
            {article.takeaway}
          </div>

          <footer className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-800 pt-4 text-xs text-gray-500">
            <span>{copy.updated}</span>
            <a
              href={OFFICIAL_METHODOLOGY}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              {copy.source} ↗
            </a>
            <a
              href={GLOBAL_INDEX_WATCH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              {copy.announcements} ↗
            </a>
          </footer>
        </article>
      </section>
    </div>
  );
}
