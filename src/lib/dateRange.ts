export type RangeKey = "3m" | "6m" | "1y" | "2y" | "3y" | "all" | "event" | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export function getRangeFromKey(
  key: RangeKey,
  now: Date = new Date()
): DateRange | null {
  if (key === "all" || key === "event" || key === "custom") return null;

  const to = new Date(now);
  const from = new Date(now);

  switch (key) {
    case "3m":
      from.setMonth(from.getMonth() - 3);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "1y":
      from.setFullYear(from.getFullYear() - 1);
      break;
    case "2y":
      from.setFullYear(from.getFullYear() - 2);
      break;
    case "3y":
      from.setFullYear(from.getFullYear() - 3);
      break;
  }

  return { from, to };
}

export function getEventWindow(
  announcementDate: string,
  effectiveDate: string,
  removalDate?: string
): DateRange {
  const annDate = new Date(announcementDate);
  const effDate = new Date(effectiveDate);

  // 60 trading days ~= 84 calendar days before announcement
  const from = new Date(annDate);
  from.setDate(from.getDate() - 84);

  // Use removal date as the anchor for the end if present, otherwise effective date
  const endAnchor = removalDate ? new Date(removalDate) : effDate;
  // 120 trading days ~= 168 calendar days after the anchor date
  const to = new Date(endAnchor);
  to.setDate(to.getDate() + 168);

  // Cap to today if in the future
  const now = new Date();
  if (to > now) {
    to.setTime(now.getTime());
  }

  return { from, to };
}

export function isDateInRange(date: string, range: DateRange): boolean {
  const d = new Date(date);
  return d >= range.from && d <= range.to;
}

export function formatDate(dateStr: string, locale: string = "en-US"): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function dateToUnix(dateStr: string): number {
  return Math.floor(new Date(dateStr + "T00:00:00").getTime() / 1000);
}
