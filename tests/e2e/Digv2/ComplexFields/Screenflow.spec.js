/** We're testing the visibility of tabs within the Case Summary area in the Case View here, more tests to be added in the future. */

const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Screen flow', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Creating a Screenflow case-type */
    const screenflowCase = page.locator('div[role="button"]:has-text("Screenflow")');
    await screenflowCase.click();

    /** Enter details in step1 */
    const firstStepInput = page.locator('input[data-test-id="e8501da981ee0c09b948fb28b0847189"]');
    await firstStepInput.click();
    await firstStepInput.fill('First Step');

    await page.locator('button:has-text("Next")').click();

    /** Enter details in step2 */
    const secondStepInput = page.locator('input[data-test-id="77a2c6ab9db81c2394fb761209e89fd4"]');
    await secondStepInput.click();
    await secondStepInput.fill('Second Step');

    await page.locator('button:has-text("Next")').click();

    /** Enter details in sub Flow 1 */
    const subFlowStep1 = page.locator('input[data-test-id="b31b8052e912d9609d7b0b35b1503089"]');
    await subFlowStep1.click();
    await subFlowStep1.fill('Sub Flow Step1');

    await page.locator('button:has-text("Next")').click();

    /** Enter details in sub Flow 2 */
    const subFlowStep2 = page.locator('input[data-test-id="8ca328af70e77d657136025c34d0f4ce"]');
    await subFlowStep2.click();
    await subFlowStep2.fill('Sub Flow Step2');

    await page.locator('button:has-text("Next")').click();

    /** Enter details in step3 */
    const thirdStepInput = page.locator('input[data-test-id="6359b052b0848cf46b32a80f89addeb0"]');
    await thirdStepInput.click();
    await thirdStepInput.fill('Third Step');

    await page.locator('button:has-text("Submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
