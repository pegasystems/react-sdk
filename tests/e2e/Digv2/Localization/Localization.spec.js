const { test, expect } = require('@playwright/test');

const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(common.launchPortal);
/** Added tests for spanish(Latin America) locale (es-XL) */
test.describe('E2E test', () => {
  test('should login, create case and test the localized values', async ({ page }) => {
    await common.login(config.config.apps.digv2.localizedUser.username, config.config.apps.digv2.localizedUser.password, page);

    /** Testing announcement banner text */
    const announcementBanner = page.locator('h6:has-text("Anuncios")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist title */
    const worklist = page.locator('h6:has-text("Mi lista de trabajo")');
    await expect(worklist).toBeVisible();

    /** Testing landing pages */
    expect(await page.locator('div[role="button"]:has-text("Hogar")')).toBeVisible(); // Home
    expect(await page.locator('div[role="button"]:has-text("Panel de control en línea")')).toBeVisible(); // Inline Dashboard

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('div[role="button"]:has-text("Campos complejos")');
    await complexFieldsCase.click();

    /** Testing Case summary */
    expect(await page.locator('div[id="case-name"]:has-text("Campos complejos")')).toBeVisible(); // case type

    expect(await page.locator('button[id="edit"]:has-text("Editar")')).toBeVisible(); // edit action
    expect(await page.locator('button[id="actions-menu"]:has-text("Comportamiento")')).toBeVisible(); // actions menu

    const caseSummary = await page.locator('div[id="CaseSummary"]');
    expect(caseSummary.locator('input[value="Nuevo"]')).toBeVisible(); // case Status

    /** Testing Case history */
    const caseHistory = await page.locator('div[id="CaseHistory"]');
    await expect(caseHistory.locator('th >> text="Fecha"')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Descripción"')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Interpretado por"')).toBeVisible();

    /** Testing Case view */
    const stages = await page.locator('div[id="Stages"]');
    await expect(stages.locator('li:has-text("Crear")')).toBeVisible();

    const assignmentHeader = await page.locator('div[id="assignment-header"]');
    await expect(assignmentHeader.locator('h6:has-text("Seleccionar prueba")')).toBeVisible();
    await expect(assignmentHeader.locator('span:has-text("Tarea en")')).toBeVisible();

    /** Testing action buttons */
    const assignment = await page.locator('div[id="Assignment"]');
    await expect(assignment.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(assignment.locator('button:has-text("Entregar")')).toBeVisible();

    /** Selecting Embedded Data from the Category dropdown */
    const selectedCategory = page.locator('div[data-test-id="76729937a5eb6b0fd88c42581161facd"]');
    await selectedCategory.click();
    await page.locator('li:has-text("EmbeddedData")').click();

    await page.locator('button:has-text("Entregar")').click();

    /** Testing Multi step */
    await expect(assignment.locator('div[id="selected-label"]:has-text("Datos integrados")')).toBeVisible();

    let selectedOption = page.locator('div[data-test-id="c6be2b6191e6660291b6b0c92bd2f0df"]');
    await selectedOption.click();
    await page.locator('li:has-text("ListOfRecords")').click();

    let selectedSubCategory = page.locator('div[data-test-id="9463d5f18a8924b3200b56efaad63bda"]');
    await selectedSubCategory.click();
    await page.locator('li:has-text("FieldGroup")').click();

    let selectedTestName = page.locator('div[data-test-id="6f64b45d01d11d8efd1693dfcb63b735"]');
    await selectedTestName.click();
    await page.locator('li:has-text("Editable")').click();

    const phone = await page.locator('div[data-test-id="1f8261d17452a959e013666c5df45e07"]');
    expect(assignment.locator('label >> text="Número de teléfono"')).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    await expect(assignment.locator('h3:has-text("Dirección de Envío")')).toBeVisible();

    /** Testing table headers */
    await expect(assignment.locator('th >> text="Calle"')).toBeVisible();
    await expect(assignment.locator('th >> text="Ciudad"')).toBeVisible();
    await expect(assignment.locator('th >> text="Estado"')).toBeVisible();
    await expect(assignment.locator('th >> text="Código Postal"')).toBeVisible();
    await expect(assignment.locator('th >> text="Número de teléfono"')).toBeVisible();

    /** Testing file utility */
    const fileUtility = await page.locator('div[id="file-utility"]');
    await expect(fileUtility.locator('div:has-text("Archivos adjuntos0")')).toBeVisible();
    await fileUtility.locator('button[id="long-button"]').click();

    await expect(page.locator('li:has-text("Agregar archivos")')).toBeVisible();
    await expect(page.locator('li:has-text("Agregar enlaces")')).toBeVisible();

    /** Testing Add files Modal */
    await page.locator('li:has-text("Agregar archivos")').click();
    await expect(fileUtility.locator('h3:has-text("Agregar archivos locales")')).toBeVisible();
    await expect(fileUtility.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(fileUtility.locator('button:has-text("Adjuntar archivos")')).toBeVisible();

    fileUtility.locator('button:has-text("Cancelar")').click();
    await fileUtility.locator('button[id="long-button"]').click();

    /** Testing Add links Modal */
    await page.locator('li:has-text("Agregar enlaces")').click();
    await expect(fileUtility.locator('h3:has-text("Agregar enlaces")')).toBeVisible();
    await expect(fileUtility.locator('div >> text="Añadir enlace"')).toBeVisible();

    await expect(fileUtility.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(fileUtility.locator('button:has-text("Adjuntar enlaces")')).toBeVisible();
    await fileUtility.locator('button:has-text("Cancelar")').click();

    await page.locator('div[id="person-icon"]').click();
    await page.locator('li:has-text("Desconectarse")').click();
  }, 10000);
});

const outputDir = './test-reports/e2e/DigV2/Localization/Localization';
test.afterEach(async ({ page }) => common.closePage(page));
