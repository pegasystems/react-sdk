import { useState, useEffect } from 'react';
import { Input } from '@govuk-react/input';
import { Label, LabelText } from 'govuk-react';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface TextInputProps extends PConnFieldProps {
  fieldMetadata?: any;
}

export default function TextInput(props: TextInputProps) {
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

  let readOnlyProp = {};

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <span>{inputValue}</span>;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <span>{inputValue}</span>;
  }

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  const testProps: any = { 'data-test-id': testId };

  function handleChange(event) {
    setInputValue(event?.target?.value);
  }

  function handleBlur() {
    handleEvent(actions, 'changeNblur', propName, inputValue);
  }

  return (
    <Label>
      <LabelText>
        {label} {required && '*'}
      </LabelText>
      <Input
        label={(!hideLabel && label) || ''}
        value={inputValue}
        onChange={handleChange}
        onBlur={!readOnly ? handleBlur : undefined}
        maxLength={maxLength}
        {...readOnlyProp}
        {...testProps}
        placeholder={placeholder}
      />
    </Label>
  );
}
