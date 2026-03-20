import { test, expect } from '@playwright/test';

import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Playwright docs', () => {
  test('has title', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    await homePage.goto();

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link navigates to installation page', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    await homePage.goto();
    await homePage.clickGetStarted();

    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });
});
