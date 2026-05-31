import { expect, test } from "@playwright/test";

test("home loads with tabs and export", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "SocialRender" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Code Image" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "OG Image" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" })).toBeVisible();
});

test("OG mode shows variable fields and template editor", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "OG Image" }).click();
  await expect(page.getByRole("textbox", { name: "Title", exact: true })).toBeVisible();
  await expect(page.getByText("Template JSON editor")).toBeVisible();
});

test("code preview renders in iframe", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('iframe[title="Code preview"]')).toBeVisible({ timeout: 10000 });
});

test("OG preview renders SVG", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "OG Image" }).click();
  await expect(page.locator('[role="img"][aria-label="OG image preview"] svg')).toBeVisible({
    timeout: 10000,
  });
});

test("SEO routes load", async ({ page }) => {
  await page.goto("/og-image-generator");
  await expect(page.getByRole("heading", { name: "OG Image Generator" })).toBeVisible();
});

test("legal pages load", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Terms & Conditions" })).toBeVisible();
});

test("twitter landing preselects OG mode", async ({ page }) => {
  await page.goto("/twitter-card-maker");
  await expect(page.getByRole("tab", { name: "OG Image" })).toHaveAttribute("aria-selected", "true");
});
