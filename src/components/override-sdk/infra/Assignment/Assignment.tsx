import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  getServiceShutteredStatus,
  scrollToTop,
  shouldRemoveFormTagForReadOnly,
  removeRedundantString
} from '../../../helpers/utils';
import ErrorSummary from '../../../BaseComponents/ErrorSummary/ErrorSummary';
import {
  DateErrorFormatter,
  DateErrorTargetFields
} from '../../../helpers/formatters/DateErrorFormatter';
import Button from '../../../BaseComponents/Button/Button';
import setPageTitle from '../../../helpers/setPageTitleHelpers';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import MainWrapper from '../../../BaseComponents/MainWrapper';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import { ErrorMsgContext } from '../../../helpers/HMRCAppContext';
import useServiceShuttered from '../../../helpers/hooks/useServiceShuttered';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import AppContext from '../../../../samples/HighIncomeCase/reuseables/AppContext';
import dayjs from 'dayjs';

export interface ErrorMessageDetails {
  message: string;
  fieldId: string;
  pageRef: string;
  clearMessageProperty: string;
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
  const serviceShuttered = useServiceShuttered();
  const { setAssignmentPConnect }: any = useContext(StoreContext);
  const { appBacklinkProps } = useContext(AppContext);

  const AssignmentCard = SdkComponentMap.getLocalComponentMap()['AssignmentCard']
    ? SdkComponentMap.getLocalComponentMap()['AssignmentCard']
    : SdkComponentMap.getPegaProvidedComponentMap()['AssignmentCard'];

