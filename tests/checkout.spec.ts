import { test, expect } from '../fixtures/test';
import { customer } from '../fixtures/users';

test.describe('Оформление заказа (E2E)', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Onesie');
    await loggedIn.openCart();
    await cartPage.checkout();
  });

  test('полный путь покупки: корзина → данные → подтверждение @smoke', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInfo(customer);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('сумма заказа равна сумме цен товаров', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(customer);
    const expected = await checkoutPage.sumOfItemPrices();
    expect(await checkoutPage.subtotalValue()).toBeCloseTo(expected, 2);
  });

  const required = [
    { field: 'First Name', data: { ...customer, firstName: '' } },
    { field: 'Last Name', data: { ...customer, lastName: '' } },
    { field: 'Postal Code', data: { ...customer, postalCode: '' } },
  ];

  for (const r of required) {
    test(`валидация: обязательное поле ${r.field}`, async ({ checkoutPage, page }) => {
      await checkoutPage.fillInfo(r.data);
      await expect(checkoutPage.error).toContainText(`${r.field} is required`);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
