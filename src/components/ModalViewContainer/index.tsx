import React, { useEffect, useRef, useState, createElement } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'fast-deep-equal';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import createPConnectComponent from '../../bridge/react_pconnect';
import Assignment from '../Assignment';
import CancelAlert from '../forms/CancelAlert';
import { getBanners } from '../../utils/case-utils';
import { isEmptyObject } from '../../helpers/common-utils';

declare const PCore;

function buildName(pConnect, name = '') {
  const context = pConnect.getContextName();
  return `${context}/${name}`;
}

function getKeyAndLatestItem(routinginfo, pConn) {
  const containerName = pConn.getContainerName();
  if (PCore.getContainerUtils().hasContainerItems(buildName(pConn, containerName))) {
    const { accessedOrder, items } = routinginfo;
    const key = accessedOrder[accessedOrder.length - 1];
    const latestItem = items[key];
    return { key, latestItem };
  }
  return {};
}

function getConfigObject(item, pConnect) {
  if (item) {
    const { context, view } = item;
    const config = {
      meta: view,
      options: {
        context,
        pageReference: view.config.context || pConnect.getPageReference(),
        hasForm: true
      }
    };
    return PCore.createPConnect(config);
  }
  return null;
}

const useStyles = makeStyles(theme => ({
  dlgTitle: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0)
    // paddingLeft: theme.spacing(0),
    // paddingRight: theme.spacing(0),
    // paddingTop: theme.spacing(0),
    // paddingBottom: theme.spacing(0),
  },
  dlgContent: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2)
    // paddingLeft: theme.spacing(0),
    // paddingRight: theme.spacing(0),
    // paddingTop: theme.spacing(0),
    // paddingBottom: theme.spacing(0),
  }
}));

