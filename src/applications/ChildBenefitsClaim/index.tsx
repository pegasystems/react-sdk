import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import StoreContext from "../../bridge/Context/StoreContext";
import createPConnectComponent from "../../bridge/react_pconnect";

import { gbLoggedIn, loginIfNecessary, logout, sdkSetAuthHeader } from '../../helpers/authManager';

import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';
import { getSdkConfig } from '../../helpers/config_access';
import StartPage from './StartPage';
import ConfirmationPage from './ConfirmationPage';
import UserPortal from './UserPortal';
import ClaimsList from '../../components/templates/ClaimsList';
import setPageTitle from '../../helpers/setPageTitleHelpers';
import LogoutPopup from '../../components/forms/LogoutPopup';

// declare var gbLoggedIn: boolean;
// declare var login: Function;
// declare var logout: Function;

declare const PCore: any;
declare const myLoadMashup: any;


export default function ChildBenefitsClaim() {
  const [pConn, setPConn] = useState<any>(null);
  const [bShowPega, setShowPega] = useState(false);
  const [showStartPage, setShowStartPage] = useState(false);
  const [showUserPortal, setShowUserPortal] = useState(true);
  const [bShowAppName, setShowAppName] = useState(false);
  const [bShowResolutionScreen, setShowResolutionScreen] = useState(false);
  const [loadingsubmittedClaims, setLoadingSubmittedClaims] = useState(true);
  const [loadinginProgressClaims, setLoadingInProgressClaims] = useState(true);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  let operatorId = '';

  useEffect(()=> {
    setPageTitle();
  }, [showStartPage, showUserPortal, bShowPega, bShowResolutionScreen]);

  const [inprogressClaims, setInprogressClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);

  function createCase() {
    setShowStartPage(false);
    setShowPega(true);
    PCore.getMashupApi().createCase('HMRC-ChB-Work-Claim', 'root', {});
  }

  function startNow() {
    // Check if PConn is created, and create case if it is
    if (pConn) {
      createCase();
    }
  }

  function beginClaim() {
    setShowStartPage(true);
    setShowUserPortal(false);
  }

  function assignmentFinished() {
    setShowStartPage(false);
    setShowPega(false);
    setShowResolutionScreen(true);

    // PCore.getMashupApi().openPage('SubmittedClaims', 'HMRC-Chb-UIPages', 'root/primary_1');

  }

  function closeContainer(){
    setShowPega(false);
    setShowStartPage(false);
    setShowUserPortal(true);
    setShowResolutionScreen(false);
  }


  // Calls data page to fetch in progress claims, then for each result (limited to first 10), calls D_Claim to get extra details about each 'assignment'
  // to display within the claim 'card' in the list. This then sets inprogress claims state value to the list of claims data.
  // This funtion also sets 'isloading' value to true before making d_page calls, and sets it back to false after data claimed.
  function fetchInProgressClaimsData(){
    setLoadingInProgressClaims(true);
    let inProgressClaimsData : any = [];
    PCore.getDataPageUtils().getDataAsync('D_ClaimantWorkAssignmentChBCases', 'root').then(resp => {
      resp = resp.data.slice(0,10);
      inProgressClaimsData = resp;
      setInprogressClaims(inProgressClaimsData);
      setLoadingInProgressClaims(false);
    });
  }

  function cancelAssignment() {
    PCore.getContainerUtils().closeContainerItem(PCore.getContainerUtils().getActiveContainerItemContext('root/primary'));
    fetchInProgressClaimsData();
    setShowStartPage(false);
    setShowUserPortal(true);
    setShowPega(false);
    setShowResolutionScreen(false);
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
        setShowStartPage(false);
        setShowUserPortal(false);
        setShowPega(true);
      },
      'continueAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED,
      () => {
        setShowStartPage(false);
        setShowUserPortal(false);
        setShowPega(true);
      },
      'continueCase'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED,
      () => {
        cancelAssignment()
      },
      'savedCase'
    );


    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_OPENED,
      () => {
        setShowStartPage(false);
        setShowUserPortal(false);
        setShowPega(true);
      },
      'continueCase'
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
      setShowUserPortal(true);
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
      operatorId = (PCore.getEnvironmentInfo().getOperatorIdentifier());
      setLoadingSubmittedClaims(true);
      PCore.getDataPageUtils().getDataAsync('D_ClaimantSubmittedChBCases', 'root', {OperatorId: operatorId} ).then(resp => setSubmittedClaims(resp.data.slice(0,10))).finally(()=>setLoadingSubmittedClaims(false));
      fetchInProgressClaimsData();

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

 function signOutAndRedirect() {
    logout().then(() => {
      window.location.href = 'https://www.gov.uk/government/organisations/hm-revenue-customs';
    });
  }
  function handleSignout() {
    if (bShowPega) {
      setShowSignoutModal(true);
    } else {
      signOutAndRedirect();
    }
  }
  const mainSignoutlink: any = document.getElementById('signout-btn');
  mainSignoutlink.onclick = handleSignout;



  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
  };


  return (
    <>
      <div id='pega-part-of-page'>
        <div id='pega-root'></div>
      </div>
      <LogoutPopup
        show={showSignoutModal}
        hideModal={() => setShowSignoutModal(false)}
        handleSignoutModal={signOutAndRedirect}
        handleStaySignIn={handleStaySignIn}
      />
      { showStartPage && <StartPage onStart={startNow} onBack={closeContainer}/>  }
      { showUserPortal && <UserPortal beginClaim={beginClaim}>
        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"></hr>
        { /* !! NEEDS TRANSLATING  -- title & button content */ }
        <ClaimsList thePConn={pConn}
         data={inprogressClaims}
         title='Claims in progress'
         options={[{name:'Claim.Child.pyFirstName', label:'Childs\' name'}, {name:'Claim.Child.pyLastName'}, {name:'pyStatusWork'}, {name:'pxCreateDateTime', type:'Date', label:'claim created date'}, {name:'pyID', label:'claim reference'}]}
         loading={loadinginProgressClaims}
         rowClickAction="OpenAssignment"
         buttonContent={(rowData) => {
          let buttonMetadata = 'a new child';
          const firstName = rowData?.Claim?.Child?.pyFirstName;
          const lastName = rowData?.Claim?.Child?.pyLastName;
          if(firstName){
            buttonMetadata = lastName ? `${firstName} ${lastName}` : firstName;
          }
          return (
           <>Continue claim <span className="govuk-visually-hidden"> for {buttonMetadata}</span></>
           )
          }}
        />
        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"></hr>
        {/* !! NEEDS TRANSLATING  -- title & button content */}
        <ClaimsList thePConn={pConn}
          data={submittedClaims}
          title='Submitted claims'
          options={[{name:'Claim.Child.pyFirstName', label:'Child\'s name'}, {name:'Claim.Child.pyLastName'}, {name:'pyStatusWork'}, {name:'pxCreateDateTime', type:'Date', label:'claim created date'}, {name:'pyID', label:'claim reference'}]}
          loading={loadingsubmittedClaims}
          rowClickAction="OpenCase"
          buttonContent={(rowData) => {
            let buttonMetadata;
            const firstName = rowData?.Claim?.Child?.pyFirstName;
            const lastName = rowData?.Claim?.Child?.pyLastName;
            if(firstName){
              buttonMetadata = lastName ? `${firstName} ${lastName}` : firstName;
            }
            return <>View claim {buttonMetadata && <span className="govuk-visually-hidden"> for {buttonMetadata}</span>}</>
          }
          }
        />

    </UserPortal>}
      {bShowResolutionScreen && <ConfirmationPage />}
    </>
  );
}
