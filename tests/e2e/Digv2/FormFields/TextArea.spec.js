const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the TextArea tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Creating a Form Field case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Form Field")');
    await complexFieldsCase.click();

    /** Selecting TextArea from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'TextArea' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    /** Required tests */
    const requiredTextArea = page.locator('textarea[data-test-id="b82763ad8469c6be8d3303a773fc3337"]');
    requiredTextArea.fill('This is a textarea');
    attributes = await common.getAttributes(requiredTextArea);
    await expect(attributes.includes('required')).toBeTruthy();

    const notrequiredTextArea = page.locator('textarea[data-test-id="c8e8140c523f01908b73d415ff81e5e9"]');
    attributes = await common.getAttributes(notrequiredTextArea);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledTextArea = page.locator('textarea[data-test-id="0a9da72f88e89b62d5477181f60e326d"]');
    attributes = await common.getAttributes(alwaysDisabledTextArea);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTextArea = page.locator('textarea[data-test-id="ab462bc2f67456422bd65ef803e5f1f7"]');
    attributes = await common.getAttributes(conditionallyDisabledTextArea);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTextArea = page.locator('textarea[data-test-id="3c91efe71a84d1331627d97d2871b6cc"]');
    attributes = await common.getAttributes(neverDisabledTextArea);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyTextArea = page.locator('textarea[data-test-id="77a1ab038e906456b8e8c94c1671518c"]');
    attributes = await common.getAttributes(readonlyTextArea);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableTextArea = page.locator('textarea[data-test-id="66e97bb54e9e0ad5860ed79bb7b8e8d4"]');
    editableTextArea.fill('This is a TextArea');

    attributes = await common.getAttributes(editableTextArea);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('textarea[data-test-id="b1173be73e47e82896554ec60a590d6d"]')).toBeVisible();

    const neverVisibleTextArea = await page.locator('textarea[data-test-id="6de0e0e23e9aab0f4fef3d9d4f52c4d8"]');
    await expect(neverVisibleTextArea).not.toBeVisible();

    const conditionallyVisibleTextArea = await page.locator('textarea[data-test-id="4a41d6f28d7a25290f93127d3b5b0c64"]');

    if (isVisible) {
      await expect(conditionallyVisibleTextArea).toBeVisible();
    } else {
      await expect(conditionallyVisibleTextArea).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
