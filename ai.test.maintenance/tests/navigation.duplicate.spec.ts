// -----------------------------------------------------------------------
// REDUNDANT – coverage already fully provided by:
//   • main.navigation.refactored.spec.ts  (page-object version)
//   • main.navigation.professional.spec.ts (TC-NAV-001 … TC-NAV-005)
//
// This file was written before the PlaywrightHomePage page-object existed.
// It tests the exact same navigation scenarios using raw CSS selectors and
// the deprecated Locator.waitFor() pattern.  Do not extend: update the
// canonical spec instead.
// -----------------------------------------------------------------------

import { test, expect } from '@playwright/test';

const navLinks = [
  { name: 'Docs',      url: '/docs/intro' },
  { name: 'API',       url: '/docs/api/class-playwright' },
  { name: 'Community', url: '/community/welcome' },
];

test.describe('Main page navigation (duplicate – no page object)', () => {

  // Redundant with main.navigation.refactored.spec.ts
  // 'should display navigation links: Docs, API, Community'
  test('navbar shows Docs, API, and Community links', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    for (const { name } of navLinks) {
      // Raw CSS attribute selector instead of role-based locator
      await expect(page.locator(`nav a[href]:has-text("${name}")`)).toBeVisible();
    }
  });

  // Redundant with the parameterised loop in main.navigation.refactored.spec.ts
  test('Docs link navigates to /docs/intro', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.navbar__link:has-text("Docs")').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/docs/intro');
  });

  test('API link navigates to /docs/api/class-playwright', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.navbar__link:has-text("API")').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/docs/api/class-playwright');
  });

  test('Community link navigates to /community/welcome', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.navbar__link:has-text("Community")').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/community/welcome');
  });

  // Redundant with TC-NAV-005 in main.navigation.professional.spec.ts
  test('Blog link is NOT in navbar', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page.locator('a.navbar__link:has-text("Blog")')).toHaveCount(0);
  });
});
