import type { DecoratorFn } from '@storybook/react';
import {
  Configuration,
  PopoverManager,
  Toaster,
  ModalManager,
  WorkTheme
} from '@pega/cosmos-react-core';

export const decorators: DecoratorFn[] = [
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
  }
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
  }
};
