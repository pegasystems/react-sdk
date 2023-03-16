import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, { makeErrorId, makeHintId } from '../FormGroup/FormGroup';

export default function TextInput(props) {
  const { name, errorText, hintText, inputProps = {}, maxLength } = props;

  const inputClasses = `govuk-input ${errorText ? 'govuk-input--error' : ''}`.trim();

  const textInputClassesWithWidth = (width: number) => {
    if (width !== undefined || width !== null) {
      if (width >= 1 && width <= 10) return `${inputClasses} govuk-input--width-${10}`.trim();
      else return `${inputClasses} govuk-input--width-${20}`.trim();
    } else return inputClasses;
  };
  // TODO - Handle input widths
  // TODO - Handle input types (password, email, numeric) - Or investigate if these should be separate components, or can simple be handled by inputProps
  // TODO - Handle autocomplete settings

  inputProps['aria-describedby'] = `${errorText ? makeErrorId(name) : ''} ${
    hintText ? makeHintId(name) : ''
  }`.trim();

  return (
    <FormGroup {...props}>
      <input
        className={textInputClassesWithWidth(maxLength)}
        {...inputProps}
        id={name}
        name={name}
      ></input>
    </FormGroup>
  );
}

TextInput.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  maxLength: PropTypes.number,
  inputProps: PropTypes.object
};
