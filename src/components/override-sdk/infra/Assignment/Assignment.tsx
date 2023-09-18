import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {Utils} from '../../../helpers/utils';
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';
import ErrorSummary from '../../../BaseComponents/ErrorSummary/ErrorSummary';
import { DateErrorFormatter } from '../../../helpers/formatters/DateErrorFormatter';
import Button from '../../../BaseComponents/Button/Button';
import setPageTitle from '../../../helpers/setPageTitleHelpers';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import {HMRCAppContext} from '../../../helpers/HMRCAppContext';


export interface ErrorMessageDetails {
  message: string;
  fieldId: string;
}

interface OrderedErrorMessage {
  message: ErrorMessageDetails;
  displayOrder: string;
}

declare const PCore: any;
export default function Assignment(props) {
  const { getPConnect, children, itemKey, isCreateStage } = props;
  const thePConn = getPConnect();
  const [arSecondaryButtons, setArSecondaryButtons] = useState([]);
  const [actionButtons, setActionButtons] = useState<any>({});
  const { t } = useTranslation();

  const AssignmentCard = SdkComponentMap.getLocalComponentMap()['AssignmentCard'] ? SdkComponentMap.getLocalComponentMap()['AssignmentCard'] : SdkComponentMap.getPegaProvidedComponentMap()['AssignmentCard'];

  const actionsAPI = thePConn.getActionsApi();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect().getCaseInfo().getName()}`.toUpperCase();

  // store off bound functions to above pointers
  const finishAssignment = actionsAPI.finishAssignment.bind(actionsAPI);
  const navigateToStep = actionsAPI.navigateToStep.bind(actionsAPI);
  const cancelAssignment = actionsAPI.cancelAssignment.bind(actionsAPI);
  const saveAssignment = actionsAPI.saveAssignment?.bind(actionsAPI);
  const cancelCreateStageAssignment = actionsAPI.cancelCreateStageAssignment.bind(actionsAPI);
  // const showPage = actionsAPI.showPage.bind(actionsAPI);

  /* APP STATE - PM IN PROGRESS */

  const [singleQuestionPage, setSingleQuestionPage] = useState(false);

  const [DFStack, setDFStack] = useState([]);

  /* ******************** */
  const [errorSummary, setErrorSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<OrderedErrorMessage>>([]);

  const _containerName =  getPConnect().getContainerName();
  const context = getPConnect().getContextName();
  const containerID = PCore.getContainerUtils().getContainerAccessOrder(`${context}/${_containerName}`).at(-1)
  useEffect(() => {
    setPageTitle();
    // Set the assignment level singleQuestionpage value for 'original' logic handling
    setSingleQuestionPage(PCore.getFormUtils().getEditableFields(containerID).length === 1);
    // Reset the DFStack array when assignment page updates
    setDFStack([]);
  },[children])

  let containerName;
  if(thePConn.getDataObject().caseInfo?.assignments && thePConn.getDataObject().caseInfo?.assignments.length > 0){
    containerName = thePConn.getDataObject().caseInfo?.assignments[0].name;
  }


  useEffect(() => {
    if (children && children.length > 0) {
      // debugger;

      const oWorkItem = children[0].props.getPConnect();
      const oWorkData = oWorkItem.getDataObject();
      const oData = thePConn.getDataObject();

      if (oWorkData?.caseInfo && oWorkData.caseInfo.assignments !== null) {
        const oCaseInfo = oData.caseInfo;

        if (oCaseInfo && oCaseInfo.actionButtons) {
          setActionButtons(oCaseInfo.actionButtons);
        }
      }
    }
  }, [children]);


  function checkErrorMessages() {
    let errorStateProps = [];
    errorStateProps = PCore.getFormUtils().getEditableFields(containerID).reduce( (acc, o) => {

    const fieldC11nEnv = o.fieldC11nEnv;
    const fieldStateProps = fieldC11nEnv.getStateProps();
    const fieldComponent = fieldC11nEnv.getComponent();
    let validatemessage = PCore.getMessageManager().getMessages({
      property: fieldStateProps.value,
      pageReference: fieldC11nEnv.getPageReference(),
      context: containerID,
      type: 'error'
      })[0]?.message;
    if(validatemessage){
      const fieldId = fieldC11nEnv.getStateProps().fieldId || fieldComponent.props.name;
      if(fieldC11nEnv.meta.type === 'Date')
      validatemessage = DateErrorFormatter(validatemessage, fieldC11nEnv.resolveConfigProps(fieldC11nEnv.getMetadata().config).label);
    acc.push({message:{
      message: validatemessage,
      fieldId},
      displayOrder:fieldComponent.props.displayOrder});
    }
    return acc;
  }, [] );

    errorStateProps.sort((a:OrderedErrorMessage, b:OrderedErrorMessage)=>{return a.displayOrder > b.displayOrder ? 1:-1})
    setErrorMessages([...errorStateProps]);
  }

  // Fetches and filters any validatemessages on fields on the page, ordering them correctly based on the display order set in DefaultForm.
  // Also adds the relevant fieldID for each field to allow error summary links to move focus when clicked. This process uses the
  // name prop on the input field in most cases, however where there is a deviation (for example, in Date component, where the first field
  // has -day appended), a fieldId stateprop will be defined and this will be used instead.
  useEffect(() => {
    checkErrorMessages();
    //
  }, [children])

  useEffect(() => {
    if (!errorSummary) {
      const bodyfocus: any = document.getElementsByClassName('govuk-template__body')[0];
      bodyfocus.focus();
    }
  }, [children]);

  useAddErrorToPageTitle(errorMessages.length > 0);

  function showErrorSummary() {
    setErrorMessages([]);
    checkErrorMessages();
    setErrorSummary(true);
  }

  function onSaveActionSuccess(data) {
    actionsAPI.cancelAssignment(itemKey).then(() => {
      PCore.getPubSubUtils().publish(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED,
        data
      );
    });
  }

  function buttonPress(sAction: string, sButtonType: string) {
    setErrorSummary(false);

    if (sButtonType === 'secondary') {
      switch (sAction) {
        case 'navigateToStep': {
          const navigatePromise = navigateToStep('previous', itemKey);

          navigatePromise
            .then(() => {
              Utils.scrollToTop();
              setErrorSummary(false);
            })
            .catch(() => {
              Utils.scrollToTop();
              showErrorSummary();
            });

          break;
        }

        case 'saveAssignment': {
          const caseID = thePConn.getCaseInfo().getKey();
          const assignmentID = thePConn.getCaseInfo().getAssignmentID();
          const savePromise = saveAssignment(itemKey);

          savePromise
            .then(() => {
              const caseType = thePConn
                .getCaseInfo()
                .c11nEnv.getValue(PCore.getConstants().CASE_INFO.CASE_TYPE_ID);
              onSaveActionSuccess({ caseType, caseID, assignmentID });
              setErrorSummary(false);
            })
            .catch(() => {
              showErrorSummary();
            });

          break;
        }

        case 'cancelAssignment': {
          // check if create stage (modal)
          const { PUB_SUB_EVENTS } = PCore.getConstants();
          const { publish } = PCore.getPubSubUtils();
          if (isCreateStage) {
            const cancelPromise = cancelCreateStageAssignment(itemKey);

            cancelPromise
              .then(data => {
                publish(PUB_SUB_EVENTS.EVENT_CANCEL, data);
                setErrorSummary(false);
              })
              .catch(() => {
                showErrorSummary();
              });
          } else {
            const cancelPromise = cancelAssignment(itemKey);

            cancelPromise
              .then(data => {
                publish(PUB_SUB_EVENTS.EVENT_CANCEL, data);
                setErrorSummary(false);
              })
              .catch(() => {
                showErrorSummary();
              });
          }
          break;
        }

        default:
          break;
      }
    } else if (sButtonType === 'primary') {
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (sAction) {
        case 'finishAssignment': {
          const finishPromise = finishAssignment(itemKey);

          finishPromise
            .then(() => {
              Utils.scrollToTop();
              setErrorSummary(false);
            })
            .catch(() => {
              Utils.scrollToTop();
              showErrorSummary();
            });

          break;
        }

        default:
          break;
      }

    }
  }
  function _onButtonPress(sAction: string, sButtonType: string) {
    buttonPress(sAction, sButtonType);
  }
  useEffect(() => {
    if (actionButtons) {
      setArSecondaryButtons(actionButtons.secondary);
    }
  }, [actionButtons]);

  return (
    <HMRCAppContext.Provider value={{
        singleQuestionPage,
        setAssignmentSingleQuestionPage: (value) => {
          if(value && !containerName.toLowerCase().includes('check your answer')) setSingleQuestionPage(value);
        },
        SingleQuestionDisplayDFStack: DFStack,
        SingleQuestionDisplayDFStackPush: (DFName) => {if(!DFStack.includes(DFName)) {
          const extendedList = DFStack;
          extendedList.push(DFName);
          setDFStack(extendedList)
        }}

      }}>
      <div id='Assignment'>
        {arSecondaryButtons?.map(sButton =>
          sButton['name'] === 'Previous' ? (
            <Button
              variant='backlink'
              onClick={e => {
                e.target.blur();
                _onButtonPress(sButton['jsAction'], 'secondary');
              }}
              key={sButton['actionID']}
              attributes={{ type: 'link' }}
            ></Button>
          ) : null
          )}
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
            {errorSummary && errorMessages.length > 0 && (
              <ErrorSummary errors={errorMessages.map(item => localizedVal(item.message, localeCategory, localeReference))} />
            )}
            {!singleQuestionPage && <h1 className='govuk-heading-l'>{localizedVal(containerName, '', localeReference)}</h1>}
            <form>
              <AssignmentCard
                getPConnect={getPConnect}
                itemKey={itemKey}
                actionButtons={actionButtons}
                onButtonPress={buttonPress}
              >
                {children}
              </AssignmentCard>
            </form>
            <a
              href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
              className='govuk-link'
              rel='noreferrer noopener'
              target='_blank'
            >
              {`${t("ASK_HMRC_ONLINE")} ${t("OPENS_IN_NEW_TAB")}`}
            </a>
            </div>
          </div>
        </main>
      </div>
    </HMRCAppContext.Provider>
  );
}

Assignment.propTypes = {
  children: PropTypes.node.isRequired,
  getPConnect: PropTypes.func.isRequired,
  itemKey: PropTypes.string,
  isCreateStage: PropTypes.bool
  // buildName: PropTypes.string
};

Assignment.defaultProps = {
  itemKey: null,
  isCreateStage: false
  // buildName: null
};


export { HMRCAppContext };
