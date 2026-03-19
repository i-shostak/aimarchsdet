import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';

/**
 * Models the Sauce Demo cart and checkout workflows.
 */
export class CheckoutPage extends BasePage {
  public constructor(page: Page) {
    super(page);
  }

  /**
   * Returns whether Sauce Labs Backpack is visible in the cart page.
   * Scoped to the cart list to avoid false positives from inventory context.
   */
  public async isBackpackVisibleInCart(): Promise<boolean> {
    return this.getByTestId('cart-list')
      .getByTestId('inventory-item-name')
      .filter({ hasText: 'Sauce Labs Backpack' })
      .isVisible();
  }
}
