import { useState, useEffect } from 'react';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import './PlainCssTextInput.css';

interface PlainCssTextInputProps extends PConnFieldProps {
  fieldMetadata?: any;
}

export default function PlainCssTextInput(props: PlainCssTextInputProps) {
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
    fieldMetadata,
    helperText,
    displayMode,
    hideLabel,
    placeholder
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;

  const [inputValue, setInputValue] = useState('');
  const maxLength = fieldMetadata?.maxLength;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  const isError = status === 'error';

  const inputClasses = ['plain-ds-input', isError && 'plain-ds-input--error', readOnly && 'plain-ds-input--readonly'].filter(Boolean).join(' ');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleBlur() {
    if (!readOnly) {
      handleEvent(actions, 'changeNblur', propName, inputValue);
    }
  }

  return (
    <div className='plain-ds-field' data-test-id={testId}>
      {!hideLabel && (
        <label className={`plain-ds-label${required ? ' plain-ds-label--required' : ''}`}>
          {label}
          <span className='plain-ds-badge'>Custom DS</span>
        </label>
      )}
      <div className='plain-ds-input-wrapper'>
        <input
          className={inputClasses}
          type='text'
          value={inputValue}
          placeholder={placeholder ?? ''}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {helperTextToDisplay && <span className={`plain-ds-helper${isError ? ' plain-ds-helper--error' : ''}`}>{helperTextToDisplay}</span>}
    </div>
  );
}
