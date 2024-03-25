const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchSelfServicePortal);

test.describe('E2E test', () => {
  test('should login and able to render self-service portal', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing app name presence */
    const appName = page.locator('button[id="appName"]:has-text("DigV2")');
    await expect(appName).toBeVisible();

    const navLinks = page.locator('div[id="nav-links"]');

    /** Testing the Home navigation link */
    await expect(navLinks.locator('button:has-text("Home")')).toBeVisible();
    await navLinks.locator('button:has-text("Home")').click();

    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Testing the My Work navigation link */
    await expect(navLinks.locator('button:has-text("My Work")')).toBeVisible();

    await navLinks.locator('button:has-text("My Work")').click();

    const myWork = await page.locator('h6:has-text("My Work")');
    await expect(myWork).toBeVisible();

    /** Testing the Inline Dashboard navigation link */
    await expect(navLinks.locator('button:has-text("Inline Dashboard")')).toBeVisible();

    await navLinks.locator('button:has-text("Inline Dashboard")').click();

    const inlineDashboard = await page.locator('h4:has-text("Inline Dashboard")');
    await expect(inlineDashboard).toBeVisible();

    const worklist1 = await page.locator('h6:has-text("Complex  Fields - List")');
    await expect(worklist1).toBeVisible();

    await page.locator('button[id="appName"]:has-text("DigV2")').click();

    /** Testing Quick links heading presence */
    const quickLinksHeading = page.locator('h1[id="quick-links-heading"]:has-text("Quick links")');
    await expect(quickLinksHeading).toBeVisible();

    /** Testing the case creation with Quick links */
    const quickLinks = page.locator('ul[id="quick-links"]');
    await quickLinks.locator('button:has-text("Complex  Fields")').click();

    await page.locator('button:has-text("Submit")').click();

    await page.locator('button[id="appName"]:has-text("DigV2")').click();

    await expect(page.locator('h6:has-text("My Tasks")')).toBeVisible();

    await page.close();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
