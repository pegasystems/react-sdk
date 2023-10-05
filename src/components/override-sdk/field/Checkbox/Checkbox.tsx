import React, {useEffect, useState} from 'react';
import GDSCheckboxes from '../../../BaseComponents/Checkboxes/Checkboxes';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks'
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';

export default function CheckboxComponent(props) {
  const {
    getPConnect,
    name,
    inputProps,
    validatemessage,
    hintText,
    readOnly,
    value,
    testId,
  } = props;
  
  let label = props.label;
  const {isOnlyField, overrideLabel} = useIsOnlyField(props.displayOrder);
  if(isOnlyField) label = overrideLabel.trim() ? overrideLabel : label;
  
  const[errorMessage,setErrorMessage] = useState(validatemessage);

  useEffect(()=>{

    if(validatemessage){
    setErrorMessage(validatemessage)
    }

  },[validatemessage])

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const { caption } = theConfigProps;
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  if(readOnly){
      return (<ReadOnlyDisplay value={value?props.trueLabel:props.falseLabel} label={caption}/>)
  }

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
  };

  const optionsList = [{checked: value, label: caption, hintText: " ", readOnly:false, name, onChange:handleChange}]

  const extraProps= {testProps:{'data-test-id':testId}};

  return (
    <>
      <GDSCheckboxes
        inputProps={...inputProps}
        name={name}
        label={label}
        optionsList={optionsList}
        legendIsHeading={isOnlyField}
        errorText={errorMessage}
        hintText={hintText}
        onChange={handleChange}
        {...extraProps}
      />
    </>
  );
}
