/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */
const path = require('path');
const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');
const endpoints = require("../../../sdk-config.json");

let caseID;

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3502/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and send for discount', async ({ page }) => {
    await common.Login(
      config.config.apps.mediaCo.rep.username,
      config.config.apps.mediaCo.rep.password,
      page
    );

    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    const newServiceCase = page.locator('div[role="button"]:has-text("New Service")');
    await newServiceCase.click();

    caseID = await page.locator('#caseId').textContent();

    const firstNameInput = page.locator('input[data-test-id="BC910F8BDF70F29374F496F05BE0330C"]');
    await firstNameInput.click();
    await firstNameInput.type('John');

    const middleNameInput = page.locator('input[data-test-id="D3691D297D95C48EF1A2B7D6523EF3F0"]');
    await middleNameInput.click();
    await middleNameInput.type('');

    const lastNameInput = page.locator('input[data-test-id="77587239BF4C54EA493C7033E1DBF636"]');
    await lastNameInput.click();
    await lastNameInput.type('Doe');

    const suffix = page.locator('div[data-test-id="56E6DDD1CB6CEC596B433440DFB21C17"]');
    await suffix.locator('button[title="Open"]').click();
    await page.locator('li:has-text("Jr")').click();

    const emailInput = page.locator('input[data-test-id="CE8AE9DA5B7CD6C3DF2929543A9AF92D"]');
    await emailInput.click();
    await emailInput.type('john@doe.com');

    const serviceDate = page.locator('div[data-test-id="E0BA356AE552ACD4326D51E61F4279AC"]');
    const serviceDateInput = serviceDate.locator('input');
    await serviceDateInput.click();
    const futureDate = common.getFutureDate();
    await serviceDateInput.type(futureDate);

    await page.locator('button:has-text("submit")').click();

    const streetInput = page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.type('Main St');

    const cityInput = page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.type('Cambridge');

    const state = page.locator('div[data-test-id="46A2A41CC6E552044816A2D04634545D"]');
    const stateSelector = state.locator('div[role="button"]');
    await stateSelector.click();
    await page.locator('li[data-value="MA"]').click();

    const postalCodeInput = page.locator('input[data-test-id="572ED696F21038E6CC6C86BB272A3222"]');
    await postalCodeInput.click();
    await postalCodeInput.type('02142');

    const phone = page.locator('div[data-test-id="1F8261D17452A959E013666C5DF45E07"]');
    const countrySelector = phone.locator('button');
    await countrySelector.click();
    await page.locator('text=United States+1 >> nth=0').click();
    const phoneInput = phone.locator('input');
    await phoneInput.click();
    await phoneInput.type('6175551212');

    await page.locator('button:has-text("submit")').click();

    const tvPackage = page.locator('label[data-test-id="0B3244CEB2CE9879260EB560BD7A811E"]');
    await tvPackage.click();

    await page.locator('#Assignment >> text=Premium').click();

    const internetPackage = page.locator('label[data-test-id="C05A1E5DECC321D9792E9A9E15184BE5"]');
    await internetPackage.click();

    await page.locator('#Assignment >> text=300 Mbps').click();

    const phonePackage = page.locator('label[data-test-id="7CF3F86883596E49D8D7298CC5B928A2"]');
    await phonePackage.click();

    await page.locator('#Assignment >> text=International Full').click();

    await page.locator('button:has-text("submit")').click();

    const otherNotes = page.locator('textarea[data-test-id="F4C6F851B00D5518BF888815DE279ABA"]');
    await otherNotes.click();
    await otherNotes.type('Thanks for the service!');

    const sendToMgr = page.locator('label[data-test-id="C3B43E79AEC2D689F0CF97BD6AFB7DC4"]');
    await sendToMgr.check();

    const currentCaseID = await page.locator('div[id="current-caseID"]').textContent();
    const filePath = path.join(__dirname, '../../../assets/img/cableinfo.png');

    const attachmentID = await page.locator('div[id="attachment-ID"]').textContent();
    await page.setInputFiles(`#${attachmentID}`, filePath);

    await Promise.all([
      page.waitForResponse(`${endpoints.serverConfig.infinityRestServerUrl}${endpoints.serverConfig.appAlias ? `/app/${endpoints.serverConfig.appAlias}` : ""}/api/application/v2/attachments/upload`)
    ]);

    await page.locator('button:has-text("submit")').click();

    await Promise.all([
      page.waitForResponse(`${endpoints.serverConfig.infinityRestServerUrl}${endpoints.serverConfig.appAlias ? `/app/${endpoints.serverConfig.appAlias}` : ""}/api/application/v2/cases/${currentCaseID}/attachments`),
    ]);

    const attachmentCount = await page.locator('div[id="attachments-count"]').textContent();
    await expect(Number(attachmentCount)).toBeGreaterThan(0);

    await page
      .locator('text=Thank you! The next step in this case has been routed appropriately.')
      .click();
  }, 10000);

  test('should enter a discount value($) and send to tech', async ({ page }) => {
    await common.Login(
      config.config.apps.mediaCo.manager.username,
      config.config.apps.mediaCo.manager.password,
      page
    );

    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    const caseButton = page.locator(`button:has-text('${caseID}')`);

    await caseButton.click();

    const mgrDiscountInput = page.locator('input[data-test-id="D69ECA63310344EDB0D0F9881CF9B662"]');

    await mgrDiscountInput.type('20');

    await page.locator('button:has-text("submit")').click();

    await page
      .locator('text=Thank you! The next step in this case has been routed appropriately.')
      .click();
  }, 10000);

  test('should modify(if required) the actual services/packages to be installed and resolve the case', async ({
    page
  }) => {
    await common.Login(
      config.config.apps.mediaCo.tech.username,
      config.config.apps.mediaCo.tech.password,
      page
    );

    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    const caseButton = page.locator(`button:has-text('${caseID}')`);
    await caseButton.click();

    const tvConnected = page.locator('label[data-test-id="EEF2AA5E42FD9F0FB0A44EA0B2D52921"]');
    await tvConnected.click();

    const internetConnected = page.locator(
      'label[data-test-id="C43FA5D99B9290C0885E058F641CAB8D"]'
    );
    await internetConnected.click();

    await page.locator('button:has-text("submit")').click();

    await page.locator('text=Resolved').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
