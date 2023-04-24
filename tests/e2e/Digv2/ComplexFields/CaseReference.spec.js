/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Case Reference', async ({
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

    /** Creating a Query case-type which will be referred by Complex Fields case type */
    let queryCase = page.locator('div[role="button"]:has-text("Query")');
    await queryCase.click();

    let modal =  page.locator('div[role="dialog"]');

    /** Value to be typed in the Name input */
    const name = "John Doe";

    await modal.locator('input').type(name);
    await modal.locator('button:has-text("submit")').click();

    /** Storing case-id of the newly created Query case-type(s), will be used later */
    const caseID = [];
    caseID.push(await page.locator('div[id="caseId"]').textContent());

    await page.locator('svg[id="chevron-right-icon"]').click();

    /** Creating another Query case-type which will be used for ListOfRecords mode */
    queryCase = page.locator('div[role="button"]:has-text("Query")');
    await queryCase.click();

    modal = page.locator('div[role="dialog"]');

    await modal.locator('input').type(name);
    await modal.locator('button:has-text("submit")').click();

    /** Wait until modal closes */
    await expect(modal).not.toBeVisible();

    caseID.push(await page.locator('div[id="caseId"]').textContent());

    await page.locator('svg[id="chevron-right-icon"]').click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting CaseReference from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("CaseReference")').click();

    await page.locator('button:has-text("submit")').click();

    /** Field sub category tests */

    const selectedSubCategory = page.locator('div[data-test-id="c2adefb64c594c6b634b3be9a40f6c83"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Field")').click();

    /** Dropdown-Local field type tests */
    const selectedTestName = page.locator('div[data-test-id="3e9562266329f358c8fad0ce1094def9"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Dropdown-Local")').click();

    await page.locator('div[data-test-id="83b6f3f7c774ee2157bfd81b548b07bf"]').click();
    await page.locator('li:has-text("Coffee")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text="Coffee"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Text field type tests */
    await selectedTestName.click();
    await page.locator('li:has-text("Text")').click();

    await page.locator('div[role="button"] >> nth=-1').click();

    await page.locator(`li >> text="${name}" >> nth=0`).click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator(`text="${name}"`)).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Dropdown-DP field type tests */
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

    /** SingleRecord mode type tests */
    await selectedTestName.click();
    await page.locator('li:has-text("SingleRecord")').click();

    await page.locator('input[id="search"]').type(caseID[0]);

    const selectedRow = await page.locator(`tr:has-text("${caseID[0]}")`);
    await selectedRow.locator('td >> span >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    const assignment = page.locator('div[id="Assignment"]');
    await expect(assignment.locator(`div >> span >> text="${caseID[0]}"`)).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** ListOfRecords mode type tests */
    await selectedTestName.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    await page.locator('input[id="search"]').type(caseID[0]);

    const selectedRow1 = await page.locator(`tr:has-text("${caseID[0]}")`);
    await selectedRow1.locator('td >> input >> nth=0').click();

    await page.locator('input[id="search"]').fill(caseID[1]);

    const selectedRow2 = await page.locator(`tr:has-text("${caseID[1]}")`);
    await selectedRow2.locator('td >> input >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator(`td >> text="${caseID[0]}"`)).toBeVisible();
    await expect(page.locator(`td >> text="${caseID[1]}"`)).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
