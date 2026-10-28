# Playwright Autotests

[![Playwright tests](../../actions/workflows/playwright.yml/badge.svg)](../../actions/workflows/playwright.yml)

Автотесты интернет-магазина [saucedemo.com](https://www.saucedemo.com) на **Playwright + TypeScript**.

## Что покрыто
| Модуль | Проверки |
|---|---|
| Авторизация | успешный вход, негативные кейсы (пустые поля, неверный пароль, заблокированный пользователь), доступ без логина, выход |
| Каталог | количество и цены товаров, сортировка по цене и названию |
| Корзина | счётчик, добавление/удаление, сохранение после перезагрузки |
| Оформление заказа | E2E-путь покупки, проверка суммы заказа, валидация обязательных полей |

Прогон в 3 конфигурациях: **Desktop Chrome, Desktop Firefox, Mobile Chrome (Pixel 7)**.

## Подходы
- **Page Object Model** — локаторы и действия вынесены в `pages/`
- **Кастомные фикстуры** (`fixtures/test.ts`) — готовые page-объекты и авторизованная сессия
- **Параметризованные тесты** для негативных сценариев (тест-дизайн: классы эквивалентности)
- Локаторы по `data-test` атрибутам и ролям — устойчивые к изменениям вёрстки
- Тег `@smoke` для быстрого прогона критичного пути
- Скриншот, видео и trace при падении, HTML-отчёт
- **CI: GitHub Actions** — прогон на push/PR, ночной прогон по расписанию, отчёт в артефактах

## Структура
```
pages/      Page Objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
fixtures/   фикстуры и тестовые данные
tests/      тесты по модулям
.github/workflows/playwright.yml   CI
```

## Запуск
```bash
npm install
npx playwright install
npm test              # все тесты, все браузеры
npm run test:smoke    # только @smoke
npm run test:headed   # с открытым браузером
npm run report        # HTML-отчёт
```
