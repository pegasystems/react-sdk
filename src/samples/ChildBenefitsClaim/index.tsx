// @ts-nocheck - TypeScript type checking to be added soon
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

import {
  sdkIsLoggedIn,
  loginIfNecessary,
  sdkSetAuthHeader,
  getSdkConfig
} from '@pega/auth/lib/sdk-auth-manager';

import { compareSdkPCoreVersions } from '@pega/react-sdk-components/lib/components/helpers/versionHelpers';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';

import StartPage from './StartPage';
import ConfirmationPage from './ConfirmationPage';
import UserPortal from './UserPortal';
import ClaimsList from '../../components/templates/ClaimsList';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import ServiceNotAvailable from '../../components/AppComponents/ServiceNotAvailable';

import { getSdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../sdk-local-component-map';
import { checkCookie, setCookie } from '../../components/helpers/cookie';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';
import { getServiceShutteredStatus, triggerLogout } from '../../components/helpers/utils';

declare const myLoadMashup: any;

/* Time out modal functionality */
let applicationTimeout = null;
// Sets default timeouts (13 mins for warning, 115 seconds for sign out after warning shows)
let milisecondsTilSignout = 115 * 1000;
let milisecondsTilWarning = 780 * 1000;

// Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
function initTimeout(setShowTimeoutModal) {
  clearTimeout(applicationTimeout);

  applicationTimeout = setTimeout(() => {
    setShowTimeoutModal(true);
  }, milisecondsTilWarning);
}

// Sends 'ping' to pega to keep session alive and then initiates the timout
function staySignedIn(setShowTimeoutModal, refreshSignin = true) {
  if (refreshSignin) {
    PCore.getDataPageUtils().getDataAsync('D_ClaimantWorkAssignmentChBCases', 'root');
  }
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal);
}
/* ******************************* */

