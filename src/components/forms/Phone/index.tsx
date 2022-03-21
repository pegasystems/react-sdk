import React from "react";
import MuiPhoneNumber from 'material-ui-phone-number';

export default function Phone(props) {
  const {label, required, disabled, value, validatemessage, status, onChange, onBlur, readOnly} = props;
  if (readOnly) {
    const disableDropdown = true;
    return (
      <div>
        <MuiPhoneNumber
        fullWidth
        helperText={validatemessage}
        placeholder=""
        size="small"
        required={required}
        disabled={disabled}
        onChange={onChange}
        error={status === "error"}
        label={label}
        value={value}
        InputProps={{
            readOnly: true,
        }}
        disableDropdown={disableDropdown}
      />
      </div>
    );
  }

  const handleChange = (inputVal) => {
    let value = inputVal && inputVal.replace(/\D+/g, '');
    value = `+${value}`;
    onChange({value});
  }

  return (
      <MuiPhoneNumber
        fullWidth
        variant="outlined"
        helperText={validatemessage}
        placeholder=""
        size="small"
        defaultCountry={'us'}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        error={status === "error"}
        label={label}
        value={value}
      />
    )
}
