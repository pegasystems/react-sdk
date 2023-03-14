import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import TextInput from '../TextInput';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

export default function Email(props) {
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
    helperText,
    displayMode,
    hideLabel
  } = props;
  const helperTextToDisplay = validatemessage || helperText;

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (readOnly) {
    return <TextInput {...props} />;
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  return (
    <TextField
      fullWidth
      variant='outlined'
      helperText={helperTextToDisplay}
      placeholder=''
      size='small'
      required={required}
      disabled={disabled}
      onChange={onChange}
      onBlur={!readOnly ? onBlur : undefined}
      error={status === 'error'}
      label={label}
      value={value}
      type='email'
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <MailOutlineIcon />
          </InputAdornment>
        ),
        inputProps: { ...testProp }
      }}
    />
  );
}
