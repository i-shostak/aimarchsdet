import type { Locator, Page } from '@playwright/test';

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
}
