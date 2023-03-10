import React from 'react';
import GDSCheckboxes from '../../BaseComponents/Checkboxes/Checkboxes';
import {useIsOnlyField, useStepName} from '../../../helpers/hooks/QuestionDisplayHooks'
import handleEvent from '../../../helpers/event-utils';


export default function CheckboxComponent(props) {
  const {
    getPConnect,
    name,
    inputProps,
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

  // TODO - How to get the optionsList from Pega? Fetch and plug optionsList
  // Hard coded example data plugged in to pass for the checkbox optionsList
  const optionsList = [{checked: false, label: caption, hintText: "item hint", readOnly:false}]

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
        name={name}
        label={stepName}
        optionsList={optionsList}
        isSmall={true}
        legendIsHeading={isOnlyField}
        errorText={errorText}
        hintText={hintText}
        required={required}
        onChange={ handleChange}
        onBlur={ handleBlur }
      />
    </>
  );
}
