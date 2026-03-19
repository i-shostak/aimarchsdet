// path: src/components/HeaderComponent.ts
import type { Locator, Page } from '@playwright/test';

import { BaseComponent } from './BaseComponent';

/**
 * Models the top inventory header in Sauce Demo.
 */
export class HeaderComponent extends BaseComponent {
  public constructor(page: Page) {
    super(page);
  }

  /**
   * Returns whether the header is visible.
   */
  public async isVisible(): Promise<boolean> {
    return this.headerLogo().isVisible();
  }

  /**
   * Opens the shopping cart from the header.
   */
  public async openCart(): Promise<void> {
    await this.locator('[data-test="shopping-cart-link"]').click();
  }

  /**
   * Returns item count from the cart badge. Returns 0 when badge is absent.
   */
  public async getCartBadgeCount(): Promise<number> {
    const badge = this.locator('[data-test="shopping-cart-badge"]');
    if (!(await badge.isVisible())) {
      return 0;
    }

    const value = await badge.innerText();
    return Number(value);
  }

  private headerLogo(): Locator {
    return this.locator('.app_logo');
  }
}