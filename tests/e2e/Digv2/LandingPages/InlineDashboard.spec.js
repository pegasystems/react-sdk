const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Inline Dashboard template', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Complex Fields")');
    await complexFieldsCase.click();

    const caseID = await page.locator('div[id="caseId"]').textContent();

    await page.locator('button:has-text("submit")').click();

    /* Testing InlineDashboard landing page */
    const inlineDashboard = page.locator('div[role="button"]:has-text("Inline Dashboard")');

    await inlineDashboard.click();

    /** Testing Complex Fields list presence */
    const complexFieldsList = page.locator('h6:has-text("Complex  Fields - List")');
    await expect(complexFieldsList).toBeVisible();

    const table = await page.locator('div[id="list-view"] >> nth=0');
    const numOfRows = await table.locator('tbody >> tr').count();

    /** Testing My Work List presence */
    const myworkList = page.locator('h6:has-text("My Work List")');
    await expect(myworkList).toBeVisible();

    /* Testing the filters */
    const filters = page.locator('div[id="filters"]');
    const caseIdFilter = filters.locator('div:has-text("Case ID")');
    caseIdFilter.locator('input').fill(caseID);

    const pagination = page.locator('div[id="pagination"]');
    await expect(pagination.locator('p:has-text("1–1 of 1")')).toBeVisible();

    await expect(table.locator(`td >> text=${caseID}`)).toBeVisible();
    await expect(table.locator('td >> text="Complex  Fields"')).toBeVisible();
    await expect(table.locator('td >> text="User DigV2"')).toBeVisible();
    await expect(table.locator('td >> text="New"')).toBeVisible();

    const dateFilter = filters.locator('div:has-text("Create date/time")');
    dateFilter.locator('input').click();
    const datePicker = filters.locator(
      'div[class="react-datepicker-popper"] div[class="react-datepicker"] div[class="react-datepicker__month-container"]'
    );
    const day = new Date();
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const currentMonthSelector = await datePicker.locator(`.react-datepicker__day:not(.react-datepicker__day--outside-month)`);

    await currentMonthSelector.locator(`text="${day.getDate().toString()}"`).click();
    await currentMonthSelector.locator(`text="${nextDay.getDate().toString()}"`).click();

    const dateCol = await table.locator('td >> nth=2');
    await expect(dateCol.getByText(`${new Date().getDate().toString().padStart(2, '0')}`)).toBeVisible();

    await page.locator('a:has-text("Clear All")').click();

    await page.waitForLoadState('networkidle');

    await expect(await caseIdFilter.locator('input').inputValue()).toEqual('');
    await expect(await dateFilter.locator('input').inputValue()).toEqual('');

    await expect(await table.locator('tbody >> tr')).toHaveCount(numOfRows);
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
