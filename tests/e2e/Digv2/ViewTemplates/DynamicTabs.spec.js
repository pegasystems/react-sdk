const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Dynamic Tabs', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Creating a View Templates case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("View Templates")');
    await complexFieldsCase.click();

    /** Selecting Confirmation from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("Dynamic Tabs")').click();

    await page.locator('button:has-text("submit")').click();

    const title = await page.locator('h3[id="dynamic-tabs-title"]');
    await expect(title).toBeVisible();
    await expect(await title.innerText()).toBe('Dynamic Tabs Template');

    const tablist = await page.locator('div[id="dynamic-tabs"] div[role="tablist"]');
    const tabpanel = await page.locator('div[id="dynamic-tabpanel"]');

    await expect(tabpanel.nth(0).locator('span:has-text("Make")')).toBeVisible();
    await expect(tabpanel.nth(0).locator('span:has-text("BMW")')).toBeVisible();

    await tablist.locator('button').nth(1).click();
    expect(await tabpanel.nth(1).locator('span:has-text("Make")')).toBeVisible();
    expect(await tabpanel.nth(1).locator('span:has-text("Audi")')).toBeVisible();

    await tablist.locator('button').nth(2).click();
    expect(await tabpanel.nth(2).locator('span:has-text("Make")')).toBeVisible();
    expect(await tabpanel.nth(2).locator('span:has-text("FIAT")')).toBeVisible();

    await tablist.locator('button').nth(3).click();
    expect(await tabpanel.nth(3).locator('span:has-text("Make")')).toBeVisible();
    expect(await tabpanel.nth(3).locator('span:has-text("Chevrolet")')).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
