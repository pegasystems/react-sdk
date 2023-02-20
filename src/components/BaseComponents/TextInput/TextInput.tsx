import React from 'react';
import PropTypes from 'prop-types';


//TODO Refactor is required elsewhere
const ConditionalWrapper = ({ condition, wrapper, children }) => {
  console.log(condition);
  console.log(wrapper(children));

  return condition ? wrapper(children) : children;
}


export default function TextInput(props){

  const {name, label, helpText, labelIsHeading, inputProps} = props;


  return(
    <div className="govuk-form-group">
      <ConditionalWrapper
        condition={labelIsHeading}
        wrapper={ children => {
                  return (
                  <h1 className="govuk-label-wrapper">
                    {children}
                  </h1>)}
                }
        children={
          <label className={`govuk-label ${labelIsHeading?"govuk-label--l":""}`}>{label}</label>
          }
      />
      {helpText && <div className="govuk-hint">{helpText}</div>}
      <input className="govuk-input" {...inputProps} id={name} name={name}></input>
    </div>

  )
}

TextInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  labelIsHeading: PropTypes.bool,
  inputProps: PropTypes.object,
  helpText: PropTypes.string
}

TextInput.defaultProps ={
  labelIsHeading: true,
}
