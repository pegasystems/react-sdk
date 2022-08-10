/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Data Reference', async ({
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
    let complexFieldsCase = page.locator('div[role="button"]:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting Embedded Data from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("EmbeddedData")').click();

    await page.locator('button:has-text("submit")').click();

    /** Option tests */

    /** SingleRecord options type test */

    const selectedOption = page.locator('div[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('li:has-text("SingleRecord")').click();

    /** Mode subcategory tests */

    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    /** Editable mode type tests */
    let selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Editable")').click();

    await page.locator('input[data-test-id="d61ebdd8a0c0cd57c22455e9f0918c65"]').type("Main St");
    await page.locator('input[data-test-id="57d056ed0984166336b7879c2af3657f"]').type("Cambridge");
    await page.locator('input[data-test-id="46a2a41cc6e552044816a2d04634545d"]').type("MA");
    await page.locator('input[data-test-id="25f75488c91cb6c3bab92672e479619f"]').type("02142");

    await page.locator('button:has-text("Next")').click();

    let assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Main St"]')).toBeVisible();
    await expect(assignment.locator('input[value="Cambridge"]')).toBeVisible();
    await expect(assignment.locator('input[value="MA"]')).toBeVisible();
    await expect(assignment.locator('input[value="02142"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type tests */
    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Readonly")').click();

    /** Testing the existence of 'readonly' attribute on the fields */
    const street = page.locator('input[data-test-id="d61ebdd8a0c0cd57c22455e9f0918c65"]');
    let attributes = await common.getAttributes(street);
    expect(attributes.includes('readonly')).toBeTruthy();

    const city = page.locator('input[data-test-id="57d056ed0984166336b7879c2af3657f"]');
    attributes = await common.getAttributes(city)
    expect(attributes.includes('readonly')).toBeTruthy();

    const state = page.locator('input[data-test-id="46a2a41cc6e552044816a2d04634545d"]');
    attributes = await common.getAttributes(state);
    expect(attributes.includes('readonly')).toBeTruthy();

    const postalCode = page.locator('input[data-test-id="25f75488c91cb6c3bab92672e479619f"]');
    attributes = await common.getAttributes(postalCode);
    expect(attributes.includes('readonly')).toBeTruthy();

    await page.locator('button:has-text("Next")').click();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
