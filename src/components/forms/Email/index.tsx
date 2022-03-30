import React from "react";
import {
  TextField,
  InputAdornment
 } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import TextInput from "../TextInput";


export default function Email(props) {
  const {label, required, disabled, value='', validatemessage, status, onChange, onBlur, readOnly} = props;

  if (readOnly) {
    return ( <TextInput {...props} /> );
  }


  return (
      <TextField
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
        type="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon />
            </InputAdornment>
          ),
        }}
      />
    )
}
