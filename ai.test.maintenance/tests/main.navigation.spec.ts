import { test, expect } from '@playwright/test';

import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

const navLinks = [
  { name: 'Docs',      url: '/docs/intro' },
  { name: 'API',       url: '/docs/api/class-playwright' },
  { name: 'Community', url: '/community/welcome' },
];

test.describe('Main page navigation', () => {
  test('should display navigation links: Docs, API, Community', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    await homePage.goto();

    await expect(homePage.navLink('Docs')).toBeVisible();
    await expect(homePage.navLink('API')).toBeVisible();
    await expect(homePage.navLink('Community')).toBeVisible();
  });

  for (const { name, url } of navLinks) {
    test(`${name} link opens the correct page`, async ({ page }) => {
      const homePage = new PlaywrightHomePage(page);
      await homePage.goto();
      await homePage.clickNavLink(name);

      await expect(page).toHaveURL(url);
    });
  }
});
