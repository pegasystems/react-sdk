import React, { useEffect, useState } from 'react';
import { InputField } from 'govuk-react';

// --- ABSOLUTE IMPORTS ---
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface IntegerProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Integer here
}

export default function Integer(props: IntegerProps) {
  // Get emitted components from map (so we can get any override that may exist)
  const TextInput = getComponentFromMap('TextInput');
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
    hideLabel,
    placeholder
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;

  const helperTextToDisplay = validatemessage || helperText;
  const isError = status === 'error';

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  if (readOnly) {
    return <TextInput {...props} />;
  }

  const testProps: any = { 'data-test-id': testId };

  function intOnChange(event) {
    // Disallow "." and "," (separators) since this is an integer field
    // Mimics Pega Integer behavior (where separator characters are "eaten" if they're typed)
    const disallowedChars = ['.', ','];
    const theAttemptedValue = event.target.value;
    const lastChar = theAttemptedValue.slice(-1);

    if (disallowedChars.includes(lastChar)) {
      event.target.value = theAttemptedValue.slice(0, -1);
    }

    // Pass through to the Constellation change handler
    setInputValue(event.target.value);
  }

  function handleBlur() {
    handleEvent(actions, 'changeNblur', propName, inputValue);
  }

  return (
    <InputField
      // GDS Compliance: Label is passed as children
      mb={6}
      meta={{
        touched: isError,
        error: isError ? helperTextToDisplay : undefined
      }}
      hint={!isError ? helperTextToDisplay : undefined}
      input={{
        type: 'text', // Keeping as text to allow inputMode to handle the keypad
        inputMode: 'numeric',
        pattern: '[0-9]*',
        name: propName,
        value: inputValue,
        onChange: intOnChange,
        onBlur: !readOnly ? handleBlur : undefined,
        disabled,
        readOnly,
        placeholder: placeholder ?? '',
        ...testProps
      }}
    >
      {!hideLabel ? label : null}
    </InputField>
  );
}
