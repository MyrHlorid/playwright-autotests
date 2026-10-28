import { type Page, type Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortSelect = page.locator('.product_sort_container');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
    await expect(this.items.first()).toBeVisible();
  }

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortSelect.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#logout_sidebar_link').click();
  }
}
