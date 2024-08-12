import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import { decorator } from '../__mocks__/react_pconnect';

getSdkComponentMap();

export const parameters = {
  backgrounds: {
    default: 'App',
    values: [
      {
        name: 'App',
        value: '#e9eef3'
      },
      {
        name: 'Primary',
        value: '#ffffff'
      },
      {
        name: 'Secondary',
        value: '#f5f5f5'
      }
    ]
  },
  docs: {
    source: { type: 'code' }
  }
};
