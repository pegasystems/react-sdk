const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Boolean tests', async ({ page }) => {
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

    /** Selecting Boolean from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'Boolean' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    // Checking required boolean field
    await expect(page.locator('div >> legend:has-text("Required Boolean")')).toBeVisible();
    await expect(page.locator('div >> p:has-text("Required field")')).toBeVisible();
    const requiredBooleanLabel = page.locator('label[data-test-id="325f4eb20dc7c90a4fb697cd6c6bf0ea"]');
    await expect(await requiredBooleanLabel.locator('span').getByText('BooleanRequired')).toBeVisible();
    requiredBooleanLabel.click(); // check required field
    requiredBooleanLabel.click(); // uncheck required field
    await expect(page.locator('p.Mui-error.Mui-required')).toBeVisible();
    requiredBooleanLabel.click();
    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    // Checking not required boolean field
    const notRequiredBooleanLabel = page.locator('label[data-test-id="da0d9f2c08a5bebe777c814af80a2351"]');
    notRequiredBooleanLabel.click(); // check required field
    notRequiredBooleanLabel.click(); // uncheck required field
    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // Disable tests
    const alwaysDisabledBoolean = page.locator('label[data-test-id="2f75cd75149315abb9d17aedfe1e129f"] input');
    attributes = await common.getAttributes(alwaysDisabledBoolean);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledBoolean = page.locator('label[data-test-id="a1e631c61eef59321ecda65e5b1e74df"] input');
    attributes = await common.getAttributes(conditionallyDisabledBoolean);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledBoolean = page.locator('label[data-test-id="c02c55807a1cda4f36c9736c17230e27"] input');
    attributes = await common.getAttributes(neverDisabledBoolean);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    // readonly boolean field
    const readonlyBoolean = page.locator('label[data-test-id="1a2aa7aad5f32dbd4638c3d5cf7b5d29"] input');
    attributes = await common.getAttributes(readonlyBoolean);
    await expect(attributes.includes('readonly')).toBeTruthy();

    // editable boolean field
    const editableBoolean = page.locator('label[data-test-id="d8d1f4bcad30bda634454182e0d1e67c"] input');
    editableBoolean.click();
    attributes = await common.getAttributes(editableBoolean);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    const alwaysVisibleBoolean = page.locator('label[data-test-id="9a31d647526143ebb08c22a58836510d"] input');
    await expect(alwaysVisibleBoolean).toBeVisible();

    const neverVisibleBoolean = await page.locator('label[data-test-id="521a807a0967b9fbbcc4a1232f1f8b46"] input');
    await expect(neverVisibleBoolean).not.toBeVisible();

    const conditionallyVisibleBoolean = await page.locator('label[data-test-id="dfbced3de44b50c470a58131004c31fe"] input');

    if (isVisible) {
      await expect(conditionallyVisibleBoolean).toBeVisible();
    } else {
      await expect(conditionallyVisibleBoolean).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
