// path: src/pages/AuthPage.ts
import type { Page } from '@playwright/test';

import { EnvHelper } from '../utils/envHelper';
import { BasePage } from './BasePage';

/**
 * Models the Sauce Demo authentication flows: login and error states.
 */
export class AuthPage extends BasePage {
  public constructor(page: Page) {
    super(page);
  }

  /**
   * Opens the Sauce Demo login page.
   */
  public async gotoLoginPage(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Returns whether the login form is visible.
   */
  public async isLoginPageVisible(): Promise<boolean> {
    return this.getByTestId('login-button').isVisible();
  }

  /**
   * Logs into Sauce Demo with provided credentials.
   */
  public async login(username: string, password: string): Promise<void> {
    await this.getByTestId('username').fill(username);
    await this.getByTestId('password').fill(password);
    await this.getByTestId('login-button').click();
  }

  /**
   * Logs into Sauce Demo with the default standard user and waits for the inventory page.
   */
  public async loginAsStandardUser(): Promise<void> {
    await this.login(EnvHelper.getSauceUsername(), EnvHelper.getSaucePassword());
    await this.waitForUrl(/.*inventory.html/);
  }

  /**
   * Returns the text content of the login error message banner.
   */
  public async getLoginErrorMessage(): Promise<string | null> {
    return this.getByTestId('error').textContent();
  }
}
