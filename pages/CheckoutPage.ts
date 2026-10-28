import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemPrices = page.locator('.inventory_item_price');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillInfo(data: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.postalCode.fill(data.postalCode);
    await this.continueButton.click();
  }

  async subtotalValue(): Promise<number> {
    const text = (await this.subtotal.textContent()) ?? '';
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async sumOfItemPrices(): Promise<number> {
    const texts = await this.itemPrices.allTextContents();
    return texts.reduce((sum, t) => sum + Number(t.replace('$', '')), 0);
  }
}
