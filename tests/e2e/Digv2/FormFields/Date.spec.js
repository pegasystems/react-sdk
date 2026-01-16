const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Date tests', async ({ page }) => {
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

    /** Selecting Date from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li >> text="Date"').click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('p.Mui-error.Mui-required')).toBeVisible();

    /** Required tests */
    const requiredDate = page.locator('div[data-test-id="4aeccb2d830e2836aebba27424c057e1"]');
    const requiredDateInput = requiredDate.locator('input');
    await requiredDateInput.click();
    const futureDate = common.getFutureDate();
    await requiredDateInput.pressSequentially(futureDate);

    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    attributes = await common.getAttributes(requiredDateInput);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredDate = page.locator('div[data-test-id="3f56f9d617e6174716d7730f8d69cce5"]');
    const notRequiredDateInput = notRequiredDate.locator('input');
    attributes = await common.getAttributes(notRequiredDateInput);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledDate = page.locator('div[data-test-id="058f04d806163a3ea0ad42d63a44bff8"]');
    const alwaysDisabledDateInput = alwaysDisabledDate.locator('input');
    attributes = await common.getAttributes(alwaysDisabledDateInput);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDate = page.locator('div[data-test-id="1064f84bc0ba8525d5f141869fb73a3d"]');
    const conditionallyDisabledDateInput = conditionallyDisabledDate.locator('input');
    attributes = await common.getAttributes(conditionallyDisabledDateInput);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDate = page.locator('div[data-test-id="3cf7f70f60efb4035b562b6d5994badd"]');
    const neverDisabledDateInput = neverDisabledDate.locator('input');
    attributes = await common.getAttributes(neverDisabledDateInput);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyDate = page.locator('input[data-test-id="ffde26c63aa11b0de746587bc02779ee"]');
    attributes = await common.getAttributes(readonlyDate);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableDate = page.locator('div[data-test-id="80f5dcc587f457378158bb305ec858a8"]');
    const editableDateInput = editableDate.locator('input');
    await editableDateInput.click();
    await editableDateInput.pressSequentially(futureDate);
    attributes = await common.getAttributes(editableDateInput);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('div[data-test-id="8d1ca7132d5ebd69ccc69b850cf0e114"]')).toBeVisible();

    const neverVisibleDate = await page.locator('div[data-test-id="2d575befd938b2cf573f6cdee8d2c194"]');
    await expect(neverVisibleDate).not.toBeVisible();

    const conditionallyVisibleDate = await page.locator('div[data-test-id="2a50b142f72fe68effc573bb904c8364"]');
    const conditionallyVisibleDateInput = conditionallyVisibleDate.locator('input');
    if (isVisible) {
      await expect(conditionallyVisibleDateInput).toBeVisible();
    } else {
      await expect(conditionallyVisibleDateInput).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
