import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../../helpers/utils';
import handleEvent from '../../../helpers/event-utils';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

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
    readOnly,
    testId,
    helperText,
    displayMode,
    hideLabel,
    onRecordChange
  } = props;
  const [options, setOptions] = useState<Array<IOption>>([]);
  const helperTextToDisplay = validatemessage || helperText;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  useEffect(() => {
    const optionsList = Utils.getOptionList(props, getPConnect().getDataObject());
    optionsList.unshift({ key: 'Select', value: 'Select...' });
    setOptions(optionsList);
  }, [datasource]);

  let readOnlyProp = {};

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

  const handleChange = evt => {
    const selectedValue = evt.target.value === 'Select' ? '' : evt.target.value;
    handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
    if (onRecordChange) {
      onRecordChange(evt);
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
      onChange={!readOnly ? handleChange : undefined}
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
