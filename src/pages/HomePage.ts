// path: src/pages/HomePage.ts
import type { Locator, Page } from '@playwright/test';

import { PriceHelper } from '../utils/priceHelper';
import { BasePage } from './BasePage';

/**
 * Models the Sauce Demo inventory workflows.
 */
export class HomePage extends BasePage {
  public constructor(page: Page) {
    super(page);
  }

  /**
   * Returns whether the inventory page is visible.
   */
  public async isInventoryPageVisible(): Promise<boolean> {
    return this.getByTestId('title').filter({ hasText: 'Products' }).isVisible();
  }

  /**
   * Adds Sauce Labs Backpack to cart from inventory.
   */
  public async addBackpackToCart(): Promise<void> {
    await this.getByTestId('add-to-cart-sauce-labs-backpack').click();
  }

  /**
   * Returns the locator for the product sort dropdown.
   */
  public productSort(): Locator {
    return this.getByTestId('product-sort-container');
  }

  /**
   * Returns all visible inventory item prices as numbers, in DOM order.
   */
  public async getInventoryPrices(): Promise<number[]> {
    const priceTexts = await this.getByTestId('inventory-item-price').allTextContents();
    return priceTexts.map((priceText) => PriceHelper.parseCurrency(priceText));
  }
}