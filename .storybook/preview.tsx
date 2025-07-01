import { Preview } from '@storybook/react';
import { Configuration, PopoverManager, Toaster, ModalManager, WorkTheme } from '@pega/cosmos-react-core';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { theme } from '../src/theme';

import { decorator } from '../__mocks__/react_pconnect';
import setPCoreMocks from '../__mocks__/pcoreMocks';

const isConstellation = process.env.STORYBOOK_CONSTELLATION;

if (!isConstellation) {
  getSdkComponentMap();
}

setPCoreMocks();

const decorators = [
  (Story, context) => {
    return isConstellation ? (
      <Configuration>
        <PopoverManager>
          <Toaster dismissAfter={5000}>
            <ModalManager>
              <Story {...context} />
            </ModalManager>
          </Toaster>
        </PopoverManager>
      </Configuration>
    ) : (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story {...context} />
        </ThemeProvider>
      </StyledEngineProvider>
    );
  },
  decorator
];

const parameters = {
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
    source: { type: 'code' },
    codePanel: true
  }
};

const preview: Preview = {
  decorators,
  parameters
};

export default preview;
