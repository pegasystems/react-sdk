import React, { useEffect, useState } from 'react';
import GDSTextInput from '../../BaseComponents/TextInput/TextInput';
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';

declare const PCore;

export default function TextInput(props) {
  const {
    label,
    value = '',
    validatemessage,
    onChange,
    helperText,
    getPConnect,
    inputProps,
  } = props;

  // const maxLength = fieldMetadata?.maxLength;



  const [isOnlyQuestion, setIsOnlyQuestion] = useState(PCore.getFormUtils().getEditableFields("root/primary_1/workarea_1").length === 1);
  const [displayLabel, setDisplayLabel] = useState(label);
  useAddErrorToPageTitle(validatemessage);

  /* let testProp = {};
  testProp = {
    'data-test-id': testId
  }; */

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

  const extraInputProps = {onChange, value};

  // TODO Investigate more robust way to check if we should display as password
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
      label={displayLabel}
      labelIsHeading={isOnlyQuestion}
    />
    </>
  );
}
