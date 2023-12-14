/* eslint-disable no-undef */
/* eslint-disable strict */

const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {
    builder: 'webpack5'
  },

  addons: ['@storybook/preset-scss'],

  webpackFinal: config => {
    config.resolve.alias['@pega/react-sdk-components/lib/bridge/react_pconnect'] = path.resolve(
      __dirname,
      '../__mocks__/react_pconnect.jsx'
    );
    config.resolve.alias[
      '@pega/react-sdk-components/lib/components/designSystemExtension/DetailsFields'
    ] = path.resolve(__dirname, '../__mocks__/DetailsFields.js');
    return config;
  }
};
