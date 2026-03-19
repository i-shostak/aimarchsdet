// path: tests/e2e/home.spec.ts
import { expect, test } from '../../src/fixtures/BaseTest';

test.describe('Home page', () => {
  test('should login with standard user and open inventory page', async ({ headerComponent, homePage }) => {
    await homePage.gotoHome();
    await expect.poll(async () => homePage.isLoginPageVisible()).toBe(true);

    await homePage.loginAsStandardUser();

    await expect.poll(async () => homePage.isInventoryPageVisible()).toBe(true);
    await expect.poll(async () => headerComponent.isVisible()).toBe(true);
  });

  test('should add backpack to cart', async ({ headerComponent, homePage }) => {
    await homePage.gotoHome();
    await homePage.loginAsStandardUser();

    await homePage.addBackpackToCart();

    await expect.poll(async () => headerComponent.getCartBadgeCount()).toBe(1);

    await headerComponent.openCart();
    await homePage.waitForUrl(/.*cart.html/);

    await expect.poll(async () => homePage.isBackpackVisibleInCart()).toBe(true);
  });
});