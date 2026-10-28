import { test, expect } from '../fixtures/test';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Корзина', () => {
  test('добавление товаров меняет счётчик корзины @smoke', async ({ loggedIn }) => {
    await expect(loggedIn.cartBadge).toBeHidden();
    await loggedIn.addToCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.addToCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('удаление товара из каталога', async ({ loggedIn }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.removeFromCart(BACKPACK);
    await expect(loggedIn.cartBadge).toBeHidden();
    await expect(loggedIn.item(BACKPACK).getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('корзина сохраняется после перезагрузки страницы', async ({ loggedIn, page, cartPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await page.reload();
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.items).toContainText(BACKPACK);
  });
});
