import { by, device, expect, element} from 'detox';

const AppStrings = {
  PleaseLogin: 'Xin vui lòng đăng nhập'
};

const timeout = 10000;

describe('Smoke test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('purchase flow (without login)', async () => {
    // Wait for inventory list on home page
    await waitFor(element(by.id('InventoryList')))
      .toBeVisible().withTimeout(timeout);
    await element(by.id('inventory')).atIndex(0).tap();

    // Product detail and product title is visible
    await expect(element(by.id('ProductTitle'))).toBeVisible();

    // Purchase flow
    await expect(element(by.id('ProductActionButton'))).toBeVisible();
    await element(by.id('ProductActionButton')).tap();
    
    // Select size and price
    await waitFor(element(by.id('SizePriceList'))).toBeVisible().withTimeout(timeout);
    await element(by.id('SizePriceItem')).atIndex(0).tap();
    await element(by.id('BuyButton')).tap();
    await expect(element(by.id('BuyerDisplayName'))).not.toBeVisible(); // user info missing
    await element(by.id('BuyButton')).tap(); // tapping buy button when not logged in
    await element(by.label(AppStrings.PleaseLogin).and(by.type('_UIAlertControllerActionView'))).tap();
  });
});
