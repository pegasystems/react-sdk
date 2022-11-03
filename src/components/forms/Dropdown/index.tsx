import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../../helpers/utils';

interface IOption {
  key: string;
  value: string;
}

export default function Dropdown(props) {
  const {
    getPConnect,
    label,
    required,
    disabled,
    placeholder,
    value = '',
    datasource = [],
    validatemessage,
    status,
    onChange,
    readOnly,
    testId,
    helperText
  } = props;
  const [options, setOptions] = useState<Array<IOption>>([]);
  const helperTextToDisplay = validatemessage || helperText;

  useEffect(() => {
    const optionsList = Utils.getOptionList(props, getPConnect().getDataObject());
    optionsList.unshift({ key: 'Select', value: 'Select...' });
    setOptions(optionsList);
  }, [datasource]);

  let readOnlyProp = {};

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  const handleChange = evt => {
    if (evt.target.value === 'Select') {
      onChange({ value: '' });
    } else {
      onChange({ value: evt.target.value });
    }
  };

  // Material UI shows a warning if the component is rendered before options are set.
  //  So, hold off on rendering anything until options are available...
  return options.length === 0 ? null : (
    <TextField
      fullWidth
      variant={readOnly ? 'standard' : 'outlined'}
      helperText={helperTextToDisplay}
      placeholder={placeholder}
      size='small'
      required={required}
      disabled={disabled}
      onChange={handleChange}
      onBlur={handleChange}
      error={status === 'error'}
      label={label}
      value={value === '' && !readOnly ? 'Select' : value}
      select
      InputProps={{ ...readOnlyProp, ...testProp }}
    >
      {options.map((option: any) => (
        <MenuItem key={option.key} value={option.key}>
          {option.value}
        </MenuItem>
      ))}
    </TextField>
  );
}
