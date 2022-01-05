import React from "react";
import { TextField } from "@material-ui/core";

export default function TextArea(props) {
  const {label, required, disabled, value, validatemessage, status, onChange, onBlur, readOnly} = props;


  let readOnlyProp = { };

  if (readOnly) {
    // Not just emitting a read only Textfield like some other components do
    //  since we want to preserve the minRows, maxRows info.
    readOnlyProp = { readOnly : true };
  }


  return (
      <TextField
        multiline
        minRows={5}
        maxRows={5}
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
