import { useState } from 'react';
import HmrcOdxGdsTextPresentation from './index.tsx';
import { withKnobs } from '@storybook/addon-knobs';
import { configProps, fieldMetadata } from './mock.stories';

export default {
  title: 'HmrcOdxGdsTextPresentation',
  decorators: [withKnobs],
  component: HmrcOdxGdsTextPresentation
};

export const BaseHmrcOdxGdsTextPresentation = () => {
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: (propName, theValue) => {
              setValue(theValue);
            }
          };
        },
        getStateProps: () => {
          return { value: '.name' };
        }
      };
    },
    onChange: (event) => { setValue(event.target.value); },
    onBlur: () => { return configProps.value; }
  };

  return (
    <>
      <HmrcOdxGdsTextPresentation {...props} />
    </>
  );
};
