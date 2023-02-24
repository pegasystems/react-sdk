import React, { useEffect, useState } from 'react';
import GDSTextInput from '../../BaseComponents/TextInput/TextInput';
import FieldValueList from '../../designSystemExtensions/FieldValueList';

import {useIsOnlyField, useStepName} from '../../../helpers/hooks/QuestionDisplayHooks';

declare const PCore;

export default function TextInput(props) {
  const {
    label,
    required,
    disabled,
    value = '',
    validatemessage,
    status,
    onChange,
    onBlur,
    readOnly,
    testId,
    fieldMetadata,
    helperText,
    displayMode,
    getPConnect,
    inputProps,
  } = props;

  const helperTextToDisplay = validatemessage || helperText;

  const maxLength = fieldMetadata?.maxLength;

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  const isOnlyField = useIsOnlyField();
  const stepName = useStepName(isOnlyField, getPConnect);

  let extraInputProps = {onChange, onBlur, value};

  //TODO Investigate more robust way to check if we should display as password
  if(label === "Password"){
    extraInputProps["type"]="password";
  }

  return (
    <>
      <GDSTextInput
        inputProps={{
          ...inputProps,
          ...extraInputProps
        }}
        hintText={helperText}
        errorText={validatemessage}
        label={isOnlyField? stepName : label}
        labelIsHeading={isOnlyField}
      />
    </>
  );
}
