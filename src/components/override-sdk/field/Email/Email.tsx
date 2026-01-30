import React, { useEffect, useState } from 'react';
import { InputField } from 'govuk-react';

// --- ABSOLUTE IMPORTS ---
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';

interface EmailProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Email here
}

export default function Email(props: EmailProps) {
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
    // If readOnly, we might default to the generic TextInput in readOnly mode
    // or render a GDS read-only input if TextInput isn't suitable.
    return <TextInput {...props} />;
  }

  const testProps: any = { 'data-test-id': testId };

  function handleChange(event) {
    // update internal value
    setInputValue(event?.target?.value);
  }

  function handleBlur() {
    handleEvent(actions, 'changeNblur', propName, inputValue);
  }

  return (
    <InputField
      // GDS Compliance: Label is passed as children
      // We handle hideLabel by passing null or the label text
      mb={6} // Standard GDS spacing bottom
      meta={{
        touched: isError,
        error: isError ? helperTextToDisplay : undefined
      }}
      hint={!isError ? helperTextToDisplay : undefined}
      input={{
        type: 'email',
        name: propName,
        value: inputValue,
        onChange: handleChange,
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
