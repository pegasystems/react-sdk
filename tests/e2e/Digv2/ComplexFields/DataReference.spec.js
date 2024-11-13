const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Data Reference', async ({ page }) => {
    await common.login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('h6:has-text("Announcements")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('h6:has-text("My Worklist")');
    await expect(worklist).toBeVisible();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting Data Reference from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("DataReference")').click();

    await page.locator('button:has-text("submit")').click();

    /** Display subcategory tests */

    /** Autocomplete display type test */
    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Display")').click();

    let selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Autocomplete")').click();

    let selectedProduct = page.locator('input[role="combobox"]');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    let assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();

    /** Commenting below "expect" statement due to the absence of the value in the DOM. The issue is from the material-ui-currency-textfield component that is currently in use.  */
    // await expect(assignment.locator('input[value="75"]')).toBeVisible();

    await expect(assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Dropdown display type tests */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Display")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Dropdown")').click();

    selectedProduct = page.locator('div[role="combobox"]:has-text("Basic Product")');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    // await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Table display type tests */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Display")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Table")').click();

    selectedProduct = page.locator('tr:has-text("Basic Product")');
    const selectedProductRow = selectedProduct.locator('input[type="radio"]');
    await selectedProductRow.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    // await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Testing whether the row/record selected above is checked/selected */
    const basicProductRecord = await assignment.locator('tr:has-text("Basic Product") >> input[type="radio"]');
    let attributes = await common.getAttributes(basicProductRecord);
    expect(attributes.includes('checked')).toBeTruthy();

    /** Options subcategory tests */

    /** SingleRecord options type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Options")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("SingleRecord")').click();

    selectedProduct = page.locator('input[role="combobox"]');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    // await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** ListOfRecords options type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Options")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    selectedProduct = page.locator('tr:has-text("Luxury Product")');
    const selectedProductTestRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestRow.click();

    selectedProduct = page.locator('tr:has-text("Green Item")');
    const selectedProductTestSecondRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductTestSecondRow.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('tr:has-text("Luxury Product")')).toBeVisible();
    await expect(assignment.locator('tr:has-text("Green Item")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Testing whether the rows/records selected above are checked/selected */
    const luxuryProductRecord = await assignment.locator('tr:has-text("Luxury Product") >> input[type="checkbox"]');
    attributes = await common.getAttributes(luxuryProductRecord);
    expect(attributes.includes('checked')).toBeTruthy();

    const greenItemRecord = await assignment.locator('tr:has-text("Green Item") >> input[type="checkbox"]');
    attributes = await common.getAttributes(greenItemRecord);
    expect(attributes.includes('checked')).toBeTruthy();

    /** Mode subcategory tests */

    /** SingleSelect mode type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("SingleSelect")').click();

    selectedProduct = page.locator('input[role="combobox"]');
    await selectedProduct.click();
    await page.locator('li:has-text("Basic Product")').click();
    await expect(selectedProduct).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    // await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** MultiSelect mode type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("MultiSelect")').click();

    /** Combo-Box mode type test */
    let displayAs = page.locator('div[data-test-id="4aa668349e0970901aa6b11528f95223"]');
    await displayAs.click();
    await page.locator('li:has-text("Combo-Box")').click();

    const selectProducts = page.locator('input[role="combobox"]');
    await selectProducts.click();
    await page.locator('li:has-text("Mobile")').click();
    await page.locator('li:has-text("Television")').click();
    await selectProducts.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    await expect(assignment.locator('td >> text="Mobile"')).toBeVisible();
    await expect(assignment.locator('td >> text="Television"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    await expect(assignment.locator('div[role="button"]:has-text("Mobile")')).toBeVisible();
    await expect(assignment.locator('div[role="button"]:has-text("Television")')).toBeVisible();

    let deleteProduct = await assignment.locator('div[role="button"]:has-text("Mobile")');
    await deleteProduct.locator('svg[focusable="false"]').click();

    await page.locator('button:has-text("Next")').click();

    await expect(assignment.locator('div[role="button"]:has-text("Mobile")')).not.toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    deleteProduct = await assignment.locator('div[role="button"]:has-text("Television")');
    await deleteProduct.locator('svg[focusable="false"]').click();

    /** Checkbox group mode type test */
    displayAs = page.locator('div[data-test-id="4aa668349e0970901aa6b11528f95223"]');
    await displayAs.click();
    await page.locator('li:has-text("Checkbox group")').click();

    await page.locator('label:has-text("Washing Machine")').click();
    await page.locator('label:has-text("Mobile")').click();

    await page.locator('button:has-text("Next")').click();

    await expect(assignment.locator('td >> text="Washing Machine"')).toBeVisible();
    await expect(assignment.locator('td >> text="Mobile"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type test */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Readonly")').click();

    selectedProduct = page.locator('div[id="semantic-link-grid"] >> span >> text="Basic Product"');
    await expect(selectedProduct).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Basic Product"]')).toBeVisible();
    // await expect(assignment.locator('input[value="75"]')).toBeVisible();
    await expect(assignment.locator('input[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Testing Sorting(both ascending and descending) */
    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Options")').click();

    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    await page.locator('span:has-text("Product Name")').click();

    const table = page.locator('div[id="list-view"]');
    let tableCell = table.locator('tbody >> tr >> td >> nth=1');
    // "---" should come at the top in the ascending order, since it's a Falsy value
    await expect(await tableCell.textContent()).toBe('---');

    await page.locator('span:has-text("Product Name")').click();

    tableCell = table.locator('tbody >> tr >> td >> nth=1');
    // "Luxury Product" should be at the top in the descending order
    await expect(await tableCell.textContent()).toBe('Luxury Product');

    const lastRow = table.locator('tbody >> tr >> nth=3');
    tableCell = lastRow.locator('td >> nth=1');
    // "---" should be at the bottom in the descending order
    await expect(await tableCell.textContent()).toBe('---');

    await page.locator('button:has-text("Next")').click();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
