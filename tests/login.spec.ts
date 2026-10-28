import { test, expect } from '../fixtures/test';
import { users, PASSWORD } from '../fixtures/users';

test.describe('Авторизация', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('успешный вход валидного пользователя @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.expectLoaded();
  });

  const negative = [
    { title: 'пустой логин', user: '', pass: PASSWORD, error: 'Username is required' },
    { title: 'пустой пароль', user: users.standard, pass: '', error: 'Password is required' },
    { title: 'неверный пароль', user: users.standard, pass: 'wrong', error: 'Username and password do not match' },
    { title: 'заблокированный пользователь', user: users.lockedOut, pass: PASSWORD, error: 'this user has been locked out' },
  ];

  for (const c of negative) {
    test(`ошибка входа: ${c.title}`, async ({ loginPage, page }) => {
      await loginPage.login(c.user, c.pass);
      await loginPage.expectError(c.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('нельзя открыть каталог без авторизации', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in");
  });

  test('выход из аккаунта', async ({ loggedIn, loginPage, page }) => {
    await loggedIn.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await page.goto('/inventory.html');
    await expect(loginPage.error).toBeVisible();
  });
});
