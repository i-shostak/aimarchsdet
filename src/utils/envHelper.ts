// path: src/utils/envHelper.ts

/**
 * Provides typed access to environment-driven test settings.
 */
export class EnvHelper {
  /**
   * Returns the base URL used by Playwright tests.
   */
  public static getBaseUrl(): string {
    return process.env.BASE_URL ?? 'https://www.saucedemo.com';
  }

  /**
   * Returns the default timeout used for actions and tests.
   */
  public static getDefaultTimeout(): number {
    return Number(process.env.DEFAULT_TIMEOUT ?? 30000);
  }

  /**
   * Returns the expectation timeout used for assertions.
   */
  public static getExpectationTimeout(): number {
    return Number(process.env.EXPECT_TIMEOUT ?? 10000);
  }

  /**
   * Returns the login user used by Sauce Demo tests.
   */
  public static getSauceUsername(): string {
    return process.env.SAUCE_USERNAME ?? 'standard_user';
  }

  /**
   * Returns the login password used by Sauce Demo tests.
   */
  public static getSaucePassword(): string {
    return process.env.SAUCE_PASSWORD ?? 'secret_sauce';
  }
}