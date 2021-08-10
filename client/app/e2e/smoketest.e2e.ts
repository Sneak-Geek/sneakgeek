import { by, device, expect, element } from 'detox';
import fetch from 'node-fetch';

const AppStrings = {
  PleaseLogin: 'Xin vui lòng đăng nhập',
  Account: 'Tài khoản',
  Login: 'Đăng nhập',
  Logout: 'Đăng xuất'
};

const timeout = 10000;

describe('Smoke test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Sign up (with email)', async () => {
    await element(by.label(AppStrings.Account)).tap();
    await element(by.label(AppStrings.Login)).tap();
    await expect(element(by.id('LoginScreen'))).toBeVisible();
    await expect(element(by.id('EmailSignUpButton'))).toBeVisible();
    await element(by.id('EmailSignUpButton')).tap();
    await expect(element(by.id('EmailSignUpInput'))).toBeVisible();
    await element(by.id('EmailSignUpInput')).tap();
    await element(by.id('EmailSignUpInput')).typeText('sneakgeek.test+e2e@gmail.com');
    await element(by.id('EmailSignUpPasswordInput')).typeText('password\n');
    await expect(element(by.id('ConfirmSignUpButton'))).toBeVisible();
    await element(by.id('ConfirmSignUpButton')).tap();
    await waitFor(element(by.id('InventoryList')))
      .toBeVisible().withTimeout(timeout); // homescreen is visible

    // need to delete test account
    await fetch(`http://localhost:8080/api/v1/profile/auth/delete-test-user`);
  });

  it('Login (with email)', async () => {
    await element(by.label(AppStrings.Account)).tap();
    await element(by.label(AppStrings.Login)).tap();
    await expect(element(by.id('LoginScreen'))).toBeVisible();
    await expect(element(by.id('EmailLogin'))).toBeVisible();
    await element(by.id('EmailLogin')).tap();
    await element(by.id('EmailInput')).typeText('sneakgeek.test+user@gmail.com');
    await element(by.id('PasswordInput')).typeText('sneakgeek');
    await element(by.id('LoginButton')).tap();
    await waitFor(element(by.id('InventoryList')))
      .toBeVisible().withTimeout(timeout); // homescreen is visible
  });

  it('Purchase flow (without login)', async () => {
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
