import React, { createElement, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
import useIsOnlyField, {
  registerNonEditableField
} from '../../../helpers/hooks/QuestionDisplayHooks';
import { DefaultFormContext, ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';
import ConditionalWrapper from '../../../helpers/formatters/ConditionalWrapper';
import './DefaultForm.css';

export default function DefaultForm(props) {
  const { getPConnect, readOnly, additionalProps, configAlternateDesignSystem } = props;

  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const { DFName } = useContext(DefaultFormContext);
  const { instructionText: passedThroughInstructionText } = useContext(DefaultFormContext);

  const [declaration, setDeclaration] = useState({ text1: '', warning1: '' });
  let containerName = null;
  if (getPConnect().getDataObject().caseInfo?.assignments) {
    containerName = getPConnect().getDataObject().caseInfo?.assignments[0].name;
  }

  const { t } = useTranslation();
  let cssClassHook = '';

  if (configAlternateDesignSystem?.cssClassHook) {
    cssClassHook = configAlternateDesignSystem.cssClassHook;
  }
  const [singleQuestionPage, setSingleQuestionPage] = useState(false);
  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  let instructionText =
    props.instructions === 'none' || props.instructions === null ? '' : props.instructions;
  // If the parent Default Form has instruction text passed through, append it here so that it is not
  // lost in nested default forms
  if (passedThroughInstructionText) {
    instructionText = instructionText
      ? `${passedThroughInstructionText} ${instructionText}`
      : passedThroughInstructionText;
  }
  const instructionExists = instructionText !== undefined && instructionText !== '';

  const settingTargetForAnchorTag = () => {
    const instructionDiv = document.getElementById('instructions');
    const keyText = t('OPENS_IN_NEW_TAB');
    if (instructionDiv) {
      const elementsArr = instructionDiv.querySelectorAll('a');
      for (const ele of elementsArr) {
        if (ele.innerHTML.includes(keyText)) {
          ele.setAttribute('target', '_blank');
        }
      }
    }
  };

  const isOnlyFieldDetails = useIsOnlyField();

  useEffect(() => {
    if (configAlternateDesignSystem?.hidePageLabel) {
      PCore.getStore().dispatch({
        type: 'SET_PROPERTY',
        payload: {
          reference: 'displayAsSingleQuestion',
          value: true,
          context: 'app',
          isArrayDeepMerge: true
        }
      });
      setSingleQuestionPage(true);
    } else {
      setSingleQuestionPage(isOnlyFieldDetails.isOnlyField);
    }
    return () => {
      if (configAlternateDesignSystem?.hidePageLabel) {
        PCore.getStore().dispatch({
          type: 'SET_PROPERTY',
          payload: {
            reference: 'displayAsSingleQuestion',
            value: false,
            context: 'app',
            isArrayDeepMerge: true
          }
        });
      }
    };
  }, [isOnlyFieldDetails]);

  useEffect(() => {
    const roText = document.getElementsByClassName('read-only');
    if (roText.length > 1) {
      const lastRoText = roText[roText.length - 1];
      lastRoText.classList.add('display-inline-block');
      lastRoText.classList.add('govuk-!-margin-bottom-4');
    }
  }, []);

  registerNonEditableField(instructionExists);
  useEffect(() => {
    if (instructionExists) {
      settingTargetForAnchorTag();
    }
  }, [instructionExists]);

  useEffect(() => {
    if (containerName === 'Declaration') {
      // Get current context
      const context = PCore.getContainerUtils().getActiveContainerItemName(
        `${PCore.getConstants().APP.APP}/primary`
      );
      // Get is documentation required flag value
      const isDocumentationRequired = PCore.getStoreValue(
        '.IsDocumentationRequired',
        'context_data.caseInfo.content.Claim.summary_of_when_conditions__',
        context
      );

      if (isDocumentationRequired) {
        const declarationText1 = PCore.getStoreValue(
          '.DeclarationText1',
          'caseInfo.content.Claim',
          context
        );
        const declarationWarning1 = PCore.getStoreValue(
          '.DeclarationWarning1',
          'caseInfo.content.Claim',
          context
        );

        setDeclaration({ text1: declarationText1, warning1: declarationWarning1 });
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Perform actions before the component unloads
      PCore.getContainerUtils().closeContainerItem(
        PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
        { skipDirtyCheck: true }
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const getFormattedInstructionText = () => {
    if (!instructionExists) {
      return null;
    }
    let text = instructionText.replaceAll('\n<p>&nbsp;</p>\n', '');
    const warning = t('WARNING');
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
    childPConnect.setInheritedProp('displayOrder', displayOrder);
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
    const groupedChildren: any = [];
    let group: any = [];

    children?.forEach(child => {
      // If there's only one child, and it's reference, we don't want to wrap it and can stop processing
      if (children.length === 1 && child.props.getPConnect().getMetadata().type === 'reference') {
        groupedChildren.push({ wrapWithDl: false, group: [child] });
        return;
      }

      // otherwise, for each non reference, add to a group
      if (child.props.getPConnect().getMetadata().type === 'reference') {
        if (group.length > 0) {
          groupedChildren.push({ wrapWithDl: true, group });
        }
        group = [];
        groupedChildren.push({ wrapWithDl: false, group: [child] });
      } else {
        group.push(child);
      }
    });

    if (group.length > 0) {
      groupedChildren.push({ wrapWithDl: true, group });
      group = [];
    }
    return groupedChildren;
  };

  if (readOnly) {
    return batchChildren(dfChildren).map((childGroup, index) => {
      const key = `${getPConnect().getMetadata().name}-${index}`;
      return (
        <ConditionalWrapper
          condition={childGroup.wrapWithDl && !hasBeenWrapped}
          wrapper={children => (
            <ReadOnlyDefaultFormContext.Provider value={{ hasBeenWrapped: true }}>
              <dl className='govuk-summary-list'>{children}</dl>
            </ReadOnlyDefaultFormContext.Provider>
          )}
          childrenToWrap={childGroup.group}
          key={key}
        ></ConditionalWrapper>
      );
    });
  }

  return (
    <ConditionalWrapper
      condition={!!cssClassHook}
      wrapper={child => {
        return <div className={cssClassHook}>{child}</div>;
      }}
      childrenToWrap={
        <DefaultFormContext.Provider
          value={{
            displayAsSingleQuestion: configAlternateDesignSystem?.hidePageLabel,
            DFName: props.localeReference,
            OverrideLabelValue: containerName,
            instructionText:
              instructionExists && !singleQuestionPage
                ? null
                : (getFormattedInstructionText() as string)
          }}
        >
          {instructionExists && !singleQuestionPage && (
            <p id='instructions' className='govuk-body'>
              <ParsedHTML htmlString={getFormattedInstructionText()} />
            </p>
          )}
          {declaration.text1 && DFName === -1 && (
            <p id='declarationText1' className='govuk-body'>
              <ParsedHTML htmlString={declaration.text1} />
            </p>
          )}
          {dfChildren}
          {declaration.warning1 && DFName === -1 && (
            <p id='declarationWarning1' className='govuk-body'>
              <ParsedHTML htmlString={declaration.warning1} />
            </p>
          )}
        </DefaultFormContext.Provider>
      }
    />
  );
}
