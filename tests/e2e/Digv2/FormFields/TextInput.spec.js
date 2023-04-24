/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Text Input tests', async ({ page }) => {
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

    /** Creating a Form Field case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Form Field")');
    await complexFieldsCase.click();

    /** Selecting Text Input from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'TextInput' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    /** Required tests */
    const requiredTextInput = page.locator(
      'input[data-test-id="6d83ba2ad05ae97a2c75e903e6f8a660"]'
    );
    attributes = await common.getAttributes(requiredTextInput);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredTextInput = page.locator(
      'input[data-test-id="206bc0200017cc475d88b1bf4279cda0"]'
    );
    attributes = await common.getAttributes(notRequiredTextInput);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledTextInput = page.locator(
      'input[data-test-id="52ad9e3ceacdb9ccea7ca193c213228a"]'
    );
    attributes = await common.getAttributes(alwaysDisabledTextInput);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTextInput = page.locator(
      'input[data-test-id="9fd3c38fdf5de68aaa56e298a8c89587"]'
    );
    attributes = await common.getAttributes(conditionallyDisabledTextInput);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTextInput = page.locator(
      'input[data-test-id="0aac4de2a6b79dd12ef91c6f16708533"]'
    );
    attributes = await common.getAttributes(neverDisabledTextInput);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyTextInput = page.locator(
      'input[data-test-id="2fff66b4f045e02eab5826ba25608807"]'
    );
    attributes = await common.getAttributes(readonlyTextInput);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const EditableTextInput = page.locator(
      'input[data-test-id="95134a02d891264bca28c3aad682afb7"]'
    );
    attributes = await common.getAttributes(EditableTextInput);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(
      page.locator('input[data-test-id="a03145775f20271d9f1276b0959d0b8e"]')
    ).toBeVisible();

    const neverVisibleTextInput = await page.locator(
      'input[data-test-id="05bf85e34402515bd91335928c06117d"]'
    );
    await expect(neverVisibleTextInput).not.toBeVisible();

    const conditionallyVisibleTextInput = await page.locator(
      'input[data-test-id="d4b374793638017e2ec1b86c81bb1208"]'
    );

    if (isVisible) {
      await expect(conditionallyVisibleTextInput).toBeVisible();
    } else {
      await expect(conditionallyVisibleTextInput).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
