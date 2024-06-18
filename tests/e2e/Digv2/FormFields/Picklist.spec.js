const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run the Email tests', async ({ page }) => {
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

    /** Selecting PickList from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'PickList' }).click();

    /** Selecting Required from the Sub Category dropdown */
    const selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'DataPage' }).click();

    /** Dropdown tests */
    const picklistAs = page.locator('div[data-test-id="683ea3aece0dce7e065d31d43f1c269b"]');
    await picklistAs.click();
    await page.getByRole('option', { name: 'Dropdown' }).click();

    const dropdown = page.locator('div[data-test-id="94cb322b7468c7827d336398e525827e"]');
    /** Checking 'placeholder' and 'helper text' */
    const placeholderValue = await dropdown.locator('input').getAttribute('placeholder');
    await expect(placeholderValue).toBe('Select...');

    await expect(page.locator('div[id="Assignment"] >> p:has-text("Picklist Helper Text")')).toBeVisible();

    await dropdown.click();
    await page.getByRole('option', { name: 'Massachusetts' }).click();

    /** Autocomplete tests */
    await picklistAs.click();
    await page.getByRole('option', { name: 'AutoComplete' }).click();

    const autocomplete = page.locator('div[data-test-id="ed90c4ad051fd65a1d9f0930ec4b2276"]');
    await autocomplete.click();
    await page.locator('li:has-text("Colorado")').click();

    /** Radiobutton tests */
    await picklistAs.click();
    await page.getByRole('option', { name: 'RadioButtons' }).click();

    const radiobutton = page.locator('div[role="radiogroup"] >> nth=0');
    const requiredDateInput = radiobutton.locator('label >> nth=0');
    await requiredDateInput.click();

    const radiobutton2 = page.locator('div[role="radiogroup"] >> nth=1');
    const requiredDateInput2 = radiobutton2.locator('label >> nth=1');
    await requiredDateInput2.click();

    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
