import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '../FormGroup/FormGroup';

export default function TextInput(props){

  const {name, errorText, hintText, inputProps} = props;

  const inputClasses = `govuk-input ${errorText && 'govuk-input--error'}`

  //TODO - Handle input widths
  //TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  //TODO - Handle autocomplete settings

  // TODO Investigate if this approach can be streamlined and/or refactored for use in other components
  const hintID = `${name}-hint`;
  const errorID = `${name}-error`;
  const describedByIDs = [hintText && hintID, errorText && errorID];

  return(
    <FormGroup {...props}>
      <input className={inputClasses} {...inputProps} id={name} name={name} aria-describedby={describedByIDs.join(' ').trim()}></input>
    </FormGroup>
    )
}

TextInput.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  inputProps: PropTypes.object,
}
