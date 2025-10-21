const { config } = require('./config');

const launchPortal = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseUrl}/portal`, { waitUntil: 'networkidle' });
};

const launchEmbedded = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseUrl}/embedded`, { waitUntil: 'networkidle' });
};

const launchSelfServicePortal = async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(`${config.baseUrl}/portal?portal=DigV2SelfService`, {
    waitUntil: 'networkidle'
  });
};

const login = async (username, password, page) => {
  await page.waitForLoadState('networkidle');
  await page.locator('input[id="txtUserID"]').fill(username);
  await page.locator('input[id="txtPassword"]').fill(password);
  await page.locator('#submit_row .loginButton').click();
};

const getAttributes = async element => {
  return element.evaluate(async ele => ele.getAttributeNames());
};

const getFormattedDate = date => {
  if (!date) {
    return date;
  }

  return `${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getFullYear()}`;
};

const getFutureDate = () => {
  const today = new Date();
  // const theLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  // add 2 days to today
  const futureDate = new Date(today.setDate(today.getDate() + 2));

  // Need to get leading zeroes on single digit months and 4 digit year
  return getFormattedDate(futureDate);
};

const closePage = async page => {
  await page.close();
};

const enterPhoneNumber = async (phone, number) => {
  const phoneInput = phone.locator('input');
  await phoneInput.click();
  await phoneInput.pressSequentially(number);
};

module.exports = {
  launchPortal,
  launchEmbedded,
  launchSelfServicePortal,
  login,
  getAttributes,
  getFutureDate,
  closePage,
  enterPhoneNumber
};
