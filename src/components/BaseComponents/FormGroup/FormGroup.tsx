import React from 'react';
import PropTypes from 'prop-types';

export default function FormGroup({labelIsHeading=true, label, errorText, hintText,  children}){

  const formGroupDivClasses = `govuk-form-group ${errorText && 'govuk-form-group--error'}`;
  const labelClasses = `govuk-label ${labelIsHeading?"govuk-label--l":""}`;

  // TODO add an id to hint and aria-described by to child field, if possible?

  // TODO Refactor if required elsewhere - THIS IS ALSO USED IN FIELDGROUP.tsx
  const ConditionalWrapper = ({ condition, wrapper, childrenToWrap }) => {
    return condition ? wrapper(childrenToWrap) : childrenToWrap;
  }

  return (
    <div className={formGroupDivClasses}>
      <ConditionalWrapper
        condition={labelIsHeading}
        wrapper={ child => {
                  return (
                  <h1 className="govuk-label-wrapper">
                    {child}
                  </h1>)}
                }
        childrenToWrap={
          <label className={labelClasses}>{label}</label>
        }
      />
      {hintText && <div className="govuk-hint">{hintText}</div>}
      {errorText  && <p className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span>{errorText}</p> }
      {children}
    </div>
  )
}

FormGroup.propTypes = {
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
}
