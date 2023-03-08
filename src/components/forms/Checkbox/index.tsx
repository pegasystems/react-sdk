import React, { useState, useEffect } from 'react';
import GDSCheckboxes from '../../BaseComponents/Checkboxes/Checkboxes';
import {useIsOnlyField, useStepName} from '../../../helpers/hooks/QuestionDisplayHooks'
import handleEvent from '../../../helpers/event-utils';
import Utils from '../../../helpers/utils';


export default function CheckboxComponent(props) {
  const {
    getPConnect,
    label,
    inputProps,
    testId,
    required,
    errorText,
    hintText
  } = props;


  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const { caption } = theConfigProps;
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  const isOnlyField = useIsOnlyField();
  const stepName = useStepName(isOnlyField, getPConnect);

  // Plz remove.. just referring
  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());
  useEffect(()=>{
    console.log('hi, option has some problem perhaps')
    console.log(theOptions)
  })

  // Example data plugged in to pass for the checkbox items
  const itemData = [{checked: false, label: caption, hintText: "item hint", readOnly:false}]

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
  };

  const handleBlur = event => {
    thePConn.getValidationApi().validate(event.target.checked);
  };


  return (
    <>
      <GDSCheckboxes
        inputProps={...inputProps}
        label={"Declaration"}
        items={itemData}
        isSmall={true}
        labelIsHeading={isOnlyField}
        errorText={errorText}
        hintText={"A  hint"}
        required={required}
        onChange={ handleChange}
        onBlur={ handleBlur }
      />
    </>
  );
}
