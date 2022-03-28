import React, {useEffect, useState} from "react";
import Utils from "../../../helpers/utils";
import { TextField } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';

interface IOption {
  key: string;
  value: string;
}

export default function Dropdown(props) {
  const {getPConnect, label, required, disabled, placeholder, value, datasource=[], validatemessage, status, onChange, readOnly} = props;
  const [options, setOptions] = useState<Array<IOption>>([]);

  useEffect(() => {
    setOptions(Utils.getOptionList(props, getPConnect().getDataObject()));
  }, [datasource]);

  let readOnlyProp = {};

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  const handleChange = evt => {
    onChange({value: evt.target.value});
  }

  // Material UI shows a warning if the component is rendered before options are set.
  //  So, hold off on rendering anything until options are available...
  return (
    options.length === 0 ?
      null
      :
      <TextField
        fullWidth
        variant={ readOnly ? "standard" : "outlined"}
        helperText={validatemessage}
        placeholder={placeholder}
        size="small"
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleChange}
        error={status === "error"}
        label={label}
        value={value}
        select
        InputProps={ readOnlyProp }
      >
        {
          options.map((option: any) => (
              <MenuItem
                key={option.key}
                value={option.key}
              >
                {option.value}
              </MenuItem>
            ))
        }
      </TextField>
    );
}
