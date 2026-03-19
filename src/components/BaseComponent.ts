// path: src/components/BaseComponent.ts
import type { Locator, Page } from '@playwright/test';

/**
 * Defines shared interactions for reusable page components.
 */
export abstract class BaseComponent {
  protected constructor(protected readonly page: Page) {}

  /**
   * Returns whether the component is visible to the user.
   */
  public abstract isVisible(): Promise<boolean>;

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