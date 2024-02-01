import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
// import { useTranslation } from 'react-i18next';
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

  // const { t } = useTranslation();
  registerNonEditableField();

  if (readOnly) {
    return null;
  }

  // const warning = t('WARNING');

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

  // const deepNodeList = (nodeList, callBack) => {
  //   nodeList.forEach(node => {
  //     if (node.childNodes && node.childNodes.length > 0) {
  //       deepNodeList(node.childNodes, callBack);
  //     } else {
  //       callBack(node);
  //     }
  //   });
  // };

  // const replaceWarningTextBlockHook = (node) => {
  //   if(node.childNodes){
  //     deepNodeList(node.childNodes, (deepNode) => {
  //       if (deepNode.parentNode.innerText && deepNode.parentNode.innerText?.indexOf( `${warning}!!!`) !== -1)
  //       {
  //         const originalInnerHTML = deepNode.parentNode.innerHTML;
  //         const trimmedInnerHTML = originalInnerHTML.replace(`${warning}!!!`, '');
  //         deepNode.parentNode.innerHTML = `<div class="govuk-warning-text">
  //             <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  //             <strong class="govuk-warning-text__text">
  //               <span class="govuk-warning-text__assistive">${warning}</span>
  //               ${trimmedInnerHTML}
  //             </strong>
  //           </div>`;
  //       }
  //     })
  //   }
  // }

  return (
    <ParsedHTML
      htmlString={getFormattedInstructionText(value)}
      DOMSanitiseHooks={[addGovukBodyToParagraphHook]}
    />
  );
}
