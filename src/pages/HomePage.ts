// path: src/pages/HomePage.ts
import type { Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

/**
 * Models the Sauce Demo inventory and cart workflows.
 */
export class HomePage extends BasePage {
  public constructor(page: Page) {
    super(page);
  }

  /**
   * Returns whether the inventory page is visible.
   */
  public async isInventoryPageVisible(): Promise<boolean> {
    return this.locator('[data-test="title"]').filter({ hasText: 'Products' }).isVisible();
  }

  /**
   * Adds Sauce Labs Backpack to cart from inventory.
   */
  public async addBackpackToCart(): Promise<void> {
    await this.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  }

  /**
   * Returns whether Sauce Labs Backpack is visible in the cart page.
   * Scoped to the cart list to avoid false positives from inventory context.
   */
  public async isBackpackVisibleInCart(): Promise<boolean> {
    return this.locator('[data-test="cart-list"]')
      .locator('[data-test="inventory-item-name"]')
      .filter({ hasText: 'Sauce Labs Backpack' })
      .isVisible();
  }

  /**
   * Returns the locator for the product sort/filter dropdown.
   */
  public productFilter(): Locator {
    return this.locator('[data-test="product-sort-container"]');
  }

}