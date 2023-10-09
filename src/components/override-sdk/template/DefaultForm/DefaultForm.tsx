import React, { createElement, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import { DefaultFormContext, ReadOnlyDefaultFormContext }  from '../../../helpers/HMRCAppContext';
import ConditionalWrapper from '../../../helpers/formatters/ConditionalWrapper';
import './DefaultForm.css';

export default function DefaultForm(props) {
  const { getPConnect, readOnly, additionalProps, configAlternateDesignSystem } = props;

  const {hasBeenWrapped} = useContext(ReadOnlyDefaultFormContext); // eslint-disable-line
  const {DFName} = useContext(DefaultFormContext);

  const [declaration, setDeclaration] = useState({text1: '', warning1: ''});
  const containerName = getPConnect().getDataObject().caseInfo.assignments[0].name;

  const { t } = useTranslation();
  let cssClassHook = "";

  if (configAlternateDesignSystem?.cssClassHook) {
    cssClassHook = configAlternateDesignSystem.cssClassHook;
  }
  // eslint-disable-next-line
  const [singleQuestionPage, setSingleQuestionPage] = useState(useIsOnlyField().isOnlyField || configAlternateDesignSystem?.hidePageLabel);
  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  let hasSingleChildWhichIsReference = false;
  const instructionText = props.instructions === 'none' || props.instructions === null ? '' : props.instructions;
  const instructionExists = instructionText !== undefined && instructionText !== '';

  const settingTargetForAnchorTag = () => {
    const instructionDiv = document.getElementById('instructions');
    const keyText = t('OPENS_IN_NEW_TAB');
    if(instructionDiv){
      const elementsArr = instructionDiv.querySelectorAll('a');      
      for(const ele of elementsArr){
        if(ele.innerHTML.includes(keyText)){
          ele.setAttribute('target', '_blank');
        }
      }
    }
  }  

  const {isOnlyField} = useIsOnlyField();

  useEffect(() => {
    setSingleQuestionPage(isOnlyField);
    if(configAlternateDesignSystem?.hidePageLabel){
      PCore.getStore().dispatch({type:'SET_PROPERTY', payload:{
        "reference": "displayAsSingleQuestion",
        "value": true,
        "context": "app",
        "isArrayDeepMerge": true
    }})
  };
    return (() => {
      if(configAlternateDesignSystem?.hidePageLabel){
      PCore.getStore().dispatch({type:'SET_PROPERTY', payload:{
        "reference": "displayAsSingleQuestion",
        "value": false,
        "context": "app",
        "isArrayDeepMerge": true
    }})}})
  }, []);

  useEffect(()=>{
    const roText = document.getElementsByClassName('read-only');
    if(roText.length > 1){
      const lastRoText = roText[roText.length-1];
      lastRoText.classList.add('display-inline-block');
      lastRoText.classList.add('govuk-!-margin-bottom-4') ;
    }    
  },[])

  useEffect(()=>{
    if(instructionExists){
      settingTargetForAnchorTag();
    }
  },[instructionExists])

  useEffect(()=>{
    if(containerName === 'Declaration'){
      const declarationText1 = PCore.getStoreValue('.DeclarationText1', 'caseInfo.content.Claim', 'app/primary_1');
      const declarationWarning1 = PCore.getStoreValue('.DeclarationWarning1', 'caseInfo.content.Claim', 'app/primary_1');
      setDeclaration({text1 : declarationText1, warning1: declarationWarning1});
    }
  },[])

  const getFormattedInstructionText = () => {
    if(!instructionExists){
      return null;
    }
    let text = instructionText.replaceAll('\n<p>&nbsp;</p>\n', '');
    const warning  = t('WARNING');
    if (text.indexOf(`${warning}!!`) !== -1) {
    // If there is a Warning Text
      const warningStr = `<strong>${warning}!!`;
      const start = text.indexOf(warningStr) + warningStr.length + 1;
      const end = text.indexOf('</strong>', start);
      const warningText = text.substring(start, end);

      const start1 = text.indexOf(warningStr);
      const end1 = text.indexOf('</strong>', start1) + '</strong>'.length;
      const stringToBeReplaced = text.substring(start1, end1);
      const stringToReplace = `<div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">${warning}</span>
        ${warningText}
      </strong>
    </div>`;

      text = text.replaceAll(stringToBeReplaced, stringToReplace);
    }

    return text;
  };

  const dfChildren = arChildren?.map((kid, idx) => {
    let extraProps = {};
    const childPConnect = kid.getPConnect();
    if (readOnly)
      extraProps = { ...extraProps, showLabel: false, labelHiddenForReadOnly: kid.showLabel };

    let displayOrder = '';
    if (props.additionalProps.displayOrder) {
      displayOrder = `${props.additionalProps.displayOrder}-${idx}`;
    } else {
      displayOrder = `${idx}`;
    }
    childPConnect.registerAdditionalProps({ displayOrder });
    childPConnect.setInheritedProp("displayOrder", displayOrder);
    const formattedContext = props.context ? props.context?.split('.').pop() : '';
    const formattedPropertyName =
      childPConnect.getStateProps().value && childPConnect.getStateProps().value.split('.').pop();
    const generatedName = props.context
      ? `${formattedContext}-${formattedPropertyName}`
      : `${formattedPropertyName}`;
    childPConnect.registerAdditionalProps({ name: generatedName });
    if (additionalProps.hasBeenWrapped) childPConnect.setStateProps({ hasBeenWrapped: true });
    return createElement(createPConnectComponent(), {
      ...kid,
      key: idx, // eslint-disable-line react/no-array-index-key
      extraProps,
      instructionText,
      instructionExists
    });
  });

  // PM - This function batches the children of a DefaultForm, to group single in put fields togehter, or with preceeding sets of fields,
  // creating a new 'batch' each time a child is a reference type, and will show label.
  // Used when read only to avoid creating individual <dl> wrappers for individual fields, and to enable the correct wrapping of read only field
  // in a <dl> when a label is being shown (as this needs to be displayed outside of the <dl> wrapper)
  const batchChildren = children => {
    let ind = 0;
    const groupedChildren: any = [];

    let group: any = [];

    children.forEach(child => {
      if (
        children.length > 1 &&
        child.props.getPConnect().getMetadata().type === 'reference' &&
        ind !== 0 &&
        child.props.getPConnect().getInheritedProps().showLabel
      ) {
        if (group.length > 0) {
          groupedChildren.push(group);
        }
        groupedChildren.push([child]);
        group = [];
        ind += 1;
        return;
      }

      group.push(child);
      ind += 1;
    });
    if (group.length > 0) {
      groupedChildren.push(group);
    }
    return groupedChildren;
  };

  hasSingleChildWhichIsReference =
    dfChildren?.length === 1 &&
    dfChildren[0].props.getPConnect().getMetadata().type === 'reference';

  if (readOnly && !hasSingleChildWhichIsReference) {
    return batchChildren(dfChildren).map((childGroup, index) => {
      if (childGroup.length < 1) {
        return;
      }

      const key = `${getPConnect().getMetadata().name}-${index}`;

      const allrefs = childGroup.every(
        child => child.props.getPConnect().getMetadata().type === 'reference'
      );
      if (additionalProps.hasBeenWrapped || allrefs) {
        return <React.Fragment key={key}>{childGroup}</React.Fragment>;
      }

      childGroup.forEach(child =>
        child.props.getPConnect().setStateProps({ hasBeenWrapped: true })
      );

      return (
        <dl className='govuk-summary-list' key={key}>
          {childGroup}
        </dl>
      );
    });
  }
/* 
  let nestedInstructionText = null;
  if(instructionExists) { nestedInstructionText = getFormattedInstructionText()}
  else if(instructionText) { nestedInstructionText = instructionText}
*/     

  return (        
    <ConditionalWrapper
      condition = {!!cssClassHook}
      wrapper = {child => {      
        return (<div className={cssClassHook}>
          {child}
        </div>)        
      }}
      childrenToWrap = {
      <DefaultFormContext.Provider value={
        { 
          displayAsSingleQuestion: configAlternateDesignSystem?.hidePageLabel,
          DFName: props.localeReference,
          OverrideLabelValue: containerName, 
          instructionText: getFormattedInstructionText() as string
        }}>

        {instructionExists && (
          <p id='instructions' className='govuk-body'>
            <ParsedHTML htmlString={getFormattedInstructionText()} />
          </p>
        )}
        {declaration.text1 && DFName === -1 && (
          <p id='declarationText1' className='govuk-body'>
            <ParsedHTML htmlString={declaration.text1}/>
          </p>
        )}
        {dfChildren}
        {declaration.warning1 && DFName === -1 && (
          <p id='declarationWarning1' className='govuk-body'>
            <ParsedHTML htmlString={declaration.warning1}/>
          </p>
        )}
      </DefaultFormContext.Provider>
      } />
 
  );
}
