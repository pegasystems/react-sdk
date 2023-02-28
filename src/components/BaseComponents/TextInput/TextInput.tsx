import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../FormGroup/FormGroup';

export default function TextInput(props){

  const {name, inputProps} = props;

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
  ...FormGroup.propTypes,
  name: PropTypes.string,
  inputProps: PropTypes.object,
}
