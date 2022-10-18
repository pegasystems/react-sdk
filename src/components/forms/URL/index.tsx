import React from 'react';
import { TextField } from '@material-ui/core';
import TextInput from '../TextInput';

// NOTE: that we had to change the name from URL to URLComponent
//  Otherwise, we were getting all kinds of weird errors when we
//  referred to URL as a component.
export default function URLComponent(props) {
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
    helperText
  } = props;
  const helperTextToDisplay = validatemessage || helperText;

  if (readOnly) {
    return <TextInput {...props} />;
  }

  return (
    <TextField
      type='url'
      fullWidth
      variant='outlined'
      helperText={helperTextToDisplay}
      placeholder=''
      size='small'
      required={required}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      error={status === 'error'}
      label={label}
      value={value}
    />
  );
}
