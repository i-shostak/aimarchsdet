// path: playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

import { EnvHelper } from './src/utils/envHelper';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: EnvHelper.getDefaultTimeout(),
  expect: {
    timeout: EnvHelper.getExpectationTimeout(),
  },
  use: {
    baseURL: EnvHelper.getBaseUrl(),
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});