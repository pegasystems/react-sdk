import React from "react";
import { TextField } from "@material-ui/core";

export default function TextInput(props) {
  const {label, required, disabled, value, validatemessage, status, onChange, onBlur, readOnly} = props;

  let readOnlyProp = {};  // Note: empty if NOT ReadOnly

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  return (
      <TextField
        fullWidth
        variant={ readOnly ? "standard" : "outlined"}
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
        InputProps={ readOnlyProp }
      />
    )
}
