const path = require('path');
const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');
const endpoints = require('../../../../sdk-config.json');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  let attributes;

  test('should login, create case and run the Attachment tests', async ({ page }) => {
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

    /** Selecting Attachment from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.getByRole('option', { name: 'Attachment' }).click();

    /** Selecting Required from the Sub Category dropdown */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Required' }).click();

    const filePath = path.join(__dirname, '../../../../assets/img/cableinfo.jpg');
    const filePath2 = path.join(__dirname, '../../../../assets/img/cablechat.jpg');
    const zeroBytesFile = path.join(__dirname, '../../../../assets/img/Zerobytes');

    // Checking required  attachment field
    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('span:has-text("Cannot be blank")')).toBeVisible();
    await page.setInputFiles(`#AttachmentRequired`, filePath);
    await expect(page.locator('span:has-text("Cannot be blank")')).toBeHidden();

    /** Selecting Disable from the Sub Category dropdown */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Disable' }).click();

    // Disable tests
    const alwaysDisabledAttachment = page.locator('input[id="AttachmentDisabledAlways"]');
    attributes = await common.getAttributes(alwaysDisabledAttachment);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledAttachment = page.locator('input[id="AttachmentDisabledCondition"]');
    attributes = await common.getAttributes(conditionallyDisabledAttachment);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledAttachment = page.locator('input[id="AttachmentDisabledNever"]');
    attributes = await common.getAttributes(neverDisabledAttachment);
    await page.setInputFiles(`#AttachmentDisabledNever`, filePath);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Testing Single mode attachments */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Single' }).click();

    const singleAttachment = page.locator('label[for="Attachment"]');
    await expect(singleAttachment.locator('span[role="button"]:has-text("Choose a file")')).toBeVisible();
    await page.setInputFiles(`#Attachment`, filePath);
    await expect(page.locator('div >> text="cableinfo.jpg"')).toBeVisible();
    await expect(page.locator('span:has-text("Choose a file")')).toBeHidden();

    await page.locator('button[aria-label="Delete Attachment"]').click();

    await expect(singleAttachment.locator('span[role="button"]:has-text("Choose a file")')).toBeVisible();

    /** Testing Multiple mode attachments */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.getByRole('option', { name: 'Multiple' }).click();

    const multipleAttachment = page.locator('label[for="AttachmentList"]');
    await expect(multipleAttachment.locator('span[role="button"]:has-text("Choose files")')).toBeVisible();
    await page.setInputFiles(`#AttachmentList`, [filePath, filePath2]);

    await Promise.all([
      page.waitForResponse(
        `${endpoints.serverConfig.infinityRestServerUrl}${
          endpoints.serverConfig.appAlias ? `/app/${endpoints.serverConfig.appAlias}` : ''
        }/api/application/v2/attachments/upload`
      )
    ]);

    await expect(page.locator('div >> text="cableinfo.jpg"')).toBeVisible();
    await expect(page.locator('div >> text="cablechat.jpg"')).toBeVisible();

    await expect(page.locator('div >> text="Uploaded successfully" >> nth=0')).toBeVisible();

    await expect(multipleAttachment.locator('span[role="button"]:has-text("Choose files")')).toBeVisible();

    /** Testing error case by uploading empty file */
    await page.setInputFiles(`#AttachmentList`, [zeroBytesFile]);
    await expect(page.locator('div >> text="Error with one or more files"')).toBeVisible();
    await expect(page.locator(`div >> text="Empty file can't be uploaded." >> nth=0`)).toBeVisible();

    const errorFile = await page.locator('div[class="psdk-utility-card"]:has-text("Unable to upload file")');
    await errorFile.locator('button[aria-label="Delete Attachment"]').click();

    await page.locator('button:has-text("submit")').click();

    await page.locator('button[id="setting-button"] >> nth=0').click();

    /** Download attachment */
    const menuSelector = await page.locator('div[id="file-menu"]:not([aria-hidden="true"])');
    await menuSelector.locator('li >> text="Download"').click();

    await page.locator('button[id="setting-button"] >> nth=0').click();

    /** Delete attachment */
    await menuSelector.locator('li >> text="Delete"').click();
    await expect(page.locator('div >> text="cableinfo.jpg"')).toBeVisible();
    await expect(page.locator('div >> text="cablechat.jpg"')).toBeHidden();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
