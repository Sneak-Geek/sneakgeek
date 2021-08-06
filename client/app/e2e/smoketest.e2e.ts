import { by, device, expect, element } from 'detox';

const timeout = 3000;

describe('Smoke test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have home screen', async () => {
    await expect(element(by.id('home'))).toBeVisible();
  });

  it('purchase flow (without login)', async () => {
    await waitFor(element(by.id('InventoryList')))
      .toBeVisible().withTimeout(timeout);
    await element(by.id('inventory')).atIndex(0).tap();

    // Product detail and product title is visible
    await expect(element(by.id('ProductTitle'))).toBeVisible();
    await expect(element(by.id('ProductDescription'))).toBeVisible();

    // Purchase flow
    await expect(element(by.id('ProductActionButton'))).toBeVisible();
    await element(by.id('ProductActionButton')).tap();
  });
});
