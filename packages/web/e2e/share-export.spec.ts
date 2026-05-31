import { expect, test } from "@playwright/test";
import { decodeShareState, encodeShareState } from "@social-render/core";

const themeSelect = (page: import("@playwright/test").Page) =>
  page.locator('label:has(span:text-is("Theme")) select');

test.describe("share URL", () => {
  test("code mode round-trip restores theme and code via hash", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Code").fill('console.log("shared 🎉");');
    await themeSelect(page).selectOption("nord");
    await page.getByRole("button", { name: "Share" }).click();
    await expect(page.getByText(/Share link copied|Share URL updated/)).toBeVisible({
      timeout: 5000,
    });

    const hash = await page.evaluate(() => window.location.hash);
    const decoded = decodeShareState(hash);
    expect(decoded?.mode).toBe("code");
    expect(decoded?.payload).toMatchObject({
      code: 'console.log("shared 🎉");',
      theme: "nord",
    });

    await page.goto(`/${hash}`);
    await expect(themeSelect(page)).toHaveValue("nord");
    await expect(page.getByLabel("Code")).toHaveValue('console.log("shared 🎉");');
  });

  test("OG mode round-trip includes template fields", async ({ page }) => {
    const hash = encodeShareState({
      mode: "og",
      payload: {
        ogTitle: "QA Title",
        ogSubtitle: "Sub",
        brandTemplateId: "talk-slide",
        ogAccent: "#ff5500",
        ogTemplateJson: '{"templateId":"talk-slide"}',
      },
    });

    await page.goto(`/${hash}`);
    await page.getByRole("tab", { name: "OG Image" }).click();

    const decoded = decodeShareState(hash);
    expect(decoded?.payload).toMatchObject({
      ogTitle: "QA Title",
      ogAccent: "#ff5500",
      brandTemplateId: "talk-slide",
      ogTemplateJson: '{"templateId":"talk-slide"}',
    });

    await expect(page.getByRole("textbox", { name: "Title", exact: true })).toHaveValue(
      "QA Title",
    );
    await expect(page.getByLabel("Accent color")).toHaveValue("#ff5500");
  });

  test("hashchange hydrates without full reload", async ({ page }) => {
    await page.goto("/");
    await themeSelect(page).selectOption("github-dark");

    const hash = encodeShareState({
      mode: "code",
      payload: { code: "hashchange test", language: "typescript", theme: "dracula" },
    });

    await page.evaluate((h) => {
      window.location.hash = h.slice(1);
    }, hash);

    await expect(themeSelect(page)).toHaveValue("dracula", { timeout: 5000 });
    await expect(page.getByLabel("Code")).toHaveValue("hashchange test");
  });
});

test.describe("persistence", () => {
  test("localStorage save and reload", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Code").fill("PERSISTED_CODE_MARKER");
    await themeSelect(page).selectOption("github-dark");
    await page.waitForTimeout(400);

    await page.reload();
    await expect(page.getByLabel("Code")).toHaveValue("PERSISTED_CODE_MARKER");
    await expect(themeSelect(page)).toHaveValue("github-dark");
  });

  test("clearLocalData removes saved preferences", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "social-render:v1",
        JSON.stringify({ code: "OLD", theme: "nord" }),
      );
    });
    await page.reload();
    await expect(page.getByLabel("Code")).toHaveValue("OLD");

    await page.getByTitle("Clear saved preferences").click();
    await expect(page.getByText("Local preferences cleared")).toBeVisible();
    await expect(page.getByLabel("Code")).not.toHaveValue("OLD");

    const stored = await page.evaluate(() => localStorage.getItem("social-render:v1"));
    expect(stored).toBeNull();
  });
});

test.describe("export and copy", () => {
  test("copy succeeds before preview iframe is ready", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByLabel("Code").fill("const copyEarly = true;");
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Copied image to clipboard")).toBeVisible({ timeout: 15000 });
  });

  test("export succeeds when preview not yet rendered", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Code").fill("const exportEarly = true;");
    const downloadPromise = page.waitForEvent("download", { timeout: 20000 });
    await page.getByRole("button", { name: "Export" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^social-render@2x\.(png|jpg|webp|svg)$/);
    await expect(page.getByText("Exported successfully")).toBeVisible();
  });

  test("AVIF code export uses webp filename when avif unsupported", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Format").selectOption("avif");
    await page.waitForSelector('iframe[title="Code preview"]', { timeout: 10000 });

    const downloadPromise = page.waitForEvent("download", { timeout: 20000 });
    await page.getByRole("button", { name: "Export" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^social-render@2x\.webp$/);
  });
});

test.describe("mode and size presets", () => {
  test("mode switch preserves independent size presets", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "OG Image" }).click();
    await page.getByLabel("Size").selectOption("linkedin");
    await expect(page.getByLabel("Size")).toHaveValue("linkedin");

    await page.getByRole("tab", { name: "Code Image" }).click();
    await page.getByLabel("Size").selectOption("twitter");
    await expect(page.getByLabel("Size")).toHaveValue("twitter");

    await page.getByRole("tab", { name: "OG Image" }).click();
    await expect(page.getByLabel("Size")).toHaveValue("linkedin");
  });

  test("SEO routes set initial mode and size preset", async ({ page }) => {
    await page.goto("/code-screenshot");
    await expect(page.getByRole("tab", { name: "Code Image" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByLabel("Size")).toHaveValue("auto");

    await page.goto("/linkedin-preview-image");
    await expect(page.getByRole("tab", { name: "OG Image" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByLabel("Size")).toHaveValue("linkedin");
  });
});
