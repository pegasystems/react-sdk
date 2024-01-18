// Prettier config options: https://prettier.io/docs/en/options.html
// Shared front-end config: https://git.pega.io/projects/FE/repos/configs/browse/packages/prettier-config/index.json

const pegaPrettierConfig = require('@pega/prettier-config');

module.exports = {
  ...pegaPrettierConfig,
  printWidth: 150
};
