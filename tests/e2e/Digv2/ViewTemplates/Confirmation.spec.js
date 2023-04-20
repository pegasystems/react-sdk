/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Confirmation', async ({
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

    /** Creating a View Templates case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("View Templates")');
    await complexFieldsCase.click();

    const caseID = await page.locator('#caseId').textContent();

    /** Selecting Confirmation from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("Confirmation")').click();

    await page.locator('button:has-text("submit")').click();

    /** Entering some data that will be verified on the Confirmation screen */
    const firstNameInput = page.locator('input[data-test-id="BC910F8BDF70F29374F496F05BE0330C"]');
    await firstNameInput.click();
    await firstNameInput.type('John');

    const lastNameInput = page.locator('input[data-test-id="77587239BF4C54EA493C7033E1DBF636"]');
    await lastNameInput.click();
    await lastNameInput.type('Doe');

    const cityInput = page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.type('Cambridge');

    const phone = page.locator('div[data-test-id="1F8261D17452A959E013666C5DF45E07"]');
    const countrySelector = phone.locator('button');
    await countrySelector.click();
    await page.locator('text=United States+1 >> nth=0').click();
    const phoneInput = phone.locator('input');
    await phoneInput.click();
    await phoneInput.type('6175551212');

    await page.locator('button:has-text("submit")').click();

    /** Testing the values present on Confirmation screen */
    await expect(page.locator('h2[id="confirm-label"]')).toBeVisible();

    await expect(page.locator('span >> text="John"')).toBeVisible();
    await expect(page.locator('span >> text="Doe"')).toBeVisible();
    await expect(page.locator('span >> text="Cambridge"')).toBeVisible();
    await expect(page.locator('span >> text="+16175551212"')).toBeVisible();

    await expect(page.locator('div >> text="Case View"')).toBeVisible();

    await expect(page.locator(`span >> text=${caseID}`)).toBeVisible();

    await page.locator('button:has-text("Done")').click();

    /** Testing the values that shouldn't be present now */
    await expect(page.locator('span >> text="John"')).toBeHidden();
    await expect(page.locator('span >> text="Doe"')).toBeHidden();
    await expect(page.locator('span >> text="Cambridge"')).toBeHidden();
    await expect(page.locator('span >> text="+16175551212"')).toBeHidden();

    await expect(page.locator('div >> text="Case View"')).toBeHidden();

    await expect(page.locator(`span >> text=${caseID}`)).toBeHidden();

    await page.close();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
