
import React, {useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConditionalWrapper from '../../helpers/formatters/ConditionalWrapper';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';

export default function FieldSet({legendIsHeading=true, label, name, errorText, hintText, children, fieldsetElementProps, testProps}){
  const[ErrorMessage,setErrorMessage] = useState(errorText);

  useEffect(()=>{

    if(errorText){
    setErrorMessage(errorText)
    }

  },[errorText])
  const formGroupDivClasses = `govuk-form-group ${ErrorMessage?'govuk-form-group--error':""}`.trim();
  const legendClasses = `govuk-fieldset__legend ${(legendIsHeading) ?"govuk-fieldset__legend--l":""}`.trim();

  // TODO Reconsider how to generate hintID and errorID for aria-described by
  const describedByIDs : Array<string> = [];
  const hintID = `${name}-hint`;
  const errorID = `${name}-error`;
  if (hintText) {describedByIDs.push(hintID)};
  if (ErrorMessage) {describedByIDs.push(errorID)};
  const ariaDescBy = describedByIDs.length !== 0 ? {'aria-describedby' : describedByIDs.join(' ')} : {};

  return (
    <div className={formGroupDivClasses} {...testProps}>
      <fieldset className="govuk-fieldset" {...ariaDescBy} {...fieldsetElementProps}>
        <legend className={legendClasses}>
          <ConditionalWrapper
            condition={legendIsHeading}
            wrapper={ child => {
                      return (
                      <h1 className="govuk-fieldset__heading">
                        {child}
                      </h1>)}
                    }
            childrenToWrap={label}
          />
        </legend>
        {hintText && <div id={hintID} className="govuk-hint"> <HintTextComponent htmlString={hintText}/></div>}
        {ErrorMessage  && <p id={errorID} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span>{ErrorMessage}</p> }
        {children}
    </fieldset>
  </div>
  )
}

FieldSet.propTypes = {
  label: PropTypes.string,
  legendIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  fieldsetElementProps: PropTypes.object,
  instructionText: PropTypes.string
}