export default function ChildBenefitsClaim() {
  const [pConn, setPConn] = useState<any>(null);
  const [bShowPega, setShowPega] = useState(false);
  const [showStartPage, setShowStartPage] = useState(false);
  const [showUserPortal, setShowUserPortal] = useState(false);
  const [bShowAppName, setShowAppName] = useState(false);
  const [bShowResolutionScreen, setShowResolutionScreen] = useState(false);
  const [loadingsubmittedClaims, setLoadingSubmittedClaims] = useState(true);
  const [loadinginProgressClaims, setLoadingInProgressClaims] = useState(true);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [serviceNotAvailable, setServiceNotAvailable] = useState(false);
  const [shutterServicePage, setShutterServicePage] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [showPortalBanner, setShowPortalBanner] = useState(false);
  const [assignmentPConn, setAssignmentPConn] = useState(null);
  const [isCreateCaseBlocked, setIsCreateCaseBlocked] = useState(false);

  const history = useHistory();

  function resetAppDisplay() {
    setShowStartPage(false);
    setShowUserPortal(false);
    setShowResolutionScreen(false);
    setShowPega(false);
  }

  function displayPega() {
    resetAppDisplay();
    setShowPega(true);
  }

  function displayUserPortal() {
    resetAppDisplay();
    setShowUserPortal(true);
  }

  function displayStartPage() {
    resetAppDisplay();
    setShowStartPage(true);
  }

  function displayServiceNotAvailable() {
    setServiceNotAvailable(true);
  }

  function displayResolutionScreen() {
    resetAppDisplay();
    setShowResolutionScreen(true);
  }

  const { t } = useTranslation();
  let operatorId = '';
  const serviceName = t('CLAIM_CHILD_BENEFIT');
  registerServiceName(serviceName);
  let assignmentFinishedFlag = false;
  useEffect(() => {
    setPageTitle();
  }, [
    showStartPage,
    showUserPortal,
    bShowPega,
    bShowResolutionScreen,
    shutterServicePage,
    serviceName
  ]);

  const [inprogressClaims, setInprogressClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);

  function doRedirectDone() {
    history.push('/');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  }

  function createCase() {
    displayPega();

    let startingFields = {};
    startingFields = {
      NotificationLanguage: sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en'
    };
    PCore.getMashupApi().createCase('HMRC-ChB-Work-Claim', PCore.getConstants().APP.APP, {
      startingFields
    });
  }

  function startNow() {
    // Check if PConn is created, and create case if it is
    if (pConn) {
      setIsCreateCaseBlocked(true);
      createCase();
    }
  }

  function beginClaim() {
    // Added to ensure that clicking begin claim restarts timeout
    staySignedIn(setShowTimeoutModal);
    displayStartPage();
  }
  function returnToPortalPage() {
    staySignedIn(setShowTimeoutModal);
    setServiceNotAvailable(false);
    displayUserPortal();
    PCore.getContainerUtils().closeContainerItem(
      PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
      { skipDirtyCheck: true }
    );
  }
  function getClaimsCaseID() {
    const context = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );
    const caseID = PCore.getStoreValue('.ID', 'caseInfo', context);
    setCaseId(caseID);
  }
  function assignmentFinished() {
    getClaimsCaseID();
    if (!bShowResolutionScreen) {
      PCore.getContainerUtils().closeContainerItem(
        PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
        { skipDirtyCheck: true }
      );
    }
    displayResolutionScreen();
  }

  function closeContainer() {
    displayUserPortal();
  }

  // Calls data page to fetch in progress claims, then for each result (limited to first 10), calls D_Claim to get extra details about each 'assignment'
  // to display within the claim 'card' in the list. This then sets inprogress claims state value to the list of claims data.
  // This funtion also sets 'isloading' value to true before making d_page calls, and sets it back to false after data claimed.
  function fetchInProgressClaimsData(isSaveComeBackClicked = false) {
    setLoadingInProgressClaims(true);
    let inProgressClaimsData: any = [];
    // @ts-ignore
    PCore.getDataPageUtils()
      .getDataAsync('D_ClaimantWorkAssignmentChBCases', 'root')
      .then(resp => {
        resp = resp.data.slice(0, 10);
        inProgressClaimsData = resp;
        setInprogressClaims(inProgressClaimsData);
        setLoadingInProgressClaims(false);
      })
      .finally(() => {
        if (isSaveComeBackClicked) {
          // Here we are calling this close container because of the fact that above
          // D_ClaimantWorkAssignmentChBCases API is getting excuted as last call but we want to make
          // close container call as the very last one.
          PCore.getContainerUtils().closeContainerItem(
            PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
            { skipDirtyCheck: true }
          );
        }
      });
  }

  function cancelAssignment() {
    //  Here we are passing true as argument for below function because we will close container
    //  based on whether claimant has clicked save and come back later link.
    fetchInProgressClaimsData(true);
    getClaimsCaseID();
    displayUserPortal();
  }

  async function setShutterStatus() {
    try {
      const status = await getServiceShutteredStatus();
      setShutterServicePage(status);

      if (status) {
        resetAppDisplay();
        // Ensure assignmentPConn isn't populated to keep the user portal hidden during assignment.
      } else if (!status && assignmentPConn !== null) {
        displayUserPortal();
      }
    } catch (error) {
      // Handle error appropriately, e.g., log it or show a notification
      console.error('Error setting shutter status:', error); // eslint-disable-line
    }
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
      'assignmentFinishedOnTaskListClicked',
      () => {
        setShutterStatus();
      },
      'assignmentFinishedOnTaskListClicked'
    );

    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        if (!assignmentFinishedFlag) {
          // Temporary workaround to restrict infinite update calls
          setShowStartPage(false);
          setShowUserPortal(false);
          setShowPega(false);
          const containername = PCore.getContainerUtils().getActiveContainerItemName(
            `${PCore.getConstants().APP.APP}/primary`
          );
          const context = PCore.getContainerUtils().getActiveContainerItemName(
            `${containername}/workarea`
          );
          const status = PCore.getStoreValue('.pyStatusWork', 'caseInfo.content', context);
          if (status === 'Resolved-Discarded') {
            displayServiceNotAvailable();

            PCore.getContainerUtils().closeContainerItem(context);
            //  Temporary workaround to restrict infinite update calls
            assignmentFinishedFlag = true;
            PCore?.getPubSubUtils().unsubscribe(
              PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
              'assignmentFinished'
            );
          }
        }
      },
      'assignmentFinished'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        cancelAssignment();
        setShowPortalBanner(true);
        setIsCreateCaseBlocked(false);
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
        displayPega();
      },
      'continueAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED,
      () => {
        displayPega();
      },
      'continueCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED,
      () => {
        cancelAssignment();
        setShowPortalBanner(true);
        setIsCreateCaseBlocked(false);
      },
      'savedCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_OPENED,
      () => {
        displayPega();
      },
      'continueCase'
    );
  }

  useEffect(() => {
    // Update when bShowAppName changes
    // If not logged in, we used to prompt for login. Now moved up to TopLevelApp
    // If logged in, make the Triple Play Options visible

    if (!sdkIsLoggedIn()) {
      // login();     // Login now handled at TopLevelApp
    } else {
      setShowUserPortal(true);
    }
  }, [bShowAppName]);

  // from react_root.js with some modifications
  function RootComponent(props) {
    const PegaConnectObj = createPConnectComponent();
    const thePConnObj = <PegaConnectObj {...props} />;

    // NOTE: For Embedded mode, we add in displayOnlyFA and isMashup to our React context
    // so the values are available to any component that may need it.
    const theComp = (
      <StoreContext.Provider
        value={{
          store: PCore.getStore(),
          displayOnlyFA: true,
          isMashup: true,
          setAssignmentPConnect: setAssignmentPConn
        }}
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

    /* const root = render(target); // createRoot(container!) if you use TypeScript
    root.render(<>{theComponent}</>); */

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
          PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, false));
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

      operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();

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

      setLoadingSubmittedClaims(true);
      // @ts-ignore
      PCore.getDataPageUtils()
        .getDataAsync('D_ClaimantSubmittedChBCases', 'root', { OperatorId: operatorId })
        .then(resp => {
          setSubmittedClaims(resp.data.slice(0, 10));
        })
        .finally(() => setLoadingSubmittedClaims(false));
      fetchInProgressClaimsData();
    });

    // Initialize the SdkComponentMap (local and pega-provided)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
      // eslint-disable-next-line no-console
      console.log(`SdkComponentMap initialized`);
    });

    setShutterStatus();

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  useEffect(() => {
    window.sessionStorage.setItem('hasAutocompleteLoaded', 'false');
  });
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
      loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: doRedirectDone });
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
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.ASSIGNMENT_OPENED,
        'continueAssignment'
      );
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_OPENED,
        'continueCase'
      );

      PCore?.getPubSubUtils().unsubscribe('assignmentFinishedOnTaskListClicked');
      PCore?.getPubSubUtils().unsubscribe('closeContainer');
      PCore?.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
        'assignmentFinished'
      );
      PCore?.getPubSubUtils().unsubscribe('languageToggleTriggered');
    };
  }, []);

  function handleSignout() {
    if (bShowPega) {
      setShowSignoutModal(true);
    } else {
      triggerLogout();
    }
  }

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal);
  };

  const checkShuttered = (status: boolean) => {
    setShutterServicePage(status);
  };

  const renderContent = () => {
    return shutterServicePage ? (
      <ShutterServicePage />
    ) : (
      <>
        <div id='pega-part-of-page'>
          <div id='pega-root'></div>
        </div>
        {showStartPage && (
          <StartPage
            onStart={startNow}
            onBack={displayUserPortal}
            isStartButtonDisabled={isCreateCaseBlocked}
          />
        )}
        {showUserPortal && (
          <UserPortal beginClaim={beginClaim} showPortalBanner={showPortalBanner}>
            {!loadinginProgressClaims && inprogressClaims.length !== 0 && (
              <ClaimsList
                thePConn={pConn}
                data={inprogressClaims}
                title={t('CLAIMS_IN_PROGRESS')}
                rowClickAction='OpenAssignment'
                buttonContent={t('CONTINUE_CLAIM')}
                caseId={caseId}
              />
            )}

            {!loadingsubmittedClaims && submittedClaims.length !== 0 && (
              <ClaimsList
                thePConn={pConn}
                data={submittedClaims}
                title={t('SUBMITTED_CLAIMS')}
                rowClickAction='OpenCase'
                buttonContent={t('VIEW_CLAIM')}
                checkShuttered={checkShuttered}
              />
            )}
          </UserPortal>
        )}
      </>
    );
  };

  return (
    <>
      <TimeoutPopup
        show={showTimeoutModal}
        staySignedinHandler={() => staySignedIn(setShowTimeoutModal)}
        signoutHandler={() => triggerLogout()}
        milisecondsTilSignout={milisecondsTilSignout}
        isAuthorised
      />

      <AppHeader
        handleSignout={handleSignout}
        appname={t('CLAIM_CHILD_BENEFIT')}
        hasLanguageToggle
        isPegaApp={bShowPega}
        languageToggleCallback={toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn
        )}
      />
      <div className='govuk-width-container'>
        {serviceNotAvailable ? (
          <ServiceNotAvailable returnToPortalPage={returnToPortalPage} />
        ) : (
          renderContent()
        )}

        {bShowResolutionScreen && <ConfirmationPage caseId={caseId} isUnAuth={false} />}
      </div>

      <LogoutPopup
        show={showSignoutModal && !showTimeoutModal}
        hideModal={() => setShowSignoutModal(false)}
        handleSignoutModal={triggerLogout}
        handleStaySignIn={handleStaySignIn}
      />
      <AppFooter />
    </>
  );
}
