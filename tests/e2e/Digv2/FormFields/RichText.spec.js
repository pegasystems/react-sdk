const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the RichText tests', async ({ page }) => {
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

    /** Selecting RichText from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'RichText' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    /** Required tests */
    const requiredRichTextContainer = page.locator('div[data-test-id="98a97d9fe6d092900021587f62ab8637"]');
    const requiredRichTextLabel = requiredRichTextContainer.locator('label');
    expect(await requiredRichTextLabel.innerText()).toEqual('RichText Required *');
    await page.locator('button:has-text("submit")').click();
    let canNotBeBlankMsg = await requiredRichTextContainer.locator('p:has-text("Cannot be blank")');
    expect(canNotBeBlankMsg).toBeVisible();

    const notRequiredRichTextContainer = page.locator('div[data-test-id="913fcb2ea3513d1f0dd357aa1766757f"]');
    const notRequiredRichTextLabel = notRequiredRichTextContainer.locator('label');
    expect(await notRequiredRichTextLabel.innerText()).toEqual('RichText Not Required');
    await page.locator('button:has-text("submit")').click();
    canNotBeBlankMsg = await notRequiredRichTextContainer.locator('p:has-text("Cannot be blank")');
    expect(canNotBeBlankMsg).not.toBeVisible();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    /** Disable tests */
    // Always Disabled RichText
    const alwaysDisabledRichTextContainer = page.locator('div[data-test-id="f8a6fa176e492f0b2c3a2ecce916a1cc"]');
    const alwaysDisabledRichTextLabel = alwaysDisabledRichTextContainer.locator('label');
    expect(await alwaysDisabledRichTextLabel.innerText()).toEqual('RichText Disabled Always');
    const alwaysDisabledRichTextBox = alwaysDisabledRichTextContainer.locator('div[role="application"]');
    attributes = await common.getAttributes(alwaysDisabledRichTextBox);
    await expect(attributes.includes('aria-disabled')).toBeTruthy();

    // Conditionally Disabled RichText
    const conditionallyDisabledRichTextContainer = page.locator('div[data-test-id="a1f1fed886e4277998358560643d5b80"]');
    const conditionallyDisabledRichTextLabel = conditionallyDisabledRichTextContainer.locator('label');
    expect(await conditionallyDisabledRichTextLabel.innerText()).toEqual('RichText Disabled Condition');
    const conditionallyDisabledRichTextBox = conditionallyDisabledRichTextContainer.locator('div[role="application"]');
    attributes = await common.getAttributes(conditionallyDisabledRichTextBox);
    if (isDisabled) {
      await expect(attributes.includes('aria-disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('aria-disabled')).toBeFalsy();
    }

    // Never Disabled RichText
    const neverDisabledRichTextContainer = page.locator('div[data-test-id="0706d1c3117909bba5dc3b11282c84c1"]');
    const neverDisabledRichTextLabel = neverDisabledRichTextContainer.locator('label');
    expect(await neverDisabledRichTextLabel.innerText()).toEqual('RichText Disabled Never');
    const neverDisabledRichTextBox = neverDisabledRichTextContainer.locator('div[role="application"]');
    const disabledValue = await neverDisabledRichTextBox.getAttribute('aria-disabled');
    await expect(disabledValue).toBe('false');

    /** Selecting Update from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Update' }).click();

    /** Update tests */
    const readOnlyRichTextContainer = page.locator('div[data-test-id="2698790fe2608356645f7f37e47d4017"]');
    const readOnlyRichTextLabel = readOnlyRichTextContainer.locator('label');
    expect(await readOnlyRichTextLabel.innerText()).toEqual('RichText ReadOnly');
    const readOnlyRTEDiv = readOnlyRichTextContainer.locator('div[class="readonly-richtext-editor"]');
    expect(readOnlyRTEDiv).toBeVisible();

    const editableRichTextContainer = page.locator('div[data-test-id="c5f3892e688f607040637162ef2d61e2"]');
    const editableRichTextLabel = editableRichTextContainer.locator('label');
    expect(await editableRichTextLabel.innerText()).toEqual('RichText Editable');
    const editableRichTextDiv = editableRichTextContainer.locator('div[role="application"]');
    expect(editableRichTextDiv).toBeVisible();

    /** Selecting Visibility from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Visibility' }).click();

    /** Visibility tests */
    await expect(page.locator('div[data-test-id="4094af7d82d8e88494423b891852cfb3"]')).toBeVisible();

    const neverVisibleRichText = await page.locator('div[data-test-id="be4eec910ae6fd21f9ff706a3d64dc58"]');
    await expect(neverVisibleRichText).not.toBeVisible();

    const conditionallyVisibleRichText = await page.locator('div[data-test-id="c50c684046dd7f7ca04fd9e35ed0ec92"]');

    if (isVisible) {
      await expect(conditionallyVisibleRichText).toBeVisible();
    } else {
      await expect(conditionallyVisibleRichText).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
