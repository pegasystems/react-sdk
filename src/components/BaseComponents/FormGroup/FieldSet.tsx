
import React, {useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import ConditionalWrapper from '../../helpers/formatters/ConditionalWrapper';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';
import { DefaultFormContext } from '../../helpers/HMRCAppContext';
import InstructionComp from '../../helpers/formatters/ParsedHtml';

export default function FieldSet({legendIsHeading=false, label, name, errorText, hintText, children, fieldsetElementProps, testProps}){
  const[ErrorMessage,setErrorMessage] = useState(errorText);

  const {instructionText} = useContext(DefaultFormContext);
  

  useEffect(()=>{
    setErrorMessage(errorText)
  },[errorText])
  const formGroupDivClasses = `govuk-form-group ${ErrorMessage?'govuk-form-group--error':""}`.trim();
  const legendClasses = ` ${(legendIsHeading) ?"govuk-fieldset__legend govuk-fieldset__legend--l":"govuk-label govuk-label--m"}`.trim();

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
            wrapper={ child => <h1 className="govuk-fieldset__heading">{child}</h1>}
            childrenToWrap={label}
          />
        </legend>
        {instructionText &&  legendIsHeading && <p id='instructions' className='govuk-body'><InstructionComp htmlString={instructionText} /></p>}  
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
