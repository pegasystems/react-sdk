import React, {useEffect, useState} from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Utils from "../../../helpers/utils";
import TextInput from "../TextInput";
import isDeepEqual from 'fast-deep-equal/react';


interface IOption {
  key: string;
  value: string;
}

export default function AutoComplete(props) {

  const {getPConnect, label, required, placeholder, value, validatemessage, datasource=[], onChange, readOnly} = props;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Array<IOption>>([]);
  const [theDatasource, setDatasource] = useState(null);

  if (!isDeepEqual(datasource, theDatasource)) {
    // inbound datasource is different, so update theDatasource (to trigger useEffect)
    setDatasource(datasource);
  }


  useEffect(() => {
    setOptions(Utils.getOptionList(props, getPConnect().getDataObject()));
  }, [theDatasource])


  const handleChange = (event: object, newValue) => {
    onChange({value: newValue ? newValue.value : ""});
  }

  const handleInputValue = (event, newInputValue) => {
    setInputValue(newInputValue);
  }

  if (readOnly) {
    const theValAsString = options?.find( opt => opt.key === value )?.value;
    return ( <TextInput {...props} value={theValAsString} /> );
  }

  // Need to use both getOptionLabel and getOptionSelected to map our
  //  key/value structure to what Autocomplete expects
  return (
      <Autocomplete
        options={options}
        getOptionLabel={(option: IOption) => { return option.value ? option.value : ""}}
        getOptionSelected={(option: any) => {return option.value ? option.value : ""}}
        fullWidth
        onChange={handleChange}
        value={value}
        inputValue={inputValue || value}
        onInputChange={handleInputValue}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            helperText={validatemessage}
            placeholder={placeholder}
            size="small"
            required={required}
            // eslint-disable-next-line no-restricted-globals
            error={status === "error"}
            label={label}
          />
        )}
      />
  )
}
