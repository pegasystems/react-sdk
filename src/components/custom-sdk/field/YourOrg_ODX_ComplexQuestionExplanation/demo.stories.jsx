import { withKnobs } from '@storybook/addon-knobs';

import YourOrgOdxComplexQuestionExplanation from './index.jsx';

import { stateProps, configProps, fieldMetadata } from './mock.stories';

export default {
  title: 'YourOrgOdxComplexQuestionExplanation',
  decorators: [withKnobs],
  component: YourOrgOdxComplexQuestionExplanation
};

export const baseYourOrgOdxComplexQuestionExplanation = () => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,

    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <YourOrgOdxComplexQuestionExplanation {...props} />
    </>
  );
};
