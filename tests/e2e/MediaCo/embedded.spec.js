/* eslint-disable no-undef */

const { test } = require('@playwright/test');
const common = require('../../common');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3502/embedded');
});

test.describe('E2E test', () => {
  test('should launch, select a service plan and fill details', async ({ page }) => {
    const silverPlan = page.locator('button:has-text("shop now") >> nth=1');
    await silverPlan.click();

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

    await page.locator('button:has-text("next")').click();

    const streetInput = page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.type('Main St');

    await page.locator('button:has-text("previous")').click();

    await page.locator('h6:has-text("Customer Info")').click();

    await page.locator('button:has-text("next")').click();

    await page.locator('h6:has-text("Customer Address")').click();

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

    await page.locator('button:has-text("next")').click();

    const dataServiceBeginDate = page.locator(
      'div[data-test-id="1321FA74451B96BC02663B0EF96CCBB9"]'
    );
    const dataServiceBeginDateInput = dataServiceBeginDate.locator('input');
    await dataServiceBeginDateInput.click();
    const futureDate = common.getFutureDate();
    await dataServiceBeginDateInput.type(futureDate);

    await page.locator('button:has-text("next")').click();

    await page.locator('button:has-text("submit")').click();

    await page.locator('text=Thanks for selecting a package with us. ').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
