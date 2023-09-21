import React, { createElement, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import InstructionComp from '../../../helpers/formatters/ParsedHtml';

import {HMRCAppContext, DefaultFormContext}  from '../../../helpers/HMRCAppContext';

// import './DefaultForm.css';

export default function DefaultForm(props) {
  const { getPConnect, readOnly, additionalProps, configAlternateDesignSystem } = props;

  const {setAssignmentSingleQuestionPage, SingleQuestionDisplayDFStack, SingleQuestionDisplayDFStackPush} = useContext(HMRCAppContext);
  // If this Default Form should display as a single question, or is wrapped by a DF that should be, push it to the df stack, to check later.
  if(configAlternateDesignSystem?.hidePageLabel === true || SingleQuestionDisplayDFStack.length > 0) SingleQuestionDisplayDFStackPush(props.localeReference);
  // Set the assignment level singleQuestionPage boolean to reflect the page type of the default form.
  setAssignmentSingleQuestionPage(configAlternateDesignSystem?.hidePageLabel);
  const isOnlyField = useIsOnlyField();
  const { t } = useTranslation();

  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  let hasSingleChildWhichIsReference = false;
  const instructionText = props.instructions === 'none' ||props.instructions === null ? '' : props.instructions;
  const instructionExists = instructionText !== undefined && instructionText !== '';

  const settingTargetForAnchorTag = () => {
    const instructionDiv = document.getElementById('instructions');
    const keyText = t('OPENS_IN_NEW_TAB');
    const elementsArr = instructionDiv.querySelectorAll('a');
    for(const ele of elementsArr){
      if(ele.innerHTML.includes(keyText)){
        ele.setAttribute('target', '_blank');
      }
    }
  }

  useEffect(()=>{
    if(instructionExists){
      settingTargetForAnchorTag();
    }
  },[instructionExists])

  const getFormattedInstructionText = () => {
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
    if (
      isOnlyField &&
      !instructionExists &&
      childPConnect.getConfigProps().readOnly !== true &&
      idx === 0 &&
      !configAlternateDesignSystem?.hidePageLabel
    ) {
      childPConnect.setInheritedProp(
        'label',
        getPConnect().getDataObject().caseInfo.assignments[0].name
      );
    }
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

  return (
    <DefaultFormContext.Provider value={{displayAsSingleQuestion: configAlternateDesignSystem?.hidePageLabel, DFName: props.localeReference}}>
      {instructionExists && (
        <p id='instructions' className='govuk-body'>
          <InstructionComp htmlString={getFormattedInstructionText()} />
        </p>
      )}
      {dfChildren}
    </DefaultFormContext.Provider>
  );
}
