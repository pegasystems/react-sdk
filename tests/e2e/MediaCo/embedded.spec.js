const { test, expect } = require('@playwright/test');

const common = require('../../common');

test.beforeEach(common.launchEmbedded);

test.describe('E2E test', () => {
  test('Embedded: should launch, select a phone and purchase the phone', async ({ page }) => {
    const selectPhone = page.locator('button:has-text("Buy now") >> nth=1');
    await selectPhone.click();

    const storageSelectableCard = await page.locator('div[id="selectable-card"] >> nth=1');
    await storageSelectableCard.locator('label >> span >> input >> nth=1').click();

    const colorSelectableCard = await page.locator('div[id="selectable-card"] >> nth=2');
    await colorSelectableCard.locator('label >> span >> input >> nth=1').click();

    await page.locator('button:has-text("next")').click();

    const phonenumber = page.locator('div[role="radiogroup"] >> nth=0');
    const requiredInput = phonenumber.locator('label >> span >> input >> nth=1');
    await requiredInput.click();

    const tradeIn = page.locator('div[role="radiogroup"] >> nth=1');
    const tradeInInput = tradeIn.locator('label >> span >> input >> nth=1');
    await tradeInInput.click();

    const paymentOptionsSelectableCard = await page.locator('div[id="selectable-card"] >> nth=0');
    await paymentOptionsSelectableCard.locator('label >> span >> input >> nth=1').click();

    await page.locator('button:has-text("next")').click();

    const firstNameInput = page.locator('input[data-test-id="BC910F8BDF70F29374F496F05BE0330C"]');
    await firstNameInput.click();
    await firstNameInput.fill('John');

    const lastNameInput = page.locator('input[data-test-id="77587239BF4C54EA493C7033E1DBF636"]');
    await lastNameInput.click();
    await lastNameInput.fill('Doe');

    const emailInput = page.locator('input[data-test-id="643a860f992333b8600ea264aca7c4fc"]');
    await emailInput.click();
    await emailInput.fill('john@doe.com');

    const phone = page.locator('div[data-test-id="1e4dbc7eaa78468a3bc1448a3d68d906"]');
    const countrySelector = phone.locator('button');
    await countrySelector.click();
    await page.locator('text=United States+1 >> nth=0').click();
    await common.enterPhoneNumber(phone, '6175551212');

    await page.locator('button:has-text("next")').click();

    const nameOnCard = page.locator('input[data-test-id="c2b63e85bd5e4dc9b6cf5a4693847e06"]');
    await nameOnCard.click();
    await nameOnCard.fill('John Doe');

    await page.locator('button:has-text("next")').click();

    const streetInput = page.locator('input[data-test-id="D61EBDD8A0C0CD57C22455E9F0918C65"]');
    await streetInput.click();
    await streetInput.fill('Main St');

    const apartmentInput = page.locator('input[data-test-id="73786cb2bc433cfb06603ab61f15e04e"]');
    await apartmentInput.click();
    await apartmentInput.fill('Glenalmond Avenue');

    const cityInput = page.locator('input[data-test-id="57D056ED0984166336B7879C2AF3657F"]');
    await cityInput.click();
    await cityInput.fill('Cambridge');

    const stateInput = page.locator('input[data-test-id="46A2A41CC6E552044816A2D04634545D"]');
    await stateInput.click();
    await stateInput.fill('Indiana');

    const postalCodeInput = page.locator('input[data-test-id="572ED696F21038E6CC6C86BB272A3222"]');
    await postalCodeInput.click();
    await postalCodeInput.fill('02142');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('p:has-text("Oceonix 25 Max")')).toBeVisible();
    await expect(page.locator('p:has-text("john@doe.com")')).toBeVisible();

    await page.locator('a:has-text("Done")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
