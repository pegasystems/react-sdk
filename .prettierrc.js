// Prettier config options: https://prettier.io/docs/en/options.html
// Shared front-end config: https://git.pega.io/projects/FE/repos/configs/browse/packages/prettier-config/index.json

module.exports = import('@pega/prettier-config').then(pegaPrettierConfig => ({
  ...pegaPrettierConfig.default,
  printWidth: 150
}));
