const path = require('path');

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5'
  },
  features: {
    storyStoreV7: false
  },
  webpackFinal: config => {
    config.resolve.alias['@pega/react-sdk-components/lib/bridge/react_pconnect'] = path.resolve(__dirname, '../__mocks__/react_pconnect.jsx');
    config.resolve.alias['@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields'] = path.resolve(
      __dirname,
      '../__mocks__/DetailsFields.js'
    );
    config.resolve.alias['@pega/react-sdk-components/lib/components/helpers/state-utils'] = path.resolve(__dirname, '../__mocks__/state-utils.tsx');
    config.module.rules.push({
      test: /\.(d.ts)$/,
      loader: 'null-loader'
    });
    config.module.rules.push({
      test: /\.(map)$/,
      loader: 'null-loader'
    });
    return config;
  }
};
export default config;
