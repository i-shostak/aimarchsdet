// -----------------------------------------------------------------------
// OUTDATED – references the old "Getting Started" URL and heading that
// were renamed during the Docusaurus v3 migration (2024-Q2).
//
// Old path : /docs/getting-started  → now redirects to /docs/intro
// Old h1   : 'Getting Started'      → now 'Installation'
// Old h1   : 'Writing Tests'        → section was split; no longer a top-level h1
//
// Uses the deprecated page.$eval() API  (superseded by Locator API in PW 1.14).
// Uses page.click(selector) string overload (removed in PW 1.27).
//
// Overlaps with playwright-docs.spec.ts:
//   'get started link navigates to installation page'
// -----------------------------------------------------------------------

import { test, expect } from '@playwright/test';

test.describe('Get Started flow (OUTDATED)', () => {

  test('Get Started link exists on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Duplicate of playwright-docs.spec.ts – 'get started link navigates to installation page'
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('Get Started navigates to old /docs/getting-started URL', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // This URL was retired in 2024-Q2 and now either 404s or redirects.
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL('/docs/getting-started');
  });

  test('installation page has "Getting Started" heading', async ({ page }) => {
    // Old heading – renamed to 'Installation' in 2024-Q2.
    await page.goto('/docs/getting-started');
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole('heading', { name: 'Getting Started', level: 1 })
    ).toBeVisible();
  });

  test('sidebar contains Writing Tests section', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForTimeout(2000);

    // 'Writing Tests' was split into multiple sub-pages; this selector no longer matches.
    const sidebarItem = page.locator('.menu__link:has-text("Writing Tests")');
    await expect(sidebarItem).toBeVisible();
  });

  test('page title contains "Getting Started"', async ({ page }) => {
    // Duplicate – playwright-docs.spec.ts already checks /Playwright/ title.
    await page.goto('/docs/getting-started');
    await page.waitForTimeout(2000);

    // Title changed to 'Installation | Playwright'
    await expect(page).toHaveTitle(/Getting Started \| Playwright/);
  });
});
