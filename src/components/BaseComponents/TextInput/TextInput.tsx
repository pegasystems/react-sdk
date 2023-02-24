import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../FormGroup/FormGroup';


//TODO Refactor is required elsewhere
const ConditionalWrapper = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : children;
}


export default function TextInput(props){

  const {name, label, errorText, hintText, labelIsHeading, inputProps} = props;

  //TODO - Handle input widths
  //TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  //TODO - Handle autocomplete settings

  return(
    <FormGroup {...props}>
      <input className="govuk-input" {...inputProps} id={name} name={name}></input>
    </FormGroup>
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
