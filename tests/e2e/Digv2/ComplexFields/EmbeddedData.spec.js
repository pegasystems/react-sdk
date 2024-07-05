const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Embedded Data', async ({ page }) => {
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

    /** Selecting Embedded Data from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("EmbeddedData")').click();

    await page.locator('button:has-text("submit")').click();

    /** Option tests */

    /** SingleRecord options type test */

    let selectedOption = page.locator('div[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('li:has-text("SingleRecord")').click();

    /** Mode subcategory tests */

    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Mode")').click();

    /** Editable mode type tests */
    let selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Editable")').click();

    await page.locator('input[data-test-id="d61ebdd8a0c0cd57c22455e9f0918c65"]').fill('Main St');
    await page.locator('input[data-test-id="57d056ed0984166336b7879c2af3657f"]').fill('Cambridge');
    await page.locator('input[data-test-id="46a2a41cc6e552044816a2d04634545d"]').fill('MA');
    await page.locator('input[data-test-id="25f75488c91cb6c3bab92672e479619f"]').fill('02142');

    await page.locator('button:has-text("Next")').click();

    let assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('input[value="Main St"]')).toBeVisible();
    await expect(assignment.locator('input[value="Cambridge"]')).toBeVisible();
    await expect(assignment.locator('input[value="MA"]')).toBeVisible();
    await expect(assignment.locator('input[value="02142"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type tests */
    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Readonly")').click();

    /** Testing the existence of 'readonly' attribute on the fields and the values which were entered by Editable mode test */
    const street = page.locator('input[data-test-id="d61ebdd8a0c0cd57c22455e9f0918c65"]');
    let attributes = await common.getAttributes(street);
    expect(attributes.includes('readonly') && (await street.inputValue()) === 'Main St').toBeTruthy();

    const city = page.locator('input[data-test-id="57d056ed0984166336b7879c2af3657f"]');
    attributes = await common.getAttributes(city);
    expect(attributes.includes('readonly') && (await city.inputValue()) === 'Cambridge').toBeTruthy();

    const state = page.locator('input[data-test-id="46a2a41cc6e552044816a2d04634545d"]');
    attributes = await common.getAttributes(state);
    expect(attributes.includes('readonly') && (await state.inputValue()) === 'MA').toBeTruthy();

    const postalCode = page.locator('input[data-test-id="25f75488c91cb6c3bab92672e479619f"]');
    attributes = await common.getAttributes(postalCode);
    expect(attributes.includes('readonly') && (await postalCode.inputValue()) === '02142').toBeTruthy();

    await page.locator('button:has-text("Next")').click();

    await page.locator('button:has-text("previous")').click();

    /** ListOfRecord options type test */

    selectedOption = page.locator('div[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    /** Table subcategory tests */

    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Table")').click();

    /** Editable mode type tests */
    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Editable")').click();

    let selectEditMode = page.locator('div[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await selectEditMode.click();
    await page.locator('li:has-text("Table rows")').click();

    const noRecordsMsg = page.locator('div[id="no-records"]');
    await expect(noRecordsMsg.locator('text="No records found."')).toBeVisible();

    /** Creating row by clicking on `+Add` button */
    await page.locator('a:has-text("+ Add")').click();

    /** Entering values in the first Row */
    await page.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"]').fill('02142');

    let phone = page.locator('div[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    await phone.locator('button').click();
    /** Selecting the country code */
    await page.locator('text=United States+1 >> nth=0').click();
    await common.enterPhoneNumber(phone, '6175551212');

    /** Creating second row by clicking on `+Add` button */
    await page.locator('a:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=1').fill('Global St');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=1').fill('California');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=1').fill('AK');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=1').fill('03142');

    phone = page.locator('div[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1');
    await phone.locator('button').click();
    /** Selecting the country code */
    await page.locator('text=United States+1 >> nth=0').click();
    await common.enterPhoneNumber(phone, '6175451212');

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('td >> text="Global St"')).toBeVisible();
    await expect(assignment.locator('td >> text="California"')).toBeVisible();
    await expect(assignment.locator('td >> text="AK"')).toBeVisible();
    await expect(assignment.locator('td >> text="03142"')).toBeVisible();
    await expect(assignment.locator('td >> text="+16175451212"')).toBeVisible();

    /** Testing the filter functionality in simple table */
    await assignment.locator('svg[id="menu-icon"] >> nth=0').click();
    await page.locator('li:has-text("Filter")').click();
    let modal = page.locator('div[role="dialog"]');

    await modal.locator('input[type="text"]').fill('main');

    await modal.locator('button:has-text("Submit")').click();

    await expect(assignment.locator('td:has-text("main")')).toBeVisible();

    await assignment.locator('svg[id="menu-icon"] >> nth=1').click();

    await page.locator('li:has-text("Filter")').click();

    modal = page.locator('div[role="dialog"]');

    await modal.locator('div[id="filter"]').click();
    await page.locator('li:has-text("Equals")').click();
    await modal.locator('input[type="text"]').fill('Cambridge');

    await modal.locator('button:has-text("Submit")').click();

    await assignment.locator('svg[id="menu-icon"] >> nth=3').click();

    await page.locator('li:has-text("Filter")').click();

    await modal.locator('div[id="filter"]').click();
    await page.locator('li:has-text("Starts with")').click();
    await modal.locator('input[type="text"]').fill('0212');

    await modal.locator('button:has-text("Submit")').click();

    await expect(noRecordsMsg.locator('text="No records found."')).toBeVisible();

    await assignment.locator('svg[id="menu-icon"] >> nth=3').click();

    await page.locator('li:has-text("Filter")').click();

    await modal.locator('input[type="text"]').fill('');
    await modal.locator('button:has-text("Submit")').click();

    await expect(assignment.locator('td:has-text("main")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    await page.locator('button[id="delete-button"] >> nth=0').click();

    await page.locator('button:has-text("Next")').click();

    /** Testing the deleted row values which should n't be present */
    await expect(assignment.locator('input[value="Main St"] >> nth=1')).toBeHidden();
    await expect(assignment.locator('input[value="Cambridge"] >> nth=1')).toBeHidden();
    await expect(assignment.locator('input[value="MA"] >> nth=1')).toBeHidden();
    await expect(assignment.locator('input[value="02142"] >> nth=1')).toBeHidden();
    await expect(assignment.locator('td:has-text("+16175551212") >> nth=1')).toBeHidden();

    await page.locator('button:has-text("Previous")').click();

    await page.locator('button[id="delete-button"] >> nth=0').click();

    /** Table Edit Modal tests */
    selectEditMode = page.locator('div[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await selectEditMode.click();
    await page.locator('li:has-text("Modal")').click();

    await page.locator('a:has-text("+ Add")').click();

    modal = page.locator('div[role="dialog"]');

    /** Testing Add Record Title */
    const addRecordTitle = modal.locator('h2:has-text("Add Record")');
    await expect(addRecordTitle).toBeVisible();

    /** Adding record to the Table in Modal */
    await modal.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await modal.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await modal.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await modal.locator('input[data-test-id="202003240938510832734"]').fill('02142');

    phone = modal.locator('div[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    await phone.locator('button').click();
    /** Selecting the country code */
    await page.locator('text=United States+1 >> nth=0').click();
    await common.enterPhoneNumber(phone, '6175551212');

    const country = modal.locator('div[data-test-id="59716c97497eb9694541f7c3d37b1a4d"]');
    await country.click();
    await page.getByRole('option', { name: 'Switzerland' }).click();

    /** submitting the record */
    await modal.locator('button:has-text("submit")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on table */
    await expect(assignment.locator('td >> text="Main St"')).toBeVisible();
    await expect(assignment.locator('td >> text="Cambridge"')).toBeVisible();
    await expect(assignment.locator('td >> text="MA"')).toBeVisible();
    await expect(assignment.locator('td >> text="02142"')).toBeVisible();
    await expect(assignment.locator('td >> text="+16175551212"')).toBeVisible();

    await assignment.locator('button:has-text("Next")').click();

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('td >> text="Main St"')).toBeVisible();
    await expect(assignment.locator('td >> text="Cambridge"')).toBeVisible();
    await expect(assignment.locator('td >> text="MA"')).toBeVisible();
    await expect(assignment.locator('td >> text="02142"')).toBeVisible();
    await expect(assignment.locator('td >> text="+16175551212"')).toBeVisible();

    await assignment.locator('button:has-text("Previous")').click();

    /** Edit Record tests */
    await assignment.locator('svg[id="table-edit-menu-icon"] >> nth=0').click();
    let editMenu = await page.locator('div[id="table-edit-menu"]');
    await editMenu.locator('li:has-text("Edit")').click();

    modal = page.locator('div[role="dialog"]');

    /** Testing Edit Record title */
    const editRecordTitle = modal.locator('h2:has-text("Edit Record")');
    await expect(editRecordTitle).toBeVisible();

    /** Editing the added row */
    await modal.locator('input[data-test-id="202003240938510823869"]').fill('');
    await modal.locator('input[data-test-id="202003240938510823869"]').fill('Gandhi St');

    await modal.locator('input[data-test-id="202003240938510831291"]').fill('');
    await modal.locator('input[data-test-id="202003240938510831291"]').fill('Dallas');

    await modal.locator('button:has-text("submit")').click();

    /** Testing the edited values on table */
    await expect(assignment.locator('td >> text="Gandhi St"')).toBeVisible();
    await expect(assignment.locator('td >> text="Dallas"')).toBeVisible();

    await assignment.locator('button:has-text("Next")').click();

    /** Testing the edited values on Confirm Screen */
    await expect(assignment.locator('td >> text="Gandhi St"')).toBeVisible();
    await expect(assignment.locator('td >> text="Dallas"')).toBeVisible();

    await assignment.locator('button:has-text("Previous")').click();

    /** Delete Row tests */
    await assignment.locator('svg[id="table-edit-menu-icon"] >> nth=0').click();
    editMenu = await page.locator('div[id="table-edit-menu"]');
    await editMenu.locator('li:has-text("Delete")').click();

    await expect(noRecordsMsg.locator('text="No records found."')).toBeVisible();

    await assignment.locator('button:has-text("Next")').click();

    await assignment.locator('button:has-text("Previous")').click();

    /** FieldGroup subcategory tests */

    selectedSubCategory = await page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("FieldGroup")').click();

    /** Editable mode type tests */
    selectedTestName = await page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Editable")').click();

    /** Entering values in the first Row */
    await page.locator('input[data-test-id="202003240938510823869"]').fill('Main St');
    await page.locator('input[data-test-id="202003240938510831291"]').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"]').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"]').fill('02142');

    phone = page.locator('div[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    await phone.locator('button').click();
    /** Selecting the country code */
    await page.locator('text=United States+1 >> nth=0').click();
    await common.enterPhoneNumber(phone, '6175551212');

    let countryName = page.locator('div[data-test-id="59716c97497eb9694541f7c3d37b1a4d"]');
    await countryName.click();
    await page.getByRole('option', { name: 'Switzerland' }).click();

    /** Creating another row by clicking on `+Add` button */
    await page.locator('a:has-text("+Add")').click();

    /** Entering values into the newly created row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=1').fill('Global St');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=1').fill('California');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=1').fill('AK');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=1').fill('03142');

    phone = page.locator('div[data-test-id="1f8261d17452a959e013666c5df45e07"] >> nth=1');
    await phone.locator('button').click();
    /** Selecting the country code */
    await page.locator('text=United States+1 >> nth=0').click();
    await common.enterPhoneNumber(phone, '6175451212');

    countryName = page.locator('div[data-test-id="59716c97497eb9694541f7c3d37b1a4d"] >> nth=1');
    await countryName.click();
    await page.getByRole('option', { name: 'United States of America' }).click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('td >> text="Main St"')).toBeVisible();
    await expect(assignment.locator('td >> text="Cambridge"')).toBeVisible();
    await expect(assignment.locator('td >> text="MA"')).toBeVisible();
    await expect(assignment.locator('td >> text="02142"')).toBeVisible();
    await expect(assignment.locator('td >> text="+16175551212"')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Deleting the newly created row */
    await page.locator('button[id="delete-row-1"]').click();

    await page.locator('button:has-text("Next")').click();

    /** Testing the values corresponding to newly created row on Confirm screen - those shouldn't be there */
    await expect(assignment.locator('td >> text="Global St"')).toBeHidden();
    await expect(assignment.locator('td >> text="California"')).toBeHidden();
    await expect(assignment.locator('td >> text="AK"')).toBeHidden();
    await expect(assignment.locator('td >> text="03142"')).toBeHidden();
    await expect(assignment.locator('td >> text="+6175451212"')).toBeHidden();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type tests */
    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Readonly")').click();

    /** Testing the values that were entered by Editable test */
    await expect(assignment.locator('span >> text="Main St"')).toBeVisible();
    await expect(assignment.locator('span >> text="Cambridge"')).toBeVisible();
    await expect(assignment.locator('span >> text="MA"')).toBeVisible();
    await expect(assignment.locator('span >> text="02142"')).toBeVisible();
    await expect(assignment.locator('span >> text="+16175551212"')).toBeVisible();

    /** Testing Sorting(both ascending and descending) */
    selectedOption = page.locator('div[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("Table")').click();

    /** Editable mode type tests */
    selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Editable")').click();

    selectEditMode = page.locator('div[data-test-id="80c1db3a7b228760228004b1a532c71e"]');
    await selectEditMode.click();
    await page.locator('li:has-text("Table rows")').click();

    /** Creating row by clicking on `+Add` button */
    await page.locator('a:has-text("+ Add")').click();

    /** Entering values in the second Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=1').fill('Global St');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=1').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=1').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=1').fill('02142');

    /** Creating row by clicking on `+Add` button */
    await page.locator('a:has-text("+ Add")').click();

    /** Entering values in the third Row */
    await page.locator('input[data-test-id="202003240938510823869"] >> nth=2').fill('');
    await page.locator('input[data-test-id="202003240938510831291"] >> nth=2').fill('Cambridge');
    await page.locator('input[data-test-id="202003240938510831411"] >> nth=2').fill('MA');
    await page.locator('input[data-test-id="202003240938510832734"] >> nth=2').fill('02142');

    await page.locator('button:has-text("Next")').click();

    await page.locator('span:has-text("Street")').click();

    const table = page.locator('div[id="simple-table-manual"]');
    let tableCell = table.locator('tbody >> tr >> td >> nth=0');
    await expect(await tableCell.textContent()).toBe('---');

    await page.locator('span:has-text("Street")').click();

    tableCell = table.locator('tbody >> tr >> td >> nth=0');
    await expect(await tableCell.textContent()).toBe('Main St');

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => common.closePage(page));
