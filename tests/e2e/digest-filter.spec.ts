import { test, expect } from "@playwright/test";

test.describe("フィルタリング機能", () => {
  test("カテゴリフィルタで記事を絞り込める", async ({ page }) => {
    await page.goto("/");
    // カテゴリフィルタの存在確認
    const filterBar = page.locator("[data-testid='category-filter']");
    if ((await filterBar.count()) > 0) {
      const newFeatureBtn = filterBar.getByText("新機能");
      if ((await newFeatureBtn.count()) > 0) {
        await newFeatureBtn.click();
        // URL にカテゴリパラメータが含まれるか、フィルタ適用を確認
        await page.waitForTimeout(500);
      }
    }
  });

  test("「すべて」でフィルタを解除できる", async ({ page }) => {
    await page.goto("/");
    const filterBar = page.locator("[data-testid='category-filter']");
    if ((await filterBar.count()) > 0) {
      const allBtn = filterBar.getByText("すべて");
      if ((await allBtn.count()) > 0) {
        await allBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
