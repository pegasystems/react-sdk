import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Utils from '../../../helpers/utils';
import TextInput from '../TextInput';
import isDeepEqual from 'fast-deep-equal/react';

declare const PCore;

interface IOption {
  key: string;
  value: string;
}

export default function AutoComplete(props) {
  const {
    getPConnect,
    label,
    required,
    placeholder,
    value = '',
    validatemessage,
    datasource = [],
    onChange,
    readOnly,
    testId,
    listType,
    displayMode
  } = props;
  let { columns = [] } = props;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Array<IOption>>([]);
  const [theDatasource, setDatasource] = useState(null);
  let selectedValue: any = '';

  const preProcessColumns = (columnList) => {
    return columnList.map(col => {
      const tempColObj = { ...col };
      tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
      return tempColObj;
    });
  };

  columns = preProcessColumns(columns);

  if (!isDeepEqual(datasource, theDatasource)) {
    // inbound datasource is different, so update theDatasource (to trigger useEffect)
    setDatasource(datasource);
  }

  const getDisplayFieldsMetaData = (columnList) => {
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

  useEffect(() => {
    if (listType === 'associated') {
      setOptions(Utils.getOptionList(props, getPConnect().getDataObject()));
    }
  }, [theDatasource]);

  useEffect(() => {
    if (!displayMode && listType !== 'associated') {
      const workListData = PCore.getDataApiUtils().getData(datasource, {});

      workListData.then((workListJSON: Object) => {
        const optionsData: Array<IOption> = [];
        const results = workListJSON['data'].data;
        const displayColumn = getDisplayFieldsMetaData(columns);
        results?.forEach(element => {
          const value = element[displayColumn.primary]?.toString();
          const obj = {
            key: element.pyGUID || value,
            value
          };
          optionsData.push(obj);
        });
        setOptions(optionsData);
      });
    }
  }, []);

  if (value) {
    const index = options?.findIndex(element => element.key === value);
    if (index > -1) {
      selectedValue = options[index].value;
    } else {
      selectedValue = value;
    }
  }

  const handleChange = (event: object, newValue) => {
    onChange({ value: newValue ? newValue.key : '' });
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
          helperText={validatemessage}
          placeholder={placeholder}
          size='small'
          required={required}
          // eslint-disable-next-line no-restricted-globals
          error={status === 'error'}
          label={label}
          data-test-id={testId}
        />
      )}
    />
  );
}