const ModalViewContainer = props => {
  const classes = useStyles();

  const routingInfoRef = useRef({});
  const { getPConnect, routingInfo, loadingInfo, pageMessages } = props;
  const pConn = getPConnect();
  const {
    CONTAINER_TYPE: { MULTIPLE },
    PUB_SUB_EVENTS: { EVENT_SHOW_CANCEL_ALERT }
  } = PCore.getConstants();
  const { subscribe } = PCore.getPubSubUtils();
  const [bShowModal, setShowModal] = useState(false);
  const [bSubscribed, setSubscribed] = useState(false);
  const [bShowCancelAlert, setShowCancelAlert] = useState(false);
  const [oCaseInfo, setOCaseInfo] = useState({});
  const [createdView, setCreatedView] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [arNewChildrenAsReact, setArNewChildrenAsReact] = useState<Array<any>>([]);
  const [itemKey, setItemKey] = useState('');
  const [cancelPConn, setCancelPConn] = useState(null);

  function showAlert(payload) {
    const { latestItem } = getKeyAndLatestItem(routingInfoRef.current, pConn);
    const { isModalAction } = payload;

    /*
      If we are in create stage full page mode, created a new case and trying to click on cancel button
      it will show two alert dialogs which is not expected. Hence isModalAction flag to avoid that.
    */
    if (latestItem && isModalAction) {
      const configObject = getConfigObject(latestItem, pConn);
      setCancelPConn(configObject.getPConnect());
      setShowCancelAlert(true);
    }
  }

  function compareCaseInfoIsDifferent(oCurrentCaseInfo: Object): boolean {
    let bRet = false;

    // fast-deep-equal version
    if (isEqual !== undefined) {
      bRet = !isEqual(oCaseInfo, oCurrentCaseInfo);
    } else {
      const sCurrentCaseInfo = JSON.stringify(oCurrentCaseInfo);
      const sOldCaseInfo = JSON.stringify(oCaseInfo);
      // stringify compare version
      if (sCurrentCaseInfo !== sOldCaseInfo) {
        bRet = true;
      }
    }

    // if different, save off new case info
    if (bRet) {
      setOCaseInfo(JSON.parse(JSON.stringify(oCurrentCaseInfo)));
    }

    return bRet;
  }

  const updateAlertState = modalFlag => {
    setShowCancelAlert(false);
    setShowModal(modalFlag);
  };

  useEffect(() => {
    // Establish the necessary containers
    const containerMgr = pConn.getContainerManager();
    containerMgr.initializeContainers({ type: MULTIPLE });
  }, [MULTIPLE, pConn]);

  useEffect(() => {
    // Update routingInfoRef.current whenever routingInfo changes
    routingInfoRef.current = routingInfo;
  }, [routingInfo]);

  useEffect(() => {
    if (routingInfoRef.current && !loadingInfo) {
      const currentOrder = routingInfo.accessedOrder;

      if (undefined === currentOrder) {
        return;
      }

      const currentItems = routingInfo.items;

      const { key, latestItem } = getKeyAndLatestItem(routingInfoRef.current, pConn);

      // console.log(`ModalViewContainer: key: ${key} latestItem: ${JSON.stringify(latestItem)}`);

      if (currentOrder.length > 0) {
        if (
          currentItems[key] &&
          currentItems[key].view &&
          !isEmptyObject(currentItems[key].view)
        ) {
          const currentItem = currentItems[key];
          const rootView = currentItem.view;
          const { context } = rootView.config;
          const config = { meta: rootView };
          config['options'] = {
            context: currentItem.context,
            hasForm: true,
            pageReference: context || pConn.getPageReference()
          };

          if (!bSubscribed) {
            setSubscribed(true);
            subscribe(
              EVENT_SHOW_CANCEL_ALERT,
              showAlert,
              EVENT_SHOW_CANCEL_ALERT /* Unique string for subscription */
            );
          }

          const configObject = PCore.createPConnect(config);

          // THIS is where the ViewContainer creates a View
          //    The config has meta.config.type = "view"
          const newComp = configObject.getPConnect();
          // const newCompName = newComp.getComponentName();
          const caseInfo =
            newComp && newComp.getDataObject() && newComp.getDataObject().caseInfo
              ? newComp.getDataObject().caseInfo
              : null;

          // console.log(`ModalViewContainer just created newComp: ${newCompName}`);

          // The metadata for pyDetails changed such that the "template": "CaseView"
          //  is no longer a child of the created View but is in the created View's
          //  config. So, we DON'T want to replace this.pConn$ since the created
          //  component is a View (and not a ViewContainer). We now look for the
          //  "template" type directly in the created component (newComp) and NOT
          //  as a child of the newly created component.
          // console.log(`---> ModalViewContainer created new ${newCompName}`);

          // Use the newly created component (View) info but DO NOT replace
          //  this ModalViewContainer's pConn$, etc.
          //  Note that we're now using the newly created View's PConnect in the
          //  ViewContainer HTML template to guide what's rendered similar to what
          //  the React return of React.Fragment does

          // right now need to check caseInfo for changes, to trigger redraw, not getting
          // changes from angularPconnect except for first draw
          if (newComp && caseInfo && compareCaseInfoIsDifferent(caseInfo)) {
            setCreatedView(configObject);

            const { actionName } = latestItem;
            const theNewCaseInfo = newComp.getCaseInfo();
            const caseName = theNewCaseInfo.getName();
            const ID = theNewCaseInfo.getID();

            setTitle(actionName || `New ${caseName} (${ID})`);

            let arChildrenAsReact: Array<any> = [];

            if (newComp.getComponentName() === 'reference') {
              // Reference component doesn't have children. It can build the View we want.
              //  The Reference component getPConnect is in configObject

              arChildrenAsReact.push(
                createElement(createPConnectComponent(), {
                  ...configObject,
                  key: `${caseName}-${ID}`
                })
              );
            } else {
              // This is the 8.6 implementation. Leaving it in for reference for now.
              // And create a similar array of the children as React components
              //  passed to Assignment component when rendered
              arChildrenAsReact = newComp.getChildren().map(child => {
                // Use Case Summary ID as the React element's key
                const caseSummaryID = child.getPConnect().getCaseSummary().ID;
                return createElement(createPConnectComponent(), { ...child, key: caseSummaryID });
              });
            }

            if (arChildrenAsReact.length > 0) setArNewChildrenAsReact(arChildrenAsReact);

            setShowModal(true);

            // save off itemKey to be used for finishAssignment, etc.
            setItemKey(key);
          }
        }
      } else {
        if (bShowModal) {
          setShowModal(false);
        }
        if (!isEmptyObject(oCaseInfo)) {
          setOCaseInfo({});
        }
      }
    }
  });

  // function placeholderModalClose() {
  //   // Intentionally a no-op. Similar behavior in other SDKs.
  //   //  Does NOT close the window. This forces the user to use
  //   //  the cancel or submit button to close the modal (which, in turn, gets the right
  //   //  Constellation code to run to clean up the containers, data, etc.)

  //   // console.log(`ModalViewContainer: placeholderModalClose setting bShowModal to false`)    setShowModal(false);
  // }

  // if (bShowModal) {
  //   console.log(`ModalViewContainer about to show modal with`);
  //   console.log(`--> createdView: ${createdView} createdView.getPConnect: ${typeof createdView.getPConnect}`);
  //   console.log(`--> itemKey: ${itemKey}`);
  //   console.log(`--> arNewChildrenAsReact: ${JSON.stringify(arNewChildrenAsReact)}`);
  // }

  return (
    <>
      <Dialog open={bShowModal} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title' className={classes.dlgTitle}>
          {title}
        </DialogTitle>
        <DialogContent className={classes.dlgContent}>
          {bShowModal ? (
            <Assignment
              getPConnect={createdView.getPConnect}
              itemKey={itemKey}
              isInModal
              banners={getBanners({
                target: itemKey,
                pageMessages
              })}
            >
              {arNewChildrenAsReact}
            </Assignment>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
      {bShowCancelAlert && (
        <CancelAlert
          pConn={cancelPConn}
          showAlert={bShowCancelAlert}
          updateAlertState={updateAlertState}
        />
      )}
    </>
  );
};

export default ModalViewContainer;

ModalViewContainer.defaultProps = {
  getPConnect: null,
  loadingInfo: false,
  routingInfo: null
};

ModalViewContainer.propTypes = {
  getPConnect: PropTypes.func,
  loadingInfo: PropTypes.bool,
  routingInfo: PropTypes.objectOf(PropTypes.any)
};
