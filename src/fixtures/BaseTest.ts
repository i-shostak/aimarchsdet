// path: src/fixtures/BaseTest.ts
import { test as base, expect } from '@playwright/test';

import { HeaderComponent } from '../components/HeaderComponent';
import { AuthPage } from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';
import { EnvHelper } from '../utils/envHelper';
import { Logger } from '../utils/logger';

type FrameworkFixtures = {
  authPage: AuthPage;
  headerComponent: HeaderComponent;
  homePage: HomePage;
};

const test = base.extend<FrameworkFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  headerComponent: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

/**
 * Registers shared setup and teardown hooks for end-to-end tests.
 */
export class BaseTest {
  /**
   * Attaches the default beforeEach and afterEach hooks.
   */
  public static registerHooks(): void {
    test.beforeEach(async ({ page }, testInfo) => {
      Logger.info(`Starting test: ${testInfo.title}`);
      page.setDefaultTimeout(EnvHelper.getDefaultTimeout());
      await page.context().clearCookies();
    });

    test.afterEach(async ({}, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        Logger.error(`Test failed: ${testInfo.title} | status=${testInfo.status}`);
        return;
      }

      Logger.info(`Finished test: ${testInfo.title} | status=${testInfo.status}`);
    });
  }
}

BaseTest.registerHooks();

export { expect, test };