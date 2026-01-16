const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test for Location component', () => {
  let attributes;

  test('should login, create case and run Location tests', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Verify homepage */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Create case */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Form Field")');
    await complexFieldsCase.click();

    /** Select Location category */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li >> text="Location"').click();

    /** Select Required subcategory */
    const selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('div[role="alert"] >> text="Cannot be blank"')).toBeVisible();
    /** Required field test */
    const requiredLocationField = page.locator('input[data-test-id="5d234240d150ee2ad896ca0be0e01fd3"]');
    await requiredLocationField.type('Hitech City, Hyderabad');
    await page.waitForSelector('.pac-container .pac-item', { timeout: 50000 });
    await page.locator('.pac-container .pac-item').nth(1).click();

    await expect(requiredLocationField).not.toHaveValue('');
    await expect(page.locator('p.Mui-error.Mui-required')).toBeHidden();

    attributes = await common.getAttributes(requiredLocationField);
    expect(attributes.includes('required')).toBeTruthy();

    /** Non-required field */
    const nonRequiredLocationField = page.locator('input[data-test-id="e4c3274b192b2696223fe7c86c635b75"]');
    attributes = await common.getAttributes(nonRequiredLocationField);
    expect(attributes.includes('required')).toBeFalsy();

    /** Disable tests */
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    const alwaysDisabledLocation = page.locator('input[data-test-id="43067a18c1d1c66f64f01e7e274c6396"]');
    attributes = await common.getAttributes(alwaysDisabledLocation);
    expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledLocation = page.locator('input[data-test-id="878f51dda2d3d8279c962e2f65172ac3"]');
    attributes = await common.getAttributes(conditionallyDisabledLocation);
    if (isDisabled) {
      expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledLocation = page.locator('input[data-test-id="a98054547fce446cbe5d4f9fb06c922c"]');
    attributes = await common.getAttributes(neverDisabledLocation);
    expect(attributes.includes('disabled')).toBeFalsy();

    /** Update tests */
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    const editableLocation = page.locator('input[data-test-id="666e146bbb2d7e31be1a66c4ea52f453"]');
    await editableLocation.fill('Hitech City, Hyderabad');

    await page.waitForSelector('.pac-container .pac-item', { timeout: 5000 });

    await page.locator('.pac-container .pac-item').nth(1).click();

    attributes = await common.getAttributes(editableLocation);
    expect(attributes.includes('readonly')).toBeFalsy();

    /** Visibility tests */
    await selectedSubCategory.click();

    await page.locator('[data-value="Visibility"]').click();

    await expect(page.locator('input[data-test-id="4d056e06ff67ee10b252d5d96d373c91"]')).toBeVisible();

    const neverVisibleLocation = page.locator('input[data-test-id="804db68b1b68c6e908079a1cab23fcdc"]');
    await expect(neverVisibleLocation).not.toBeVisible();

    const conditionallyVisibleLocation = page.locator('input[data-test-id="4b7ffe4018eb786ba3d11aa195f7d98d"]');
    if (isVisible) {
      await expect(conditionallyVisibleLocation).toBeVisible();
    } else {
      await expect(conditionallyVisibleLocation).not.toBeVisible();
    }

    /** Label and Placeholder tests */
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Label' }).click();

    const defaultLabelLocationField = page.locator('input[data-test-id="1d1f18e5499018ff649dd30066ba2270"]');
    const defaultLabel = await defaultLabelLocationField.locator('xpath=ancestor::div[contains(@class, "MuiFormControl")]//label').textContent();
    expect(defaultLabel).toBe('LocationDefaultLabel');

    const customLabelLocationField = page.locator('input[data-test-id="88de9f842705651ff0dae0556755a43e"]');
    const customLabel = await customLabelLocationField.locator('xpath=ancestor::div[contains(@class, "MuiFormControl")]//label').textContent();
    expect(customLabel).toBe('Enter location (custom label)');

    const customPlaceholderHelperField = page.locator('input[data-test-id="df7f2d2aa61b4ebfddb604ae39cb7374"]');
    const placeholder = await customPlaceholderHelperField.getAttribute('placeholder');
    expect(placeholder).toBe('Enter location');
    const helper = await customPlaceholderHelperField
      .locator('xpath=ancestor::div[contains(@class, "MuiFormControl")]//p[contains(@class, "MuiFormHelperText")]')
      .textContent();
    expect(helper).toBe('You can either enter place name or coordinates ');

    /** Map visibility tests */

    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Map Visibility' }).click();

    const mapVisibleField = page.locator('input[data-test-id="ce5f551ab012660f2358544a1ce8dede"]');
    await expect(mapVisibleField).toBeVisible();
    const mapContainer = page.locator('input[data-test-id="ce5f551ab012660f2358544a1ce8dede"] >> xpath=..');
    await expect(mapContainer.locator('div')).toHaveCount(1); // Google Map
    const hiddenMapContainer = page.locator('input[data-test-id="ad80fd801feb0799ca829d6eedb8902a"] >> xpath=..');
    await expect(hiddenMapContainer.locator('iframe')).toHaveCount(0);

    /** Coordinates format test */
    const onlyCoordsField = page.locator('input[data-test-id="41b59bdbb86495ae2db766c2944d4d7b"]');
    await onlyCoordsField.fill('Hitech City, Hyderabad');
    await page.waitForSelector('.pac-container .pac-item', { timeout: 5000 });
    await page.locator('.pac-container .pac-item').nth(1).click();

    const coordinates = await onlyCoordsField.inputValue();
    const regex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    expect(regex.test(coordinates.trim())).toBe(true);
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
