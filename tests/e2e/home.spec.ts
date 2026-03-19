// path: tests/e2e/home.spec.ts
import { expect, test } from '../../src/fixtures/BaseTest';
import { EnvHelper } from '../../src/utils/envHelper';

test.describe('Home page', () => {
  test('should login with standard user and open inventory page', async ({ authPage, headerComponent, homePage }) => {
    await authPage.gotoLoginPage();
    await expect.poll(async () => authPage.isLoginPageVisible()).toBe(true);

    await authPage.loginAsStandardUser();

    await expect.poll(async () => homePage.isInventoryPageVisible()).toBe(true);
    await expect.poll(async () => headerComponent.isVisible()).toBe(true);
  });

  test('should add backpack to cart', async ({ authPage, headerComponent, homePage }) => {
    await authPage.gotoLoginPage();
    await authPage.loginAsStandardUser();

    await homePage.addBackpackToCart();

    await expect.poll(async () => headerComponent.getCartBadgeCount()).toBe(1);

    await headerComponent.openCart();
    await homePage.waitForUrl(/.*cart.html/);

    await expect.poll(async () => homePage.isBackpackVisibleInCart()).toBe(true);
  });

  test('should show error message on login with invalid password', async ({ authPage }) => {
    await authPage.gotoLoginPage();
    await expect.poll(async () => authPage.isLoginPageVisible()).toBe(true);

    await authPage.login(EnvHelper.getSauceUsername(), 'invalid_password');

    const errorMessage = await authPage.getLoginErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
    await expect.poll(async () => authPage.isLoginPageVisible()).toBe(true);
  });

  test('should sort products by name Z to A', async ({ authPage, homePage }) => {
    await authPage.gotoLoginPage();
    await authPage.loginAsStandardUser();

    await expect.poll(async () => homePage.isInventoryPageVisible()).toBe(true);

    await homePage.productSort().selectOption('za');

    await expect(homePage.productSort()).toHaveValue('za');
  });

  test('should sort products by price low to high', async ({ authPage, homePage }) => {
    await authPage.gotoLoginPage();
    await authPage.loginAsStandardUser();

    await homePage.productSort().selectOption('lohi');

    const prices = await homePage.getInventoryPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('should sort products by price high to low', async ({ authPage, homePage }) => {
    await authPage.gotoLoginPage();
    await authPage.loginAsStandardUser();

    await homePage.productSort().selectOption('hilo');

    const prices = await homePage.getInventoryPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});