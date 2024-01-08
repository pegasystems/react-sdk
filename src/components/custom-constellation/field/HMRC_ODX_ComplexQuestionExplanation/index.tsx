import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface HmrcOdxComplexQuestionExplanationProps extends PConnFieldProps {
  // If any, enter additional props that only exist on this componentName
  
}


// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxComplexQuestionExplanation(props: HmrcOdxComplexQuestionExplanationProps) {
  const {
    value = '',
  } = props;  
  
  registerNonEditableField();

  return (
    <ParsedHTML htmlString={value} />        
  );
}


