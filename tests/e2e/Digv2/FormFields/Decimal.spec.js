const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Decimal tests', async ({ page }) => {
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

    /** Selecting Decimal from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'Decimal' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('p.Mui-error.Mui-required')).toBeVisible();

    /** Required tests */
    const requiredDecimal = page.locator('input[data-test-id="9de2a78c2dd0d4dfff4a9bf33349197d"]');
    requiredDecimal.click();
    await requiredDecimal.clear();
    await requiredDecimal.fill('12345');
    requiredDecimal.blur();
    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    attributes = await common.getAttributes(requiredDecimal);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredDecimal = page.locator('input[data-test-id="ec06f580c56642afef52547b6755695e"]');
    attributes = await common.getAttributes(notRequiredDecimal);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledDecimal = page.locator('input[data-test-id="a8216a966548578ad7e015a05ae518f5"]');
    attributes = await common.getAttributes(alwaysDisabledDecimal);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDecimal = page.locator('input[data-test-id="fdd7f2ac36278186ac15c11d4c30ece1"]');
    attributes = await common.getAttributes(conditionallyDisabledDecimal);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDecimal = page.locator('input[data-test-id="e91313ec779184e1b172bdc7870f3d4c"]');
    attributes = await common.getAttributes(neverDisabledDecimal);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyDecimal = page.locator('input[data-test-id="acdcc5f01c940f07cf14373612721a0c"]');
    attributes = await common.getAttributes(readonlyDecimal);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableDecimal = page.locator('input[data-test-id="3e8f5b4dd3786ae5d79fd2dfa2e53cac"]');
    editableDecimal.fill('12345');

    attributes = await common.getAttributes(editableDecimal);
    await expect(attributes.includes('readonly')).toBeFalsy();

    const decimalAsCurrency = page.locator('input[data-test-id="9e438afab6d7ec67b5582bded10f5172"]');
    attributes = await common.getAttributes(decimalAsCurrency);
    await expect(attributes.includes('readonly')).toBeTruthy();
    await expect(await decimalAsCurrency.inputValue()).toBe('$20');

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="847e3fd45a1aca1c3242d2735124eb9a"]')).toBeVisible();

    const neverVisibleDecimal = await page.locator('input[data-test-id="c73cc441b5988a07bfb30ce168c98800"]');
    await expect(neverVisibleDecimal).not.toBeVisible();

    const conditionallyVisibleDecimal = await page.locator('input[data-test-id="6e93264d15f63cf06e79a402e48c283b"]');

    if (isVisible) {
      await expect(conditionallyVisibleDecimal).toBeVisible();
    } else {
      await expect(conditionallyVisibleDecimal).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
