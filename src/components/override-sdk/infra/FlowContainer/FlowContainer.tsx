/* eslint-disable camelcase */
import React, { useState, useEffect, useContext, createElement } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, Avatar, Typography } from '@material-ui/core';
import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';
// import { Alert } from '@material-ui/lab';

import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { addContainerItem, showBanner } from '@pega/react-sdk-components/lib/components/infra/Containers/FlowContainer/helpers';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
// import { isEmptyObject } from '@pega/react-sdk-components/lib/components/helpers/common-utils'

// Remove this and use "real" PCore type once .d.ts is fixed (currently shows 3 errors)
declare const PCore: any;


//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

export default function FlowContainer(props) {
  const pCoreConstants = PCore.getConstants();
  const PCoreVersion = PCore.getPCoreVersion();

  const Assignment =  getComponentFromMap("Assignment");

  const { getPConnect, routingInfo } = props;

  const { displayOnlyFA } = useContext<any>(StoreContext);

  const thePConn = getPConnect();

  // const [init, setInit] = useState(true);
  // const [fcState, setFCState] = useState({ hasError: false });
  const [arNewChildren, setArNewChildren] = useState<Array<any>>(thePConn.getChildren());
  const [arNewChildrenAsReact, setArNewChildrenAsReact] = useState<Array<any>>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [todo_context, setTodoContext] = useState('');

  // const [caseMessages, setCaseMessages] = useState('');
 // const [bHasCaseMessages,setHasCaseMessages] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [checkSvg, setCheckSvg] = useState('');

  const [itemKey, setItemKey] = useState('');
  const [containerName, setContainerName] = useState('');
  const [buildName, setBuildName] = useState('');
  const [bShowConfirm, setShowConfirm] = useState(false);
 // const localizedVal = PCore.getLocaleUtils().getLocaleValue;
 // const localeCategory = 'Messages';

  function initContainer() {
    const ourPConn = getPConnect();
    const containerMgr = ourPConn.getContainerManager();
    const baseContext = ourPConn.getContextName();
    const theContainerName = ourPConn.getContainerName();
    const containerType = 'single';

    const flowContainerTarget = `${baseContext}/${theContainerName}`;
    const isContainerItemAvailable =
      PCore.getContainerUtils().getActiveContainerItemName(flowContainerTarget);

    window.sessionStorage.setItem('okToInitFlowContainer', 'false');

    if (!isContainerItemAvailable) {
      containerMgr.initializeContainers({
        type: containerType
      });

      // updated for 8.7 - 30-Mar-2022
      addContainerItem(ourPConn);
    }
  }

  function getBuildName(): string {
    const ourPConn = getPConnect();

    // let { getPConnect, name } = this.pConn$.pConn;
    const context = ourPConn.getContextName();
    let viewContainerName = ourPConn.getContainerName();

    if (!viewContainerName) viewContainerName = '';
    return `${context.toUpperCase()}/${viewContainerName.toUpperCase()}`;
  }

    function initComponent(bLoadChildren: boolean) {
    const ourPConn = getPConnect();

    // when true, update arChildren from pConn, otherwise, arChilren will be updated in updateSelf()
    if (bLoadChildren) {
      setArNewChildren(ourPConn.getChildren());
    }

    // debugging/investigation help
    // console.log(`${ourPConn.getComponentName()}: children update for main draw`);

    // const oData = ourPConn.getDataObject();

    // const activeActionLabel = "";
    // const child0_getPConnect = arNewChildren[0].getPConnect();

    // this.templateName$ = this.configProps$["template"];

    // create pointers to functions
    // const containerMgr = ourPConn.getContainerManager();
    // const actionsAPI = thePConn.getActionsApi();
    const baseContext = ourPConn.getContextName();
    const acName = ourPConn.getContainerName();

    // for now, in general this should be overridden by updateSelf(), and not be blank
    if (itemKey === '') {
      // debugger;
      setItemKey(baseContext.concat('/').concat(acName));
    }

    ourPConn.isBoundToState();

    // inside
    // get fist kid, get the name and displa
    // pass first kid to a view container, which will disperse it to a view which will use one column, two column, etc.
    const oWorkItem = arNewChildren[0].getPConnect(); // child0_getPConnect;
    const oWorkData = oWorkItem.getDataObject();

    if (bLoadChildren && oWorkData) {
      // debugger;
      setContainerName(oWorkData.caseInfo.assignments?.[0].name);
    }

    // debugger;
    setBuildName(getBuildName());
  }

  useEffect(() => {
    // from WC SDK connectedCallback (mount)
    initComponent(true);
    initContainer();
  }, []);

  function isCaseWideLocalAction() {
    const ourPConn = getPConnect();

    const actionID = ourPConn.getValue(pCoreConstants.CASE_INFO.ACTIVE_ACTION_ID);
    const caseActions = ourPConn.getValue(pCoreConstants.CASE_INFO.AVAILABLEACTIONS);
    let bCaseWideAction = false;
    if (caseActions && actionID) {
      const actionObj = caseActions.find(caseAction => caseAction.ID === actionID);
      if (actionObj) {
        bCaseWideAction = actionObj.type === 'Case';
      }
    }
    return bCaseWideAction;
  }

  function hasChildCaseAssignments() {
    const ourPConn = getPConnect();

    const childCases = ourPConn.getValue(pCoreConstants.CASE_INFO.CHILD_ASSIGNMENTS);
    // const allAssignments = [];
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (childCases && childCases.length > 0) {
      return true;
    }
    return false;
  }

  function hasAssignments() {
    const ourPConn = getPConnect();

    let bHasAssignments = false;
    const assignmentsList: Array<any> = ourPConn.getValue(
      pCoreConstants.CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS
    );

    const isEmbedded = window.location.href.includes('embedded');
    let bAssignmentsForThisOperator = false;

    // 8.7 includes assignments in Assignments List that may be assigned to
    //  a different operator. So, see if there are any assignments for
    //  the current operator
    if (PCoreVersion?.includes('8.7') || isEmbedded) {
      const thisOperator = PCore.getEnvironmentInfo().getOperatorIdentifier();
      for (const assignment of assignmentsList) {
        if (assignment['assigneeInfo']['ID'] === thisOperator) {
          bAssignmentsForThisOperator = true;
        }
      }
    } else {
      bAssignmentsForThisOperator = true;
    }
    // Bail out if there isn't an assignmentsList
    if (!assignmentsList) {
      return bHasAssignments;
    }

    const bHasChildCaseAssignments = hasChildCaseAssignments();

    if (bAssignmentsForThisOperator || bHasChildCaseAssignments || isCaseWideLocalAction()) {
      bHasAssignments = true;
    }

    return bHasAssignments;
  }

  function getActiveViewLabel() {
    const ourPConn = getPConnect();

    let activeActionLabel = '';

    const { CASE_INFO: CASE_CONSTS } = pCoreConstants;

    const caseActions = ourPConn.getValue(CASE_CONSTS.CASE_INFO_ACTIONS);
    const activeActionID = ourPConn.getValue(CASE_CONSTS.ACTIVE_ACTION_ID);
    const activeAction = caseActions?.find(action => action.ID === activeActionID);
    if (activeAction) {
      activeActionLabel = activeAction.name;
    }
    return activeActionLabel;
  }

  // From SDK-WC updateSelf - so do this in useEffect that's run only when the props change...
  useEffect(() => {
    const localPConn = arNewChildren[0].getPConnect();

    setBuildName(getBuildName());

    // routingInfo was added as component prop in populateAdditionalProps
    // let routingInfo = this.getComponentProp("routingInfo");

    let loadingInfo: any;
    try {
      loadingInfo = thePConn.getLoadingStatus();
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(`${thePConn.getComponentName()}: loadingInfo catch block`);
    }

    // let configProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    if (!loadingInfo) {
      // turn off spinner
      // this.psService.sendMessage(false);
    }

    const caseViewMode = thePConn.getValue('context_data.caseViewMode');
    if (caseViewMode && caseViewMode === 'review' || (caseViewMode && caseViewMode === 'perform' && window.sessionStorage.getItem('okToInitFlowContainer') === 'true')) {
      // in React, when cancel is called, somehow the constructor for flowContainer is called which
      // does init/add of containers.  This mimics that
      initContainer();
    }

    // if have caseMessage show message and end
   // const theCaseMessages = localizedVal(thePConn.getValue('caseMessages'), localeCategory);

   // if (theCaseMessages || !hasAssignments()) {
      if ( !hasAssignments()) {
      // Temp fix for 8.7 change: confirmationNote no longer coming through in caseMessages$.
      // So, if we get here and caseMessages$ is empty, use default value in DX API response
      // setCaseMessages(
      //   theCaseMessages || localizedVal('Thank you! The next step in this case has been routed appropriately.', localeCategory)
      // );
    //  setHasCaseMessages(true);
      setShowConfirm(true);

      // publish this "assignmentFinished" for mashup, need to get approved as a standard
      PCore.getPubSubUtils().publish('assignmentFinished');

      // debugger;
      // setCheckSvg(Utils.getImageSrc('check', Utils.getSDKStaticConentUrl()));
    } else {
      // debugger;
     // setHasCaseMessages(false);
      setShowConfirm(false);
    }

    // this check in routingInfo, mimic React to check and get the internals of the
    // flowContainer and force updates to pConnect/redux
    if (routingInfo && loadingInfo !== undefined) {
      // debugging/investigation help
      // console.log(`${thePConn.getComponentName()}: >>routingInfo: ${JSON.stringify(routingInfo)}`);

      const currentOrder = routingInfo.accessedOrder;
      const currentItems = routingInfo.items;
      const type = routingInfo.type;
      if (currentOrder && currentItems) {
        // JA - making more similar to React version
        const key = currentOrder[currentOrder.length - 1];

        // save off itemKey to be used for finishAssignment, etc.
        // debugger;
        setItemKey(key);

        if (
          currentOrder.length > 0 &&
          currentItems[key] &&
          currentItems[key].view &&
          type === 'single' // &&
          // !isEmptyObject(currentItems[key].view)
        ) {
          const currentItem = currentItems[key];
          const rootView = currentItem.view;
          const { context } = rootView.config;
          const config = { meta: rootView };

          config['options'] = {
            context: currentItem.context,
            pageReference: context || localPConn.getPageReference(),
            hasForm: true,
            isFlowContainer: true,
            containerName: localPConn.getContainerName(),
            containerItemName: key,
            parentPageReference: localPConn.getPageReference()
          };

          const configObject = PCore.createPConnect(config);

          // Since we're setting an array, need to add in an appropriate key
          //  to remove React warning.
          configObject['key'] = config['options'].parentPageReference;

          // keep track of these changes
          const theNewChildren: Array<Object> = [];
          theNewChildren.push(configObject);
          setArNewChildren(theNewChildren);

          // JEA - adapted from Constellation DX Components FlowContainer since we want to render children that are React components
          const root = createElement(createPConnectComponent(), configObject);
          setArNewChildrenAsReact([root]);

          const oWorkItem = configObject.getPConnect(); // was theNewChildren[0].getPConnect()
          const oWorkData = oWorkItem.getDataObject();

          // check if have oWorkData, there are times due to timing of state change, when this
          // may not be available
          if (oWorkData) {
            setContainerName(getActiveViewLabel() || oWorkData.caseInfo.assignments?.[0].name);
          }
        }
      }
    }
  }, [props]);

  const caseId = thePConn.getCaseSummary().content.pyID;
  const urgency = getPConnect().getCaseSummary().assignments
    ? getPConnect().getCaseSummary().assignments?.[0].urgency
    : '';
  const operatorInitials = Utils.getInitials(PCore.getEnvironmentInfo().getOperatorName());
  let instructionText = thePConn.getCaseSummary()?.assignments?.[0]?.instructions;
  if (instructionText === undefined) {
    instructionText = '';
  }

  const bShowBanner = showBanner(getPConnect);

  return (
    <div id={buildName}>
      {!bShowConfirm &&
        !displayOnlyFA ? (
            <Card>
              <CardHeader
                title={<Typography variant='h6'>{containerName}</Typography>}
                subheader={`Task in ${caseId} \u2022 Priority ${urgency}`}
                avatar={<Avatar >{operatorInitials}</Avatar>}
              ></CardHeader>
              {instructionText !== '' ? (
                <Typography variant='caption'>{instructionText}</Typography>
              ) : null}
              <MuiPickersUtilsProvider utils={DayjsUtils}>
                <Assignment getPConnect={getPConnect} itemKey={itemKey}>
                  {arNewChildrenAsReact}
                </Assignment>
              </MuiPickersUtilsProvider>
            </Card>
          ) : (
            <div>
              {instructionText !== '' ? (
                <Typography variant='caption'>{instructionText}</Typography>
              ) : null}
                <Assignment getPConnect={getPConnect} itemKey={itemKey}>
                  {arNewChildrenAsReact}
                </Assignment>
            </div>
          )
      }
      {/* {bHasCaseMessages && (
        <div>
          <Alert severity='success'>{caseMessages}</Alert>
        </div>
      )} */}
      {bShowConfirm && bShowBanner && <div>{arNewChildrenAsReact}</div>}
    </div>
  );
}

FlowContainer.defaultProps = {
  children: null,
  getPConnect: null,
  name: '',
  routingInfo: null,
  pageMessages: null
};

FlowContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  children: PropTypes.node,
  getPConnect: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  name: PropTypes.string,
  routingInfo: PropTypes.objectOf(PropTypes.any),
  // eslint-disable-next-line react/no-unused-prop-types
  pageMessages: PropTypes.arrayOf(PropTypes.any)
};
