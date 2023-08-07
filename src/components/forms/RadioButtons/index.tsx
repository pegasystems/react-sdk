import React, { useState, useEffect } from 'react';
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText
} from '@material-ui/core';

import Utils from '../../../helpers/utils';
import handleEvent from '../../../helpers/event-utils';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

export default function RadioButtons(props) {
  const {
    getPConnect,
    label,
    value = '',
    readOnly,
    validatemessage,
    helperText,
    status,
    required,
    inline,
    displayMode,
    hideLabel,
    fieldMetadata
  } = props;
  const [theSelectedButton, setSelectedButton] = useState(value);

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;
  const helperTextToDisplay = validatemessage || helperText;
  const className = thePConn.getCaseInfo().getClassName();

  let configProperty = thePConn.getRawMetadata()?.config?.value || '';
  configProperty = configProperty.startsWith('@P') ? configProperty.substring(3) : configProperty;
  configProperty = configProperty.startsWith('.') ? configProperty.substring(1) : configProperty;

  const metaData = Array.isArray(fieldMetadata)
    ? fieldMetadata.filter(field => field?.classID === className)[0]
    : fieldMetadata;
  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : configProperty;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());

  useEffect(() => {
    // This update theSelectedButton which will update the UI to show the selected button correctly
    setSelectedButton(value);
  }, [value]);

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

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.value);
  };

  const handleBlur = event => {
    thePConn.getValidationApi().validate(event.target.value);
  };

  return (
    <FormControl error={status === 'error'} required={required}>
      <FormLabel component='legend'>{label}</FormLabel>
      <RadioGroup
        value={theSelectedButton}
        onChange={handleChange}
        onBlur={!readOnly ? handleBlur : undefined}
        row={inline}
      >
        {theOptions.map(theOption => {
          return (
            <FormControlLabel
              value={theOption.key}
              key={theOption.key}
              label={thePConn.getLocalizedValue(
                theOption.value,
                localePath,
                thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
              )}
              control={<Radio key={theOption.key} color='primary' disabled={readOnly} />}
            />
          );
        })}
      </RadioGroup>
      <FormHelperText>{helperTextToDisplay}</FormHelperText>
    </FormControl>
  );
}
