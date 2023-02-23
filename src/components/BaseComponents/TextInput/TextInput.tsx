import React from 'react';
import PropTypes from 'prop-types';


//TODO Refactor is required elsewhere
const ConditionalWrapper = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : children;
}


export default function TextInput(props){

  const {name, label, errorText, hintText, labelIsHeading, inputProps} = props;

  const formGroupDivClasses = `govuk-form-group ${errorText && 'govuk-form-group--error'}`;
  const labelClasses = `govuk-label ${labelIsHeading?"govuk-label--l":""}`;

  //TODO - Handle input widths
  //TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  //TODO - Handle autocomplete settings

  return(
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
      <input className="govuk-input" {...inputProps} id={name} name={name}></input>
    </div>
  )
}

TextInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  inputProps: PropTypes.object,
  hintText: PropTypes.string,
  errorText: PropTypes.string
}

TextInput.defaultProps ={
  labelIsHeading: true,
}
