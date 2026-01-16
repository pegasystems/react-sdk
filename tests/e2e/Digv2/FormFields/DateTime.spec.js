const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the DateTime tests', async ({ page }) => {
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

    /** Selecting DateTime from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li >> text="DateTime"').click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('p.Mui-error.Mui-required')).toBeVisible();

    /** Required tests */
    const requiredDateTime = page.locator('div[data-test-id="8c40204d0a4eee26d94339eee34ac0dd"]');
    const requiredDateTimeInput = requiredDateTime.locator('input');
    const date = new Date();
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}${date
      .getDate()
      .toString()
      .padStart(2, '0')}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getHours() >= 12 ? 'pm' : 'am'}`;
    await requiredDateTimeInput.click();
    await requiredDateTimeInput.pressSequentially(formattedDate);

    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    attributes = await common.getAttributes(requiredDateTimeInput);
    await expect(attributes.includes('required')).toBeTruthy();

    const notRequiredDateTime = page.locator('div[data-test-id="4af9f6fe0973eef74015a25fc36784c0"]');
    const notRequiredDateTimeInput = notRequiredDateTime.locator('input');
    attributes = await common.getAttributes(notRequiredDateTimeInput);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledDateTime = page.locator('div[data-test-id="94d0498d6fd5a5aa2db1145100810fc3"]');
    const alwaysDisabledDateTimeInput = alwaysDisabledDateTime.locator('input');
    attributes = await common.getAttributes(alwaysDisabledDateTimeInput);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDateTime = page.locator('div[data-test-id="98882344d484a1122bdb831ace88b0d3"]');
    const conditionallyDisabledDateTimeInput = conditionallyDisabledDateTime.locator('input');
    attributes = await common.getAttributes(conditionallyDisabledDateTimeInput);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDateTime = page.locator('div[data-test-id="33d5b006df6170d453d52c438271f0eb"]');
    const neverDisabledDateTimeInput = neverDisabledDateTime.locator('input');
    attributes = await common.getAttributes(neverDisabledDateTimeInput);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyDateTime = page.locator('input[data-test-id="13858d32e1a9e9065cbef90a4fc4467e"]');
    attributes = await common.getAttributes(readonlyDateTime);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableDateTime = page.locator('div[data-test-id="4e5110fbcaf65441b3e4c763907b5eb8"]');
    const editableDateTimeInput = editableDateTime.locator('input');
    await editableDateTimeInput.click();
    await editableDateTimeInput.pressSequentially(formattedDate);
    attributes = await common.getAttributes(editableDateTimeInput);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('div[data-test-id="f7bace3922d6b19942bcb05f4bbe34ff"]')).toBeVisible();

    const neverVisibleDateTime = await page.locator('div[data-test-id="1d7b52f872b9425481bb5c42863dbe02"]');
    await expect(neverVisibleDateTime).not.toBeVisible();

    const conditionallyVisibleDateTime = await page.locator('div[data-test-id="d7168c76ee76f4242fee3afbd4c9f745"]');
    const conditionallyVisibleDateTimeInput = conditionallyVisibleDateTime.locator('input');
    if (isVisible) {
      await expect(conditionallyVisibleDateTimeInput).toBeVisible();
    } else {
      await expect(conditionallyVisibleDateTimeInput).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
