import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Utils from '../../../helpers/utils';
import TextInput from '../TextInput';
import isDeepEqual from 'fast-deep-equal/react';
import { getDataPage } from '../../../helpers/data_page';
import handleEvent from '../../../helpers/event-utils';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

interface IOption {
  key: string;
  value: string;
}

const preProcessColumns = columnList => {
  return columnList.map(col => {
    const tempColObj = { ...col };
    tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
    return tempColObj;
  });
};

const getDisplayFieldsMetaData = columnList => {
  const displayColumns = columnList.filter(col => col.display === 'true');
  const metaDataObj: any = { key: '', primary: '', secondary: [] };
  const keyCol = columnList.filter(col => col.key === 'true');
  metaDataObj.key = keyCol.length > 0 ? keyCol[0].value : 'auto';
  for (let index = 0; index < displayColumns.length; index += 1) {
    if (displayColumns[index].primary === 'true') {
      metaDataObj.primary = displayColumns[index].value;
    } else {
      metaDataObj.secondary.push(displayColumns[index].value);
    }
  }
  return metaDataObj;
};

export default function AutoComplete(props) {
  const {
    getPConnect,
    label,
    required,
    placeholder,
    value = '',
    validatemessage,
    readOnly,
    testId,
    displayMode,
    deferDatasource,
    datasourceMetadata,
    status,
    helperText,
    hideLabel,
    onRecordChange
  } = props;
  const context = getPConnect().getContextName();
  let { listType, parameters, datasource = [], columns = [] } = props;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Array<IOption>>([]);
  const [theDatasource, setDatasource] = useState(null);
  let selectedValue: any = '';
  const helperTextToDisplay = validatemessage || helperText;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  if (!isDeepEqual(datasource, theDatasource)) {
    // inbound datasource is different, so update theDatasource (to trigger useEffect)
    setDatasource(datasource);
  }

  const flattenParameters = (params = {}) => {
    const flatParams = {};
    Object.keys(params).forEach(key => {
      const { name, value: theVal } = params[key];
      flatParams[name] = theVal;
    });

    return flatParams;
  };

  // convert associated to datapage listtype and transform props
  // Process deferDatasource when datapage name is present. WHhen tableType is promptList / localList
  if (deferDatasource && datasourceMetadata?.datasource?.name) {
    listType = 'datapage';
    datasource = datasourceMetadata.datasource.name;
    parameters = flattenParameters(datasourceMetadata?.datasource?.parameters);
    const displayProp = datasourceMetadata.datasource.propertyForDisplayText.startsWith('@P')
      ? datasourceMetadata.datasource.propertyForDisplayText.substring(3)
      : datasourceMetadata.datasource.propertyForDisplayText;
    const valueProp = datasourceMetadata.datasource.propertyForValue.startsWith('@P')
      ? datasourceMetadata.datasource.propertyForValue.substring(3)
      : datasourceMetadata.datasource.propertyForValue;
    columns = [
      {
        key: 'true',
        setProperty: 'Associated property',
        value: valueProp
      },
      {
        display: 'true',
        primary: 'true',
        useForSearch: true,
        value: displayProp
      }
    ];
  }
  columns = preProcessColumns(columns);

  useEffect(() => {
    if (listType === 'associated') {
      setOptions(Utils.getOptionList(props, getPConnect().getDataObject()));
    }
  }, [theDatasource]);

  useEffect(() => {
    if (!displayMode && listType !== 'associated') {
      getDataPage(datasource, parameters, context).then((results: any) => {
        const optionsData: Array<any> = [];
        const displayColumn = getDisplayFieldsMetaData(columns);
        results?.forEach(element => {
          const val = element[displayColumn.primary]?.toString();
          const obj = {
            key: element[displayColumn.key] || element.pyGUID,
            value: val
          };
          optionsData.push(obj);
        });
        setOptions(optionsData);
      });
    }
  }, []);

  if (displayMode === 'LABELS_LEFT') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (value) {
    const index = options?.findIndex(element => element.key === value);
    if (index > -1) {
      selectedValue = options[index].value;
    } else {
      selectedValue = value;
    }
  }

  const handleChange = (event: object, newValue) => {
    const val = newValue ? newValue.key : '';
    handleEvent(actionsApi, 'changeNblur', propName, val);
    if (onRecordChange) {
      onRecordChange(event);
    }
  };

  const handleInputValue = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  if (readOnly) {
    const theValAsString = options?.find(opt => opt.key === value)?.value;
    return <TextInput {...props} value={theValAsString} />;
  }
  // Need to use both getOptionLabel and getOptionSelected to map our
  //  key/value structure to what Autocomplete expects
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option: IOption) => {
        return option.value ? option.value : '';
      }}
      getOptionSelected={(option: any) => {
        return option.value ? option.value : '';
      }}
      fullWidth
      onChange={handleChange}
      value={selectedValue}
      inputValue={inputValue || selectedValue}
      onInputChange={handleInputValue}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          variant='outlined'
          helperText={helperTextToDisplay}
          placeholder={placeholder}
          size='small'
          required={required}
          error={status === 'error'}
          label={label}
          data-test-id={testId}
        />
      )}
    />
  );
}
