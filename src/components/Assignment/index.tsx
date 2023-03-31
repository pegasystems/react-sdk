import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import AssignmentCard from '../AssignmentCard';
import MultiStep from '../MultiStep';
import useIsOnlyField from '../../helpers/hooks/QuestionDisplayHooks';
import ErrorSummary from '../BaseComponents/ErrorSummary/ErrorSummary';

declare const PCore: any;

export default function Assignment(props) {
  const { getPConnect, children, itemKey, isCreateStage } = props;
  const thePConn = getPConnect();

  const [bHasNavigation, setHasNavigation] = useState(false);
  const [actionButtons, setActionButtons] = useState( {} );
  const [bIsVertical, setIsVertical] = useState(false);
  const [arCurrentStepIndicies, setArCurrentStepIndicies] = useState<Array<any>>([]);
  const [arNavigationSteps, setArNavigationSteps] = useState<Array<any>>([]);

  const actionsAPI = thePConn.getActionsApi();

  // store off bound functions to above pointers
  const finishAssignment = actionsAPI.finishAssignment.bind(actionsAPI);
  const navigateToStep = actionsAPI.navigateToStep.bind(actionsAPI);
  const cancelAssignment = actionsAPI.cancelAssignment.bind(actionsAPI);
  const saveAssignment = actionsAPI.saveAssignment?.bind(actionsAPI);
  const cancelCreateStageAssignment = actionsAPI.cancelCreateStageAssignment.bind(actionsAPI);
  // const showPage = actionsAPI.showPage.bind(actionsAPI);

  const [errorSummary, setErrorSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const isOnlyOneField = useIsOnlyField(children);
  const containerName = thePConn.getDataObject().caseInfo.assignments[0].name

  function findCurrentIndicies(arStepperSteps: Array<any>, arIndicies: Array<number>, depth: number) : Array<number> {

    let count = 0;
    arStepperSteps.forEach( (step) => {
      if (step.visited_status === "current") {
        arIndicies[depth] = count;

        // add in
        step["step_status"] = "";
      }
      else if (step.visited_status === "success") {
        count += 1;
        step.step_status = "completed"
      }
      else {
        count += 1;
        step.step_status = "";
      }

      if (step.steps) {
        arIndicies = findCurrentIndicies(step.steps, arIndicies, depth + 1)
      }
    });

    return arIndicies;
  }


  useEffect( ()=> {

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

        if ( oCaseInfo?.navigation /* was oCaseInfo.navigation != null */) {
          setHasNavigation(true);

          if (oCaseInfo.navigation.template && oCaseInfo.navigation.template.toLowerCase() === "standard") {
            setHasNavigation(false);
          }
          else if (oCaseInfo.navigation.template && oCaseInfo.navigation.template.toLowerCase() === "vertical") {
            setIsVertical(true);
          }
          else {
            setIsVertical(false);
          }

          setArNavigationSteps(JSON.parse(JSON.stringify(oCaseInfo.navigation.steps)));
          setArCurrentStepIndicies(findCurrentIndicies(arNavigationSteps, arCurrentStepIndicies, 0));

        }
      }

    }


  }, [children]);

  function showErrorSummary(message: string) {
    setErrorMessage(message);
    // TODO Update the error summary component as per GDS for US-9419 in MVP1, then setErrorSummary(true)
    setErrorSummary(false);
  }

  function onSaveActionSuccess(data) {
    actionsAPI.cancelAssignment(itemKey).then(() => {
      PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED, data);
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
            })
            .catch(() => {
              showErrorSummary(`Navigation failed!`);
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
            })
            .catch(() => {
              showErrorSummary('Save failed');
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
              })
              .catch(() => {
                showErrorSummary(`Cancel failed!`);
              });
          } else {
            const cancelPromise = cancelAssignment(itemKey);

            cancelPromise
              .then(data => {
                publish(PUB_SUB_EVENTS.EVENT_CANCEL, data);
              })
              .catch(() => {
                showErrorSummary(`Cancel failed!`);
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
            .then(() => {})
            .catch(() => {
              showErrorSummary(`Submit failed!`);
            });

          break;
        }

        default:
          break;
      }
    }
  }

  return (
    <div id='Assignment'>
      {errorSummary && <ErrorSummary messages={errorMessage} />}
      {bHasNavigation ? (
        <React.Fragment>
          <div>has Nav</div>
          {!isOnlyOneField && <h1 className='govuk-heading-l'>{containerName}</h1>}
          <MultiStep
            getPConnect={getPConnect}
            itemKey={itemKey}
            actionButtons={actionButtons}
            onButtonPress={buttonPress}
            bIsVertical={bIsVertical}
            arCurrentStepIndicies={arCurrentStepIndicies}
            arNavigationSteps={arNavigationSteps}
          >
            {children}
          </MultiStep>
        </React.Fragment>
      ) : (
        <>
          {!isOnlyOneField && <h1 className='govuk-heading-l'>{containerName}</h1>}
          <AssignmentCard
            getPConnect={getPConnect}
            itemKey={itemKey}
            actionButtons={actionButtons}
            onButtonPress={buttonPress}
          >
            {children}
          </AssignmentCard>
        </>
      )}
      <a
        href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
        className='govuk-link'
        rel='noreferrer noopener'
        target='_blank'
      >
        Ask HMRC online (opens in new tab)
      </a>
    </div>
  );
}

// From WC SDK
// const aHtml = html`
// ${this.bHasNavigation?
//   html`
//     <div class="psdk-stepper">
//     <multi-step-component .pConn=${this.pConn} .arChildren=${this.arChildren} itemKey=${this.itemKey}
//         .arMainButtons=${this.arMainButtons} .arSecondaryButtons=${this.arSecondaryButtons}
//         .bIsVertical=${this.bIsVertical} .arCurrentStepIndicies=${this.arCurrentStepIndicies}
//         .arNavigationSteps=${this.arNavigationSteps}
//         @MultiStepActionButtonClick="${this._onActionButtonClick}">
//     </multi-step-component>
//     <lit-toast></lit-toast>
//     </div>`
//     :
//   html`
//     <div>
//         <assignment-card-component .pConn=${this.pConn} .arChildren=${this.arChildren} itemKey=${this.itemKey}
//           .arMainButtons=${this.arMainButtons} .arSecondaryButtons=${this.arSecondaryButtons}
//           @AssignmentActionButtonClick="${this._onActionButtonClick}">
//         </assignment-card-component>
//         <lit-toast></lit-toast>
//     </div>`}
// `;


Assignment.propTypes = {
  children: PropTypes.node.isRequired,
  getPConnect: PropTypes.func.isRequired,
  itemKey: PropTypes.string,
  isCreateStage: PropTypes.bool
  // actionButtons: PropTypes.object
  // buildName: PropTypes.string
};

Assignment.defaultProps = {
  itemKey: null,
  isCreateStage: false
  // buildName: null
};
