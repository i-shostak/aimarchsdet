// -----------------------------------------------------------------------
// LEGACY – kept for historical reference only.
// This file predates the PlaywrightHomePage page-object and has NOT been
// updated since the playwright.dev site redesign (2024-Q1).
//
// Known issues:
//   • Hardcoded base URL – ignores playwright.config.ts baseURL setting.
//   • Uses waitForTimeout() throughout – masks real flakiness.
//   • 'Blog' nav link was removed from the primary navbar in 2024.
//   • Tagline text changed; the old assertion '.hero__subtitle' will fail.
//   • Footer copyright year is hardcoded to 2023.
// -----------------------------------------------------------------------

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://playwright.dev';

test.describe('playwright.dev home page (LEGACY)', () => {

  test('page has correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);

    // Title was "Fast and reliable end-to-end testing for modern web apps | Playwright"
    // Site retitled in 2024 – this assertion is now stale.
    await expect(page).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright');
  });

  test('hero subtitle is visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);

    // Old CSS class used before Docusaurus v3 migration.
    const subtitle = page.locator('.hero__subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Any browser • Any platform • One API');
  });

  test('Blog link is present in navbar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // 'Blog' was removed from the primary navbar during the 2024 redesign.
    const blogLink = page.locator('a.navbar__link:has-text("Blog")');
    await expect(blogLink).toBeVisible();
  });

  test('footer shows 2023 copyright', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Year hardcoded – will silently become wrong every January.
    const footer = page.locator('footer');
    await expect(footer).toContainText('Copyright © 2023 Microsoft');
  });

  test('Get Started button exists', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Duplicate of playwright-docs.spec.ts – 'get started link navigates to installation page'
    const btn = page.locator('a.button:has-text("Get Started")');
    await expect(btn).toBeVisible();
  });
});
