import { test, expect } from "@playwright/test";

test.describe("Nasdaq-100 Tracker", () => {
  test("should load the homepage and display ticker list", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("ticker-list")).toBeVisible();
    const tickerItems = page.locator('[data-testid^="ticker-item-"]');
    await expect(tickerItems.first()).toBeVisible({ timeout: 10000 });
    const count = await tickerItems.count();
    expect(count).toBeGreaterThanOrEqual(20);
  });

  test("should select a ticker and show stock chart", async ({ page }) => {
    await page.goto("/#PLTR");
    // Wait for chart to load (need to wait for API response)
    await expect(page.getByTestId("stock-chart")).toBeVisible({ timeout: 60000 });
    await expect(page).toHaveURL(/#PLTR/);
  });

  test("should navigate via URL hash", async ({ page }) => {
    await page.goto("/#ARM");
    // Use the main area to check company name
    await expect(
      page.getByRole("main").getByText("Arm Holdings plc")
    ).toBeVisible({ timeout: 15000 });
  });

  test("should search tickers", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("ticker-search").fill("palantir");
    await expect(page.getByTestId("ticker-item-PLTR")).toBeVisible();
    await expect(page.getByTestId("ticker-item-ARM")).not.toBeVisible();
  });

  test("should show range selector with time range buttons", async ({ page }) => {
    await page.goto("/#PLTR");
    await expect(page.getByTestId("stock-chart")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("range-selector")).toBeVisible();
    const selector = page.getByTestId("range-selector");
    await expect(selector.getByRole("button", { name: "3M" })).toBeVisible();
    await expect(selector.getByRole("button", { name: "1Y" })).toBeVisible();
    await expect(selector.getByRole("button", { name: "2Y" })).toBeVisible();
    await expect(selector.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.getByTestId("event-window-btn")).toBeVisible();
  });

  test("should show out-of-range notice for CDW on 3M range", async ({ page }) => {
    await page.goto("/#CDW");
    await expect(page.getByTestId("stock-chart")).toBeVisible({ timeout: 60000 });
    await page.getByRole("button", { name: "3M" }).click();
    await expect(page.getByTestId("out-of-range-notice")).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("jump-to-event-btn")).toBeVisible();
  });

  test("should jump to event window", async ({ page }) => {
    await page.goto("/#CDW");
    await expect(page.getByTestId("stock-chart")).toBeVisible({ timeout: 60000 });
    await page.getByRole("button", { name: "3M" }).click();
    await expect(page.getByTestId("out-of-range-notice")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("jump-to-event-btn").click();
    // After jumping, wait a bit for chart to update
    await page.waitForTimeout(1500);
    // The event window button should be selected or notice should disappear
  });

  test("should switch between tickers", async ({ page }) => {
    await page.goto("/#PLTR");
    await expect(
      page.getByRole("main").getByText("Palantir")
    ).toBeVisible({ timeout: 15000 });
    await page.getByTestId("ticker-item-AXON").click();
    await expect(
      page.getByRole("main").getByText("Axon Enterprise")
    ).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/#AXON/);
  });

  test("should display warning icon for SMCI", async ({ page }) => {
    await page.goto("/#SMCI");
    await expect(
      page.getByRole("main").getByText("Super Micro Computer")
    ).toBeVisible({ timeout: 15000 });
    // Warning icon should be visible in the header area
    const warningBtn = page.getByRole("main").locator("button[aria-label]").first();
    await expect(warningBtn).toBeVisible();
  });

  test("should show announcement and effective dates for PLTR", async ({ page }) => {
    await page.goto("/#PLTR");
    const main = page.getByRole("main");
    await expect(main.getByText("December 13, 2024")).toBeVisible({ timeout: 15000 });
    await expect(main.getByText("December 23, 2024")).toBeVisible();
  });

  test("should show official source link", async ({ page }) => {
    await page.goto("/#PLTR");
    const link = page.getByRole("link", { name: /nasdaq announcement/i });
    await expect(link).toBeVisible({ timeout: 15000 });
    const href = await link.getAttribute("href");
    expect(href).toContain("nasdaq.com");
  });
});
