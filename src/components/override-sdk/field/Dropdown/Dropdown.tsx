import React, { useEffect, useState } from 'react';

import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import Select from '../../../BaseComponents/Select/Select';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay'

interface IOption {
  key: string;
  value: string;
}

export default function Dropdown(props) {
  const {
    getPConnect,
    placeholder,
    value = '',
    datasource = [],
    validatemessage,
    helperText,
    readOnly,
    name,
    fieldMetadata
  } = props;

  const [options, setOptions] = useState<Array<IOption>>([]);
  const [displayValue, setDisplayValue] = useState();
  let label = props.label;
  const {isOnlyField, overrideLabel} = useIsOnlyField(props.displayOrder);
  if(isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;
  const[errorMessage,setErrorMessage] = useState(validatemessage);


  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();

  const propName = thePConn.getStateProps().value;
  const className = thePConn.getCaseInfo().getClassName();
  const refName = propName?.slice(propName.lastIndexOf('.') + 1);

  useEffect(()=>{
    setErrorMessage(validatemessage)
  
  },[validatemessage])


  useEffect(() => {
    const optionsList = [...Utils.getOptionList(props, getPConnect().getDataObject())];
    const selectedOption = optionsList.find(option => option.key === value);
    if(selectedOption && selectedOption.value){
      setDisplayValue(selectedOption.value);
    }
    setOptions(optionsList);
  }, [datasource, value]);

  const metaData = Array.isArray(fieldMetadata)
    ? fieldMetadata.filter(field => field?.classID === className)[0]
    : fieldMetadata;

  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : refName;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

  const handleChange = evt => {
    const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
    handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
  };

  if(readOnly){
    return <ReadOnlyDisplay label={label} value={thePConn.getLocalizedValue(
      displayValue,
      localePath,
      thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
    )} />
  }

  return (
      <Select
        label={label}
        hintText={helperText}
        errorText={errorMessage}
        legendIsHeading={isOnlyField}
        onChange={handleChange}
        value={value}
        name={name}
      >
        <option key={placeholder} value=''>
          {placeholder}
        </option>
        {options.map(option => {
          return (
            <option key={option.key} value={option.key}>
              {thePConn.getLocalizedValue(
                option.value,
                localePath,
                thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
              )}
            </option>
          );
        })}
      </Select>
  );
}
