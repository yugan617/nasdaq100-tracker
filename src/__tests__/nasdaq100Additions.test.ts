import { describe, it, expect } from "vitest";
import nasdaq100Additions, {
  getAdditionByTicker,
  getAdditionYears,
  filterByYear,
} from "@/data/nasdaq100Additions";

describe("nasdaq100Additions data", () => {
  it("should have at least 20 stocks", () => {
    expect(nasdaq100Additions.length).toBeGreaterThanOrEqual(20);
  });

  it("should have unique tickers (within the same effective date)", () => {
    const keys = nasdaq100Additions.map(
      (a) => `${a.ticker}_${a.effectiveDate}`
    );
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it("should have valid date formats for all entries", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const stock of nasdaq100Additions) {
      expect(stock.announcementDate).toMatch(dateRegex);
      expect(stock.effectiveDate).toMatch(dateRegex);
    }
  });

  it("announcement date should be before or equal to effective date", () => {
    for (const stock of nasdaq100Additions) {
      expect(stock.announcementDate <= stock.effectiveDate).toBe(true);
    }
  });

  it("should have officialSourceUrl for all entries", () => {
    for (const stock of nasdaq100Additions) {
      expect(stock.officialSourceUrl).toBeTruthy();
      expect(stock.officialSourceUrl).toMatch(/^https?:\/\//);
    }
  });

  it("should have chartSymbol for all entries", () => {
    for (const stock of nasdaq100Additions) {
      expect(stock.chartSymbol).toBeTruthy();
    }
  });

  it("getAdditionByTicker should find existing tickers", () => {
    const pltr = getAdditionByTicker("PLTR");
    expect(pltr).toBeDefined();
    expect(pltr!.companyName).toContain("Palantir");
  });

  it("getAdditionByTicker should be case-insensitive", () => {
    const pltr = getAdditionByTicker("pltr");
    expect(pltr).toBeDefined();
  });

  it("getAdditionByTicker should return undefined for non-existent ticker", () => {
    expect(getAdditionByTicker("ZZZZZ")).toBeUndefined();
  });

  it("getAdditionYears should return years in descending order", () => {
    const years = getAdditionYears();
    expect(years.length).toBeGreaterThan(0);
    for (let i = 1; i < years.length; i++) {
      expect(years[i - 1]).toBeGreaterThan(years[i]);
    }
  });

  it("filterByYear should return stocks for that year", () => {
    const stocks2024 = filterByYear(2024);
    expect(stocks2024.length).toBeGreaterThan(0);
    for (const stock of stocks2024) {
      expect(new Date(stock.effectiveDate).getFullYear()).toBe(2024);
    }
  });

  // Verify specific known additions
  it("should include December 2023 additions", () => {
    const dec2023 = nasdaq100Additions.filter(
      (a) => a.effectiveDate === "2023-12-18"
    );
    const tickers = dec2023.map((a) => a.ticker);
    expect(tickers).toContain("CDW");
    expect(tickers).toContain("CCEP");
    expect(tickers).toContain("DASH");
    expect(tickers).toContain("MDB");
    expect(tickers).toContain("ROP");
    expect(tickers).toContain("SPLK");
    expect(tickers).toContain("TTWO");
  });

  it("should include December 2024 additions", () => {
    const dec2024 = nasdaq100Additions.filter(
      (a) => a.effectiveDate === "2024-12-23"
    );
    const tickers = dec2024.map((a) => a.ticker);
    expect(tickers).toContain("PLTR");
    expect(tickers).toContain("MSTR");
    expect(tickers).toContain("AXON");
  });

  it("should include special reconstitutions", () => {
    expect(getAdditionByTicker("LIN")).toBeDefined(); // Mar 2024
    expect(getAdditionByTicker("ARM")).toBeDefined(); // Jun 2024
    expect(getAdditionByTicker("SMCI")).toBeDefined(); // Jul 2024
  });

  it("should include December 2025 additions", () => {
    const dec2025 = nasdaq100Additions.filter(
      (a) => a.effectiveDate === "2025-12-22"
    );
    const tickers = dec2025.map((a) => a.ticker);
    expect(tickers).toContain("ALNY");
    expect(tickers).toContain("FER");
    expect(tickers).toContain("MPWR");
    expect(tickers).toContain("STX");
    expect(tickers).toContain("WDC");
  });

  it("should include June 2026 additions", () => {
    const jun2026 = nasdaq100Additions.filter(
      (a) => a.effectiveDate === "2026-06-22"
    );
    const tickers = jun2026.map((a) => a.ticker);
    expect(tickers).toContain("ALAB");
    expect(tickers).toContain("CRWV");
    expect(tickers).toContain("RKLB");
    expect(tickers).toContain("TER");
  });

  it("stocks with warnings should have valid warning objects", () => {
    const warned = nasdaq100Additions.filter((a) => a.warning);
    expect(warned.length).toBeGreaterThan(0);
    for (const stock of warned) {
      expect(stock.warning!.title).toBeTruthy();
      expect(stock.warning!.description).toBeTruthy();
    }
  });

  it("SPLK should have a warning about acquisition", () => {
    const splk = getAdditionByTicker("SPLK");
    expect(splk!.warning).toBeDefined();
    expect(splk!.warning!.description.toLowerCase()).toContain("cisco");
  });

  it("SMCI should have a warning about removal", () => {
    const smci = getAdditionByTicker("SMCI");
    expect(smci!.warning).toBeDefined();
    expect(smci!.warning!.description.toLowerCase()).toContain("removed");
  });

  it("MSTR should have a warning about stock split", () => {
    const mstr = getAdditionByTicker("MSTR");
    expect(mstr!.warning).toBeDefined();
    expect(mstr!.warning!.description.toLowerCase()).toContain("split");
  });
});
