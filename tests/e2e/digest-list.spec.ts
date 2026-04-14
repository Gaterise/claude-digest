import { test, expect } from "@playwright/test";

test.describe("ダイジェスト一覧ページ", () => {
  test("トップページにアクセスするとダイジェスト一覧が表示される", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Claude Digest");
    // ダイジェストカードが 1 件以上あること（データが存在する場合）
    const cards = page.locator("[data-testid='digest-card']");
    const count = await cards.count();
    // データが無い場合は「まだダイジェストがありません」と表示
    if (count === 0) {
      await expect(page.getByText(/まだダイジェストがありません/)).toBeVisible();
    } else {
      await expect(cards.first()).toBeVisible();
    }
  });

  test("記事カードをクリックすると詳細ページに遷移する", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator("[data-testid='digest-card'] a").first();
    if ((await firstCard.count()) > 0) {
      const href = await firstCard.getAttribute("href");
      await firstCard.click();
      await expect(page).toHaveURL(href!);
      await expect(page.locator("h1")).toBeVisible();
    }
  });
});
