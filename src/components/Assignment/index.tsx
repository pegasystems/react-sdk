import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import AssignmentCard from '../AssignmentCard';
import MultiStep from '../MultiStep';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

declare const PCore: any;

export default function Assignment(props) {
  const { getPConnect, children, itemKey } = props;
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
  // const showPage = actionsAPI.showPage.bind(actionsAPI);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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



  function showToast(message: string) {
    const theMessage = `Assignment: ${message}`;
    // eslint-disable-next-line no-console
    console.error(theMessage);
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }


  function handleSnackbarClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };


  function buttonPress(sAction: string, sButtonType: string) {

    if (sButtonType === "secondary") {

      const dispatchInfo = {
        context: itemKey,
        semanticURL: ""
      };

      switch (sAction) {
        case "navigateToStep": {
          const navigatePromise = navigateToStep( "previous", itemKey );

          navigatePromise
            .then(() => {
            })
            .catch(() => {
              showToast( `Navigation failed!`);
            });

          break;
        }

        case "cancelAssignment": {
          const cancelPromise = cancelAssignment(dispatchInfo.context);

          cancelPromise
            .then(() => {

              PCore.getPubSubUtils().publish(
                PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
              })
            .catch(() => {
              showToast( `Cancel failed!`);
             });
          break;
        }

        default:
          break;
      }
    }
    else if (sButtonType === "primary") {
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (sAction) {
        case "finishAssignment" :
          {
            const finishPromise = finishAssignment(itemKey);

            finishPromise
              .then(() => {
              })
              .catch(() => {
                showToast( `Submit failed!`);
              });

            break;
          }

        default:
          break;
      }
    }

  }


  return (
    <div id="Assignment">
      { bHasNavigation ?
          <React.Fragment>
            <MultiStep getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}
              bIsVertical={bIsVertical} arCurrentStepIndicies={arCurrentStepIndicies} arNavigationSteps={arNavigationSteps}>
              {children}
            </MultiStep>
            <Snackbar
              open={showSnackbar}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
              action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            />
          </React.Fragment>
        : (
          <React.Fragment>
            <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress} >
              {children}
            </AssignmentCard>
            <Snackbar
              open={showSnackbar}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
              action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            />
          </React.Fragment>
        )
    }
    </div>
  )
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
  // actionButtons: PropTypes.object
  // buildName: PropTypes.string
};

Assignment.defaultProps = {
  itemKey: null,
  // buildName: null
};
