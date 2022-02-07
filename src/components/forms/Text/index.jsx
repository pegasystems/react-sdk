import React from "react";
import TextInput from '../TextInput';

export default function Text(props) {
  // const {label, required, disabled, value, validatemessage, status, onChange, onBlur} = props;
  // Text component is a readOnly text component
  const readOnly = true;

  return (
      <TextInput {...props} readOnly={readOnly}
      />
    )
}
