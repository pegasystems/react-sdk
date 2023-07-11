import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import FieldValueList from '../../designSystemExtensions/FieldValueList';
import handleEvent from '../../../helpers/event-utils';

export default function TextInput(props) {
  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    /* onChange, onBlur */
    readOnly,
    testId,
    fieldMetadata,
    helperText,
    displayMode,
    hideLabel
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;

  const helperTextToDisplay = validatemessage || helperText;

  const [inputValue, setInputValue] = useState();
  const maxLength = fieldMetadata?.maxLength;

  let readOnlyProp = {}; // Note: empty if NOT ReadOnly

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  function handleChange(event) {
    // update internal value
    setInputValue(event?.target?.value);
  }

  function handleBlur() {
    handleEvent(actions, 'changeNblur', propName, inputValue);
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
      onChange={handleChange}
      onBlur={!readOnly ? handleBlur : undefined}
      error={status === 'error'}
      label={label}
      value={inputValue}
      InputProps={{ ...readOnlyProp, inputProps: { maxLength, ...testProp } }}
    />
  );
}
