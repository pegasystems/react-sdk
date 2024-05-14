import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import AppHeader from './reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import ServiceNotAvailable from '../../components/AppComponents/ServiceNotAvailable';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';
import { loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { staySignedIn } from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { useStartMashup } from './reuseables/PegaSetup';
import {
  initTimeout,
  settingTimer
} from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import SummaryPage from '../../components/AppComponents/SummaryPage';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import { triggerLogout } from '../../components/helpers/utils';
import AppContext from './reuseables/AppContext';

// declare const myLoadMashup;

const ClaimPage: FunctionComponent<any> = () => {
    // const [bShowPega, setShowPega] = useState(false);
    const [shutterServicePage, /* setShutterServicePage */] = useState(false);
    const [serviceNotAvailable, /* setServiceNotAvailable */] = useState(false);
    const [pCoreReady, setPCoreReady] = useState(false);
    const {showLanguageToggle} = useContext(AppContext);

    const setAuthType = useState('gg')[1];

    const [currentDisplay, setCurrentDisplay] = useState<|'pegapage'|'resolutionpage'|'servicenotavailable'|'shutterpage'|'loading'>('pegapage');
    const [summaryPageContent, setSummaryPageContent] = useState<{content:string|null, title:string|null, banner:string|null}>({content:null, title:null, banner:null})
    const { t } = useTranslation();
    
    const history = useHistory();

    const [showTimeoutModal, setShowTimeoutModal] = useState(false);  
    const [showSignoutModal, setShowSignoutModal] = useState(false);

    const { hmrcURL } = useHMRCExternalLinks();

    useEffect(() => 
        {
          initTimeout(setShowTimeoutModal, false, true, false)         
        }        
    , []);    
    
    function doRedirectDone() {
        history.push('/hicbc/opt-in');
        // appName and mainRedirect params have to be same as earlier invocation
        loginIfNecessary({ appName: 'embedded', mainRedirect: true });        
    } 

    const { showPega, setShowPega, showResolutionPage, caseId } = useStartMashup(setAuthType, doRedirectDone, {appBacklinkProps:{}});
    
    
    useEffect(() => {
      if(showPega){setCurrentDisplay('pegapage')}
      else if(showResolutionPage){
        setCurrentDisplay('resolutionpage')
        getSdkConfig().then((config)=>{
          PCore.getRestClient().invokeCustomRestApi(
            `${config.serverConfig.infinityRestServerUrl}/api/application/v2/cases/${caseId}?pageName=SubmissionSummary`,
            {
              method: 'GET',
              body: '',
              headers: '',
              withoutDefaultHeaders: false,
            },
            '')
            .then((response) => {
              const summaryData = response.data.data.caseInfo.content;
              setSummaryPageContent({content:summaryData.SubmissionContent, title:summaryData.SubmissionTitle, banner:summaryData.SubmissionBanner})
            })
            .catch(() => {                            
              return false;
            });
        }

        )
      }
      else if(shutterServicePage){setCurrentDisplay('shutterpage')}      
      else if(serviceNotAvailable){setCurrentDisplay('servicenotavailable')}
      else {
        setCurrentDisplay('loading');
      }
      if(!showPega){ setPageTitle(); }

    }, [showResolutionPage, showPega, shutterServicePage, serviceNotAvailable, pCoreReady])

  

  function handleSignout() {
        if (currentDisplay==='pegapage') {
          setShowSignoutModal(true);
        } else {
          triggerLogout();
        }
  }  

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal, "D_ClaimantSubmittedChBCases", null, null);
  };

  const startClaim = () => {
    setShowPega(true);
    PCore.getMashupApi().createCase('HMRC-ChB-Work-HICBCPreference', PCore.getConstants().APP.APP);
  };

  /* ***
   * Application specific PCore subscriptions
   *
   * TODO Can this be made into a tidy helper? including its own clean up? A custom hook perhaps
   */  

  // And clean up

  useEffect(() => {
    document.addEventListener('SdkConstellationReady', () => {
      PCore.onPCoreReady(() => {
        if(!pCoreReady){
          setPCoreReady(true);
          PCore.getPubSubUtils().subscribe(
            PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
            () => {
              // console.log("SUBEVENT!!! showStartPageOnCloseContainerItem")
              setShowPega(false);
            },
            'showStartPageOnCloseContainerItem'
          );
          startClaim();
        }
      });
      settingTimer();
    });
    
    return () => {
      PCore.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
        'showStartPageOnCloseContainerItem'
      );
    };
  }, []);

    /* ***
     * Application specific PCore subscriptions
     * 
     * TODO Can this be made into a tidy helper? including its own clean up? A custom hook perhaps 
     */
    document.addEventListener('SdkConstellationReady', () => {
        PCore.onPCoreReady(() => {        
        PCore.getPubSubUtils().subscribe(
            PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
            () => {
                // console.log("SUBEVENT!!! showStartPageOnCloseContainerItem")
                setShowPega(false);
            },
            'showStartPageOnCloseContainerItem'
        );
        })
        settingTimer();
        PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, '', null, true, false));
    }); 
    
    // And clean up

    useEffect(() => {
        return () => {
            PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,'showStartPageOnCloseContainerItem')
        }
    }, [])


    return ( <>
      <TimeoutPopup
        show={showTimeoutModal}
        staySignedinHandler={() =>
          staySignedIn(setShowTimeoutModal, 'D_ClaimantWorkAssignmentChBCases')
        }
        signoutHandler={triggerLogout}
        isAuthorised={false}  
        signoutButtonText="Sign out"
        staySignedInButtonText="Stay signed in"
      >
        <h1 id="hmrc-timeout-heading" className="govuk-heading-m push--top">You’re about to be signed out</h1>
        <p className="govuk-body hmrc-timeout-dialog__message" aria-hidden="true">For your security, we will sign you out in <span id="hmrc-timeout-countdown" className="hmrc-timeout-dialog__countdown">2 minutes</span>.</p>

      </TimeoutPopup>

      <AppHeader
        handleSignout={handleSignout}
        appname={t('HIGH_INCOME_BENEFITS')}
        hasLanguageToggle={showLanguageToggle}
        isPegaApp={showPega}
        languageToggleCallback={
          () => {} /* toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn 
          ) */}
        betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}    
      />
      <div className='govuk-width-container'>
        {shutterServicePage ? (
          <ShutterServicePage />
        ) : (
          <>
            <div id='pega-part-of-page'>
              <div id='pega-root'></div>
            </div>
            { serviceNotAvailable && <ServiceNotAvailable /> }            
            { currentDisplay === 'resolutionpage' && <SummaryPage summaryContent={
              summaryPageContent.content}
              summaryTitle={summaryPageContent.title}
              summaryBanner={summaryPageContent.banner}
              backlinkProps={{}}  
            />}        
          </>
        )}
      </div>
      <LogoutPopup
        show={showSignoutModal && !showTimeoutModal}
        hideModal={() => setShowSignoutModal(false)}
        handleSignoutModal={triggerLogout}
        handleStaySignIn={handleStaySignIn}
        staySignedInButtonText='Stay signed in'
        signoutButtonText='Sign out'
      >
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          {t('YOU_ARE_ABOUT_TO_SIGN_OUT')}
        </h1>
        <p className='govuk-body'>If you sign out now, your progress will be lost.</p>
      </LogoutPopup>
      <AppFooter />
    </>
  );
};

export default ClaimPage;
