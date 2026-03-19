// path: src/pages/BasePage.ts
import type { Locator, Page } from '@playwright/test';

/**
 * Defines shared browser interactions for page objects.
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /**
   * Navigates to a page path relative to the configured base URL.
   */
  public async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Waits until the current URL matches the expected value.
   */
  public async waitForUrl(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }

  /**
   * Returns the current page title.
   */
  public async getTitle(): Promise<string> {
    return this.page.title();
  }

  protected getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Locator {
    return this.page.getByRole(role, options);
  }

  protected getByLabel(
    text: Parameters<Page['getByLabel']>[0],
    options?: Parameters<Page['getByLabel']>[1],
  ): Locator {
    return this.page.getByLabel(text, options);
  }

  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}