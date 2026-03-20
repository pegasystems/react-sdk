import { useEffect, useRef, useState } from 'react';
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
  optionHover: '#eef1f7',
  optionActive: '#dde3f5',
  disabledOpacity: '0.5',
  fontFamily: "'Graphik', 'Helvetica Neue', Helvetica, sans-serif",
  fontSize: '1rem',
  labelFontSize: '0.875rem',
  helperFontSize: '0.75rem',
  transitionSpeed: '0.2s',
};

// --- Styled primitives -------------------------------------------------------

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: ${NM.fontFamily};
  position: relative;
`;

const Label = styled.label<{ $required?: boolean; $hasError?: boolean }>`
  font-size: ${NM.labelFontSize};
  font-weight: 500;
  color: ${({ $hasError }) => ($hasError ? NM.errorRed : NM.labelColor)};
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
  ${({ $required }) =>
    $required &&
    `&::after { content: ' *'; color: ${NM.errorRed}; }`}
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  /* Chevron that rotates when dropdown is open */
  &[data-open='true']::after {
    transform: translateY(-50%) rotate(180deg);
  }
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
    transition: transform ${NM.transitionSpeed} ease;
  }
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  line-height: 1.5;
  color: ${NM.textColor};
  background-color: ${NM.surface};
  border: 1px solid ${({ $hasError }) => ($hasError ? 'transparent' : NM.border)};
  border-bottom: ${({ $hasError }) => ($hasError ? `2px solid ${NM.errorRed}` : `1px solid ${NM.border}`)};
  border-radius: ${({ $hasError }) => ($hasError ? '0' : '4px')};
  padding: 0.625rem 2.25rem 0.625rem 0.75rem;
  outline: none;
  transition:
    border-color ${NM.transitionSpeed} ease,
    border-bottom-color ${NM.transitionSpeed} ease,
    box-shadow ${NM.transitionSpeed} ease;

  &::placeholder {
    color: ${NM.placeholder};
    opacity: 1;
  }

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

// Floating option list — appears below the input
const OptionList = styled.ul<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid ${NM.border};
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 12px rgba(31, 45, 70, 0.12);
  max-height: 260px;
  overflow-y: auto;
`;

const OptionItem = styled.li<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  font-family: ${NM.fontFamily};
  font-size: ${NM.fontSize};
  color: ${NM.textColor};
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? NM.optionActive : 'transparent')};

  &:hover {
    background-color: ${NM.optionHover};
  }
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

interface AutoCompleteProps extends PConnFieldProps {
  // If any, enter additional props that only exist on AutoComplete here'
  displayMode?: string;
  deferDatasource?: boolean;
  datasourceMetadata?: any;
  status?: string;
  onRecordChange?: any;
  additionalProps?: object;
  listType: string;
  parameters?: any;
  datasource: any;
  columns: any[];
}

export default function AutoComplete(props: AutoCompleteProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const TextInput = getComponentFromMap('TextInput');
  const FieldValueList = getComponentFromMap('FieldValueList');

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
  const [options, setOptions] = useState<IOption[]>([]);
  const [theDatasource, setDatasource] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasError = status === 'error';
  const helperTextToDisplay = validatemessage || helperText;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = (thePConn.getStateProps() as any).value;

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
    if (listType === 'associated') {
      setOptions(Utils.getOptionList(props, getPConnect().getDataObject('')));
    }
  }, [theDatasource]);

  useEffect(() => {
    if (!displayMode && listType !== 'associated') {
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

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  // Resolve display string for current value
  const selectedOption = options.find(o => o.key === value);
  const selectedDisplayValue = selectedOption?.value ?? (value || '');

  if (readOnly) {
    return <TextInput {...props} value={selectedDisplayValue} />;
  }

  // Filter options by whatever the user has typed
  const filteredOptions = inputValue
    ? options.filter(o => o.value.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  const handleSelect = (option: IOption) => {
    handleEvent(actionsApi, 'changeNblur', propName, option.key);
    if (onRecordChange) {
      onRecordChange(option);
    }
    setInputValue(option.value);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpen(true);
    setActiveIndex(-1);
    // Clear pega value if user clears the input
    if (!e.target.value) {
      handleEvent(actionsApi, 'changeNblur', propName, '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(i => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0 && filteredOptions[activeIndex]) {
      e.preventDefault();
      handleSelect(filteredOptions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleBlur = () => {
    // Small delay so a mouse click on an option fires before blur closes the list
    setTimeout(() => setOpen(false), 120);
  };

  const inputId = `nm-autocomplete-${testId ?? propName ?? label}`;
  const displayInput = open ? inputValue : inputValue || selectedDisplayValue;

  return (
    <Wrapper ref={wrapperRef}>
      {!hideLabel && label && (
        <Label htmlFor={inputId} $required={required} $hasError={hasError}>
          {label}
        </Label>
      )}
      <InputWrapper data-open={open ? 'true' : 'false'}>
        <StyledInput
          id={inputId}
          type='text'
          role='combobox'
          aria-autocomplete='list'
          aria-expanded={open}
          aria-haspopup='listbox'
          aria-invalid={hasError}
          aria-describedby={helperTextToDisplay ? `${inputId}-helper` : undefined}
          placeholder={placeholder ?? ''}
          value={displayInput}
          required={required}
          $hasError={hasError}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          data-test-id={testId}
        />
        <OptionList $open={open && filteredOptions.length > 0} role='listbox'>
          {filteredOptions.map((option, index) => (
            <OptionItem
              key={option.key}
              role='option'
              aria-selected={option.key === value}
              $active={index === activeIndex}
              onMouseDown={() => handleSelect(option)}
            >
              {option.value}
            </OptionItem>
          ))}
        </OptionList>
      </InputWrapper>
      {helperTextToDisplay && (
        <HelperText
          id={`${inputId}-helper`}
          $hasError={hasError}
          role={hasError ? 'alert' : undefined}
        >
          {helperTextToDisplay}
        </HelperText>
      )}
    </Wrapper>
  );
}
