import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config: StorybookConfig = {
  stories: process.env.STORYBOOK_CONSTELLATION
    ? ['../src/components/custom-constellation/**/*.stories.@(js|jsx|ts|tsx)']
    : ['../src/components/custom-sdk/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react-webpack5',
  docs: {
    autodocs: 'tag'
  },
  features: {
    storyStoreV7: true
  },
  webpackFinal: async config => {
    if (config.resolve?.alias) {
      config.resolve.alias['@pega/react-sdk-components/lib/bridge/react_pconnect'] = path.resolve(__dirname, '../__mocks__/react_pconnect.jsx');
      config.resolve.alias['@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields'] = path.resolve(
        __dirname,
        '../__mocks__/DetailsFields.js'
      );
      config.resolve.alias['@pega/react-sdk-components/lib/components/helpers/state-utils'] = path.resolve(__dirname, '../__mocks__/state-utils.tsx');
      config.resolve.alias['@pega/auth/lib/sdk-auth-manager'] = path.resolve(__dirname, '../__mocks__/authManager.tsx');
    }

    if (config.module) {
      config.module.rules?.push(
        {
          test: /\.(d.ts)$/,
          loader: 'null-loader'
        },
        {
          test: /\.(map)$/,
          loader: 'null-loader'
        }
      );
    }

    return config;
  }
};

export default config;
