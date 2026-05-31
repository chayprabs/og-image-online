import { expect, test } from "@playwright/test";

test("home loads with tabs and export", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "SocialRender" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Code Image" })).toBeVisible();
  await expect(page.getByRole("button", { name: "OG Image" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
});

test("OG mode shows variable fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "OG Image" }).click();
  await expect(page.getByRole("textbox", { name: "Title", exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Subtitle" })).toBeVisible();
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
