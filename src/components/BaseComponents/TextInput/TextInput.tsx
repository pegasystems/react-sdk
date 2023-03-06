import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, {makeErrorId, makeHintId} from '../FormGroup/FormGroup';

export default function TextInput(props){

  const {name, errorText, hintText, inputProps={}} = props;

  const inputClasses = `govuk-input ${errorText?'govuk-input--error':""}`.trim();

  // TODO - Handle input widths
  // TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  // TODO - Handle autocomplete settings

  inputProps["aria-describedby"] = `${errorText?makeErrorId(name):""} ${hintText?makeHintId(name):""}`.trim();

  return(
    <FormGroup {...props}>
      <input className={inputClasses} {...inputProps} id={name} name={name}></input>
    </FormGroup>
    )
}

TextInput.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  inputProps: PropTypes.object,
}
