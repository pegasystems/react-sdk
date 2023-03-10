import React  from 'react';
import GDSRadioButtons from '../../BaseComponents/RadioButtons/RadioButtons';
import {useIsOnlyField, useStepName} from '../../../helpers/hooks/QuestionDisplayHooks'
import Utils from '../../../helpers/utils';

export default function RadioButtons(props) {
  const {
    getPConnect,
    label,
    validatemessage,
    helperText
  } = props;

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();

  // TODO Investigate whether or not this can be refactored out, or if a name can be injected as a prop higher up
  let propName = thePConn.getStateProps().value;
  propName = propName.indexOf('.') === 0 ? propName.substring(1) : propName;

  const isOnlyField = useIsOnlyField();
  const stepName = useStepName(isOnlyField, getPConnect);


  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());

  return (
    <GDSRadioButtons
      {...props}
      name={propName}
      label={isOnlyField?stepName:label}
      legendIsHeading={isOnlyField}
      options={theOptions.map(option => {return {value:option.key, label:option.value}})}
      displayInline={theOptions.length === 2}
      hintText={helperText}
      errorText={validatemessage}
    />
  );
}
