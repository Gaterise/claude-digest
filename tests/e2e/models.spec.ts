import { test, expect } from "@playwright/test";

test.describe("AI モデル比較ページ", () => {
  test("既定で Claude モデルタブが表示される", async ({ page }) => {
    await page.goto("/models");
    await expect(page.getByRole("tab", { name: /Claude モデル/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("table", { name: "スペック比較表" })).toBeVisible();
  });

  test("タブを切り替えると URL に反映され、再読み込みしても同じタブが開く", async ({ page }) => {
    await page.goto("/models");
    await page.getByRole("tab", { name: /ベンチマーク比較/ }).click();
    await expect(page).toHaveURL(/\?tab=benchmarks$/);

    await page.reload();
    await expect(page.getByRole("tab", { name: /ベンチマーク比較/ })).toHaveAttribute("aria-selected", "true");
  });

  test("URL で話題の AI モデルタブを直接開ける", async ({ page }) => {
    await page.goto("/models?tab=trending");
    await expect(page.getByRole("tab", { name: /話題の AI モデル/ })).toHaveAttribute("aria-selected", "true");
  });

  test("スマートフォン幅でページが横にはみ出さない", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const tab of ["claude", "benchmarks", "trending"]) {
      await page.goto(`/models?tab=${tab}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
});
