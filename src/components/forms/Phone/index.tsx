import React from "react";
import { TextField } from "@material-ui/core";
import TextInput from "../TextInput";

export default function Phone(props) {
  const {label, required, disabled, value, validatemessage, status, onChange, onBlur, readOnly} = props;

  if (readOnly) {
    return ( <TextInput {...props} /> );
  }

  return (
      <TextField
        type="tel"
        fullWidth
        variant="outlined"
        helperText={validatemessage}
        placeholder=""
        size="small"
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        error={status === "error"}
        label={label}
        value={value}
      />
    )
}
