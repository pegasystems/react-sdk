/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for User Reference', async ({
    page
  }) => {
    await common.Login(
      config.config.apps.digv2.user.username,
      config.config.apps.digv2.user.password,
      page
    );

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting User Reference from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("UserReference")').click();

    await page.locator('button:has-text("submit")').click();

    /** selecting user from autocomplete field  */
    const searchBoxInputDiv = page.locator('div[data-test-id="75c6db46c48c2d7bb102c91d13ed766e"]');
    const searchBoxInput = searchBoxInputDiv.locator('input[aria-autocomplete="list"]');
    await searchBoxInput.type('user');
    const firstSearchboxOption = page.locator(
      'div[role="presentation"] ul[role="listbox"]>li:first-child'
    );
    await firstSearchboxOption.click();

    /** selecting first user from Dropdown field  */
    const userReferenceDropdownDiv = page.locator(
      'div[data-test-id="12781aa4899d4a2141570b5e52b27156"]'
    );
    await userReferenceDropdownDiv.click();
    const firstDropdownOption = page.locator(
      'div[role="presentation"] ul[role="listbox"]>li:nth-child(2)'
    );
    await firstDropdownOption.click();
    const selectedUser = firstDropdownOption.innerHTML;

    /** check readonly user reference value is same as dropdown selected user */
    const user = await page.locator('app-operator span[class="mat-button-wrapper"]').innerHTML;
    await expect(user).toBe(selectedUser);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
