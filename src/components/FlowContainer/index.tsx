/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useState, useEffect, useContext, createElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, Avatar, Typography } from '@material-ui/core';
import { Utils } from '../../helpers/utils';
import { Alert } from '@material-ui/lab';

import Assignment from '../Assignment';
import ToDo from '../ToDo';

import createPConnectComponent from '../../bridge/react_pconnect';
import StoreContext from '../../bridge/Context/StoreContext';
import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { addContainerItem, getToDoAssignments, showBanner } from './helpers';
import { isEmptyObject } from '../../helpers/common-utils';

declare const PCore;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  alert: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light)
  }
}));

export default function FlowContainer(props) {
  const pCoreConstants = PCore.getConstants();
  const { TODO } = pCoreConstants;
  const todo_headerText = 'To do';

  const { getPConnect, routingInfo } = props;

  const { displayOnlyFA } = useContext(StoreContext);

  const thePConn = getPConnect();

  // const [init, setInit] = useState(true);
  // const [fcState, setFCState] = useState({ hasError: false });
  const [arNewChildren, setArNewChildren] = useState<Array<any>>(thePConn.getChildren());
  const [arNewChildrenAsReact, setArNewChildrenAsReact] = useState<Array<any>>([]);

  const [todo_showTodo, setShowTodo] = useState(false);
  const [todo_caseInfoID, setCaseInfoID] = useState('');
  const [todo_showTodoList, setShowTodoList] = useState(false);
  const [todo_datasource, setTodoDatasource] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [todo_context, setTodoContext] = useState('');

  const [caseMessages, setCaseMessages] = useState('');
  const [bHasCaseMessages, setHasCaseMessages] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [checkSvg, setCheckSvg] = useState('');

  const [itemKey, setItemKey] = useState('');
  const [containerName, setContainerName] = useState('');
  const [buildName, setBuildName] = useState('');
  const [bShowConfirm, setShowConfirm] = useState(false);

  const classes = useStyles();

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

  function getTodoVisibility() {
    const caseViewMode = getPConnect().getValue('context_data.caseViewMode');
    if (caseViewMode && caseViewMode === 'review') {
      return true;
    }
    if (caseViewMode && caseViewMode === 'perform') {
      return false;
    }

    return true;
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

    // debugger;
    setShowTodo(getTodoVisibility());

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
    const thisOperator = PCore.getEnvironmentInfo().getOperatorIdentifier();
    // 8.7 includes assignments in Assignments List that may be assigned to
    //  a different operator. So, see if there are any assignments for
    //  the current operator
    let bAssignmentsForThisOperator = false;

    // Bail out if there isn't an assignmentsList
    if (!assignmentsList) {
      return bHasAssignments;
    }

    for (const assignment of assignmentsList) {
      if (assignment['assigneeInfo']['ID'] === thisOperator) {
        bAssignmentsForThisOperator = true;
      }
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

  // From WC SDK updateSelf - so do this in useEffect that's run only when the props change...
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
    const { CASE_INFO: CASE_CONSTS } = pCoreConstants;
    if (caseViewMode && caseViewMode === 'review') {
      setTimeout(() => {
        // updated for 8.7 - 30-Mar-2022
        const todoAssignments = getToDoAssignments(thePConn);
        if (todoAssignments && todoAssignments.length > 0) {
          setCaseInfoID(thePConn.getValue(CASE_CONSTS.CASE_INFO_ID));
          setTodoDatasource({ source: todoAssignments });
        }
        setShowTodo(true);
        setShowTodoList(false);
      }, 100);

      // in React, when cancel is called, somehow the constructor for flowContainer is called which
      // does init/add of containers.  This mimics that
      initContainer();
    } else if (caseViewMode && caseViewMode === 'perform') {
      // perform
      // debugger;
      setShowTodo(false);

      // this is different than Angular SDK, as we need to initContainer if root container reloaded
      if (window.sessionStorage.getItem('okToInitFlowContainer') === 'true') {
        initContainer();
      }
    }

    // if have caseMessage show message and end
    const theCaseMessages = thePConn.getValue('caseMessages');

    if (theCaseMessages || !hasAssignments()) {
      // Temp fix for 8.7 change: confirmationNote no longer coming through in caseMessages$.
      // So, if we get here and caseMessages$ is empty, use default value in DX API response
      setCaseMessages(
        theCaseMessages || 'Thank you! The next step in this case has been routed appropriately.'
      );
      setHasCaseMessages(true);
      setShowConfirm(true);

      // publish this "assignmentFinished" for mashup, need to get approved as a standard
      PCore.getPubSubUtils().publish('assignmentFinished');

      // debugger;
      setCheckSvg(Utils.getImageSrc('check', Utils.getSDKStaticConentUrl()));
    } else {
      // debugger;
      setHasCaseMessages(false);
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
          type === 'single' &&
          !isEmptyObject(currentItems[key].view)
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
          // JEA - adapted from Nebula FlowContainer since we want to render children that are React components
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
    <div style={{ textAlign: 'left' }} id={buildName} className='psdk-flow-container-top'>
      {!bShowConfirm &&
        (!todo_showTodo ? (
          !displayOnlyFA ? (
            <Card className={classes.root}>
              <CardHeader
                title={<Typography variant='h6'>{containerName}</Typography>}
                subheader={`Task in ${caseId} \u2022 Priority ${urgency}`}
                avatar={<Avatar className={classes.avatar}>{operatorInitials}</Avatar>}
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
            <Card className={classes.root}>
              <Typography variant='h6'>{containerName}</Typography>
              {instructionText !== '' ? (
                <Typography variant='caption'>{instructionText}</Typography>
              ) : null}
              <MuiPickersUtilsProvider utils={DayjsUtils}>
                <Assignment getPConnect={getPConnect} itemKey={itemKey}>
                  {arNewChildrenAsReact}
                </Assignment>
              </MuiPickersUtilsProvider>
            </Card>
          )
        ) : (
          <div>
            <ToDo
              getPConnect={getPConnect}
              caseInfoID={todo_caseInfoID}
              datasource={todo_datasource}
              showTodoList={todo_showTodoList}
              headerText={todo_headerText}
              type={TODO}
              context={todo_context}
              itemKey={itemKey}
            ></ToDo>
          </div>
        ))}
      {bHasCaseMessages && (
        <div className={classes.alert}>
          <Alert severity='success'>{caseMessages}</Alert>
        </div>
      )}
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
