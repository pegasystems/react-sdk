/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */

const Login = async (username, password, page) => {
  await page.locator('#txtUserID').type(username);
  await page.locator('#txtPassword').type(password);
  await page.locator('#submit_row .loginButton').click();
};

const getAttributes = async (element) => {
  const attributes = await element.evaluate(async (ele) => ele.getAttributeNames());
  return attributes;
}

module.exports = {
  Login,
  getAttributes
};
