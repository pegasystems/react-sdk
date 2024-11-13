const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Time tests', async ({ page }) => {
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

    /** Selecting TimeOnly from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'TimeOnly' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('p.Mui-error.Mui-required')).toBeVisible();

    /** Required tests */
    const requiredTime = page.locator('div[data-test-id="2a98fa391e3ce4e2a077bb71271eb2da"] >> input');
    const date = new Date();
    const time = `${date.getHours()}${date.getMinutes()}${date.getHours() >= 12 ? 'pm' : 'am'}`;
    requiredTime.pressSequentially(time);
    attributes = await common.getAttributes(requiredTime);
    await expect(attributes.includes('required')).toBeTruthy();

    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    const notRequiredTime = page.locator('div[data-test-id="921d625dba40a48cdcd006d6d17273fd"] >> input');
    attributes = await common.getAttributes(notRequiredTime);
    await expect(attributes.includes('required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // /** Disable tests */
    const alwaysDisabledTime = page.locator('div[data-test-id="b5b2a2335304986a2aba011c0a2a464d"] >> input');
    attributes = await common.getAttributes(alwaysDisabledTime);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTime = page.locator('div[data-test-id="9f7b7d5d8793642e0650a03f5f9dd991"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledTime);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTime = page.locator('div[data-test-id="aeb770a579929bf10a1b301600da68ca"] >> input');
    attributes = await common.getAttributes(neverDisabledTime);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readonlyTime = page.locator('input[data-test-id="084f8187169ed36f03937ecfd6e67087"]');
    attributes = await common.getAttributes(readonlyTime);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableTime = page.locator('div[data-test-id="9a43bbe34f0e3db5a53f8e89082c0770"] >> input');
    editableTime.pressSequentially(time);

    attributes = await common.getAttributes(editableTime);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('div[data-test-id="1b5786591e69307188bb7bb6ed1d6007"]')).toBeVisible();

    const neverVisibleTime = await page.locator('div[data-test-id="971d3da425a39fac98652a85633db661"] >> input');
    await expect(neverVisibleTime).not.toBeVisible();

    const conditionallyVisibleTime = await page.locator('div[data-test-id="6e52133ee5d2aef2dab9a8e61511c030"] >> input');

    if (isVisible) {
      await expect(conditionallyVisibleTime).toBeVisible();
    } else {
      await expect(conditionallyVisibleTime).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
