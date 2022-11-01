import React from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
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

  if(displayMode === 'LABELS_LEFT'){
    const field = {
      [label]: value
    };
    return <FieldValueList item={field}/>
  }

  if (readOnly) {
    const disableDropdown = true;
    return (
      <div>
        <MuiPhoneNumber
          fullWidth
          helperText={helperTextToDisplay}
          placeholder=''
          size='small'
          required={required}
          disabled={disabled}
          onChange={onChange}
          error={status === 'error'}
          label={label}
          value={value}
          InputProps={{
            readOnly: true
          }}
          disableDropdown={disableDropdown}
        />
      </div>
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
    <MuiPhoneNumber
      fullWidth
      variant='outlined'
      helperText={helperTextToDisplay}
      placeholder=''
      size='small'
      defaultCountry='us'
      required={required}
      disabled={disabled}
      onChange={handleChange}
      onBlur={handleBlur}
      error={status === 'error'}
      label={label}
      value={value}
      InputProps={{ ...testProp }}
    />
  );
}
