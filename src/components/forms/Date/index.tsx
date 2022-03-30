import React from "react";
import { KeyboardDatePicker } from '@material-ui/pickers';
import TextInput from "../TextInput";

export default function Date(props) {
  const {label, required, disabled, value='', validatemessage, status, onChange, readOnly} = props;

  if (readOnly) {
    // const theReadOnlyComp = <TextInput props />
    return ( <TextInput {...props} /> );
  }

  const handleChange = date => {
    const changeValue = date && date.isValid() ? date.toISOString() : null;
    onChange({value: changeValue});
  }

  return (
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        placeholder="mm/dd/yyyy"
        fullWidth
        autoOk
        required={required}
        disabled={disabled}
        format="MM/DD/YYYY"
        mask="__/__/____"
        error={status === "error"}
        helperText={validatemessage}
        size="small"
        label={label}
        value={value || null}
        onChange={handleChange}
      />
    );
}
