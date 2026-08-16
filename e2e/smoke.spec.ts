import { test, expect } from "@playwright/test";

test.describe("A2M institutional site", () => {
  test("Swedish home loads with brand and CTAs", async ({ page }) => {
    await page.goto("/sv/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Digitala leveranser"
    );
    await expect(
      page.getByRole("link", { name: /Inled en dialog/i }).first()
    ).toBeVisible();
    await expect(page.getByText("A2M Tech AB").first()).toBeVisible();
  });

  test("English home loads", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Digital delivery"
    );
  });

  test("primary nav reaches Swedish services", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop nav");
    await page.goto("/sv/");
    await page
      .getByRole("navigation", { name: "Huvudnavigering" })
      .getByRole("link", { name: "Ert behov" })
      .click();
    await expect(page).toHaveURL(/\/sv\/(tjanster|services)\/?/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tjänster");
  });

  test("language switch maps to equivalent path", async ({ page, isMobile }) => {
    await page.goto("/sv/om-oss/");
    const switcher = isMobile
      ? page.getByRole("contentinfo").getByRole("button", { name: "Language" })
      : page.getByRole("banner").getByRole("button", { name: "Language" });
    await switcher.click();
    await page.getByRole("option", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/about\/?/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("About");
  });

  test("mobile menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");
    await page.goto("/sv/");
    await page.getByRole("button", { name: "Meny" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("dialog").getByRole("link", { name: "Kontakt" }).click();
    await expect(page).toHaveURL(/\/sv\/(kontakt|contact)\/?/);
  });

  test("contact page has Calendly and phone, no mailto company email", async ({
    page,
  }) => {
    await page.goto("/sv/kontakt/");
    await expect(page.getByRole("link", { name: /Calendly/i })).toBeVisible();
    await expect(
      page.locator("#main-content").getByRole("link", { name: /010-114/ })
    ).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test("keyboard can focus skip link", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop keyboard");
    await page.goto("/sv/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /Hoppa till innehåll/i });
    await expect(skip).toBeFocused();
  });

  test("new institutional routes resolve", async ({ page }) => {
    await page.goto("/sv/kvalitet-sakerhet/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kvalitet");
    await page.goto("/sv/partnerskap/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Partnerskap");
    await page.goto("/sv/insikter/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Insikter");
  });

  test("root redirects toward Swedish", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/sv\/?/);
  });
});
