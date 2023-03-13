import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import StoreContext from "../../bridge/Context/StoreContext";
import createPConnectComponent from "../../bridge/react_pconnect";

import { gbLoggedIn, loginIfNecessary, sdkSetAuthHeader } from '../../helpers/authManager';

import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';
import { getSdkConfig } from '../../helpers/config_access';
import StartPage from './StartPage';
import ConfirmationPage from './ConfirmationPage';

// declare var gbLoggedIn: boolean;
// declare var login: Function;
// declare var logout: Function;

declare const PCore: any;
declare const myLoadMashup: any;

export default function ChildBenefitsClaim() {
  const [pConn, setPConn] = useState<any>(null);
  const [bShowPega, setShowPega] = useState(false);
  const [bShowTriplePlayOptions, setShowTriplePlayOptions] = useState(false);
  const [bShowAppName, setShowAppName] = useState(false);
  const [bShowResolutionScreen, setShowResolutionScreen] = useState(false);

  function createCase() {
    setShowTriplePlayOptions(false);
    setShowPega(true);

    const actionsApi = pConn.getActionsApi();
    const createWork = actionsApi.createWork.bind(actionsApi);

    const actionInfo = {
      containerName: 'primary'
    };

    createWork('HMRC-ChB-Work-Claim', actionInfo);
  }

  function startNow() {
    // Check if PConn is created, and create case if it is
    if (pConn) {
      createCase();
    }
  }

  function assignmentFinished() {
    setShowTriplePlayOptions(false);
    setShowPega(false);
    setShowResolutionScreen(true);
  }

  function cancelAssignment() {
    setShowTriplePlayOptions(true);
    setShowPega(false);
    setShowResolutionScreen(false);
  }

  function establishPCoreSubscriptions() {
    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        assignmentFinished();
      },
      'assignmentFinished'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        cancelAssignment();
      },
      'cancelAssignment'
    );
  }

  useEffect(() => {
    // Update visibility of UI when bShowPega changes
    const thePegaPartEl = document.getElementById('pega-part-of-page');

    if (thePegaPartEl) {
      if (bShowPega) {
        thePegaPartEl.style.display = 'block';
      } else {
        thePegaPartEl.style.display = 'none';
      }
    }
  }, [bShowPega]);

  useEffect(() => {
    // Update when bShowAppName changes
    // If not logged in, we used to prompt for login. Now moved up to TopLevelApp
    // If logged in, make the Triple Play Options visible

    if (!gbLoggedIn) {
      // login();     // Login now handled at TopLevelApp
    } else {
      setShowTriplePlayOptions(true);
    }
  }, [bShowAppName]);

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
    // so the values are available to any component that may need it.
    const theComp = (
      <StoreContext.Provider
        value={{ store: PCore.getStore(), displayOnlyFA: true, isMashup: true }}
      >
        {thePConnObj}
      </StoreContext.Provider>
    );

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

    let target: any = null;

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
      <Component {...props} portalTarget={portalTarget} styleSheetTarget={styleSheetTarget} />
    );

    // Initial render of component passed in (which should be a RootContainer)
    const root = createRoot(target); // createRoot(container!) if you use TypeScript
    root.render(<>{theComponent}</>);

    // Initial render to show that we have a PConnect and can render in the target location
    // render( <div>EmbeddedTopLevel initialRender in {domContainerID} with PConn of {componentName}</div>, target);
  }

  /**
   * kick off the application's portal that we're trying to serve up
   */
  function startMashup() {
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();
      establishPCoreSubscriptions();
      setShowAppName(true);
      initialRender(renderObj);
    });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  // One time (initialization) subscriptions and related unsubscribe
  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const sdkConfigAuth = sdkConfig.authConfig;

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(
          `${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`
        );
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
        const now = new Date();
        const expTime = new Date(now.getTime() + 5 * 60 * 1000);
        let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
        const regex = /[-:]/g;
        sISOTime = sISOTime.replace(regex, '');
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(
          `${sdkConfigAuth.mashupUserIdentifier}:${window.atob(
            sdkConfigAuth.mashupPassword
          )}:${sISOTime}`
        );
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      // Login if needed, without doing an initial main window redirect
      loginIfNecessary('embedded', true);
    });

    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startMashup();
    });

    // Subscriptions can't be done until onPCoreReady.
    //  So we subscribe there. But unsubscribe when this
    //  component is unmounted (in function returned from this effect)

    return function cleanupSubscriptions() {
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        'cancelAssignment'
      );

      PCore?.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');
    };
  }, []);

  return (
    <>
      {bShowTriplePlayOptions && <StartPage onStart={startNow} />}
      {bShowResolutionScreen && <ConfirmationPage />}
      <div id='pega-part-of-page'>
        <div id='pega-root'></div>
      </div>
    </>
  );
}
