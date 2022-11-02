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
    displayMode
  } = props;
  const helperTextToDisplay = validatemessage || helperText;

  if(displayMode === 'LABELS_LEFT'){
    const field = {
      [label]: value
    };
    return <FieldValueList item={field}/>
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
      onBlur={onBlur}
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
