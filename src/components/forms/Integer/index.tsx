import React from 'react';
import { TextField } from '@material-ui/core';
import TextInput from '../TextInput';

export default function Integer(props) {
  const {
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
    onBlur,
    readOnly,
    testId,
    helperText
  } = props;
  const helperTextToDisplay = validatemessage || helperText;

  // console.log(`Integer: label: ${label} value: ${value}`);

  if (readOnly) {
    return <TextInput {...props} />;
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  function intOnChange(event) {
    // console.log(`Integer intOnChange inValue: ${event.target.value}`);

    // Disallow "." and "," (separators) since this is an integer field
    //  Mimics Pega Integer behavior (where separator characters are "eaten" if they're typed)
    const disallowedChars = ['.', ','];
    const theAttemptedValue = event.target.value;
    const lastChar = theAttemptedValue.slice(-1);

    if (disallowedChars.includes(lastChar)) {
      event.target.value = theAttemptedValue.slice(0, -1);
    }

    // Pass through to the Constellation change handler
    onChange(event);
  }

  return (
    <TextField
      fullWidth
      variant={readOnly ? 'standard' : 'outlined'}
      helperText={helperTextToDisplay}
      placeholder=''
      size='small'
      required={required}
      disabled={disabled}
      onChange={intOnChange}
      onBlur={onBlur}
      error={status === 'error'}
      label={label}
      value={value}
      type='text'
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', ...testProp }}
    />
  );
}
