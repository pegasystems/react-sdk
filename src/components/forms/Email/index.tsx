import React from 'react';
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

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  return (
    <TextInput
      {...props}
      inputProps={{
        type:'email',
        spellcheck:"false",
        /*
            TODO enable if always relevant
            autocomplete="email"
        */
      }}
    />
  );
}
