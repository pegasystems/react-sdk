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
    value = '',
    datasource = [],
    validatemessage,
    status,
    readOnly,
    testId,
    helperText,
    displayMode,
    hideLabel,
    onRecordChange,
    fieldMetadata
  } = props;
  let { placeholder } = props;
  placeholder = placeholder || 'Select';
  const [options, setOptions] = useState<Array<IOption>>([]);
  const helperTextToDisplay = validatemessage || helperText;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;
  const className = thePConn.getCaseInfo().getClassName();
  const refName = propName?.slice(propName.lastIndexOf('.') + 1);

  useEffect(() => {
    const list = Utils.getOptionList(props, getPConnect().getDataObject());
    const optionsList = [...list];
    optionsList.unshift({ key: placeholder, value: thePConn.getLocalizedValue(placeholder) });
    setOptions(optionsList);
  }, [datasource]);

  const metaData = Array.isArray(fieldMetadata)
    ? fieldMetadata.filter(field => field?.classID === className)[0]
    : fieldMetadata;

  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : refName;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

  let readOnlyProp = {};

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={thePConn.getLocalizedValue(
      value,
      localePath,
      thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
    )} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={thePConn.getLocalizedValue(
      value,
      localePath,
      thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
    )} variant='stacked' />;
  }

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  const handleChange = evt => {
    const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
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
      placeholder={thePConn.getLocalizedValue(placeholder)}
      size='small'
      required={required}
      disabled={disabled}
      onChange={!readOnly ? handleChange : undefined}
      error={status === 'error'}
      label={label}
      value={value === '' && !readOnly ? placeholder : thePConn.getLocalizedValue(
      value,
      localePath,
      thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
    )}
      select
      InputProps={{ ...readOnlyProp, ...testProp }}
    >
      {options.map((option: any) => (
        <MenuItem key={option.key} value={option.key}>
          {thePConn.getLocalizedValue(
            option.value,
            localePath,
            thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
          )}
        </MenuItem>
      ))}
    </TextField>
  );
}
