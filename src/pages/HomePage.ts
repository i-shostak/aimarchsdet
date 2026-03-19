// path: src/pages/HomePage.ts
import type { Page } from '@playwright/test';

import { HeaderComponent } from '../components/HeaderComponent';
import { EnvHelper } from '../utils/envHelper';
import { BasePage } from './BasePage';

/**
 * Models Sauce Demo user workflows: login, inventory, and cart.
 */
export class HomePage extends BasePage {
  public readonly header: HeaderComponent;

  public constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  /**
   * Opens the login page.
   */
  public async gotoHome(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Returns whether the login form is visible.
   */
  public async isLoginPageVisible(): Promise<boolean> {
    return this.locator('[data-test="login-button"]').isVisible();
  }

  /**
   * Logs into Sauce Demo with provided credentials.
   */
  public async login(username: string, password: string): Promise<void> {
    await this.locator('[data-test="username"]').fill(username);
    await this.locator('[data-test="password"]').fill(password);
    await this.locator('[data-test="login-button"]').click();
  }

  /**
   * Logs into Sauce Demo with the default standard user.
   */
  public async loginAsStandardUser(): Promise<void> {
    await this.login(EnvHelper.getSauceUsername(), EnvHelper.getSaucePassword());
    await this.waitForUrl(/.*inventory.html/);
  }

  /**
   * Returns whether the inventory page is visible.
   */
  public async isInventoryPageVisible(): Promise<boolean> {
    return this.locator('.title').filter({ hasText: 'Products' }).isVisible();
  }

  /**
   * Adds Sauce Labs Backpack to cart from inventory.
   */
  public async addBackpackToCart(): Promise<void> {
    await this.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  }

  /**
   * Returns whether Sauce Labs Backpack is visible in the cart page.
   */
  public async isBackpackVisibleInCart(): Promise<boolean> {
    return this.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' }).isVisible();
  }
}