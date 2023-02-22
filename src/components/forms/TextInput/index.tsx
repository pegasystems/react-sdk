import React, { useEffect, useState } from 'react';
import GDSTextInput from '../../BaseComponents/TextInput/TextInput';
import FieldValueList from '../../designSystemExtensions/FieldValueList';


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

  const [isOnlyQuestion, setIsOnlyQuestion] = useState(PCore.getFormUtils().getEditableFields("root/primary_1/workarea_1").length === 1);
  const [displayLabel, setDisplayLabel] = useState(label);

  let readOnlyProp = {}; // Note: empty if NOT ReadOnly

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  useEffect ( () => {
    setIsOnlyQuestion(PCore.getFormUtils().getEditableFields("root/primary_1/workarea_1").length === 1);
  }, [])

  useEffect ( () => {
    if(isOnlyQuestion){
      setDisplayLabel(getPConnect().getDataObject()?.caseInfo.assignments[0].name);
    } else {
      setDisplayLabel(label);
    }
  }, [isOnlyQuestion])

  return (
    <>
    <GDSTextInput
      inputProps={{
        ...inputProps,
        onChange,
        onBlur,
        value,
      }}
      errorText={validatemessage}
      label={displayLabel}
      labelIsHeading={isOnlyQuestion}
    />
    </>
  );
}
