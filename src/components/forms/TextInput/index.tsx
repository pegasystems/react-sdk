import React, { useEffect, useState } from 'react';
import GDSTextInput from '../../BaseComponents/TextInput/TextInput';
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';
import {useIsOnlyField, useStepName} from '../../../helpers/hooks/QuestionDisplayHooks';

declare const PCore;

export default function TextInput(props) {
  const {
    label,
    value = '',
    validatemessage,
    onChange,
    helperText,
    displayMode,
    getPConnect,
    inputProps,
    fieldMetadata,
  } = props;

  // const maxLength = fieldMetadata?.maxLength;

  const [isOnlyQuestion, setIsOnlyQuestion] = useState(PCore.getFormUtils().getEditableFields("root/primary_1/workarea_1").length === 1);
  const [displayLabel, setDisplayLabel] = useState(label);
  useAddErrorToPageTitle(validatemessage);


  // TODO Investigate whether or not this can be refactored out, or if a name can be injected as a prop higher up
  const thePConn = getPConnect();
  let propName = thePConn.getStateProps().value;
  propName = propName.indexOf('.') === 0 ? propName.substring(1) : propName;

  /* let testProp = {};
  testProp = {
    'data-test-id': testId
  }; */

  let extraInputProps = {onChange, value};

  // TODO Investigate more robust way to check if we should display as password
  if(fieldMetadata?.displayAs === "pxPassword"){
    extraInputProps["type"]="password";
  }

  const isOnlyField = useIsOnlyField();
  const stepName = useStepName(isOnlyField, getPConnect);

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
        name={propName}
      />
    </>
  );
}
