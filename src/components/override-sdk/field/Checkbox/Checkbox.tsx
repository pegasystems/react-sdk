import React, {useEffect, useState} from 'react';
import GDSCheckboxes from '../../../BaseComponents/Checkboxes/Checkboxes';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks'
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';


export default function CheckboxComponent(props) {
  const {
    getPConnect,
    name,
    inputProps,
    validatemessage,
    hintText,
    label,
    readOnly,
    value,
    testId,
  } = props;

  const isOnlyField = useIsOnlyField();
  const [errorMessage,setErrorMessage] = useState(validatemessage);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [declaration, setDeclaration] = useState({text1: '', text2:'', warning1: ''});

  useEffect(()=>{
    if(name ==='Claim-Declaration'){
      setShowDeclaration(true);
    }
  },[])

  useEffect(()=>{
    if(showDeclaration){
      const declarationText1 = PCore.getStoreValue('.DeclarationText1', 'caseInfo.content.Claim', 'app/primary_1');
      const declarationText2 = PCore.getStoreValue('.DeclarationText2', 'caseInfo.content.Claim', 'app/primary_1');
      const declarationWarning1 = PCore.getStoreValue('.DeclarationWarning1', 'caseInfo.content.Claim', 'app/primary_1');
      setDeclaration({
        text1: declarationText1,
        text2: declarationText2,
        warning1: declarationWarning1, });
    }
  },[showDeclaration])

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
      {declaration.text1 && (
        <p id='declarationText1' className='govuk-body'>
          <ParsedHTML htmlString={declaration.text1}/>
        </p>
      )}
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
      {declaration.text2 && (
        <p id='declarationText2' className='govuk-body'>
          <ParsedHTML htmlString={declaration.text2}/>
        </p>
      )}
      {declaration.warning1 && (
        <p id='declarationWarning1' className='govuk-body'>
          <ParsedHTML htmlString={declaration.warning1}/>
        </p>
      )}
    </>
  );
}
