/* eslint-disable no-undef */
/* eslint-disable strict */

const path = require("path");

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {
    builder: 'webpack5',
  },

  webpackFinal: (config) => {
    config.resolve.alias['@pega/react-sdk-components/lib/bridge/react_pconnect'] = path.resolve(__dirname, '../__mocks__/react_pconnect.jsx');
    return config;
  },
};
