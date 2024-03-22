import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import ServiceNotAvailable from '../../components/AppComponents/ServiceNotAvailable';
import StartPage from './StartPage';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';
import { logout } from '@pega/auth/lib/sdk-auth-manager';
import { staySignedIn } from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { useStartMashup } from './reuseables/PegaSetup';
import {
  initTimeout,
  settingTimer
} from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { loginIfNecessary } from '@pega/react-sdk-components/lib/components/helpers/authManager';
import ConfirmationPage from '../ChildBenefitsClaim/ConfirmationPage';

// declare const myLoadMashup;

const HighIncomeCase: FunctionComponent<any> = () => {
    // const [bShowPega, setShowPega] = useState(false);
    const [shutterServicePage, /* setShutterServicePage */] = useState(false);
    const [serviceNotAvailable, /* setServiceNotAvailable */] = useState(false);
    const [authType, setAuthType] = useState('gg');

    const [currentDisplay, setCurrentDisplay] = useState<'startpage'|'pegapage'|'resolutionpage'|'servicenotavailable'|'shutterpage'>('startpage');
    
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);  
    const [showSignoutModal, setShowSignoutModal] = useState(false);

    const history = useHistory();
    useEffect(() => 
        {initTimeout(setShowTimeoutModal, false, true) }  
    , []);
    
    function doRedirectDone() {
        history.push('/hicbc/opt-in');
        // appName and mainRedirect params have to be same as earlier invocation
        loginIfNecessary({ appName: 'embedded', mainRedirect: true });
      } 
      const { showPega, setShowPega, showResolutionPage, caseId, caseStatus } = useStartMashup(setAuthType, doRedirectDone);

    useEffect(() => {
      if(showPega){setCurrentDisplay('pegapage')}
      else if(showResolutionPage){setCurrentDisplay('resolutionpage')}
      else if(shutterServicePage){setCurrentDisplay('shutterpage')}      
      else if(serviceNotAvailable){setCurrentDisplay('servicenotavailable')}
      else {setCurrentDisplay('startpage')}

    }, [showResolutionPage, showPega, shutterServicePage, serviceNotAvailable])

  function signOut() {
    //  const authService = authType === 'gg' ? 'GovGateway' : (authType === 'gg-dev' ? 'GovGateway-Dev' : authType);
    let authService;
    if (authType && authType === 'gg') {
      authService = 'GovGateway';
    } else if (authType && authType === 'gg-dev') {
      authService = 'GovGateway-Dev';
    }
    const dpprom = PCore.getDataPageUtils().getPageDataAsync('D_AuthServiceLogout', 'root', {
      AuthService: authService
    }) as Promise<object>;

    dpprom.then(() => {
      logout().then(() => {});
    });
  }

  function handleSignout() {
        if (currentDisplay==='pegapage') {
        setShowSignoutModal(true);
        } else {
        signOut();
        }
  }  

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal, null, null, null);
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
    });
    settingTimer();
  });

  // And clean up

  useEffect(() => {
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
        signoutHandler={() => logout()}
        isAuthorised
      />

      <AppHeader
        handleSignout={handleSignout}
        appname={useTranslation().t('HIGH_INCOME_BENEFITS')}
        hasLanguageToggle
        isPegaApp={showPega}
        languageToggleCallback={
          () => {} /* toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn 
        ) */
        }
      />
      <div className='govuk-width-container'>
        {shutterServicePage ? (
          <ShutterServicePage />
        ) : (
          <>
            <div id='pega-part-of-page'>
              <div id='pega-root'></div>
            </div>

            {serviceNotAvailable && <ServiceNotAvailable />}

            { currentDisplay === 'startpage' && <StartPage onStart={startClaim}/>}

            { currentDisplay === 'resolutionpage' && <ConfirmationPage caseStatus={caseStatus} caseId={caseId} isUnAuth={false} /> }            
          </>
        )}
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
};

export default HighIncomeCase;
