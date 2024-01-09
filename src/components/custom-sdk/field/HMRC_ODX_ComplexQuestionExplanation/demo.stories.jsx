import { useState } from 'react';
import HmrcOdxComplexQuestionExplanation from './index.tsx';
import { configProps, fieldMetadata } from './mock.stories';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'HmrcOdxComplexQuestionExplanation',
  decorators: [withKnobs],
  component: HmrcOdxComplexQuestionExplanation
};

export const BaseHmrcOdxComplexQuestionExplanation = () => {
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    helperText: configProps.helperText,
    disabled: configProps.disabled,
    required: configProps.required,
    readOnly: configProps.readOnly,
    displayMode: configProps.displayMode,
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
      <HmrcOdxComplexQuestionExplanation {...props} />
    </>
  );
};
