import React from 'react';
import GDSCheckboxes from '../../BaseComponents/Checkboxes/Checkboxes';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks'
import handleEvent from '../../../helpers/event-utils';
import ReadOnlyDisplay from '../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';

export default function CheckboxComponent(props) {
  const {
    getPConnect,
    name,
    inputProps,
    validatemessage,
    hintText,
    label,
    readOnly,
    value
  } = props;

  const isOnlyField = useIsOnlyField();

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const { caption } = theConfigProps;
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  if(readOnly){
      return (<ReadOnlyDisplay value={value?props.trueLabel:props.falseLabel} label={caption}/>)
  }

  // TODO - How to get the optionsList from Pega? Fetch and plug optionsList
  // Hard coded example data plugged in to pass for the checkbox optionsList
  const optionsList = [{checked: value, label: caption, hintText: " ", readOnly:false}]

  const handleChange = event => {
    handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
  };


  return (
    <>
      <GDSCheckboxes
        inputProps={...inputProps}
        name={name}
        label={label}
        optionsList={optionsList}
        legendIsHeading={isOnlyField}
        errorText={validatemessage}
        hintText={hintText}
        onChange={ handleChange }
      />
    </>
  );
}
