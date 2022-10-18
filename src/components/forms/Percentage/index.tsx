import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TextInput from '../TextInput';

// Inspired by https://stackoverflow.com/questions/50823182/material-ui-remove-up-down-arrow-dials-from-textview
const useStyles = makeStyles((/* theme */) => ({
  input: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  }
}));

export default function Percentage(props) {
  const classes = useStyles();

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

  // console.log(`Percentage: label: ${label} value: ${value}`);

  if (readOnly) {
    return <TextInput {...props} />;
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  return (
    <TextField
      className={classes.input}
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
      type='number'
      inputProps={{ ...testProp }}
    />
  );
}
