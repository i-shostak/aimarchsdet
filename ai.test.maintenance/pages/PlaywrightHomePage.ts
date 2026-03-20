import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightHomePage {
  private readonly getStartedLink: Locator;
  private readonly mainNav: Locator;

  constructor(private readonly page: Page) {
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.mainNav = page.getByRole('navigation', { name: 'Main' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  navLink(name: string): Locator {
    return this.mainNav.getByRole('link', { name });
  }

  async clickNavLink(name: string): Promise<void> {
    await this.navLink(name).click();
  }

  async assertNavLink(name: string, url: string): Promise<void> {
    const link = this.navLink(name);
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', url);
  }

  /** Asserts the link carries aria-current="page" (active state — ARIA AP §3.14). */
  async assertNavLinkActive(name: string): Promise<void> {
    await expect(this.navLink(name)).toHaveAttribute('aria-current', 'page');
  }

  /** Asserts the link does NOT carry aria-current="page" (inactive sibling). */
  async assertNavLinkInactive(name: string): Promise<void> {
    await expect(this.navLink(name)).not.toHaveAttribute('aria-current', 'page');
  }

  /** Asserts the visible level-1 heading on the current page (exact match). */
  async assertDestinationHeading(text: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: text, exact: true, level: 1 })
    ).toBeVisible();
  }
}
