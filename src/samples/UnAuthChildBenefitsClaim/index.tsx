// @ts-nocheck - TypeScript type checking to be added soon
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

import {
  loginIfNecessary,
  sdkSetAuthHeader
} from '@pega/react-sdk-components/lib/components/helpers/authManager';

import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';
import { logout } from '@pega/react-sdk-components/lib/components/helpers/authManager';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';

import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import ServiceNotAvailable from '../../components/AppComponents/ServiceNotAvailable';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../sdk-local-component-map';
import { checkCookie, setCookie } from '../../components/helpers/cookie';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';

declare const myLoadMashup: any;

/* Time out modal functionality */
let applicationTimeout = null;
let signoutTimeout = null;
// Sets default timeouts (13 mins for warning, 115 seconds for sign out after warning shows)
let milisecondsTilSignout = 115 * 1000;
let milisecondsTilWarning = 780 * 1000;

// Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
function initTimeout(setShowTimeoutModal) {
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);

  applicationTimeout = setTimeout(() => {
    setShowTimeoutModal(true);
    signoutTimeout = setTimeout(() => {
      logout();
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
}

// Sends 'ping' to pega to keep session alive and then initiates the timout
function staySignedIn(setShowTimeoutModal) {
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal);
}

export default function UnAuthChildBenefitsClaim() {
  const [pConn, setPConn] = useState<any>(null);
  const [bShowPega, setShowPega] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [bShowResolutionScreen, setShowResolutionScreen] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [serviceNotAvailable, setServiceNotAvailable] = useState(false);
  const [shutterServicePage, setShutterServicePage] = useState(false);
  const [authType, setAuthType] = useState('gg');
  const history = useHistory();
  // This needs to be changed in future when we handle the shutter for multiple service, for now this one's for single service
  const featureID = 'ChB';
  const featureType = 'Service';

  const { t } = useTranslation();

  function doRedirectDone() {
    history.push('/ua');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  }

  function resetAppDisplay() {
    setShowStartPage(false);
    setShowResolutionScreen(false);
    setServiceNotAvailable(false);
    setShowPega(false);
  }

  useEffect(() => {
    setPageTitle();
    function startNow() {
      // Check if PConn is created, and create case if it is
      if (pConn) {
        resetAppDisplay();
        setShowPega(true);
        PCore.getMashupApi().createCase('HMRC-ChB-Work-Claim', PCore.getConstants().APP.APP);
      }
      setShowStartPage(false);
    }
    startNow();
  }, [showStartPage, bShowPega, bShowResolutionScreen]);

  function closeContainer() {
    PCore.getContainerUtils().closeContainerItem(
      PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
      { skipDirtyCheck: true }
    );
  }

  function returnToPortalPage() {
    staySignedIn(setShowTimeoutModal);
    resetAppDisplay();
    setShowStartPage(true);
    closeContainer();
  }

  function assignmentFinished() {
    closeContainer();
    resetAppDisplay();
    setShowResolutionScreen(true);
  }

  function cancelAssignment() {
    closeContainer();
    // displayUserPortal();
    resetAppDisplay();
    setShowStartPage(true);
  }

  function establishPCoreSubscriptions() {
    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
      () => {
        assignmentFinished();
      },
      'assignmentFinished'
    );
    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        resetAppDisplay();
        const containername = PCore.getContainerUtils().getActiveContainerItemName(
          `${PCore.getConstants().APP.APP}/primary`
        );
        const context = PCore.getContainerUtils().getActiveContainerItemName(
          `${containername}/workarea`
        );
        const status = PCore.getStoreValue('.pyStatusWork', 'caseInfo.content', context);
        if (status === 'Resolved-Discarded') {
          setServiceNotAvailable(true);
          PCore.getContainerUtils().closeContainerItem(context);
        }
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

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
      () => {
        closeContainer();
      },
      'closeContainer'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_OPENED,
      () => {
        resetAppDisplay();
        setShowPega(true);
      },
      'continueAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED,
      () => {
        // displayPega();
        resetAppDisplay();
        setShowPega(true);
      },
      'continueCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED,
      () => {
        cancelAssignment();
      },
      'savedCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_OPENED,
      () => {
        resetAppDisplay();
        setShowPega(true);
      },
      'continueCase'
    );
  }

  function RootComponent(props) {
    const PegaConnectObj = createPConnectComponent();
    const thePConnObj = <PegaConnectObj {...props} />;

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
    render(<React.Fragment>{theComponent}</React.Fragment>, target);
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

      // Fetches timeout length config
      getSdkConfig()
        .then(sdkConfig => {
          if (sdkConfig.timeoutConfig.secondsTilWarning)
            milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
          if (sdkConfig.timeoutConfig.secondsTilLogout)
            milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
        })
        .finally(() => {
          // Subscribe to any store change to reset timeout counter
          initTimeout(setShowTimeoutModal);
        });

      // TODO : Consider refactoring 'en_GB' reference as this may need to be set elsewhere
      PCore.getEnvironmentInfo().setLocale(sessionStorage.getItem('rsdk_locale') || 'en_GB');
      PCore.getLocaleUtils().resetLocaleStore();
      PCore.getLocaleUtils().loadLocaleResources([
        PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
        '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE'
      ]);
      initialRender(renderObj);

      /* Functionality to set the device id in the header for use in CIP.
      Device id is unique and will be stored on the user device / browser cookie */
      const COOKIE_PEGAODXDI = 'pegaodxdi';
      let deviceID = checkCookie(COOKIE_PEGAODXDI);
      if (deviceID) {
        setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
        PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
      } else {
        PCore.getDataPageUtils()
          .getPageDataAsync('D_UserSession', 'root')
          .then(res => {
            deviceID = res.DeviceId;
            setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
            PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
          });
      }
    });

    // Initialize the SdkComponentMap (local and pega-provided)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
      // eslint-disable-next-line no-console
      console.log(`SdkComponentMap initialized`);
    });
    PCore.getDataPageUtils()
      .getPageDataAsync('D_ShutterLookup', 'root', {
        FeatureID: featureID,
        FeatureType: featureType
      })
      .then(resp => {
        const isShuttered = resp.Shuttered;
        if (isShuttered) {
          resetAppDisplay();
          setShutterServicePage(true);
        } else {
          setShutterServicePage(false);
          resetAppDisplay();
          setShowStartPage(true);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  // One time (initialization) subscriptions and related unsubscribe
  useEffect(() => {
    getSdkConfig().then(sdkConfig => {
      const sdkConfigAuth = sdkConfig.authConfig;
      setAuthType(sdkConfigAuth.uAuthService);
      sdkConfigAuth.authService = sdkConfigAuth.uAuthService;

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
      loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: doRedirectDone });
    });

    document.addEventListener('SdkConstellationReady', () => {
      // start the portal
      startMashup();
    });

    document.addEventListener('SdkLoggedOut', () => {
      window.location.href = 'https://www.gov.uk/government/organisations/hm-revenue-customs';
    });

    // Subscriptions can't be done until onPCoreReady.
    //  So we subscribe there. But unsubscribe when this
    //  component is unmounted (in function returned from this effect)

    return function cleanupSubscriptions() {
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        'cancelAssignment'
      );
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.ASSIGNMENT_OPENED,
        'continueAssignment'
      );
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_OPENED,
        'continueCase'
      );

      PCore?.getPubSubUtils().unsubscribe('closeContainer');
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
        'assignmentFinished'
      );
    };
  }, []);

  function signOut() {
    let authService;
    if (authType && authType === 'gg') {
      authService = 'GovGateway';
    } else if (authType && authType === 'gg-dev') {
      authService = 'GovGateway-Dev';
    }
    PCore.getDataPageUtils()
      .getPageDataAsync('D_AuthServiceLogout', 'root', { AuthService: authService })
      .then(() => {
        logout().then(() => {});
      });
  }

  const handleStaySignIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal);
  };

  return (
    <>
      <TimeoutPopup
        show={showTimeoutModal}
        staySignedinHandler={() => staySignedIn(setShowTimeoutModal)}
        signoutHandler={() => logout()}
      />

      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={bShowPega} />
      <div className='govuk-width-container'>
        <div id='pega-part-of-page'>
          <div id='pega-root'></div>
        </div>
        {shutterServicePage && <ShutterServicePage />}

        {serviceNotAvailable && <ServiceNotAvailable returnToPortalPage={returnToPortalPage} />}
      </div>

      <LogoutPopup
        show={showSignoutModal && !showTimeoutModal}
        hideModal={() => setShowSignoutModal(false)}
        handleSignoutModal={signOut}
        handleStaySignIn={handleStaySignIn}
      />
      <AppFooter />
    </>
  );
}
