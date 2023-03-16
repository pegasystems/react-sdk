import React from 'react';
import GDSTextInput from '../../BaseComponents/TextInput/TextInput';
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';

export default function TextInput(props) {
  const {
    label,
    value = '',
    validatemessage,
    onChange,
    helperText,
    getPConnect,
    inputProps,
    fieldMetadata,
    maxLength
  } = props;

  // const maxLength = fieldMetadata?.maxLength;

  // TODO consider moving this functionality 'up' especially when we add Error summary,
  // as it may be tidier to call this only once, rather than on every input
  useAddErrorToPageTitle(validatemessage);

  // TODO Investigate whether or not this can be refactored out, or if a name can be injected as a prop higher up
  const thePConn = getPConnect();
  let propName = thePConn.getStateProps().value;
  propName = propName.indexOf('.') === 0 ? propName.substring(1) : propName;

  /* let testProp = {};
  testProp = {
    'data-test-id': testId
  }; */

  const extraInputProps = {onChange, value};

  // TODO Investigate more robust way to check if we should display as password
  if(fieldMetadata?.displayAs === "pxPassword"){
    extraInputProps["type"]="password";
  }

  const isOnlyField = useIsOnlyField();

  return (
    <>
      <GDSTextInput
        inputProps={{
          ...inputProps,
          ...extraInputProps
        }}
        hintText={helperText}
        errorText={validatemessage}
        label={label}
        labelIsHeading={isOnlyField}
        name={propName}
        maxLength={maxLength}
      />
    </>
  );
}
