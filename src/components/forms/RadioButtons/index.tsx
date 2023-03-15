import React  from 'react';
import GDSRadioButtons from '../../BaseComponents/RadioButtons/RadioButtons';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks'
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';
import Utils from '../../../helpers/utils';
import ReadOnlyDisplay from '../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';

export default function RadioButtons(props) {
  const {
    getPConnect,
    label,
    validatemessage,
    helperText,
    readOnly,
    value
  } = props;

  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();

  // TODO Investigate whether or not this can be refactored out, or if a name can be injected as a prop higher up
  let propName = thePConn.getStateProps().value;
  propName = propName.indexOf('.') === 0 ? propName.substring(1) : propName;

  const isOnlyField = useIsOnlyField();

  // TODO Investigate if this can be moved to 'higher' leven in component stack to avoid repititions
  useAddErrorToPageTitle(validatemessage);

  // theOptions will be an array of JSON objects that are literally key/value pairs.
  //  Ex: [ {key: "Basic", value: "Basic"} ]
  const theOptions = Utils.getOptionList(theConfigProps, thePConn.getDataObject());

  if(readOnly){
    return <ReadOnlyDisplay label={label} value={value} />
  }

  return (
    <GDSRadioButtons
      {...props}
      name={propName}
      label={label}
      legendIsHeading={isOnlyField}
      options={theOptions.map(option => {return {value:option.key, label:option.value}})}
      displayInline={theOptions.length === 2}
      hintText={helperText}
      errorText={validatemessage}
    />
  );
}
