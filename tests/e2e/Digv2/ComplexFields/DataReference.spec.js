/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

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
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting Data Reference from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("DataReference")').click();

    await page.locator('button:has-text("submit")').click();

    /** Display subcategory tests */

    /** Autocomplete display type test */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Display")').click();

    let selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Autocomplete")').click();

    let selectedProduct = page.locator('div[role="combobox"]');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    let assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(
      assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')
    ).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Dropdown display type tests */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Display")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Dropdown")').click();

    selectedProduct = page.locator('div[role="button"]:has-text("Basic Product")');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(
      assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')
    ).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Table display type tests */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Display")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Table")').click();

    selectedProduct = page.locator('tr:has-text("Basic Product")');
    const selectedProductRow = selectedProduct.locator('input[type="radio"]');
    await selectedProductRow.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(
      assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')
    ).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Options subcategory tests */

    /** SingleRecord options type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Options")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("SingleRecord")').click();

    selectedProduct = page.locator('div[role="combobox"]');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(
      assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')
    ).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** ListOfRecords options type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Options")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    selectedProduct = page.locator('tr:has-text("Luxury Product")');
    const selectedProductTestRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestRow.click();

    selectedProduct = page.locator('tr:has-text("Green Item")');
    const selectedProductTestSecondRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestSecondRow.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('tr:has-text("Luxury Product")')).toBeVisible();
    await expect(assignment.locator('tr:has-text("Green Item")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Mode subcategory tests */

    /** SingleSelect mode type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("SingleSelect")').click();

    selectedProduct = page.locator('div[role="combobox"]');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();
    await expect(selectedProduct).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(
      assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')
    ).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Readonly")').click();

    selectedProduct = page.locator('div[id="semantic-link-grid"] >> span >> text="Basic Product"');
    await expect(selectedProduct).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(
      assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')
    ).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
