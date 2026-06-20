import { describe, it, expect } from "vitest";
import {
  getRangeFromKey,
  getEventWindow,
  isDateInRange,
  formatDate,
  dateToUnix,
} from "@/lib/dateRange";

describe("dateRange utilities", () => {
  describe("getRangeFromKey", () => {
    const now = new Date("2026-06-20T12:00:00");

    it("should return null for 'all', 'event', 'custom'", () => {
      expect(getRangeFromKey("all", now)).toBeNull();
      expect(getRangeFromKey("event", now)).toBeNull();
      expect(getRangeFromKey("custom", now)).toBeNull();
    });

    it("should return correct range for 3m", () => {
      const range = getRangeFromKey("3m", now);
      expect(range).not.toBeNull();
      expect(range!.from.getMonth()).toBe(2); // March
      expect(range!.to.getMonth()).toBe(5); // June
    });

    it("should return correct range for 1y", () => {
      const range = getRangeFromKey("1y", now);
      expect(range).not.toBeNull();
      expect(range!.from.getFullYear()).toBe(2025);
    });

    it("should return correct range for 2y", () => {
      const range = getRangeFromKey("2y", now);
      expect(range).not.toBeNull();
      expect(range!.from.getFullYear()).toBe(2024);
    });
  });

  describe("getEventWindow", () => {
    it("should create a window around announcement and effective dates", () => {
      const window = getEventWindow("2024-12-13", "2024-12-23");
      expect(window.from < new Date("2024-12-13")).toBe(true);
      expect(window.to > new Date("2024-12-23")).toBe(true);
    });

    it("should cap to today if event window extends into future", () => {
      const future = "2026-12-01";
      const window = getEventWindow(future, future);
      expect(window.to <= new Date()).toBe(true);
    });
  });

  describe("isDateInRange", () => {
    it("should return true for date within range", () => {
      const range = {
        from: new Date("2024-01-01"),
        to: new Date("2024-12-31"),
      };
      expect(isDateInRange("2024-06-15", range)).toBe(true);
    });

    it("should return false for date outside range", () => {
      const range = {
        from: new Date("2024-01-01"),
        to: new Date("2024-12-31"),
      };
      expect(isDateInRange("2023-06-15", range)).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("should format date as readable string", () => {
      const formatted = formatDate("2024-12-13");
      expect(formatted).toContain("December");
      expect(formatted).toContain("13");
      expect(formatted).toContain("2024");
    });
  });

  describe("dateToUnix", () => {
    it("should convert date string to unix timestamp", () => {
      const unix = dateToUnix("2024-01-01");
      expect(unix).toBeGreaterThan(0);
      expect(typeof unix).toBe("number");
    });
  });
});
