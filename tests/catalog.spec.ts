import { test, expect } from '../fixtures/test';

test.describe('Каталог товаров', () => {
  test('отображаются все 6 товаров с ценой @smoke', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
    for (const price of await loggedIn.prices()) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('сортировка по цене: по возрастанию', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('сортировка по цене: по убыванию', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('сортировка по названию: Z → A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });
});
