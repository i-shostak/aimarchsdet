import { test, expect } from '@playwright/test';

import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

// Exported for reuse in other specs that need nav-link data
export interface NavLink {
  name: string;
  url: string;
  heading: string;
}

/** Matches a URL path with or without a trailing slash, anchored at the end. */
function urlRegex(path: string): RegExp {
  return new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\/?$');
}

const navLinks: NavLink[] = [
  // Headings verified against playwright.dev as of 2026-03
  { name: 'Docs',      url: '/docs/intro',                heading: 'Installation'      },
  { name: 'API',       url: '/docs/api/class-playwright', heading: 'Playwright Library' },
  { name: 'Community', url: '/community/welcome',         heading: 'Welcome'           },
];

/** Link names that must never appear in the primary navbar (regression guard). */
const disallowedNavLinks = ['Blog', 'Pricing', 'Login'];

test.describe('playwright.dev — primary navbar', () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.goto();
  });

  // TC-NAV-001: Positive – all expected primary links are visible with correct hrefs
  test('[TC-NAV-001] primary navbar displays all expected links with correct hrefs',
    { annotation: { type: 'TC', description: 'TC-NAV-001' } },
    async () => {
      for (const { name, url } of navLinks) {
        await homePage.assertNavLink(name, url);
      }
    }
  );

  // TC-NAV-002–004: Per-link navigation, content, ARIA state, and page title assertions
  for (const [index, { name, url, heading }] of navLinks.entries()) {
    const tcId = `TC-NAV-${String(index + 2).padStart(3, '0')}`;

    test(`[${tcId}] clicking "${name}" lands on ${url}, renders "${heading}" h1, and sets aria-current`,
      { annotation: { type: 'TC', description: tcId } },
      async ({ page }) => {
        await homePage.clickNavLink(name);

        // URL must resolve to the expected path, with or without a trailing slash
        await expect(page).toHaveURL(urlRegex(url));

        // Page <title> must contain the heading keyword (e.g. "Installation | Playwright")
        await expect(page).toHaveTitle(new RegExp(heading, 'i'));

        // Destination h1 must match exactly — prevents false positives like 'Installation Guide'
        await homePage.assertDestinationHeading(heading);

        // Active link must carry aria-current="page" (ARIA AP §3.14)
        await homePage.assertNavLinkActive(name);

        // Only one link may be active at a time; all siblings must be inactive
        for (const { name: sibling } of navLinks.filter(l => l.name !== name)) {
          await homePage.assertNavLinkInactive(sibling);
        }
      }
    );
  }

  // TC-NAV-005: Negative – unexpected links must never be present in the primary navbar
  test('[TC-NAV-005] primary navbar must not expose unexpected links (Blog, Pricing, Login)',
    { annotation: { type: 'TC', description: 'TC-NAV-005' } },
    async () => {
      for (const name of disallowedNavLinks) {
        await expect(homePage.navLink(name)).toBeHidden();
      }
    }
  );

  // TC-NAV-006: Edge – each nav link href must be a real, interactable path
  //             Guards against placeholder anchors or disabled links reaching production.
  test('[TC-NAV-006] nav links must each resolve to a valid, interactable href',
    { annotation: { type: 'TC', description: 'TC-NAV-006' } },
    async () => {
      for (const { name } of navLinks) {
        const link = homePage.navLink(name);

        // Link must resolve to a real path, not a stub
        await expect(link).not.toHaveAttribute('href', '#');
        await expect(link).not.toHaveAttribute('href', '');

        // href must not begin with 'javascript:' – a common XSS vector and a dead link
        const href = await link.getAttribute('href');
        expect(href, `${name} href must not be a javascript: URI`).not.toMatch(/^javascript:/i);

        // Link must be visible and interactable (not hidden, not aria-disabled)
        await expect(link).toBeVisible();
        await expect(link).not.toHaveAttribute('aria-disabled', 'true');
        await expect(link).toBeEnabled();
      }
    }
  );
});