  const actionsAPI = thePConn.getActionsApi();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect()
    .getCaseInfo()
    .getName()}`.toUpperCase();

  // store off bound functions to above pointers
  const finishAssignment = actionsAPI.finishAssignment.bind(actionsAPI);
  const navigateToStep = actionsAPI.navigateToStep.bind(actionsAPI);
  const cancelAssignment = actionsAPI.cancelAssignment.bind(actionsAPI);
  const saveAssignment = actionsAPI.saveAssignment?.bind(actionsAPI);
  const cancelCreateStageAssignment = actionsAPI.cancelCreateStageAssignment.bind(actionsAPI);
  // const showPage = actionsAPI.showPage.bind(actionsAPI);

  const isOnlyFieldDetails = useIsOnlyField(null, children); // .isOnlyField;
  const [errorSummary, setErrorSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<OrderedErrorMessage>>([]);
  const [serviceShutteredStatus, setServiceShutteredStatus] = useState(serviceShuttered);
  const [header, setHeader] = useState('');

  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [selectedLang, setSelectedLang] = useState(lang);

  const _containerName = getPConnect().getContainerName();
  const context = getPConnect().getContextName();
  const containerID = PCore.getContainerUtils()
    .getContainerAccessOrder(`${context}/${_containerName}`)
    .at(-1);

  // Register/Deregister this Pconnect Object to AssignmentPConn context value, for use in Portal scope
  useEffect(() => {
    setAssignmentPConnect(getPConnect());
    return () => setAssignmentPConnect(null);
  }, []);

  useEffect(() => {
    setServiceShutteredStatus(serviceShuttered);
  }, [serviceShuttered]);

  useEffect(() => {
    const updateErrorTimeOut = setTimeout(() => {
      setPageTitle(errorMessages.length > 0);
    }, 500);
    return () => {
      clearTimeout(updateErrorTimeOut);
    };
  }, [errorMessages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Perform actions before the component unloads
      sessionStorage.setItem('isAutocompleteRendered', 'false');

      const assignmentID = thePConn.getCaseInfo().getAssignmentID();
      sessionStorage.setItem('assignmentID', assignmentID);

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

  let containerName;

  const caseInfo = thePConn.getDataObject().caseInfo;

  if (caseInfo?.assignments?.length > 0) {
    containerName = caseInfo.assignments[0].name;
  }

  const headerLocaleLocation = PCore.getStoreValue('localeReference', '', 'app');

  PCore.getPubSubUtils().subscribe('languageToggleTriggered', langreference => {
    setSelectedLang(langreference?.language);
  });

  // To update the title when we toggle the language
  useEffect(() => {
    setTimeout(() => {
      let tryTranslate = localizedVal(containerName, '', 'HMRC-CHB-WORK-CLAIM!CASE!CLAIM');
      if (tryTranslate === containerName) {
        tryTranslate = localizedVal(tryTranslate, '', headerLocaleLocation);
      }
      if (containerName.toLowerCase() === 'claim child benefit') {
        tryTranslate = t('CLAIM_CHILD_BENEFIT');
      }
      // Set our translated header!
      setHeader(tryTranslate);
    }, 300);
  }, [selectedLang]);

  useEffect(() => {
    const headerFetch = setTimeout(() => {
      setHeader(localizedVal(containerName, '', headerLocaleLocation));
    }, 50);

    return () => clearTimeout(headerFetch);
  }, [headerLocaleLocation, containerName]);

  useEffect(() => {
    if (children && children.length > 0) {
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

  function sortErrorMessages(errorMsg) {
    const formElements = document.forms[0].elements;
    const sortedErrors = [];

    for (let i = 0; i < formElements.length; i += 1) {
      errorMsg.forEach(err => {
        if (formElements[i]?.id === err?.message?.fieldId) {
          sortedErrors.push(err);
        }
      });
    }
    return sortedErrors;
  }

  function checkErrorMessages() {
    let errorStateProps = [];
    errorStateProps = PCore.getFormUtils()
      .getEditableFields(containerID)
      .reduce((acc, o) => {
        const fieldC11nEnv = o.fieldC11nEnv;
        const fieldStateProps = fieldC11nEnv.getStateProps();
        const fieldComponent = fieldC11nEnv.getComponent();
        const errorVal = PCore.getMessageManager().getMessages({
          property: fieldStateProps.value,
          pageReference: fieldC11nEnv.getPageReference(),
          context: containerID,
          type: 'error'
        });
        let validatemessage = '';
        if (errorVal.length > 0) {
          errorVal.forEach(element => {
            validatemessage =
              validatemessage + (validatemessage.length > 0 ? '. ' : '') + element.message;
          });
        }

        if (validatemessage) {
          const clearMessageProperty = fieldC11nEnv?.getStateProps()?.value;
          const pageRef = fieldC11nEnv?.getPageReference();
          const formattedPropertyName = fieldC11nEnv?.getStateProps()?.value?.split('.')?.pop();
          let fieldId =
            fieldC11nEnv.getStateProps().fieldId ||
            fieldComponent.props.name ||
            formattedPropertyName;
          if (fieldC11nEnv.meta.type === 'Date') {
            const propertyName = fieldComponent.props.name;
            const DateErrorTargetFieldId = DateErrorTargetFields(validatemessage);
            fieldId = `${propertyName}-day`;
            if (DateErrorTargetFieldId.includes(`month`)) {
              fieldId = `${propertyName}-month`;
            } else if (DateErrorTargetFieldId.includes(`year`)) {
              fieldId = `${propertyName}-year`;
            }
            validatemessage = DateErrorFormatter(
              validatemessage,
              fieldC11nEnv.resolveConfigProps(fieldC11nEnv.getMetadata().config).label
            );
          }

          acc.push({
            message: {
              message: localizedVal(removeRedundantString(validatemessage)),
              pageRef,
              fieldId,
              clearMessageProperty
            },
            displayOrder: fieldComponent.props.displayOrder
          });
        }
        return acc;
      }, []);

    // To sort error message based on form field order
    if (errorStateProps.length > 0) {
      errorStateProps = sortErrorMessages(errorStateProps);
    }
    setErrorMessages([...errorStateProps]);
  }

  function clearErrors() {
    errorMessages.forEach(error =>
      PCore.getMessageManager().clearMessages({
        property: error.message.clearMessageProperty,
        pageReference: error.message.pageRef,
        category: 'Property',
        context: containerID,
        type: 'error'
      })
    );
  }

  // Fetches and filters any validatemessages on fields on the page, ordering them correctly based on the display order set in DefaultForm.
  // Also adds the relevant fieldID for each field to allow error summary links to move focus when clicked. This process uses the
  // name prop on the input field in most cases, however where there is a deviation (for example, in Date component, where the first field
  // has -day appended), a fieldId stateprop will be defined and this will be used instead.
  useEffect(() => {
    checkErrorMessages();
  }, [children]);

  useEffect(() => {
    if (!errorSummary) {
      const bodyfocus: any = document.getElementsByClassName('govuk-template__body')[0];
      bodyfocus.focus();
    }
  }, [children]);

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

  function handleBackLinkforInvalidDate(){
    const childPconnect = children[0]?.props?.getPConnect();
    const dateField = PCore.getFormUtils().getEditableFields(childPconnect.getContextName()).filter(field => field.type.toLowerCase() === 'date');
    if(dateField){
      dateField?.forEach(field => {
        const childPagRef = childPconnect.getPageReference();
        const pageRef = thePConn.getPageReference() === childPagRef ? thePConn.getPageReference() : childPagRef;
        const storedRefName = field.name?.replace(pageRef, '');
        const storedDateValue = childPconnect.getValue(`.${storedRefName}`);
        if(!dayjs(storedDateValue, 'YYYY-MM-DD', true).isValid()) {
          childPconnect.setValue(`.${storedRefName}`,'');
        }
      })
    }
  }

  async function buttonPress(sAction: string, sButtonType: string) {
    setErrorSummary(false);

    if (sButtonType === 'secondary') {
      switch (sAction) {
        case 'navigateToStep': {
          handleBackLinkforInvalidDate(); // clears the date value if there is invalid date, allowing back btn click(ref bug-7756) 
          const navigatePromise = navigateToStep('previous', itemKey);

          clearErrors();

          navigatePromise
            .then(() => {
              scrollToTop();
              setErrorSummary(false);
            })
            .catch(() => {
              scrollToTop();
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
              scrollToTop();
              setErrorSummary(false);
            })
            .catch(() => {
              scrollToTop();
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
                scrollToTop();
                setErrorSummary(false);
              })
              .catch(() => {
                scrollToTop();
                showErrorSummary();
              });
          } else {
            const cancelPromise = cancelAssignment(itemKey);

            cancelPromise
              .then(data => {
                publish(PUB_SUB_EVENTS.EVENT_CANCEL, data);
                scrollToTop();
                setErrorSummary(false);
              })
              .catch(() => {
                scrollToTop();
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
          const status = await getServiceShutteredStatus();
          if (status) {
            setServiceShutteredStatus(status);
          } else {
            const finishPromise = finishAssignment(itemKey);

            finishPromise
              .then(() => {
                scrollToTop();
                setErrorSummary(false);
              })
              .catch(() => {
                scrollToTop();
                showErrorSummary();
              });
          }
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

  function renderAssignmentCard() {
    return (
      <ErrorMsgContext.Provider
        value={{
          errorMsgs: errorMessages
        }}
      >
        <AssignmentCard
          getPConnect={getPConnect}
          itemKey={itemKey}
          actionButtons={actionButtons}
          onButtonPress={buttonPress}
          errorMsgs={errorMessages}
        >
          {children}
        </AssignmentCard>
      </ErrorMsgContext.Provider>
    );
  }

  const shouldRemoveFormTag = shouldRemoveFormTagForReadOnly(containerName);
  return (
    <>
      {serviceShutteredStatus ? (
        <ShutterServicePage />
      ) : (
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
          {
            // If there is no previous action button, and a 'appcontext' backlink action is set, show a backlink that performs the appcontext backlink action
            arSecondaryButtons?.findIndex(button => button.name === 'Previous') === -1 &&
              appBacklinkProps.appBacklinkAction && (
                <Button
                  variant='backlink'
                  onClick={e => {
                    e.target.blur();
                    appBacklinkProps.appBacklinkAction();
                  }}
                  key='createstagebacklink'
                  attributes={{ type: 'link' }}
                >
                  {appBacklinkProps.appBacklinkText}
                </Button>
              )
          }
          <MainWrapper>
            {errorSummary && errorMessages.length > 0 && (
              <ErrorSummary
                errors={errorMessages.map(item =>
                  localizedVal(item.message, localeCategory, localeReference)
                )}
              />
            )}
            {(!isOnlyFieldDetails.isOnlyField ||
              containerName?.toLowerCase().includes('check your answer') ||
              containerName?.toLowerCase().includes('declaration')) && (
              <h1 className='govuk-heading-l'>{header}</h1>
            )}
            {shouldRemoveFormTag ? renderAssignmentCard() : <form>{renderAssignmentCard()}</form>}
            <a
              href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
              className='govuk-link'
              rel='noreferrer noopener'
              target='_blank'
            >
              {t('ASK_HMRC_ONLINE')} {t('OPENS_IN_NEW_TAB')}
            </a>
            <br />
            <br />
          </MainWrapper>
        </div>
      )}
    </>
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
