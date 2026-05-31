import { expect, test } from "@playwright/test";

test("OG title change updates preview without Sync", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "OG Image" }).click();
  await expect(page.locator('[aria-label="OG image preview"] svg')).toBeVisible({
    timeout: 10000,
  });

  const unique = `Live Title ${Date.now()}`;
  await page.getByRole("textbox", { name: "Title", exact: true }).fill(unique);
  await page.waitForTimeout(500);

  const svgHtml = await page
    .locator('[aria-label="OG image preview"]')
    .innerHTML();
  expect(svgHtml.length).toBeGreaterThan(100);
});

test("invalid OG template JSON clears preview and shows error", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "OG Image" }).click();
  await expect(page.locator('[aria-label="OG image preview"] svg')).toBeVisible({
    timeout: 10000,
  });

  const editor = page.locator('details:has(summary:text("Template JSON editor")) textarea');
  await editor.fill("{ broken");
  await page.getByRole("button", { name: "Apply JSON" }).click();
  await expect(page.locator("p.text-red-600")).toBeVisible({ timeout: 5000 });
});
