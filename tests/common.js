/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */

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
  const tomorrow = new Date();
  const theLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  // add 1 day to today
  tomorrow.setDate(new Date().getDate() + 1);
  // Need to get leading zeroes on single digit months and 4 digit year
  return tomorrow.toLocaleDateString(theLocale, {
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
