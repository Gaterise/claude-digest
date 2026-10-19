import { test, expect } from "@playwright/test";

test.describe("Claude モデル比較ページ", () => {
  test("Claude モデルのみをタブなしで表示する", async ({ page }) => {
    await page.goto("/models");
    await expect(page.getByRole("heading", { level: 1, name: "Claude モデル比較" })).toBeVisible();
    await expect(page.getByRole("table", { name: "スペック比較表" })).toBeVisible();
    await expect(page.getByRole("tablist")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /話題の AI 比較/ }).first()).toBeVisible();
  });

  test("旧 URL（?tab=benchmarks）は話題の AI 比較ページへ転送される", async ({ page }) => {
    await page.goto("/models?tab=benchmarks");
    await expect(page).toHaveURL(/\/ai-models\?tab=benchmarks$/);
    await expect(page.getByRole("tab", { name: /ベンチマーク比較/ })).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("話題の AI 比較ページ", () => {
  test("既定で話題の AI モデルタブが表示される", async ({ page }) => {
    await page.goto("/ai-models");
    await expect(page.getByRole("heading", { level: 1, name: "話題の AI 比較" })).toBeVisible();
    await expect(page.getByRole("tab", { name: /話題の AI モデル/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: /Claude モデル/ })).toHaveCount(0);
  });

  test("タブを切り替えると URL に反映され、再読み込みしても同じタブが開く", async ({ page }) => {
    await page.goto("/ai-models");
    await page.getByRole("tab", { name: /ベンチマーク比較/ }).click();
    await expect(page).toHaveURL(/\/ai-models\?tab=benchmarks$/);

    await page.reload();
    await expect(page.getByRole("tab", { name: /ベンチマーク比較/ })).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("ナビゲーション", () => {
  test("3点メニューに Claude モデル比較と話題の AI 比較が並ぶ", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /メニュー/ }).click();
    await expect(page.getByRole("link", { name: "Claude モデル比較" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "話題の AI 比較" }).first()).toBeVisible();
  });
});

test("スマートフォン幅でページが横にはみ出さない", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/models", "/ai-models", "/ai-models?tab=benchmarks"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  }
});
