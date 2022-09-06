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
    await page.locator('li:has-text("CaseReference")').click();

    await page.locator('button:has-text("submit")').click();

    /** Fields tests */

    /** Field sub category tests */

    let selectedSubCategory = page.locator('div[data-test-id="c2adefb64c594c6b634b3be9a40f6c83"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Field")').click();

    /** Dropdown-Local field type tests */
    let selectedTestName = page.locator('div[data-test-id="3e9562266329f358c8fad0ce1094def9"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Dropdown-Local")').click();

    await page.locator('div[data-test-id="83b6f3f7c774ee2157bfd81b548b07bf"]').click();
    await page.locator('li:has-text("Coffee")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text="Coffee"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    await selectedTestName.click();
    await page.locator('li:has-text("Text")').click();

    await page.locator('div[role="button"] >> nth=-1').click();
    await page.locator('li >> text="John" >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text="John"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    await selectedTestName.click();
    await page.locator('li:has-text("Dropdown-DP")').click();


    await page.locator('div[data-test-id="311f2f128456b3bf37c7568da9ac1898"]').click();
    await page.locator('li:has-text("Dropdown")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text="Dropdown"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Mode tests */


    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    await selectedTestName.click();
    await page.locator('li:has-text("SingleRecord")').click();

    const selectedRow = await page.locator('tr:has-text("Q-2004")');
    await selectedRow.locator('td >> span >> span >> nth=0').click();

    //await page.locator('td:has-text("Q-2004")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('td >> text="Q-2004"')).toBeVisible();

    //await page.pause();

    await page.locator('button:has-text("Previous")').click();

    await selectedTestName.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    const selectedRow1 = await page.locator('tr:has-text("Q-2004")');
    await selectedRow1.locator('td >> span >> span >> nth=0').click();
    // const selectedRow2 = await page.locator('tr:has-text("Q-2005")');
    // await selectedRow2.locator('td >> span >> span >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('td >> text="Q-2004"')).toBeVisible();
    await expect(page.locator('td >> text="Q-2005"')).toBeVisible();



    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
