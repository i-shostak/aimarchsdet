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
    return this.headerContainer().isVisible();
  }

  /**
   * Opens the shopping cart from the header.
   */
  public async openCart(): Promise<void> {
    await this.locator('[data-test="shopping-cart-link"]').click();
  }

  /**
   * Returns item count from the cart badge. Returns 0 when badge is absent.
   * Throws if the badge contains a non-numeric value.
   */
  public async getCartBadgeCount(): Promise<number> {
    const badge = this.locator('[data-test="shopping-cart-badge"]');
    if (!(await badge.isVisible())) {
      return 0;
    }

    const raw = (await badge.innerText()).trim();
    const count = Number(raw);
    if (Number.isNaN(count)) {
      throw new Error(`Cart badge contains unexpected non-numeric value: "${raw}"`);
    }

    return count;
  }

  private headerContainer(): Locator {
    return this.locator('#header_container');
  }
}