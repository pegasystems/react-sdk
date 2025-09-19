import { useEffect, useState } from 'react';
import { TextArea as Textarea, FormGroup, Label, ErrorText } from 'govuk-react';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface TextAreaProps extends PConnFieldProps {
  fieldMetadata?: any;
}

export default function TextArea(props: TextAreaProps) {
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
  const helperTextToDisplay = validatemessage || helperText;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const maxLength = fieldMetadata?.maxLength;

  const [inputValue, setInputValue] = useState('');

  let readOnlyProp = {};

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    return null;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return null;
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
    <FormGroup>
      {!hideLabel && <Label>{label}</Label>}
      <Textarea
        {...readOnlyProp}
        hint={helperTextToDisplay}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        meta={{
          error: validatemessage,
          touched: !!validatemessage
        }}
        {...testProps}
      />
    </FormGroup>
  );
}
