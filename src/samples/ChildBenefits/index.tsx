/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { render } from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import StoreContext from "../../bridge/Context/StoreContext";
import createPConnectComponent from "../../bridge/react_pconnect";

import { gbLoggedIn, loginIfNecessary, sdkSetAuthHeader } from '../../helpers/authManager';

import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';
import { getSdkConfig } from '../../helpers/config_access';


// declare var gbLoggedIn: boolean;
// declare var login: Function;
// declare var logout: Function;

declare const PCore: any;
declare const myLoadMashup: any;

export default function ChildBenefits() {

  //const classes = useStyles();

  const [pConn, setPConn] = useState<any>(null);

  const [bShowPega, setShowPega] = useState(false);

  useEffect( () => {
    //Check if PConn is createdy, and create case if it is
    console.log(`ChildBenifts: PConn is ${pConn}`);
    if(pConn){
      createCase();
    }
  }, [pConn])

  useEffect( () => {
    // Update visibility of UI when bShowPega changes
    // eslint-disable-next-line no-console
    console.log(`ChildBenifts: bShowPega set to ${bShowPega}`);

    const thePegaPartEl = document.getElementById("pega-part-of-page");

    if (thePegaPartEl) {
      if (bShowPega) {
        thePegaPartEl.style.display = "flex";
  } else {
        thePegaPartEl.style.display = "none";
      }
    }
  }, [bShowPega]);

  function assignmentFinished() {
    setShowPega(false);
  }

  function cancelAssignment() {
    setShowPega(false);
  }

  function establishPCoreSubscriptions() {

    PCore.getPubSubUtils().subscribe(
      "assignmentFinished",
      () => { assignmentFinished() },
      "assignmentFinished"
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { cancelAssignment() },
      "cancelAssignment"
    );

  }


  // from react_root.js with some modifications
  function RootComponent(props) {
    const PegaConnectObj = createPConnectComponent();

    // remove from Provider to work around compiler error for now: context={StoreContext}
    // return (
    //   <Provider store={PCore.getStore()} context={StoreContext} >
    //     <PegaConnectObj {...props} />
    //   </Provider>
    // );

    const thePConnObj = <PegaConnectObj {...props} />;

    // NOTE: For Embedded mode, we add in displayOnlyFA and isMashup to our React context
    //  so the values are available to any component that may need it.
    const theComp =
      <StoreContext.Provider value={{store: PCore.getStore(), displayOnlyFA: true, isMashup: true}} >
        {/*<ThemeProvider theme={theme}>*/}
          {thePConnObj}
        {/*  </ThemeProvider>*/}
      </StoreContext.Provider>;

    return theComp;

  }


  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
   function initialRender(inRenderObj) {

    // loadMashup does its own thing so we don't need to do much/anything here

    // // modified from react_root.js render
    const {
      props,
      domContainerID = null,
      componentName,
      portalTarget,
      styleSheetTarget
    } = inRenderObj;

    const thePConn = props.getPConnect();
    setPConn(thePConn);
    // eslint-disable-next-line no-console
    console.log(`ChildBenefits: initialRender got a PConnect with ${thePConn.getComponentName()} and dconID=${domContainerID}, portalTarget=${portalTarget}`);

    let target:any = null;

    if (domContainerID !== null) {
      target = document.getElementById(domContainerID);
    } else if (portalTarget !== null) {
      target = portalTarget;
    }

    // Note: RootComponent is just a function (declared below)
    const Component: any = RootComponent;

    if (componentName) {
      Component.displayName = componentName;
    }

    const theComponent = (
      //<ThemeProvider theme={theme}>
        <Component
          {...props}
          portalTarget={portalTarget}
          styleSheetTarget={styleSheetTarget}
        />
      //</ThemeProvider>
    );

    // Initial render of component passed in (which should be a RootContainer)
    render(
      <React.Fragment>
        {theComponent}
      </React.Fragment>,
      target
    )

    // Initial render to show that we have a PConnect and can render in the target location
    // render( <div>EmbeddedTopLevel initialRender in {domContainerID} with PConn of {componentName}</div>, target);

  }

  function createCase() {
    console.log("Creating Case");
    setShowPega(true);

    const actionsApi = pConn.getActionsApi();
    const createWork = actionsApi.createWork.bind(actionsApi);
    const sFlowType = "pyStartCase";

    let actionInfo;

      actionInfo = {
        containerName: "primary"
      };

      createWork("O0GBM6-ChildBen-Work-ChildBenefit", actionInfo);

  }


  /**
   * kick off the application's portal that we're trying to serve up
   */
   function startMashup() {

    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // eslint-disable-next-line no-console
      console.log(`PCore ready!`);
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      establishPCoreSubscriptions();

      initialRender(renderObj);
    });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup("pega-root", false);   // this is defined in bootstrap shell that's been loaded already

  }


  // One time (initialization) subscriptions and related unsubscribe
  useEffect(() => {

    getSdkConfig().then( sdkConfig => {
      const sdkConfigAuth = sdkConfig.authConfig;

      if( !sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === "Basic" ) {
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
        sdkSetAuthHeader( `Basic ${sB64}`);
      }

      if( !sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === "BasicTO" ) {
        const now = new Date();
        const expTime = new Date( now.getTime() + 5*60*1000);
        let sISOTime = `${expTime.toISOString().split(".")[0]}Z`;
        const regex = /[-:]/g;
        sISOTime = sISOTime.replace(regex,"");
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
        sdkSetAuthHeader( `Basic ${sB64}`);
      }

      // Login if needed, without doing an initial main window redirect
      loginIfNecessary("embedded", true);

    });

    document.addEventListener("SdkConstellationReady", () => {
      // start the portal
      startMashup();
    });


    // Subscriptions can't be done until onPCoreReady.
    //  So we subscribe there. But unsubscribe when this
    //  component is unmounted (in function returned from this effect)

    return function cleanupSubscriptions() {

      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        "cancelAssignment"
      );

      PCore?.getPubSubUtils().unsubscribe(
        "assignmentFinished",
        "assignmentFinished"
      );

    }
  }, []);

  return (
    <div>
      <div>
        <div id="pega-part-of-page">
        {/* <root-container .pConn="${this.pConn}" ?displayOnlyFA="${true}" ?isMashup="${true}"></root-container> */}
          <div id="pega-root"></div>
        </div>
      </div>
    </div>
  )

}
