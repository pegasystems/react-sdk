import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import TextInput from "../TextInput";
import { makeStyles } from '@material-ui/core/styles';

import Utils from "../../../helpers/utils";
import handleEvent from '../../../helpers/event-utils';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));


export default function RadioButtons(props) {

  const classes = useStyles();
  const {getPConnect, label, value='', readOnly} = props;
  const [theSelectedButton, setSelectedButton] = useState(value);

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());

  useEffect( () => {
    // This update theSelectedButton which will update the UI to show the selected button correctly
    setSelectedButton(value);
  }, [value])

  const handleChange = (event) => {
    handleEvent(actionsApi, "changeNblur", propName, event.target.value);
  }

  const handleBlur = (event) => {
    thePConn.getValidationApi().validate(event.target.value);
  }

  if (readOnly) {
    // const theReadOnlyComp = <TextInput props />
    return ( <TextInput {...props} /> );
  }

  return (
    <FormControl className={classes.root}>
      <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup value={theSelectedButton} onChange={handleChange} onBlur={handleBlur}>
          { theOptions.map( (theOption) => {
              return <FormControlLabel value={theOption.key} key={theOption.key} label={theOption.value} control={<Radio key={theOption.key} color="primary" />} />
            })
          }
        </RadioGroup>
    </FormControl>

  );

}
