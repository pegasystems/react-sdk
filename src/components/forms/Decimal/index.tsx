import React from 'react';
import { TextField } from '@material-ui/core';
import TextInput from '../TextInput';

export default function Decimal(props) {
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
      fullWidth
      variant={readOnly ? 'standard' : 'outlined'}
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
      type='text'
      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
    />
  );
}
