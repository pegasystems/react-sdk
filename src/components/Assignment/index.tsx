import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import AssignmentCard from '../AssignmentCard';
import MultiStep from '../MultiStep';
import useIsOnlyField from '../../helpers/hooks/QuestionDisplayHooks';
import useAddErrorToPageTitle from '../../helpers/hooks/useAddErrorToPageTitle';
import ErrorSummary from '../BaseComponents/ErrorSummary/ErrorSummary';

export interface ErrorMessageDetails{
  message:string,
  fieldId: string
}

interface OrderedErrorMessage{
  message:ErrorMessageDetails,
  displayOrder:string
}


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
  const [errorMessages, setErrorMessages] = useState<Array<OrderedErrorMessage>>([]);

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

  // Fetches and filters any validatemessages on fields on the page, ordering them correctly based on the display order set in DefaultForm.
  // Also adds the relevant fieldID for each field to allow error summary links to move focus when clicked. This process uses the
  // name prop on the input field in most cases, however where there is a deviation (for example, in Date component, where the first field
  // has -day appended), a fieldId stateprop will be defined and this will be used instead.
  useEffect(() => {
    let errorStateProps = [];
    getPConnect().getContainerManager().updateContainerItem({context:"root/primary_1", containerItemID:"root/primary_1"}).then(()=>{
      errorStateProps = PCore.getFormUtils().getEditableFields('root/primary_1/workarea_1').reduce( (acc, o) => {
      const fieldC11nEnv = o.fieldC11nEnv;
      const fieldStateprops = fieldC11nEnv.getStateProps();
      const fieldComponent = fieldC11nEnv.getComponent();
      if(fieldStateprops && fieldStateprops.validatemessage && fieldStateprops.validatemessage !== ''){
        const fieldId = fieldC11nEnv.getStateProps().fieldId || fieldComponent.props.name;

        acc.push({message:{message:fieldStateprops.validatemessage, fieldId}, displayOrder:fieldComponent.props.displayOrder});
      }
        return acc;
      }, [] );

      errorStateProps.sort((a:OrderedErrorMessage, b:OrderedErrorMessage)=>{return a.displayOrder > b.displayOrder ? 1:-1})
      setErrorMessages([...errorStateProps]);
    });
  }, [children])

  useAddErrorToPageTitle(errorMessages.length > 0);

  function showErrorSummary() {
    setErrorMessages([]);
    setErrorSummary(true);
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
              setErrorSummary(false);
            })
            .catch(() => {
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
            const caseType = thePConn.getCaseInfo().c11nEnv.getValue(PCore.getConstants().CASE_INFO.CASE_TYPE_ID);
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
            .then(() => setErrorSummary(false))
            .catch(() => {
              showErrorSummary();
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
          {errorSummary && errorMessages.length > 0 && <ErrorSummary errors={errorMessages.map(item => item.message)} />}
          {!isOnlyOneField && <h1 className="govuk-heading-l">{containerName}</h1>}
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
