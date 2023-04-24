/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Query', async ({
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

    /** Selecting Query from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("Query")').click();

    await page.locator('button:has-text("submit")').click();

    /** selecting SingleRecord option from dropdown  */
    const selectedOption = await page.locator(
      'div[data-test-id="365ab066d5dd67171317bc3fc755245a"]'
    );
    await selectedOption.click();
    await page.locator('li:has-text("SingleRecord")').click();

    /** Testing presence of Single Record Query data */
    const assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('span >> text="Sacramento"')).toBeVisible();
    await expect(assignment.locator('span >> text="CA"')).toBeVisible();
    await expect(assignment.locator('span >> text="2653"')).toBeVisible();

    /** Query as Table */
    /** selecting ListOfReords option from dropdown  */
    await selectedOption.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    /** selecting Table option from dropdown  */
    const selectedDisplayAs = await page.locator(
      'div[data-test-id="03e83bd975984c06d12c584cb59cc4ad"]'
    );
    await selectedDisplayAs.click();
    await page.locator('li:has-text("Table")').click();

    const tableRows = page.locator('div[id="simple-table-manual"]');
    await expect(tableRows).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
