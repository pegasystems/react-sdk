import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import getFormattedInstructionText from '../../../override-sdk/template/DefaultForm/DefaultFormUtils';

interface HmrcOdxComplexQuestionExplanationProps extends PConnFieldProps {
  // If any, enter additional props that only exist on this componentName
}

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxComplexQuestionExplanation(
  props: HmrcOdxComplexQuestionExplanationProps
) {
  const { value = '', readOnly } = props;

  registerNonEditableField();

  if (readOnly) {
    return null;
  }

  const addGovukBodyToParagraphHook = node => {
    const govukBodyClass = 'govuk-body';
    if (node.tagName === 'P') {
      if (!node.getAttribute('class')) {
        node.setAttribute('class', govukBodyClass);
      } else if (!node.getAttribute('class').includes(govukBodyClass)) {
        node.setAttribute('class', govukBodyClass.concat(' ', node.getAttribute('class')));
      }
    }
  };

  return (
    <ParsedHTML
      htmlString={getFormattedInstructionText(value)}
      DOMSanitiseHooks={[addGovukBodyToParagraphHook]}
    />
  );
}
