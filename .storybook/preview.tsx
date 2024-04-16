import { Configuration, PopoverManager, Toaster, ModalManager, WorkTheme } from '@pega/cosmos-react-core';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import { decorator } from '../__mocks__/react_pconnect';

getSdkComponentMap();

export const decorators = [
  (Story, context) => {
    return (
      <Configuration>
        <PopoverManager>
          <Toaster dismissAfter={5000}>
            <ModalManager>
              <Story {...context} />
            </ModalManager>
          </Toaster>
        </PopoverManager>
      </Configuration>
    );
  },
  decorator
];

export const parameters = {
  backgrounds: {
    default: 'App',
    values: [
      {
        name: 'App',
        value: WorkTheme.base.palette['app-background']
      },
      {
        name: 'Primary',
        value: WorkTheme.base.palette['primary-background']
      },
      {
        name: 'Secondary',
        value: WorkTheme.base.palette['secondary-background']
      }
    ]
  },
  docs: {
    source: { type: 'code' }
  }
};
