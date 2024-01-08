import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import ConditionalWrapper from '../../helpers/formatters/ConditionalWrapper';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';
import { DefaultFormContext, ErrorMsgContext } from '../../helpers/HMRCAppContext';
import InstructionComp from '../../helpers/formatters/ParsedHtml';
import { checkErrorMsgs } from '../../helpers/utils';

export default function FieldSet({
  legendIsHeading = false,
  label,
  name,
  errorText,
  hintText,
  children,
  fieldsetElementProps,
  testProps
}) {
  const { instructionText } = useContext(DefaultFormContext);

  const { errorMsgs } = useContext(ErrorMsgContext);
  const [errMessage, setErrorMessage] = useState(errorText);

  useEffect(() => {
    const found = checkErrorMsgs(errorMsgs, name);
    if (!found) {
      setErrorMessage(errorText);
    }
  }, [errorText, errorMsgs]);
  const formGroupDivClasses = `govuk-form-group ${
    errMessage ? 'govuk-form-group--error' : ''
  }`.trim();
  const legendClasses = ` ${
    legendIsHeading
      ? 'govuk-fieldset__legend govuk-fieldset__legend--l'
      : 'govuk-label govuk-label--m'
  }`.trim();
  const hintTextExists = !['none', '', null, undefined].includes(hintText);

  // TODO Reconsider how to generate hintID and errorID for aria-described by
  const describedByIDs: Array<string> = [];
  const hintID = `${name}-hint`;
  const errorID = `${name}-error`;
  if (hintText) {
    describedByIDs.push(hintID);
  }
  if (errMessage) {
    describedByIDs.push(errorID);
  }
  const ariaDescBy =
    describedByIDs.length !== 0 ? { 'aria-describedby': describedByIDs.join(' ') } : {};

  return (
    <div className={formGroupDivClasses} {...testProps}>
      <fieldset className='govuk-fieldset' {...ariaDescBy} {...fieldsetElementProps}>
        <legend className={legendClasses}>
          <ConditionalWrapper
            condition={legendIsHeading}
            wrapper={child => <h1 className='govuk-fieldset__heading'>{child}</h1>}
            childrenToWrap={label}
          />
        </legend>
        {instructionText && legendIsHeading && (
          <p id='instructions' className='govuk-body'>
            <InstructionComp htmlString={instructionText} />
          </p>
        )}
        {hintTextExists && (
          <div id={hintID} className='govuk-hint'>
            {' '}
            <HintTextComponent htmlString={hintText} />
          </div>
        )}
        {errMessage && (
          <p id={errorID} className='govuk-error-message'>
            <span className='govuk-visually-hidden'>Error:</span>
            {errMessage}
          </p>
        )}
        {children}
      </fieldset>
    </div>
  );
}

FieldSet.propTypes = {
  label: PropTypes.string,
  legendIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  fieldsetElementProps: PropTypes.object,
  instructionText: PropTypes.string
};
