const { test, expect } = require('@playwright/test');

const config = require('../../config');

test.describe('Override Demo — runtime toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${config.baseUrl}/override-demo`, { waitUntil: 'networkidle' });
  });

  test('should show default MUI TextInput initially', async ({ page }) => {
    // The MUI TextField renders an <input> inside a div with MUI classes
    // Our demo heading should say "TextInput (MUI)"
    const heading = page.locator('h4');
    await expect(heading).toContainText('TextInput (MUI)');

    // The toggle button should indicate default DS
    const toggleContainer = page.locator('[data-test-id="override-toggle-container"]');
    await expect(toggleContainer).toContainText('Default Design System (MUI)');
  });

  test('should switch to custom PlainCssTextInput when toggle is clicked', async ({ page }) => {
    const toggleBtn = page.locator('[data-test-id="override-toggle-btn"]');
    await toggleBtn.click();

    // Heading should now indicate the custom DS
    const heading = page.locator('h4');
    await expect(heading).toContainText('PlainCssTextInput (Custom DS)');

    // The "Custom DS" badge should appear inside a label
    const badge = page.locator('.plain-ds-badge');
    await expect(badge.first()).toBeVisible();
    await expect(badge.first()).toContainText('Custom DS');

    // Toggle container text should update
    const toggleContainer = page.locator('[data-test-id="override-toggle-container"]');
    await expect(toggleContainer).toContainText('Custom Design System (Plain CSS)');
  });

  test('should switch back to MUI when toggled off', async ({ page }) => {
    const toggleBtn = page.locator('[data-test-id="override-toggle-btn"]');

    // Toggle ON
    await toggleBtn.click();
    await expect(page.locator('h4')).toContainText('PlainCssTextInput (Custom DS)');

    // Toggle OFF
    await toggleBtn.click();
    await expect(page.locator('h4')).toContainText('TextInput (MUI)');
    await expect(page.locator('.plain-ds-badge')).toHaveCount(0);
  });
});
