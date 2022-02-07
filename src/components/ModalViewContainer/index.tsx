import React, { useEffect, useRef, useState, createElement } from "react";
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import createPConnectComponent from "../../bridge/react_pconnect";
import Assignment from "../Assignment";
import * as isEqual from 'fast-deep-equal';


declare const PCore;


const ModalViewContainer = (props) => {
  const routingInfoRef = useRef({});
  const {
    getPConnect,
    routingInfo,
    loadingInfo
  } = props;
  const {
    CONTAINER_TYPE: { MULTIPLE },
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    PUB_SUB_EVENTS: { EVENT_SHOW_CANCEL_ALERT }
  } = PCore.getConstants();
  const pConn = getPConnect();
  const [bShowModal, setShowModal] = useState(false);
  const [bSubscribed, setSubscribed] = useState(false);
  const [bShowCancelAlert, setShowCancelAlert] = useState(false);
  const [oCaseInfo, setOCaseInfo] = useState({});
  const [createdView, setCreatedView] = useState<any>(null);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [templateName, setTemplateName] = useState("");
  const [title, setTitle] = useState("");
  const [arNewChildrenAsReact, setArNewChildrenAsReact] = useState<Array<any>>([]);
  const [itemKey, setItemKey] = useState("");
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [cancelPConn, setCancelPConn] = useState(null);


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


  function routingInfoHasContainerItems(theRoutingInfo) {
    if (theRoutingInfo) {
      const { accessedOrder, items } = theRoutingInfo;
      return accessedOrder && accessedOrder.length > 0 && items;
    }
    return false;
  }


  function getKeyAndLatestItem(routinginfo) {
    if (routingInfoHasContainerItems(routinginfo)) {
      const { accessedOrder, items } = routinginfo;
      const key = accessedOrder[accessedOrder.length - 1];
      const latestItem = items[key];
      return { key, latestItem };
    }
    return {};
  }

  function showAlert(payload) {
    // eslint-disable-next-line no-console
    console.log(`ModalViewContainer: in showAlert: ${bShowCancelAlert}`);

    const { latestItem } = getKeyAndLatestItem(routingInfoRef["current"]);
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


  function compareCaseInfoIsDifferent(oCurrentCaseInfo: Object) : boolean {
    let bRet = false;

    // fast-deep-equal version
    if (isEqual !== undefined) {
      bRet = !isEqual(oCaseInfo, oCurrentCaseInfo);
    } else {
      const sCurrentCaseInfo = JSON.stringify(oCurrentCaseInfo);
      const sOldCaseInfo = JSON.stringify(oCaseInfo);
      // stringify compare version
      if ( sCurrentCaseInfo !== sOldCaseInfo ) {
        bRet = true;
      }
    }

    // if different, save off new case info
    if (bRet) {
      setOCaseInfo(JSON.parse(JSON.stringify(oCurrentCaseInfo)));
    }

    return bRet;
  }

  // Utility to determine if a JSON object is empty
  function isEmptyObject(inObj: Object): Boolean {
    let key: String;
    // eslint-disable-next-line guard-for-in
    for (key in inObj) { return false; }
    return true;
  }



  useEffect(() => {
    // Establish the necessary containers
    const containerMgr = pConn.getContainerManager();
    containerMgr.initializeContainers({ type: MULTIPLE });
  }, [MULTIPLE, pConn]);

  useEffect(() => {
    // Update routingInfoRef.current whenever routingInfo changes

    // Persisting routing information between the renders in showAlert
    routingInfoRef.current = routingInfo;

    // // Initial work to determine if/when to show the modal
    // if (routingInfoRef.current["accessedOrder"]?.length > 0) {
    //   setShowModal(true);
    // }

  }, [routingInfo]);

  useEffect(() => {

    if ( routingInfoRef.current && !loadingInfo ) {
      const currentOrder = routingInfoRef.current["accessedOrder"];

      if (undefined === currentOrder) {
        return;
      }

      const currentItems = routingInfo.items;
      // let key = currentOrder[currentOrder.length - 1];

      const { key, latestItem } = getKeyAndLatestItem(routingInfo);

      // console.log(`ModalViewContainer: key: ${key} latestItem: ${JSON.stringify(latestItem)}`);

      if (currentOrder.length > 0) {
        if (currentItems[key] &&
          currentItems[key].view &&
          Object.keys(currentItems[key].view).length > 0 ) {

            const currentItem = currentItems[key];
            const rootView = currentItem.view;
            const { context } = rootView.config;
            const config = { meta: rootView };
            config["options"] = {
              context: currentItem.context,
              hasForm: true,
              pageReference: context || pConn.getPageReference()
            };

            if (!bSubscribed) {
              setSubscribed(true);
              const { /* CONTAINER_TYPE, */ PUB_SUB_EVENTS } = PCore.getConstants();
              // Already keeping this up-to-date in a useEffect
              // routingInfoRef["current"] = routingInfo;
              PCore.getPubSubUtils().subscribe(
                PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
                (payload) => { showAlert(payload); },
                PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT
                /* ,
                routingInfoRef */
              );
            }

            const configObject = PCore.createPConnect(config);

            // THIS is where the ViewContainer creates a View
            //    The config has meta.config.type = "view"
            const newComp = configObject.getPConnect();
            // const newCompName = newComp.getComponentName();
            const caseInfo = newComp && newComp.getDataObject() && newComp.getDataObject().caseInfo ? newComp.getDataObject().caseInfo : null;

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
              const newConfigProps = newComp.getConfigProps();
              setTemplateName(('template' in newConfigProps) ? newConfigProps["template"] : "");

              // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
              const { actionName, isMinimizable } = latestItem;
              const theNewCaseInfo = newComp.getCaseInfo();
              const caseName = theNewCaseInfo.getName();
              const ID = theNewCaseInfo.getID();

              setTitle( actionName || `New ${caseName} (${ID})` );

              // And create a similar array of the children as React components
              //  passed to Assignment component when rendered
              const arChildrenAsReact: Array<any>  = (newComp.getChildren()).map( (child) => {
                // Use Case Summary ID as the React element's key
                const caseSummaryID = child.getPConnect().getCaseSummary().ID;
                return (createElement(createPConnectComponent(), {...child, key: caseSummaryID}));
              });

              setArNewChildrenAsReact(arChildrenAsReact);

              setShowModal(true);

              // save off itemKey to be used for finishAssignment, etc.
              setItemKey(key);

            }
          }
      } else {

        if (bShowModal) {
          // console.log(`ModalViewContainer: useEffect setting bShowModal to false`)

          setShowModal(false);
        }
        if (!isEmptyObject(oCaseInfo)) {
          setOCaseInfo({});
        }

      }
    }

  });


  function placeholderModalClose() {
    // Intentionally a no-op. Similar behavior in other SDKs.
    //  Does NOT close the window. This forces the user to use
    //  the cancel or submit button to close the modal (which, in turn, gets the right
    //  Constellation code to run to clean up the containers, data, etc.)

    // console.log(`ModalViewContainer: placeholderModalClose setting bShowModal to false`)    setShowModal(false);
  }

  // if (bShowModal) {
  //   console.log(`ModalViewContainer about to show modal with`);
  //   console.log(`--> createdView: ${createdView} createdView.getPConnect: ${typeof createdView.getPConnect}`);
  //   console.log(`--> itemKey: ${itemKey}`);
  //   console.log(`--> arNewChildrenAsReact: ${JSON.stringify(arNewChildrenAsReact)}`);
  // }


  return (
    <Dialog
      open={bShowModal}
      onClose={ placeholderModalClose }
    aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        { bShowModal ?
          <Assignment getPConnect={createdView.getPConnect} itemKey={itemKey}>
            {arNewChildrenAsReact}
          </Assignment>
        :
        <></>
        }
      </DialogContent>
    </Dialog>
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
