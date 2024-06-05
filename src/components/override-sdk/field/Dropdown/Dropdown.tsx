import { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import isDeepEqual from 'fast-deep-equal/react';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import { getDataPage } from '@pega/react-sdk-components/lib/components/helpers/data_page';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import './dropdown.css';

interface IOption {
  key: string;
  value: string;
}

const flattenParameters = (params = {}) => {
  const flatParams = {};
  Object.keys(params).forEach(key => {
    const { name, value: theVal } = params[key];
    flatParams[name] = theVal;
  });

  return flatParams;
};

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

interface DropdownProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Dropdown here
  datasource?: any[];
  onRecordChange?: any;
  fieldMetadata?: any;
  listType: string;
  deferDatasource?: boolean;
  datasourceMetadata?: any;
  parameters?: any;
  columns: any[];
}

export default function Dropdown(props: DropdownProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect,
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    readOnly,
    testId,
    helperText,
    displayMode,
    deferDatasource,
    datasourceMetadata,
    hideLabel,
    onRecordChange,
    fieldMetadata
  } = props;
  let { placeholder = '' } = props;
  const context = getPConnect().getContextName();
  let { listType, parameters, datasource = [], columns = [] } = props;
  placeholder = placeholder || 'Select...';
  const [options, setOptions] = useState<IOption[]>([]);
  const [theDatasource, setDatasource] = useState<any[] | null>(null);
  const helperTextToDisplay = validatemessage || helperText;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = (thePConn.getStateProps() as any).value;
  const className = thePConn.getCaseInfo().getClassName();
  const refName = propName?.slice(propName.lastIndexOf('.') + 1);

  if (!isDeepEqual(datasource, theDatasource)) {
    // inbound datasource is different, so update theDatasource (to trigger useEffect)
    setDatasource(datasource);
  }

  // convert associated to datapage listtype and transform props
  // Process deferDatasource when datapage name is present. WHhen tableType is promptList / localList
  if (deferDatasource && datasourceMetadata?.datasource?.name) {
    listType = 'datapage';
    datasource = datasourceMetadata.datasource.name;
    const { parameters: dataSourceParameters, propertyForDisplayText, propertyForValue } = datasourceMetadata.datasource;
    parameters = flattenParameters(dataSourceParameters);
    const displayProp = propertyForDisplayText.startsWith('@P') ? propertyForDisplayText.substring(3) : propertyForDisplayText;
    const valueProp = propertyForValue.startsWith('@P') ? propertyForValue.substring(3) : propertyForValue;
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
    if (theDatasource) {
      const list = Utils.getOptionList(props, getPConnect().getDataObject('')); // 1st arg empty string until typedef marked correctly
      const optionsList = [...list];
      optionsList.unshift({
        key: placeholder,
        value: thePConn.getLocalizedValue(placeholder, '', '')
      }); // 2nd and 3rd args empty string until typedef marked correctly
      setOptions(optionsList);
    }
  }, [theDatasource]);

  useEffect(() => {
    if (!displayMode && listType !== 'associated' && typeof datasource === 'string') {
      getDataPage(datasource, parameters, context).then((results: any) => {
        const optionsData: any[] = [];
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

  const metaData = Array.isArray(fieldMetadata) ? fieldMetadata.filter(field => field?.classID === className)[0] : fieldMetadata;

  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : refName;
  const localePath = localeContext === 'datapage' ? displayName : localeName;

  let readOnlyProp = {};

  if (displayMode === 'LABELS_LEFT') {
    return (
      <FieldValueList
        name={hideLabel ? '' : label}
        // @ts-ignore - Property 'getLocaleRuleNameFromKeys' is private and only accessible within class 'C11nEnv'
        value={thePConn.getLocalizedValue(value, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
      />
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <FieldValueList
        name={hideLabel ? '' : label}
        // @ts-ignore - Property 'getLocaleRuleNameFromKeys' is private and only accessible within class 'C11nEnv'
        value={thePConn.getLocalizedValue(value, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
        variant='stacked'
      />
    );
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
      className='dropdown'
      fullWidth
      variant={readOnly ? 'standard' : 'outlined'}
      helperText={helperTextToDisplay}
      placeholder={thePConn.getLocalizedValue(placeholder, '', '')} // 2nd and 3rd args empty string until typedef marked correctly
      size='small'
      required={required}
      disabled={disabled}
      onChange={!readOnly ? handleChange : undefined}
      error={status === 'error'}
      label={label}
      value={value === '' && !readOnly ? placeholder : value}
      select
      InputProps={{ ...readOnlyProp, ...testProp }}
      InputLabelProps={{
        style: {
          fontSize: '1.5em'
        } as any
      }}
    >
      {options.map((option: any) => (
        <MenuItem key={option.key} value={option.key}>
          {/* @ts-ignore - Property 'getLocaleRuleNameFromKeys' is private and only accessible within class 'C11nEnv'  */}
          {thePConn.getLocalizedValue(option.value, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
        </MenuItem>
      ))}
    </TextField>
  );
}
