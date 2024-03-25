const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the URL tests', async ({ page }) => {
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

    /** Selecting Text Input from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'URL' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    /** Required tests */
    const requiredURL = page.locator('input[data-test-id="20815fd8b2e59e25b75185515b126212"]');
    attributes = await common.getAttributes(requiredURL);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredURL = page.locator('input[data-test-id="d50c2aa9fe6df301d0d3d5a667daeda2"]');
    attributes = await common.getAttributes(notRequiredURL);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledURL = page.locator('input[data-test-id="922758766489b064688aba17552c566d"]');
    attributes = await common.getAttributes(alwaysDisabledURL);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledURL = page.locator('input[data-test-id="ae2e04faf34d58c5bff6be9b4fc9b0d9"]');
    attributes = await common.getAttributes(conditionallyDisabledURL);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledURL = page.locator('input[data-test-id="cd5da1117b7b64256f2749d1664866bc"]');
    attributes = await common.getAttributes(neverDisabledURL);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyURL = page.locator('input[data-test-id="6180c34fa2ef0cbfe3459b6f94b89d62"]');
    attributes = await common.getAttributes(readonlyURL);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableURL = page.locator('input[data-test-id="79504c0d99166c4c0a0749bef59b5e0f"]');
    attributes = await common.getAttributes(editableURL);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Validation tests */
    const validationMsg = 'Please enter a valid URL including the protocol (http://, https://, ftp://, etc.)';
    await editableURL.fill('InvalidUrl');
    await editableURL.blur();
    await expect(page.locator(`p:has-text("${validationMsg}")`)).toBeVisible();
    await editableURL.click();
    await editableURL.clear();
    await editableURL.blur();
    await expect(page.locator(`p:has-text("${validationMsg}")`)).toBeHidden();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('input[data-test-id="c239893d906b22bc8de9c7f3d0c1e219"]')).toBeVisible();

    const neverVisibleURL = await page.locator('input[data-test-id="01cec81e2fe61acf1b0480187998d1ee"]');
    await expect(neverVisibleURL).not.toBeVisible();

    const conditionallyVisibleURL = await page.locator('input[data-test-id="c7a204d92fc6300c68859901de172f8b"]');

    if (isVisible) {
      await expect(conditionallyVisibleURL).toBeVisible();
    } else {
      await expect(conditionallyVisibleURL).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
