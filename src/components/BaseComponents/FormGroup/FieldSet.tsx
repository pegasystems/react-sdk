import React from 'react';
import PropTypes from 'prop-types';
import ConditionalWrapper from '../../../helpers/formatters/ConditionalWrapper';

export default function FieldSet({legendIsHeading=true, label, name, errorText, hintText, children, fieldsetElementProps}){

  const formGroupDivClasses = `govuk-form-group ${errorText?'govuk-form-group--error':""}`.trim();
  const legendClasses = `govuk-fieldset__legend ${legendIsHeading?"govuk-fieldset__legend--l":""}`.trim();

  // TODO Reconsider how to generate hintID and errorID for aria-described by
  const describedByIDs : Array<string> = [];
  const hintID = `${name}-hint`;
  const errorID = `${name}-error`;
  if (hintText) {describedByIDs.push(hintID)};
  if (errorText) {describedByIDs.push(errorID)};

  return (
    <div className={formGroupDivClasses}>
      <fieldset className="govuk-fieldset" aria-describedby={describedByIDs.join(' ')} {...fieldsetElementProps}>
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
        {hintText && <div id={hintID} className="govuk-hint">{hintText}</div>}
        {errorText  && <p id={errorID} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span>{errorText}</p> }
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
}
