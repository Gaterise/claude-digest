import { test, expect } from "@playwright/test";

test.describe("ダイジェスト詳細ページ", () => {
  for (const width of [1280, 768, 375]) {
    test(`幅 ${width}px でバージョン番号が欄からはみ出さない`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const firstCard = page.locator("[data-testid='digest-card'] a").first();
      test.skip((await firstCard.count()) === 0, "記事データがない");
      const href = await firstCard.getAttribute("href");
      await firstCard.click();
      await expect(page).toHaveURL(href!, { timeout: 15000 });
      await expect(page.locator("h1")).toBeVisible();

      const version = page.getByTestId("detail-version");
      test.skip((await version.count()) === 0, "バージョン番号のない記事");
      await expect(version).toBeVisible();

      const overflow = await version.evaluate((el) => {
        const column = el.closest("[data-testid='detail-meta']") as HTMLElement;
        const style = getComputedStyle(column);
        const contentRight = column.getBoundingClientRect().right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth);
        const range = document.createRange();
        range.selectNodeContents(el);
        return range.getBoundingClientRect().right - contentRight;
      });
      expect(overflow).toBeLessThanOrEqual(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    });
  }
});
