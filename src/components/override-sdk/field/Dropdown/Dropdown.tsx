import { useEffect, useState } from 'react';
import styled from 'styled-components';
import isDeepEqual from 'fast-deep-equal/react';
import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import { getDataPage } from '@pega/react-sdk-components/lib/components/helpers/data_page';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// ---------------------------------------------------------------------------
// Northwestern Mutual "Luna" design tokens
// ---------------------------------------------------------------------------
const NM = {
  navy: '#1f2d46',
  border: '#5c697f',
  borderHover: '#1f2d46',
  focusBlue: '#2d4dc5',
  errorRed: '#c93939',
  errorRedDark: '#b52828',
  placeholder: '#9ba7bc',
  labelColor: '#5c697f',
  textColor: '#1f2d46',
  surface: '#fffffe',
  helperText: '#5c697f',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  fontSize: '1rem',
  labelFontSize: '0.875rem',
  helperFontSize: '0.75rem',
  transitionSpeed: '0.2s'
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  font-family: ${NM.fontFamily};
`;

const Label = styled.label<{ $required?: boolean; $hasError?: boolean }>`
  font-size: ${NM.labelFontSize};
  font-weight: 500;
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.labelColor)};
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
  ${({ $required }) => $required && `&::after { content: ' *'; color: ${NM.errorRed}; }`}
`;

// Wraps the <select> and injects the chevron icon via ::after pseudo-element
const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  &::after {
    content: '';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231f2d46' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
  }
`;

// Luna bottom-border-only select — no full box, animated focus underline
const StyledSelect = styled.select<{ $hasError?: boolean; $isPlaceholder?: boolean }>`
  width: 100%;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  line-height: 1.5;
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? NM.placeholder : NM.textColor)};
  background-color: ${NM.surface};
  border: 1px solid ${({ $hasError }) => ($hasError ? 'transparent' : NM.border)};
  border-bottom: ${({ $hasError }) => ($hasError ? `2px solid ${NM.errorRed}` : `1px solid ${NM.border}`)};
  border-radius: ${({ $hasError }) => ($hasError ? '0' : '4px')};
  padding: 0.625rem 2.25rem 0.625rem 0.75rem;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition:
    border-color ${NM.transitionSpeed} ease,
    border-bottom-color ${NM.transitionSpeed} ease,
    box-shadow ${NM.transitionSpeed} ease;

  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => ($hasError ? 'transparent' : NM.borderHover)};
    border-bottom-color: ${({ $hasError }) => ($hasError ? NM.errorRedDark : NM.borderHover)};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? 'transparent' : NM.focusBlue)};
    border-bottom-color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.focusBlue)};
    box-shadow: 0 1px 0 0 ${({ $hasError }) => ($hasError ? NM.errorRed : NM.focusBlue)};
  }

  &:disabled {
    opacity: ${NM.disabledOpacity};
    cursor: not-allowed;
  }
`;

const ReadOnlyValue = styled.span`
  width: 100%;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  background-color: transparent;
  border-bottom: 1px dashed ${NM.border};
  padding: 0.625rem 0.75rem;
  display: block;
`;

const HelperText = styled.span<{ $hasError?: boolean }>`
  font-size: ${NM.helperFontSize};
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.helperText)};
  margin-top: 0.25rem;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  ${({ $hasError }) => $hasError && `&::before { content: '⚠'; }`}
`;

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
    if (listType !== 'associated' && typeof datasource === 'string') {
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

  const displayFn = (displayM, val) => {
    if (displayM === 'DISPLAY_ONLY') {
      return (
        <FieldValueList
          name={hideLabel ? '' : label}
          value={thePConn.getLocalizedValue(val, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
        />
      );
    }

    if (displayM === 'STACKED_LARGE_VAL') {
      return (
        <FieldValueList
          name={hideLabel ? '' : label}
          value={thePConn.getLocalizedValue(val, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
          variant='stacked'
        />
      );
    }

    return null;
  };

  const hasError = status === 'error';

  if (displayMode) {
    return displayFn(displayMode, options.find(option => option.key === value)?.value || value);
  }

  if (readOnly) {
    const displayValue = options.find(o => o.key === value)?.value || value;
    return (
      <Wrapper>
        {!hideLabel && label && <Label $hasError={hasError}>{label}</Label>}
        <ReadOnlyValue>{displayValue}</ReadOnlyValue>
        {helperTextToDisplay && <HelperText $hasError={hasError}>{helperTextToDisplay}</HelperText>}
      </Wrapper>
    );
  }

  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
    handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
    if (onRecordChange) {
      onRecordChange(evt);
    }
  };

  const selectId = `nm-select-${testId ?? propName ?? label}`;
  const currentValue = value === '' ? placeholder : value;
  const isPlaceholder = currentValue === placeholder;

  // Hold off rendering until options are available (avoids MUI warning equivalent)
  return options.length === 0 ? null : (
    <Wrapper>
      {!hideLabel && label && (
        <Label htmlFor={selectId} $required={required} $hasError={hasError}>
          {label}
        </Label>
      )}
      <SelectWrapper>
        <StyledSelect
          id={selectId}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          $hasError={hasError}
          $isPlaceholder={isPlaceholder}
          data-test-id={testId}
          aria-invalid={hasError}
          aria-describedby={helperTextToDisplay ? `${selectId}-helper` : undefined}
          aria-required={required}
        >
          {options.map(option => (
            <option key={option.key} value={option.key}>
              {thePConn.getLocalizedValue(option.value, localePath, thePConn.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName))}
            </option>
          ))}
        </StyledSelect>
      </SelectWrapper>
      {helperTextToDisplay && (
        <HelperText id={`${selectId}-helper`} $hasError={hasError} role={hasError ? 'alert' : undefined}>
          {helperTextToDisplay}
        </HelperText>
      )}
    </Wrapper>
  );
}
