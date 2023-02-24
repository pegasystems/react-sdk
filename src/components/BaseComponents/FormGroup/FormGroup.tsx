import React from 'react';
import PropTypes from 'prop-types';

export default function FormGroup(props){
  const {children, errorText, hintText, labelIsHeading, label} = props;
  const formGroupDivClasses = `govuk-form-group ${errorText && 'govuk-form-group--error'}`;
  const labelClasses = `govuk-label ${labelIsHeading?"govuk-label--l":""}`;

  //TODO Refactor is required elsewhere
  const ConditionalWrapper = ({ condition, wrapper, children }) => {
    return condition ? wrapper(children) : children;
  }

  return (
    <div className="govuk-form-group">
      <div className={formGroupDivClasses}>
      <ConditionalWrapper
        condition={labelIsHeading}
        wrapper={ children => {
                  return (
                  <h1 className="govuk-label-wrapper">
                    {children}
                  </h1>)}
                }
        children={
          <label className={labelClasses}>{label}</label>
        }
      />
      {hintText && <div className="govuk-hint">{hintText}</div>}
      {errorText  && <p className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span>{errorText}</p> }
      {children}
    </div>
  </div>
  )
}

FormGroup.propTypes = {
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  hintText: PropTypes.string,
  errorText: PropTypes.string
}

FormGroup.defaultProps ={
  labelIsHeading: true,
}
