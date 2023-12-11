import React, { useEffect, useState } from 'react';
import GDSTextInput from '../../../BaseComponents/TextInput/TextInput';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';

export default function TextInput(props) {
  const {
    getPConnect,
    value = '',
    placeholder,
    validatemessage,
    onChange,
    helperText,
    inputProps,
    fieldMetadata,
    readOnly,
    disabled,
    name,
    testId,
    configAlternateDesignSystem
  } = props;

  const[errorMessage,setErrorMessage] = useState(validatemessage);

  registerNonEditableField(!!disabled);

  useEffect(()=>{
    setErrorMessage(validatemessage)
  },[validatemessage])
  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();

  const propName = thePConn.getStateProps().value;
  const formattedPropertyName = name || propName?.split('.')?.pop();

  const handleChange = evt => {
    if (name === 'content-pyPostalCode') {
      const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
      handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
    }
  };

  let label = props.label;
  const {isOnlyField, overrideLabel} = useIsOnlyField(props.displayOrder);
  if(isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  const maxLength = fieldMetadata?.maxLength;

  if (readOnly) {
    return <ReadOnlyDisplay label={label} value={value} />;
  }

  const extraProps = { testProps: { 'data-test-id': testId } };

  const extraInputProps = { onChange, value };

  // TODO Investigate more robust way to check if we should display as password
  if (fieldMetadata?.displayAs === 'pxPassword') {
    extraInputProps['type'] = 'password';
  }

  if (configAlternateDesignSystem?.autocomplete) {
    extraInputProps['autoComplete'] = configAlternateDesignSystem.autocomplete;
  }

  return (
    <>
      <GDSTextInput
        inputProps={{
          ...inputProps,
          ...extraInputProps
        }}
        hintText={helperText}
        errorText={errorMessage}
        label={label}
        labelIsHeading={isOnlyField}
        name={formattedPropertyName}
        maxLength={maxLength}
        id={formattedPropertyName}
        onBlur={e => handleChange(e)}
        {...extraProps}
        disabled={disabled || false}
      />
    </>
  );
}
