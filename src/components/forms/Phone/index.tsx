import React from 'react';
import TextInput from '../TextInput';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

export default function Phone(props) {
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

  if (readOnly) {
    const disableDropdown = true;
    return (
      <></>
    );
  }

  const handleChange = inputVal => {
    let phoneValue = inputVal && inputVal.replace(/\D+/g, '');
    phoneValue = `+${phoneValue}`;
    onChange({ value: phoneValue });
  };

  const handleBlur = event => {
    const phoneValue = event?.target?.value;
    event.target.value = `+${phoneValue && phoneValue.replace(/\D+/g, '')}`;
    onBlur(event);
  };

  return (

    <TextInput
      {...props}
      inputProps={{
          type:'tel',
          /*
            TODO enable if always relevant
            autocomplete="tel"
          */
        }
      }
    />
  );
}
