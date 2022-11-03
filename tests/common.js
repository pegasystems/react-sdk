/* eslint-disable no-undef */

const Login = async (username, password, page) => {
  await page.locator('#txtUserID').type(username);
  await page.locator('#txtPassword').type(password);
  await page.locator('#submit_row .loginButton').click();
};

const getAttributes = async element => {
  const attributes = await element.evaluate(async ele => ele.getAttributeNames());
  return attributes;
};

const getNextDay = () => {
  const today = new Date();
  const theLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  // add 10 day to today
  const futureDate = new Date(today.setDate(today.getDate() + 10));
  // Need to get leading zeroes on single digit months and 4 digit year
  return futureDate.toLocaleDateString(theLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

module.exports = {
  Login,
  getAttributes,
  getNextDay
};
