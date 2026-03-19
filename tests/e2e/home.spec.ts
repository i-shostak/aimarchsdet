// path: tests/e2e/home.spec.ts
import { expect, test } from '../../src/fixtures/BaseTest';
import { EnvHelper } from '../../src/utils/envHelper';

test.describe('Home page', () => {
  test('should login with standard user and open inventory page', async ({ headerComponent, homePage }) => {
    await homePage.gotoLoginPage();
    await expect.poll(async () => homePage.isLoginPageVisible()).toBe(true);

    await homePage.loginAsStandardUser();

    await expect.poll(async () => homePage.isInventoryPageVisible()).toBe(true);
    await expect.poll(async () => headerComponent.isVisible()).toBe(true);
  });

  test('should add backpack to cart', async ({ headerComponent, homePage }) => {
    await homePage.gotoLoginPage();
    await homePage.loginAsStandardUser();

    await homePage.addBackpackToCart();

    await expect.poll(async () => headerComponent.getCartBadgeCount()).toBe(1);

    await headerComponent.openCart();
    await homePage.waitForUrl(/.*cart.html/);

    await expect.poll(async () => homePage.isBackpackVisibleInCart()).toBe(true);
  });

  test('should apply product filter', async ({ homePage }) => {
    await homePage.gotoLoginPage();
    await homePage.login(EnvHelper.getSauceUsername(), EnvHelper.getSaucePassword());
    await homePage.waitForUrl(/.*inventory.html/);

    await expect.poll(async () => homePage.isInventoryPageVisible()).toBe(true);

    await homePage.productFilter().selectOption('za');

    await expect(homePage.productFilter()).toHaveValue('za');
  });
});