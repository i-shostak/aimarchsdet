import { test, expect } from '@playwright/test';

import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

interface NavLink {
  name: string;
  url: string;
  heading: string;
}

const navLinks: NavLink[] = [
  { name: 'Docs',      url: '/docs/intro',                heading: 'Installation'      },
  { name: 'API',       url: '/docs/api/class-playwright', heading: 'Playwright Library' },
  { name: 'Community', url: '/community/welcome',         heading: 'Welcome'           },
];

test.describe('Main page navigation', () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.goto();
  });

  test('should display navigation links: Docs, API, Community', async () => {
    for (const { name, url } of navLinks) {
      await homePage.assertNavLink(name, url);
    }
  });

  for (const { name, url, heading } of navLinks) {
    test(`${name} link opens the correct page`, async ({ page }) => {
      // Verify link target before clicking
      await homePage.assertNavLink(name, url);

      await homePage.clickNavLink(name);

      // Verify URL and destination page content loaded
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();

      // Verify active nav state is reflected accessibly
      await expect(homePage.navLink(name)).toHaveAttribute('aria-current', 'page');
    });
  }
});
