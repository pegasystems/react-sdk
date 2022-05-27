import React from "react";
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import TextInput from "../TextInput";

export default function DateTime(props) {
  const {label, required, disabled, value='', validatemessage, status, onChange, readOnly, testId} = props;

  if (readOnly) {
    return ( <TextInput {...props} /> );
  }

  const handleChange = (date) => {
    const changeValue = date && date.isValid() ? date.toISOString() : null;
    onChange({value: changeValue});
  }

  //
  // TODO: Keyboard doesn't work in the minute field, it updates one digit then jump to am/pm field
  //       try an older version of the lib or use DateTimePicker
  //

  return (
      <KeyboardDateTimePicker
        variant="inline"
        inputVariant="outlined"
        fullWidth
        autoOk
        required={required}
        disabled={disabled}
        placeholder="mm/dd/yyyy hh:mm am"
        format="MM/DD/YYYY hh:mm a"
        mask="__/__/____ __:__ _m"
        minutesStep={5}
        error={status === "error"}
        helperText={validatemessage}
        size="small"
        label={label}
        value={value || null}
        onChange={handleChange}
        data-test-id={testId}
      />
    );
}
